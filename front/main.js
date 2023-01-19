const url = "http://localhost:3000";
let postsOnPage = 10;

const removeInfiniteScroll = () => {
    window.removeEventListener("scroll", handleInfiniteScroll);
};

const handleInfiniteScroll = () => {
    const postsLimit = Number(localStorage.getItem("postsLimit"));
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if (postsOnPage >= postsLimit) {
        console.log("remove");
        removeInfiniteScroll();
    }

    if (endOfPage) {
        console.log("end");
        loadPosts(postsOnPage);
        postsOnPage += 10;
    }
};

async function like(postId, event) {
    const likesNum = event.composedPath()[1].querySelector(".card-likes-num");
    if (event.target.src.split("/").at(-1) === "heart.png") {
        event.target.src = "./images/heart-fill.png";
        likesNum.textContent = Number(likesNum.textContent) + 1;
    } else {
        event.target.src = "./images/heart.png";
        likesNum.textContent = Number(likesNum.textContent) - 1;
    }

    const userId = localStorage.getItem("currentUserId");
    const payload = {
        postId,
        userId,
    };

    const response = await fetch(url + "/posts/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.message === "Success");
}

async function loadPosts(skip) {
    const filters = JSON.parse(localStorage.getItem("filter"));

    const response = await fetch(url + "/posts/filter/" + skip, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
    });
    const data = await response.json();

    const postsBlock = document.querySelector("#posts-cards-block");
    const postTemplate = document.querySelector("#post-template");

    for (const post of data.data) {
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".card-author").textContent = `Posted by ${post.author.login}`;
        clone.querySelector(".card-title").textContent = post.title;
        clone.querySelector(".card-body").textContent = post.body;
        clone.querySelector(".card-description").textContent = post.description;
        clone.querySelector(".card-like-image").addEventListener("click", (event) => like(post._id, event));
        clone.querySelector(".card-likes-num").textContent = post.userIdsLiked.length;
        clone.querySelector(".card-tags").textContent = post.tags.join(" ");

        const userId = localStorage.getItem("currentUserId");

        if (post.userIdsLiked.includes(userId)) {
            clone.querySelector(".card-like-image").src = "./images/heart-fill.png";
        }

        postsBlock.appendChild(clone);
    }
}

async function getNumberOfPosts() {
    const response = await fetch(url + "/posts/count", { method: "GET" });
    const data = await response.json();

    if (data.message === "Success") localStorage.setItem("postsLimit", data.data);
}

function setFilters() {
    const userId = localStorage.getItem("currentUserId");

    const filters = {
        login: document.querySelector("#posts-byUser-sort-input").value,
        title: document.querySelector("#posts-byPost-sort-input").value,
        hashtag: document.querySelector("#posts-byHashtag-sort-input").value,
        onlySubs: document.querySelector("#posts-onlySubs-sort-input").checked,
        userId,
    };

    localStorage.setItem("filter", JSON.stringify(filters));
}

function updateFilters() {
    setFilters();
    document.querySelector("#posts-cards-block").innerHTML = "";
    loadPosts();
}

function clearFilters() {
    document.querySelector("#posts-byUser-sort-input").value = "";
    document.querySelector("#posts-byPost-sort-input").value = "";
    document.querySelector("#posts-byHashtag-sort-input").value = "";
    document.querySelector("#posts-byPost-sort-input").checked = false;
}

function fillFilters() {
    const filters = JSON.parse(localStorage.getItem("filter"));

    document.querySelector("#posts-byUser-sort-input").value = filters.login;
    document.querySelector("#posts-byPost-sort-input").value = filters.title;
    document.querySelector("#posts-byHashtag-sort-input").value = filters.hashtag;
    document.querySelector("#posts-onlySubs-sort-input").checked = filters.onlySubs;
}

if (!localStorage.getItem("filter")) {
    setFilters();
} else {
    fillFilters();
}

getNumberOfPosts();
window.addEventListener("scroll", handleInfiniteScroll);
loadPosts(postsOnPage - 10);
