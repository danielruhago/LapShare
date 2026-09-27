const UNIVERSITY_DOMAIN = /(\.edu|\.edu\.[a-z]{2,}|\.ac\.[a-z]{2,}|usask\.ca)$/i

export function isUniversityEmail(email: string) {
  const at = email.lastIndexOf('@')
  if (at < 1) return false
  return UNIVERSITY_DOMAIN.test(email.slice(at + 1).trim())
}