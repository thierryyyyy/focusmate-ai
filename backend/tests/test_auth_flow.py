from conftest import register


def test_register_login_flow(client, valid_user):
    res = register(client, valid_user)
    assert res.status_code == 201
    body = res.json()
    assert body["token"]
    assert body["refreshToken"]
    assert body["expiresIn"] > 0
    assert body["user"]["name"] == "Test User"
    assert body["user"]["email"] == "test@example.com"
    assert "createdAt" in body["user"]

    login = client.post(
        "/api/auth/login",
        json={"email": valid_user["email"], "password": valid_user["password"]},
    )
    assert login.status_code == 200
    assert login.json()["refreshToken"]


def test_duplicate_register_rejected(client, valid_user):
    assert register(client, valid_user).status_code == 201
    assert register(client, valid_user).status_code == 400


def test_wrong_password_rejected(client, valid_user):
    register(client, valid_user)
    res = client.post(
        "/api/auth/login",
        json={"email": valid_user["email"], "password": "Wrong!pass1"},
    )
    assert res.status_code == 401


def test_refresh_token_rotation(client, valid_user):
    refresh_token = register(client, valid_user).json()["refreshToken"]

    refreshed = client.post("/api/auth/refresh", json={"refreshToken": refresh_token})
    assert refreshed.status_code == 200
    body = refreshed.json()
    assert body["token"]
    assert body["refreshToken"] != refresh_token

    reused = client.post("/api/auth/refresh", json={"refreshToken": refresh_token})
    assert reused.status_code == 401


def test_logout_revokes_refresh_token(client, valid_user):
    refresh_token = register(client, valid_user).json()["refreshToken"]

    logout = client.post("/api/auth/logout", json={"refreshToken": refresh_token})
    assert logout.status_code == 204

    revoked = client.post("/api/auth/refresh", json={"refreshToken": refresh_token})
    assert revoked.status_code == 401


def test_users_me_get_and_update(client, valid_user):
    token = register(client, valid_user).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    me = client.get("/api/users/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == valid_user["email"]

    updated = client.put("/api/users/me", json={"name": "Renamed"}, headers=headers)
    assert updated.status_code == 200
    assert updated.json()["name"] == "Renamed"


def test_protected_route_requires_auth(client):
    assert client.get("/api/goals").status_code == 401
    assert client.get("/api/users/me").status_code == 401


def test_weak_password_rejected(client):
    res = register(client, {"name": "Weak", "email": "weak@example.com", "password": "123456"})
    assert res.status_code == 422

    res2 = register(
        client,
        {"name": "Weak", "email": "weak2@example.com", "password": "alllowercase1"},
    )
    assert res2.status_code == 422


def test_invalid_email_rejected(client):
    res = register(client, {"name": "Bad", "email": "not-an-email", "password": "Str0ng!pass"})
    assert res.status_code == 422


def test_goals_crud(client, valid_user):
    token = register(client, valid_user).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    created = client.post(
        "/api/goals",
        json={
            "title": "Apprendre FastAPI",
            "category": "work",
            "startDate": "2026-08-01",
            "endDate": "2026-08-31",
            "priority": "high",
            "estimatedTime": 20,
        },
        headers=headers,
    )
    assert created.status_code == 201
    goal = created.json()
    assert goal["title"] == "Apprendre FastAPI"
    assert goal["startDate"] == "2026-08-01"
    assert goal["status"] == "pending"

    listed = client.get("/api/goals", headers=headers)
    assert listed.status_code == 200
    body = listed.json()
    assert body["total"] == 1
    assert len(body["items"]) == 1
    assert body["items"][0]["title"] == "Apprendre FastAPI"

    updated = client.put(
        f"/api/goals/{goal['id']}",
        json={"status": "completed", "progression": 100},
        headers=headers,
    )
    assert updated.status_code == 200
    assert updated.json()["progression"] == 100

    deleted = client.delete(f"/api/goals/{goal['id']}", headers=headers)
    assert deleted.status_code == 204

    listed_after = client.get("/api/goals", headers=headers)
    assert listed_after.json()["total"] == 0
    assert listed_after.json()["items"] == []


def test_goals_pagination(client, valid_user):
    token = register(client, valid_user).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    for i in range(5):
        res = client.post(
            "/api/goals",
            json={
                "title": f"Objectif {i}",
                "category": "personal",
                "startDate": "2026-08-01",
                "endDate": "2026-08-31",
                "estimatedTime": 1,
            },
            headers=headers,
        )
        assert res.status_code == 201

    page1 = client.get("/api/goals?page=1&per_page=2", headers=headers)
    assert page1.status_code == 200
    body = page1.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5
    assert body["page"] == 1
    assert body["perPage"] == 2
    assert body["totalPages"] == 3

    page3 = client.get("/api/goals?page=3&per_page=2", headers=headers)
    assert len(page3.json()["items"]) == 1

    page4 = client.get("/api/goals?page=4&per_page=2", headers=headers)
    assert page4.json()["items"] == []

    clamped = client.get("/api/goals?per_page=500", headers=headers)
    assert clamped.json()["perPage"] == 100


def test_habits_crud_with_completed_dates(client, valid_user):
    token = register(client, valid_user).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    created = client.post(
        "/api/habits",
        json={"name": "Méditation", "icon": "🧘", "frequency": "daily"},
        headers=headers,
    )
    assert created.status_code == 201
    habit = created.json()
    assert habit["completedDates"] == []

    updated = client.put(
        f"/api/habits/{habit['id']}",
        json={"completedDates": ["2026-08-07"]},
        headers=headers,
    )
    assert updated.status_code == 200
    assert updated.json()["completedDates"] == ["2026-08-07"]


def test_activities_create(client, valid_user):
    token = register(client, valid_user).json()["token"]
    headers = {"Authorization": f"Bearer {token}"}

    created = client.post(
        "/api/activities",
        json={"type": "focus", "duration": 25, "date": "2026-08-07"},
        headers=headers,
    )
    assert created.status_code == 201
    assert created.json()["date"] == "2026-08-07"
