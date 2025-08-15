const frontPage = document.getElementById("front-page");
const newsDetails = document.getElementById("news-details");

let articleData = [];

// Function to display the news grid
function renderFrontPage(news) {
    frontPage.innerHTML = "";
    newsDetails.style.display = "none";
    frontPage.style.display = "grid";

    news.forEach((article, index) => {
        const articleCard = document.createElement("div");

        let author = nullAuthor(article.source.name); // GNews doesn't always have author
        let image = nullImage(article.image);

        articleCard.classList.add("grid-card");
        articleCard.dataset.articleId = index;

        articleCard.innerHTML = `
        <img src="${image}" alt="${article.title}">
        <h3>${article.title}</h3>
        <p><b>Author:</b> <i>${author}</i></p>
        <p><b>Published Date:</b> ${new Date(article.publishedAt).toLocaleString()}</p>
        <p><b>Source:</b> ${article.source.name}</p>
        `;

        frontPage.appendChild(articleCard);
    });
}

function nullAuthor(author) {
    if (!author || author.trim() === "") {
        return "Anonymous";
    }
    return author;
}

function nullImage(image) {
    if (!image || image.trim() === "") {
        return "https://cdn.pixabay.com/photo/2022/11/01/11/27/breaking-news-7562017_1280.jpg";
    }
    return image;
}

function renderNewsDetails(article) {
    frontPage.style.display = "none";
    newsDetails.style.display = "grid";

    let author = nullAuthor(article.source.name);
    let image = nullImage(article.image);

    newsDetails.innerHTML = `
    <button class="back-btn">← Back To HomePage</button>
    <img src="${image}" alt="${article.title}">
    <h3>${article.title}</h3>
    <p><b>Author:</b> <i>${author}</i></p>
    <p><b>Published Date:</b> ${new Date(article.publishedAt).toLocaleString()}</p>
    <p>${article.description}</p>

    <button class="story-btn">Read Full Story</button>
    `;

    // Back button
    document.querySelector(".back-btn").addEventListener("click", () => {
        renderFrontPage(articleData);
    });

    // Read full story
    document.querySelector(".story-btn").addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Fetch news from GNews API
document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "f82feffe5d394c58812e89d27f99ca82"; // Replace with your actual GNews API key
    const apiUrl = `https://gnews.io/api/v4/top-headlines?country=us&token=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                articleData = data.articles;
                renderFrontPage(articleData);
            } else {
                frontPage.innerHTML = `<p>No news articles found.</p>`;
            }
        })
        .catch(error => {
            console.error(`Error fetching news: ${error}`);
            frontPage.innerHTML = `<p>Error: Could not load news data.</p>`;
        });
});

// Click event for opening details
frontPage.addEventListener("click", (event) => {
    const frontPageCard = event.target.closest(".grid-card");
    if (frontPageCard) {
        const newsId = frontPageCard.dataset.articleId;
        const selectedNews = articleData[parseInt(newsId)];

        if (selectedNews) {
            renderNewsDetails(selectedNews);
        }
    }
});
