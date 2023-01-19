const url = "http://localhost:3000";

async function subscribe(targetId, event) {
    const userId = localStorage.getItem("currentUserId");

    if (event.target.textContent == "Subscribe") event.target.textContent = "Unsubscribe";
    else event.target.textContent = "Subscribe";

    const payload = {
        targetId,
        userId,
    };

    const response = await fetch(url + "/users/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.message === "Success");
}

async function loadUsers() {
    const response = await fetch(url + "/users", { method: "GET" });
    const data = await response.json();

    const usersBlock = document.querySelector("#users-cards-block");
    const userCardTemplate = document.querySelector("#user-card-template");

    const userId = localStorage.getItem("currentUserId");
    const response2 = await fetch(url + "/users/" + userId, { method: "GET" });
    const curentUser = await response2.json();

    usersBlock.innerHTML = "";

    for (const user of data.data) {
        const clone = userCardTemplate.content.cloneNode(true);

        clone.querySelector(".card-full-name").textContent = `${user.name} ${user.surname}`;
        clone.querySelector(".card-login").textContent = user.login;
        clone.querySelector(".card-subscribe-btn").addEventListener("click", (event) => subscribe(user._id, event));

        if (curentUser.data.subscriptionUserIds.includes(user._id)) {
            clone.querySelector(".card-subscribe-btn").textContent = "Unsubscribe";
        }

        usersBlock.appendChild(clone);
    }
}

loadUsers();
