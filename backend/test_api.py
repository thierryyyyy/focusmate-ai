import httpx

url = "https://focusmate-pocu.onrender.com/api/debug-db"
r = httpx.get(url, timeout=30)
print(r.status_code, r.text[:500])
