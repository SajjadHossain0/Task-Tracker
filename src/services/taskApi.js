import { BASE_URL } from "./api";

const TASK_URL = `${BASE_URL}/tasks`;

// ✅ Auth header function
function authHeader() {
    const token = localStorage.getItem("token"); // ensure token exists
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

// 🔹 CREATE TASK
export async function createTask(formData) {
    const res = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return await res.json();
}


// 🔹 GET TASKS BY PROJECT
export async function getTasksByProject(projectId) {
    try {
        const res = await fetch(`${TASK_URL}/project/${projectId}`, {
            headers: authHeader(),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.message || errorData.error || "Failed to get tasks"
            );
        }

        return await res.json();
    } catch (err) {
        console.error("getTasksByProject error:", err);
        throw err;
    }
}

export async function getProjectById(projectId) {
    const res = await fetch(`${BASE_URL}/projects/${projectId}`, {
        headers: authHeader(),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to get project");
    }

    return await res.json();
}

// updateTask//
export async function updateTask(id, formData) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return await res.json();
}


//Delete Task//

export async function deleteTaskById(id) {
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return true;
}