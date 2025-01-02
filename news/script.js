document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");

    fetch("news.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(newsItem => {
                const newsBox = document.createElement("div");
                newsBox.className = "news-box";

                newsBox.innerHTML = `
                    <img src="${newsItem.image}" alt="News image">
                    <h2>${newsItem.headline}</h2>
                    <p>${newsItem.date}</p>
                `;

                newsBox.addEventListener("click", () => {
                    showNewsDetail(newsItem);
                });

                newsContainer.appendChild(newsBox);
            });
        });
});

function showNewsDetail(newsItem) {
    const newsContainer = document.getElementById("news-container");
    newsContainer.innerHTML = `
        <div class="news-detail">
            <img src="${newsItem.image}" alt="News image">
            <h1>${newsItem.headline}</h1>
            <p>${newsItem.date}</p>
            <p>${newsItem.text}</p>
            <button onclick="window.location.reload()">Back to Headlines</button>
        </div>
    `;
}
