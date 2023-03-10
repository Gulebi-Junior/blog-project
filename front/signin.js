const url = "http://localhost:3000";

async function signin() {
    const payload = {
        login: document.querySelector("#login-input").value,
        password: document.querySelector("#password-input").value,
    };

    const response = await fetch(url + "/users/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.message === "Success") {
        localStorage.setItem("currentUserId", data.data);
        location.replace("main.html");
    } else alert(data.message);
}
