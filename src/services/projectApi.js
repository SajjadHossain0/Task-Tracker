const BASE_URL = "http://task.riggcorp.com/api/projects";

function authHeader() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };
}

export async function getProjects() {
    const res = await fetch(BASE_URL, { headers: authHeader() });
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
}

export async function createProject(data) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create project");
    return res.json();
}

export async function updateProject(id, data) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update project");
    return res.json();
}

// ✅ FIXED DELETE
export async function deleteProject(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: authHeader(),
    });
    if (!res.ok) throw new Error("Failed to delete project");
    return true; // JSON na thakle error na dibe
}