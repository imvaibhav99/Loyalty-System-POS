import { env } from '../config/env.js';

// Render's free tier spins a web service down after ~15 min without inbound traffic.
// Hitting our own public /health keeps the instance warm while it is still running.
export async function pingSelf() {
  if (!env.SELF_URL) return;

  const url = `${env.SELF_URL.replace(/\/+$/, '')}/health`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, { signal: controller.signal });
    console.log(`[serverWakeup] ${url} -> ${res.status}`);
  } catch (err) {
    console.error(`[serverWakeup] ping failed: ${err.message}`);
  } finally {
    clearTimeout(timer);
  }
}
