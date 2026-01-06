const BASE_URL = "http://task.riggcorp.com/api/admin/users";

function authHeader() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getUsers() {
    const res = await fetch(BASE_URL, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
}

export async function createUser(user) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return await res.json();
}

export async function updateUser(id, user) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return await res.json();
}

export async function deleteUser(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return true;
}