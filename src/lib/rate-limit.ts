/**
 * Rate limit em memória por chave (IP): 5 envios por janela de 10 min.
 *
 * Limite conhecido: na Vercel cada instância serverless tem sua própria
 * memória, então o teto vale por instância — suficiente contra flood burro
 * (bots sequenciais batem na mesma instância quente). Junto com o honeypot
 * cobre a Fase 1; proteção distribuída (Upstash/KV) fica para quando houver
 * volume real.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_HITS = 5;

const hits = new Map<string, { count: number; windowStart: number }>();

export function rateLimitOk(key: string): boolean {
  const now = Date.now();

  // Limpeza oportunista para a Map não crescer sem limite
  if (hits.size > 5_000) {
    for (const [k, v] of hits) {
      if (now - v.windowStart > WINDOW_MS) hits.delete(k);
    }
  }

  const entry = hits.get(key);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_HITS;
}
