const url = "http://localhost:3000";

async function like(postId, event) {
    let liked;
    const likesNum = event.composedPath()[1].querySelector(".card-likes-num");
    if (event.target.src.split("/").at(-1) === "heart.png") {
        event.target.src = "./images/heart-fill.png";
        likesNum.textContent = Number(likesNum.textContent) + 1;
        liked = true;
    } else {
        event.target.src = "./images/heart.png";
        likesNum.textContent = Number(likesNum.textContent) - 1;
        liked = false;
    }

    const userId = localStorage.getItem("currentUserId");
    const payload = {
        postId,
        userId,
        liked,
    };

    const response = await fetch(url + "/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.message === "Success");
}

async function loadPosts() {
    const response = await fetch(url + "/posts", { method: "GET" });
    const data = await response.json();

    const postsBlock = document.querySelector("#posts-cards-block");
    const postTemplate = document.querySelector("#post-template");

    postsBlock.innerHTML = "";

    for (const post of data) {
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".card-author").textContent = `Posted by ${post.author.login}`;
        clone.querySelector(".card-title").textContent = post.title;
        clone.querySelector(".card-body").textContent = post.body;
        clone.querySelector(".card-description").textContent = post.description;
        clone.querySelector(".card-like-image").addEventListener("click", (event) => like(post._id, event));
        clone.querySelector(".card-likes-num").textContent = post.usersIdsLiked.length;
        clone.querySelector(".card-tags").textContent = post.tags.join(" ");

        const userId = localStorage.getItem("currentUserId");

        if (post.usersIdsLiked.includes(userId)) {
            clone.querySelector(".card-like-image").src = "./images/heart-fill.png";
        }

        postsBlock.appendChild(clone);
    }
}

loadPosts();
