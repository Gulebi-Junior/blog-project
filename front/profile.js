const url = "http://localhost:3000";

async function loadPosts() {
    const userId = localStorage.getItem("currentUserId");
    const response = await fetch(url + "/posts/byUserId/" + userId, { method: "GET" });
    const data = await response.json();

    const postsBlock = document.querySelector("#profile-posts-cards-block");
    const postTemplate = document.querySelector("#post-template");

    postsBlock.innerHTML = "";

    for (const post of data.data) {
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".card-title").textContent = post.title;
        clone.querySelector(".card-description").textContent = post.description;
        clone.querySelector(".card-body").textContent = post.body.split(" ").slice(0, 13).join(" ") + "...";
        clone.querySelector(".card-likes-num").textContent = post.usersIdsLiked.length;

        if (post.usersIdsLiked.includes(userId)) {
            clone.querySelector(".card-like-image").src = "./images/heart-fill.png";
        }

        postsBlock.appendChild(clone);
    }
}

loadPosts();
