function generateRandomId() {
  return Math.floor(Math.random() * 1000000000);
}

class BlogPost {
  constructor(title, body, imgSrc, postedAt) {
    if (!title || !body || !imgSrc) {
      throw new Error("Title and body are required");
    }
    this.id = generateRandomId();
    this.title = title;
    this.body = body;
    this.imgSrc = imgSrc;
    this.postedAt = postedAt || new Date();
  }
  toString() {
    return `${this.title} - ${this.body}`;
  }
}

function getPosts() {
  const postsJson = localStorage.getItem("posts");
  if (postsJson) {
    const postsArr = JSON.parse(postsJson);
    postsArr.map((post) => {
      return new BlogPost(post.title, post.body, post.imgSrc, post.postedAt);
    });
    return postsArr;
  } else {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function addPost(post) {
  const posts = getPosts();
  posts.push(post);
  savePosts(posts);
}

function deletePost(id) {
  const posts = getPosts();
  const filteredPosts = posts.filter((post) => post.id !== id);
  savePosts(filteredPosts);
  loadAndViewPosts();
}

function getPost(id) {
  const posts = getPosts();
  return posts.find((post) => post.id === id);
}

function loadAndViewPosts() {
  const posts = getPosts();
  const postsContainer = document.querySelector(".articles");
  postsContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = document.createElement("article");
    postElement.classList.add("article-card");
    const date = new Date(post.postedAt);
    postElement.innerHTML = `
            <h3 class="article-title">${post.title}</h3>
            <img
                src="${post.imgSrc}"
                alt="Article Image"
                class="article-image"
            />
            <p class="article-body">${post.body.substr(0, 40) + "..."}</p>
            <p class="article-date">Posted on ${date.toDateString()}</p>
            <a class="read-article" href="article.html?id=${
              post.id
            }">Read Article</a>
            <button class="delete" onclick="deletePost(${
              post.id
            })">Delete</button>
        `;
    // postElement.querySelector(".delete").addEventListener("click", () => {
    //   deletePost(post.id);
    //   loadAndViewPosts();
    // });
    postsContainer.appendChild(postElement);
  });
}

window.onload = () => {
  console.log(window.location.pathname);
  if (window.location.pathname === "/index.html") loadAndViewPosts();
  if (window.location.pathname === "/new.html") {
    document
      .getElementById("new-article-form")
      .addEventListener("submit", onSubmit);
  }
};

function onSubmit(event) {
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const image = document.querySelector("#image").value;
  const body = document.querySelector("#body").value;

  const post = new BlogPost(title, body, image);
  console.log("post", post);
  addPost(post);

  window.location.href = "index.html";
}
