// test-api.mjs
import fetch from "node-fetch";

const URL = "https://autoblogmaster.onrender.com/api/articles";

const fetchWithTimeout = async (url, timeout = 15000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const t0 = Date.now();
  try {
    const res = await fetch(url, { signal: controller.signal });
    const ms = Date.now() - t0;
    console.log(`HTTP ${res.status} in ${ms}ms`);
    const text = await res.text();
    console.log(`Bytes: ${text.length}`);
    return { ok: res.ok, status: res.status, ms, text };
  } catch (e) {
    const ms = Date.now() - t0;
    console.error(`❌ Failed in ${ms}ms: ${e.name} ${e.message}`);
    throw e;
  } finally {
    clearTimeout(id);
  }
};

await fetchWithTimeout(URL, 15000);
