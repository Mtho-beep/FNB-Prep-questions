export const STUDY_MODE_LABELS = { teach: 'Teach Me', deep: 'Deep Dive', interview: 'FNB Interview Prep' } as const

/** Link to where an existing source question lives in the app (null for profile facts). */
export function sourceHref(id: string): string | null {
  if (id.startsWith('cb-')) return `/coderbyte#${id}`
  if (id.startsWith('profile-')) return null
  return `/question/${id}`
}
