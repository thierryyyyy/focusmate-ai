import httpx
import time

print("Waking up Render free tier (may take 30-60s)...")
try:
    r = httpx.get("https://focusmate-pocu.onrender.com/api/health", timeout=60)
    print("Health:", r.status_code, r.text)
except Exception as e:
    print("Health error:", e)

print("\nTrying register...")
try:
    r = httpx.post(
        "https://focusmate-pocu.onrender.com/api/auth/register",
        json={"name": "TestUser", "email": "test@test.com", "password": "123456"},
        timeout=60
    )
    print("Register:", r.status_code, r.text[:500])
except Exception as e:
    print("Register error:", e)

print("\nTrying login...")
try:
    r = httpx.post(
        "https://focusmate-pocu.onrender.com/api/auth/login",
        json={"email": "test@test.com", "password": "123456"},
        timeout=60
    )
    print("Login:", r.status_code, r.text[:500])
except Exception as e:
    print("Login error:", e)
