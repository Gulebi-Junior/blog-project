const url = "http://localhost:3000";

async function login() {
    const payload = {
        name: document.querySelector("#name-input").value,
        surname: document.querySelector("#surname-input").value,
        login: document.querySelector("#login-input").value,
        password: document.querySelector("#password-input").value,
    };

    const response = await fetch(url + "/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.message === "Success") location.replace("signin.html");
}
