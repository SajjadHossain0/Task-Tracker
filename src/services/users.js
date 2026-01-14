// const BASE_URL = "http://task.riggcorp.com/api/admin/users";
import { BASE_URL } from "./api";
const USER_URL = BASE_URL + '/admin/users'

function authHeader() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

export async function getUsers() {
    const res = await fetch(USER_URL, {
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
}

export async function createUser(user) {
    console.log("createUser payload:", user); // debug payload
    const res = await fetch(USER_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create user");
    return data;
}



export async function updateUser(id, user) {
    const res = await fetch(`${USER_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(user),
    });
    if (!res.ok) throw new Error("Failed to update user");
    return await res.json();
}

export async function deleteUser(id) {
    const res = await fetch(`${USER_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to delete user");
    return true;
}


// 🔹 GET USER BY ID
export async function getUserById(id) {
    const res = await fetch(`${USER_URL}/${id}`, {
        headers: authHeader(),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch user by ID");
    }

    return await res.json();
}