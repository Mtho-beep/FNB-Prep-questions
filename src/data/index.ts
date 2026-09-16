import type { Category, Question } from '../types/questions'
import { behaviouralQuestions } from './behaviouralQuestions'
import { teamworkQuestions } from './teamworkQuestions'
import { projectQuestions } from './projectQuestions'
import { aiQuestions } from './aiQuestions'
import { mlQuestions } from './mlQuestions'
import { llmQuestions } from './llmQuestions'
import { agentQuestions } from './agentQuestions'
import { pythonQuestions } from './pythonQuestions'
import { sqlQuestions } from './sqlQuestions'
import { bankingQuestions } from './bankingQuestions'
import { ethicsQuestions } from './ethicsQuestions'
import { securityQuestions } from './securityQuestions'
import { systemDesignQuestions } from './systemDesignQuestions'
import { coderbyteQuestions } from './coderbyteQuestions'
import { rapidFireQuestions } from './rapidFireQuestions'

export {
  behaviouralQuestions,
  teamworkQuestions,
  projectQuestions,
  aiQuestions,
  mlQuestions,
  llmQuestions,
  agentQuestions,
  pythonQuestions,
  sqlQuestions,
  bankingQuestions,
  ethicsQuestions,
  securityQuestions,
  systemDesignQuestions,
  coderbyteQuestions,
  rapidFireQuestions,
}

/** All standard (non-coding, non-rapid-fire) questions in one flat array. */
export const allQuestions: Question[] = [
  ...behaviouralQuestions,
  ...teamworkQuestions,
  ...projectQuestions,
  ...aiQuestions,
  ...mlQuestions,
  ...llmQuestions,
  ...agentQuestions,
  ...pythonQuestions,
  ...sqlQuestions,
  ...bankingQuestions,
  ...ethicsQuestions,
  ...securityQuestions,
  ...systemDesignQuestions,
]

/** The ordered list of categories shown in the sidebar (excludes Coderbyte/Rapid Fire, which have their own pages). */
export const practiceCategories: Category[] = [
  'Behavioural & Soft Skills',
  'Teamwork',
  'Project Questions',
  'AI Fundamentals',
  'Machine Learning',
  'LLMs & Generative AI',
  'AI Agents',
  'Python',
  'SQL & Databases',
  'AI + Banking',
  'AI Ethics & Responsible AI',
  'System Design',
  'Security',
]

export function questionsByCategory(category: Category): Question[] {
  return allQuestions.filter((q) => q.category === category)
}

export const totalStandardQuestions = allQuestions.length
export const totalCodingQuestions = coderbyteQuestions.length
export const totalRapidFireQuestions = rapidFireQuestions.length
export const totalAllQuestions = totalStandardQuestions + totalCodingQuestions
