if (localStorage.getItem("currentUserId") === null) {
    location.replace("signin.html");
} else {
    document.querySelector("#sign-btn").addEventListener("click", () => {
        localStorage.removeItem("currentUserId");
        location.replace("signin.html");
    });
}
