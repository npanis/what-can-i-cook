export type StepPart = { kind: 'text'; text: string } | { kind: 'term'; slug: string; text: string };

const TERM = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

/** Splits step text with [[slug|shown text]] markup into plain and tappable parts. */
export function parseStep(step: string): StepPart[] {
  const parts: StepPart[] = [];
  let last = 0;
  for (const m of step.matchAll(TERM)) {
    if (m.index > last) parts.push({ kind: 'text', text: step.slice(last, m.index) });
    parts.push({ kind: 'term', slug: m[1], text: m[2] ?? m[1] });
    last = m.index + m[0].length;
  }
  if (last < step.length) parts.push({ kind: 'text', text: step.slice(last) });
  return parts;
}
