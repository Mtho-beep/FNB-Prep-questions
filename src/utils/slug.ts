import type { Category } from '../types/questions'

/** Converts a Category name into a URL-safe slug, e.g. "AI Fundamentals" -> "ai-fundamentals". */
export function categoryToSlug(category: Category): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const slugMap: Record<string, Category> = {
  'behavioural-and-soft-skills': 'Behavioural & Soft Skills',
  teamwork: 'Teamwork',
  'project-questions': 'Project Questions',
  'ai-fundamentals': 'AI Fundamentals',
  'machine-learning': 'Machine Learning',
  'llms-and-generative-ai': 'LLMs & Generative AI',
  'ai-agents': 'AI Agents',
  python: 'Python',
  'sql-and-databases': 'SQL & Databases',
  'ai-plus-banking': 'AI + Banking',
  'ai-ethics-and-responsible-ai': 'AI Ethics & Responsible AI',
  'system-design': 'System Design',
  security: 'Security',
}

export function slugToCategory(slug: string): Category | undefined {
  return slugMap[slug]
}
