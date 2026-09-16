"""Neon (Postgres) persistence for interview-prep progress.

The React app sends a full ProgressState snapshot; `save_progress` diffs it
against the previously saved snapshot and writes only what changed.
"""

from __future__ import annotations

import json
from typing import Any

import psycopg
from psycopg.types.json import Jsonb

SCHEMA = """
CREATE TABLE IF NOT EXISTS question_progress (
    question_id    TEXT PRIMARY KEY,
    completed      BOOLEAN NOT NULL DEFAULT FALSE,
    mastered       BOOLEAN NOT NULL DEFAULT FALSE,
    difficult      BOOLEAN NOT NULL DEFAULT FALSE,
    favorite       BOOLEAN NOT NULL DEFAULT FALSE,
    last_viewed_at TIMESTAMPTZ,
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mock_interview_sessions (
    id           TEXT PRIMARY KEY,
    session_date TIMESTAMPTZ NOT NULL,
    data         JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS app_state (
    key   TEXT PRIMARY KEY,
    value JSONB
);
"""

FLAGS = ("completed", "mastered", "difficult", "favorite")


def connect(database_url: str) -> psycopg.Connection:
    return psycopg.connect(database_url, connect_timeout=15)


def init_schema(database_url: str) -> None:
    with connect(database_url) as conn:
        conn.execute(SCHEMA)


def load_progress(database_url: str) -> dict[str, Any] | None:
    """Returns a ProgressState dict, or None if nothing has been saved yet."""
    with connect(database_url) as conn:
        rows = conn.execute(
            "SELECT question_id, completed, mastered, difficult, favorite, last_viewed_at FROM question_progress"
        ).fetchall()
        sessions = conn.execute(
            "SELECT data FROM mock_interview_sessions ORDER BY session_date DESC LIMIT 50"
        ).fetchall()
        last_viewed = conn.execute("SELECT value FROM app_state WHERE key = 'lastViewedQuestionId'").fetchone()

    if not rows and not sessions and not last_viewed:
        return None

    questions: dict[str, Any] = {}
    for question_id, completed, mastered, difficult, favorite, last_viewed_at in rows:
        entry: dict[str, Any] = {
            "completed": completed,
            "mastered": mastered,
            "difficult": difficult,
            "favorite": favorite,
        }
        if last_viewed_at is not None:
            entry["lastViewedAt"] = last_viewed_at.isoformat()
        questions[question_id] = entry

    state: dict[str, Any] = {
        "questions": questions,
        "mockInterviewHistory": [row[0] for row in sessions],
    }
    if last_viewed and last_viewed[0]:
        state["lastViewedQuestionId"] = last_viewed[0]
    return state


def _question_row(question_id: str, p: dict[str, Any]) -> tuple:
    return (
        question_id,
        *(bool(p.get(flag, False)) for flag in FLAGS),
        p.get("lastViewedAt"),
    )


def save_progress(database_url: str, new: dict[str, Any], old: dict[str, Any] | None) -> None:
    """Writes the differences between `old` and `new` in one transaction."""
    old = old or {}
    new_questions: dict[str, Any] = new.get("questions") or {}
    old_questions: dict[str, Any] = old.get("questions") or {}

    changed = [
        _question_row(qid, p)
        for qid, p in new_questions.items()
        if json.dumps(p, sort_keys=True) != json.dumps(old_questions.get(qid), sort_keys=True)
    ]
    removed = [qid for qid in old_questions if qid not in new_questions]

    new_sessions = {s["id"]: s for s in new.get("mockInterviewHistory") or []}
    old_session_ids = {s["id"] for s in old.get("mockInterviewHistory") or []}
    added_sessions = [s for sid, s in new_sessions.items() if sid not in old_session_ids]
    removed_sessions = [sid for sid in old_session_ids if sid not in new_sessions]

    with connect(database_url) as conn, conn.transaction():
        with conn.cursor() as cur:
            if changed:
                cur.executemany(
                    """
                    INSERT INTO question_progress
                        (question_id, completed, mastered, difficult, favorite, last_viewed_at)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (question_id) DO UPDATE SET
                        completed = EXCLUDED.completed,
                        mastered = EXCLUDED.mastered,
                        difficult = EXCLUDED.difficult,
                        favorite = EXCLUDED.favorite,
                        last_viewed_at = EXCLUDED.last_viewed_at,
                        updated_at = now()
                    """,
                    changed,
                )
            if removed:
                cur.execute("DELETE FROM question_progress WHERE question_id = ANY(%s)", (removed,))
            if added_sessions:
                cur.executemany(
                    """
                    INSERT INTO mock_interview_sessions (id, session_date, data)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
                    """,
                    [(s["id"], s["date"], Jsonb(s)) for s in added_sessions],
                )
            if removed_sessions:
                cur.execute("DELETE FROM mock_interview_sessions WHERE id = ANY(%s)", (removed_sessions,))
            if new.get("lastViewedQuestionId") != old.get("lastViewedQuestionId"):
                cur.execute(
                    """
                    INSERT INTO app_state (key, value) VALUES ('lastViewedQuestionId', %s)
                    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
                    """,
                    (Jsonb(new.get("lastViewedQuestionId")),),
                )
