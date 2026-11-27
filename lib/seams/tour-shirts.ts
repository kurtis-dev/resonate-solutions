const garment = /\b(?:t[- ]?shirts?|tees?)\b/i;
const event = /\b(?:tour|concert|festival|live in concert)\b/i;
const period = /\b(?:19[89]\d|(?:19)?[89]0[’']?s)\b/i;
const reproduction = /\b(?:reprint|repro(?:duction)?|reissued?|replica|bootleg|remake|newly printed|vintage[- ]style|inspired by|tribute shirt|print on demand)\b/i;

export function isPeriodTourShirt(title: string, description = "") {
  if (!garment.test(title) || !event.test(title) || !period.test(title)) return false;
  if (reproduction.test(title) || reproduction.test(description) || /\b20(?:0\d|1\d|2\d)\b/.test(title)) return false;
  // The Rising tour began in 2002, despite occasional 1990s seller descriptions.
  return !(/\bspringsteen\b/i.test(title) && /\bthe rising\b/i.test(title));
}
