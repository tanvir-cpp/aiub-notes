export const AIUB_STUDENT_EMAIL_PATTERN = /^\d{2}-\d{5}-\d@student\.aiub\.edu$/i;

export function isAiubEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  return AIUB_STUDENT_EMAIL_PATTERN.test(normalized);
}
