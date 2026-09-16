import hmac
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

import db

st.set_page_config(page_title="AI Interview Prep", page_icon="🎯", layout="wide")

# Hide Streamlit's own chrome so the embedded React app fills the page.
st.markdown(
    """
    <style>
      #MainMenu, header, footer {visibility: hidden;}
      .block-container {padding: 0 !important; max-width: 100% !important;}
    </style>
    """,
    unsafe_allow_html=True,
)

# Pin the app's iframe to the full screen. The app scrolls inside it, so the
# Streamlit page itself must not scroll (two nested scrollers break touch
# scrolling on phones). `dvh` tracks mobile browser toolbars showing/hiding.
FULLSCREEN_APP_CSS = """
<style>
  html, body, [data-testid="stAppViewContainer"], [data-testid="stMain"] {
    overflow: hidden !important;
    overscroll-behavior: none;
  }
  iframe[data-testid="stCustomComponentV1"] {
    position: fixed !important;
    inset: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important;
    border: 0 !important;
    z-index: 999990;
  }
  /* Every save reruns the script; don't dim the app while that happens. */
  [data-stale="true"], .stale-element {
    opacity: 1 !important;
    transition: none !important;
  }
</style>
"""

build_dir = Path(__file__).parent / "streamlit_build"
if not (build_dir / "index.html").exists():
    st.error("streamlit_build/index.html is missing. Run `npm run build:streamlit` first.")
    st.stop()


def secret(name: str) -> str | None:
    try:
        return st.secrets.get(name)
    except FileNotFoundError:
        return None


# --- Password gate (the app URL is public; progress belongs to one person) ---
app_password = secret("APP_PASSWORD")
if app_password and not st.session_state.get("authenticated"):
    _, middle, _ = st.columns([1, 1, 1])
    with middle:
        st.markdown("<div style='height: 20vh'></div>", unsafe_allow_html=True)
        st.subheader("🎯 AI Interview Prep")
        with st.form("login"):
            password = st.text_input("Password", type="password")
            if st.form_submit_button("Sign in", use_container_width=True):
                if hmac.compare_digest(password, app_password):
                    st.session_state.authenticated = True
                    st.rerun()
                else:
                    st.error("Incorrect password.")
    st.stop()

database_url = secret("DATABASE_URL")
if not database_url:
    st.error("DATABASE_URL is not set. Add your Neon connection string to Streamlit secrets.")
    st.stop()


@st.cache_resource(show_spinner=False)
def ensure_schema(url: str) -> bool:
    db.init_schema(url)
    return True


try:
    ensure_schema(database_url)
    if "progress" not in st.session_state:
        st.session_state.progress = db.load_progress(database_url)
except Exception as exc:  # noqa: BLE001 - show any connection problem to the user
    st.error(f"Could not connect to the database: {exc}")
    st.stop()

st.session_state.setdefault("attempted_rev", None)
st.session_state.setdefault("saved_rev", None)
st.session_state.setdefault("save_error", None)

# Save the snapshot the app sent (if new) before rendering, so the render below
# already carries the save result. The component value persists across reruns,
# so each revision is attempted only once.
update = st.session_state.get("prep_app")
if update and update.get("rev") != st.session_state.attempted_rev:
    st.session_state.attempted_rev = update["rev"]
    try:
        db.save_progress(database_url, update["progress"], st.session_state.progress)
        st.session_state.progress = update["progress"]
        st.session_state.saved_rev = update["rev"]
        st.session_state.save_error = None
    except Exception as exc:  # noqa: BLE001 - reported back to the app's save badge
        st.session_state.save_error = str(exc)

prep_app = components.declare_component("fnb_prep_app", path=str(build_dir))

st.markdown(FULLSCREEN_APP_CSS, unsafe_allow_html=True)

# `progress` is only read by the app when it first loads.
prep_app(
    progress=st.session_state.progress,
    saved_rev=st.session_state.saved_rev,
    save_error=st.session_state.save_error,
    key="prep_app",
    default=None,
)
