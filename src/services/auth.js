import { BASE_URL } from "./api";

export async function loginUser(username, password) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username,
            password,
        }),
    });

    // 🔴 Wrong login or error
    if (!response.ok) {
        let errorMessage = "Login failed";

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (err) {
            // ❗ backend empty response দিলে এখানে আসবে
        }

        throw new Error(errorMessage);
    }

    // ✅ Correct login
    return await response.json(); // { token: "JWT_TOKEN" }
}