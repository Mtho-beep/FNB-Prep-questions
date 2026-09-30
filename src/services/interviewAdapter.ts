import type { Category, CodingQuestion, Question, RapidFireQuestion } from '../types/questions'
import type { InterviewQuestion, ScoreArea } from '../types/interview'
import { allQuestions, coderbyteQuestions, rapidFireQuestions } from '../data'
import { profileQuestions } from '../data/candidateProfile'

// Adapts the app's existing question bank into the shape the interview engine
// needs. Nothing is copied: each InterviewQuestion is derived on demand from
// src/data, which stays the single source of truth.

const categoryScoreAreas: Record<Category, ScoreArea[]> = {
  'Behavioural & Soft Skills': ['behavioural'],
  Teamwork: ['behavioural'],
  'Project Questions': ['project', 'problemSolving'],
  'AI Fundamentals': ['fundamentals'],
  'Machine Learning': ['fundamentals', 'technical'],
  'LLMs & Generative AI': ['fundamentals', 'technical'],
  'AI Agents': ['technical', 'fundamentals'],
  Python: ['technical', 'problemSolving'],
  'SQL & Databases': ['technical', 'problemSolving'],
  'AI + Banking': ['technical', 'problemSolving'],
  'AI Ethics & Responsible AI': ['behavioural', 'fundamentals'],
  'System Design': ['technical', 'problemSolving'],
  Security: ['technical', 'problemSolving'],
  'Coderbyte Technical Assessment': ['problemSolving', 'technical'],
  'Rapid Fire': ['fundamentals'],
}

export function fromQuestion(q: Question): InterviewQuestion {
  return {
    sourceId: q.id,
    sourceType: 'question',
    text: q.question,
    category: q.category,
    difficulty: q.difficulty,
    modelAnswer: q.answer,
    keyPoints: q.keyPoints,
    followUps: q.followUps,
    projectContext: q.projectConnection,
    tags: q.tags,
    scoreAreas: categoryScoreAreas[q.category],
  }
}

export function fromRapidFire(q: RapidFireQuestion): InterviewQuestion {
  return {
    sourceId: q.id,
    sourceType: 'rapid',
    text: q.question,
    category: 'Rapid Fire',
    difficulty: 'Beginner',
    modelAnswer: q.answer,
    keyPoints: [],
    followUps: [],
    tags: q.tags,
    scoreAreas: categoryScoreAreas['Rapid Fire'],
  }
}

/** Coding questions are asked verbally: the candidate explains their approach before coding. */
export function fromCoding(q: CodingQuestion): InterviewQuestion {
  return {
    sourceId: q.id,
    sourceType: 'coding',
    text: `Let's move to a coding problem: ${q.title}. ${q.problem} Before writing any code, talk me through your approach.`,
    category: 'Coderbyte Technical Assessment',
    difficulty: q.difficulty,
    modelAnswer: `${q.approach}\nTime complexity: ${q.timeComplexity}. Space complexity: ${q.spaceComplexity}.`,
    keyPoints: [q.approach, `Time complexity: ${q.timeComplexity}`, `Space complexity: ${q.spaceComplexity}`],
    followUps: [q.followUp, 'What is the time and space complexity of your approach?', 'Which edge cases would you test?'],
    tags: ['coding', ...q.title.toLowerCase().split(/\s+/)],
    scoreAreas: categoryScoreAreas['Coderbyte Technical Assessment'],
  }
}

export function fromProfile(p: (typeof profileQuestions)[number]): InterviewQuestion {
  return {
    sourceId: p.id,
    sourceType: 'profile',
    text: p.question,
    category: 'Experience',
    difficulty: 'Beginner',
    modelAnswer: '',
    keyPoints: [],
    followUps: ['What did you find most challenging there?', 'How did you work with the people around you?'],
    projectContext: p.context,
    tags: ['sarao', 'experience'],
    scoreAreas: ['behavioural'],
  }
}

export const closingQuestion: InterviewQuestion = {
  sourceId: 'closing',
  sourceType: 'closing',
  text: "We're nearly out of time. Do you have any questions for us?",
  category: 'Closing',
  difficulty: 'Beginner',
  modelAnswer: '',
  keyPoints: [],
  followUps: [],
  tags: ['closing'],
  scoreAreas: [],
}

const questionById = new Map(allQuestions.map((q) => [q.id, q]))
const codingById = new Map(coderbyteQuestions.map((q) => [q.id, q]))
const rapidById = new Map(rapidFireQuestions.map((q) => [q.id, q]))
const profileById = new Map(profileQuestions.map((q) => [q.id, q]))

/** Look up any interview question by the id of its source question. */
export function getInterviewQuestion(sourceId: string): InterviewQuestion | undefined {
  const q = questionById.get(sourceId)
  if (q) return fromQuestion(q)
  const c = codingById.get(sourceId)
  if (c) return fromCoding(c)
  const r = rapidById.get(sourceId)
  if (r) return fromRapidFire(r)
  const p = profileById.get(sourceId)
  if (p) return fromProfile(p)
  if (sourceId === closingQuestion.sourceId) return closingQuestion
  return undefined
}

export function getSourceQuestion(sourceId: string): Question | undefined {
  return questionById.get(sourceId)
}

export const adaptedQuestions: InterviewQuestion[] = allQuestions.map(fromQuestion)
export const adaptedRapidFire: InterviewQuestion[] = rapidFireQuestions.map(fromRapidFire)
export const adaptedCoding: InterviewQuestion[] = coderbyteQuestions.map(fromCoding)
export const adaptedProfile: InterviewQuestion[] = profileQuestions.map(fromProfile)
