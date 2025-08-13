import requests
import hashlib
import json
import os

SERPER_API_KEY = os.getenv("SERPER_API_KEY") 
CACHE_FILE = "serper_cache.json"

if os.path.exists(CACHE_FILE):
    with open(CACHE_FILE, "r", encoding="utf-8") as f:
        cache = json.load(f)
else:
    cache = {}

def hash_query(q: str) -> str:
    return hashlib.sha256(q.strip().lower().encode()).hexdigest()

def search_medical_web(query: str) -> list[str]:
    h = hash_query(query)
    if h in cache:
        return cache[h]

    url = "https://google.serper.dev/search"
    headers = {
        "X-API-KEY": SERPER_API_KEY,
        "Content-Type": "application/json"
    }
    data = { "q": query }

    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    results = response.json()

    snippets = []
    for item in results.get("organic", [])[:3]:
        snippets.append(f"{item['title']}: {item['snippet']}")

    cache[h] = snippets
    with open(CACHE_FILE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    return snippets
