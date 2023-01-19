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

async function changePost(event, id) {
    const card = event.composedPath()[2];
    if (event.target.textContent == "Change") {
        card.querySelector(".card-change-btn").textContent = "Save";

        card.querySelector(".card-title").setAttribute("contenteditable", true);
        card.querySelector(".card-title").classList.add("text-outline");
        card.querySelector(".card-body").setAttribute("contenteditable", true);
        card.querySelector(".card-body").classList.add("text-outline");
        card.querySelector(".card-tags-input-subblock").style.display = "flex";
    } else {
        card.querySelector(".card-change-btn").textContent = "Change";

        card.querySelector(".card-title").setAttribute("contenteditable", false);
        card.querySelector(".card-title").classList.remove("text-outline");
        card.querySelector(".card-body").setAttribute("contenteditable", false);
        card.querySelector(".card-body").classList.remove("text-outline");
        card.querySelector(".card-tags-input-subblock").style.display = "none";

        const payload = {
            title: card.querySelector(".card-title").textContent,
            description: card.querySelector(".card-description").textContent,
            body: card.querySelector(".card-body").textContent,
            tags: card.querySelector(".card-tags").textContent.split(" "),
        };

        const response = await fetch(url + "/posts/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (data.message === "Success");
    }
}

async function changeUser(event) {
    if (event.target.textContent == "Change") {
        document.querySelector("#profile-info-change-btn").textContent = "Save";

        document.querySelector("#profile-info-fullname").setAttribute("contenteditable", true);
        document.querySelector("#profile-info-login").setAttribute("contenteditable", true);
    } else {
        document.querySelector("#profile-info-change-btn").textContent = "Change";

        document.querySelector("#profile-info-fullname").setAttribute("contenteditable", false);
        document.querySelector("#profile-info-login").setAttribute("contenteditable", false);

        const userId = localStorage.getItem("currentUserId");
        const nameArr = document.querySelector("#profile-info-fullname").textContent.split(" ");

        const payload = {
            name: nameArr[0],
            surname: nameArr[1],
            login: document.querySelector("#profile-info-login").textContent,
        };

        const response = await fetch(url + "/users/" + userId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (data.message === "Success");
    }
}

async function deletePost(event, id) {
    event.composedPath()[2].remove();

    const response = await fetch(url + "/posts/" + id, { method: "DELETE" });
    const data = await response.json();

    if (data.message === "Success");
}

function addTag(event) {
    const input = event.composedPath()[1].querySelector(".card-tags-input");
    event.composedPath()[2].querySelector(".card-tags").textContent += ` ${input.value}`;
    input.value = "";
}

async function loadPosts() {
    const userId = localStorage.getItem("currentUserId");
    const response = await fetch(url + "/posts/byUserId/" + userId, { method: "GET" });
    const data = await response.json();

    const postsBlock = document.querySelector("#profile-posts-cards-block");
    const postTemplate = document.querySelector("#post-template");

    for (const post of data.data) {
        const clone = postTemplate.content.cloneNode(true);

        clone.querySelector(".card-title").textContent = post.title;
        clone.querySelector(".card-description").textContent = post.description;
        clone.querySelector(".card-body").textContent = post.body;
        clone.querySelector(".card-likes-num").textContent = post.userIdsLiked.length;
        clone.querySelector(".card-tags").textContent = post.tags.join(" ");

        if (post.userIdsLiked.includes(userId)) {
            clone.querySelector(".card-like-image").src = "./images/heart-fill.png";
        }

        clone.querySelector(".card-change-btn").addEventListener("click", (event) => changePost(event, post._id));
        clone.querySelector(".card-delete-btn").addEventListener("click", (event) => deletePost(event, post._id));

        postsBlock.appendChild(clone);
    }
}

async function loadUserInfo() {
    const userId = localStorage.getItem("currentUserId");
    const response = await fetch(url + "/users/" + userId, { method: "GET" });
    const data = await response.json();

    document.querySelector("#profile-info-fullname").textContent = `${data.data.name} ${data.data.surname}`;
    document.querySelector("#profile-info-login").textContent = data.data.login;

    const response2 = await fetch(url + "/users/subscriptionsInfo/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arrayOfIds: data.data.subscriptionUserIds }),
    });
    const data2 = await response2.json();

    const subsBlock = document.querySelector("#profile-subscriptions-subblock");
    const subTemplate = document.querySelector("#subscription-template");

    for (const sub of data2.data) {
        const clone = subTemplate.content.cloneNode(true);

        clone.querySelector(".subscription-login").textContent = sub.login;

        subsBlock.appendChild(clone);
    }
}

async function createPost(event) {
    const postsBlock = document.querySelector("#profile-posts-cards-block");
    const postTemplate = document.querySelector("#post-template");

    const clone = postTemplate.content.cloneNode(true);

    clone.querySelector(".card-title").setAttribute("contenteditable", true);
    clone.querySelector(".card-title").classList.add("text-outline");
    clone.querySelector(".card-title").textContent = "Title";
    clone.querySelector(".card-body").setAttribute("contenteditable", true);
    clone.querySelector(".card-body").classList.add("text-outline");
    clone.querySelector(".card-body").textContent = "Body";
    clone.querySelector(".card-tags-input-subblock").style.display = "flex";
    clone.querySelector(".card-likes-subblock").style.display = "none";

    clone.querySelector(".card-change-btn").textContent = "Save";
    clone.querySelector(".card-delete-btn").textContent = "Cancel";

    clone.querySelector(".card-delete-btn").addEventListener("click", (event) => {
        event.composedPath()[2].remove();
    });
    clone.querySelector(".card-change-btn").addEventListener("click", async (event) => {
        const userId = localStorage.getItem("currentUserId");
        const card = event.composedPath()[2];

        const payload = {
            title: card.querySelector(".card-title").textContent,
            description: card.querySelector(".card-description").textContent,
            body: card.querySelector(".card-body").textContent,
            tags: card.querySelector(".card-tags").textContent.split(" "),
            authorId: userId,
        };

        const response = await fetch(url + "/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (data.message === "Success") {
            card.remove();
            document.querySelector("#profile-posts-cards-block").innerHTML = "";
            loadPosts();
        }
    });

    postsBlock.prepend(clone);
}

async function getNumberOfPosts() {
    const response = await fetch(url + "/posts/count", { method: "GET" });
    const data = await response.json();

    if (data.message === "Success") localStorage.setItem("postsLimit", data.data);
}

getNumberOfPosts();
loadUserInfo();
window.addEventListener("scroll", handleInfiniteScroll);
loadPosts(postsOnPage - 10);
