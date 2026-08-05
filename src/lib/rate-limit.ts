import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";

const LIMIT = 3;
const WINDOW_MS = 10 * 60 * 1000;

const upstash =
  env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: new Redis({
          url: env.UPSTASH_REDIS_REST_URL,
          token: env.UPSTASH_REDIS_REST_TOKEN,
        }),
        limiter: Ratelimit.slidingWindow(LIMIT, "10 m"),
        prefix: "contact",
      })
    : null;

// In-memory працює лише в межах одного інстанса — для dev і self-hosted.
// У serverless (Vercel) кожен інстанс має свою пам'ять, тому в проді
// обов'язковий Upstash (архітектура §14).
const memory = new Map<string, number[]>();

export async function checkRateLimit(ip: string): Promise<boolean> {
  if (upstash) {
    return (await upstash.limit(ip)).success;
  }
  const now = Date.now();
  const hits = (memory.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= LIMIT) {
    memory.set(ip, hits);
    return false;
  }
  hits.push(now);
  memory.set(ip, hits);
  return true;
}
