import { BASE_URL } from "./api";

const PROJECT_URL = BASE_URL + '/projects'

function authHeader() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function getProjects() {
    const res = await fetch(PROJECT_URL, { headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
}

export async function createProject(data) {
    const res = await fetch(PROJECT_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
}

export async function updateProject(id, data) {
    const res = await fetch(`${PROJECT_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
}

// ✅ FIXED DELETE
export async function deleteProject(id) {
    const res = await fetch(`${PROJECT_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to delete project");
    return true; // JSON na thakle error na dibe
}

export async function getProjectById(projectId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Failed to load project");

    return res.json();
}