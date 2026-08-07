"""Local smoke test for the FocusMate API.

Targets a local/CI server by default. Override with FOCUSMATE_BASE_URL.
Never contains credentials.
"""

import os

import httpx

BASE_URL = os.getenv("FOCUSMATE_BASE_URL", "http://127.0.0.1:8000").rstrip("/")
EMAIL = os.getenv("FOCUSMATE_TEST_EMAIL", f"smoke.{os.getpid()}@example.com")
PASSWORD = "Sm0ke!test42"


def main() -> None:
    with httpx.Client(base_url=BASE_URL, timeout=15) as client:
        health = client.get("/api/health")
        print(f"Health: {health.status_code} {health.text}")
        assert health.status_code == 200

        register = client.post(
            "/api/auth/register",
            json={"name": "Smoke", "email": EMAIL, "password": PASSWORD},
        )
        print(f"Register: {register.status_code} {register.text[:200]}")
        assert register.status_code == 201

        body = register.json()
        token = body["token"]
        refresh_token = body["refreshToken"]
        assert body["expiresIn"] > 0
        headers = {"Authorization": f"Bearer {token}"}

        me = client.get("/api/users/me", headers=headers)
        print(f"Me: {me.status_code} {me.text[:200]}")
        assert me.status_code == 200

        goals = client.get("/api/goals", headers=headers)
        print(f"Goals: {goals.status_code} {goals.text[:200]}")
        assert goals.status_code == 200

        refreshed = client.post(
            "/api/auth/refresh",
            json={"refreshToken": refresh_token},
        )
        print(f"Refresh: {refreshed.status_code} {refreshed.text[:200]}")
        assert refreshed.status_code == 200
        new_token = refreshed.json()["token"]
        new_refresh = refreshed.json()["refreshToken"]

        # old refresh token must be rotated (rejected now)
        reuse = client.post(
            "/api/auth/refresh",
            json={"refreshToken": refresh_token},
        )
        assert reuse.status_code == 401

        headers2 = {"Authorization": f"Bearer {new_token}"}
        updated = client.put("/api/users/me", json={"name": "Smoke2"}, headers=headers2)
        print(f"Update me: {updated.status_code} {updated.text[:200]}")
        assert updated.status_code == 200 and updated.json()["name"] == "Smoke2"

        logout = client.post("/api/auth/logout", json={"refreshToken": new_refresh})
        print(f"Logout: {logout.status_code}")
        assert logout.status_code == 204

        # revoked refresh token must be rejected
        revoked = client.post(
            "/api/auth/refresh",
            json={"refreshToken": new_refresh},
        )
        assert revoked.status_code == 401

        # strict validation: weak password rejected
        weak = client.post(
            "/api/auth/register",
            json={"name": "Weak", "email": "weak@test.local", "password": "123456"},
        )
        print(f"Weak register: {weak.status_code}")
        assert weak.status_code == 422

        print("Smoke test OK")


if __name__ == "__main__":
    main()
