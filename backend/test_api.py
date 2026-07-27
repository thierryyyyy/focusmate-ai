import httpx, time

endpoints = [
    ("GET", "/api/health", None),
    ("POST", "/api/auth/register", {"name": "TestUser", "email": "test2@test.com", "password": "123456"}),
    ("POST", "/api/auth/login", {"email": "test2@test.com", "password": "123456"}),
]

for method, path, body in endpoints:
    try:
        if method == "GET":
            r = httpx.get(f"https://focusmate-pocu.onrender.com{path}", timeout=30)
        else:
            r = httpx.post(f"https://focusmate-pocu.onrender.com{path}", json=body, timeout=30)
        print(f"{method} {path} -> {r.status_code}: {r.text[:200]}")
    except Exception as e:
        print(f"{method} {path} -> ERROR: {e}")
    time.sleep(2)
