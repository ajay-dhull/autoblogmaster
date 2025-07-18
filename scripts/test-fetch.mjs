import fetch from "node-fetch";

const API_URL = "https://autoblogmaster-production.up.railway.app/api/articles";

try {
  const response = await fetch(API_URL);
  const data = await response.json();
  console.log("✅ API data structure:");
  console.dir(data, { depth: null });
} catch (error) {
  console.error("❌ Failed to fetch data:", error);
}
