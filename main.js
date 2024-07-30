const apiKey = '548ec6a83add43f4b8d10c5ecc31df26';
let currentPage = 1;
let currentCategory = 'all';

async function fetchNewsByCategory(category, page = 1) {
    try {
        const apiUrl = category === 'all' ? 
            `https://newsapi.org/v2/top-headlines?country=kr&page=${page}&pageSize=8&apikey=${apiKey}` :
            `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&page=${page}&pageSize=8&apikey=${apiKey}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.articles;
    } catch (error) {
        console.error('Error fetching news by category', error);
        return [];
    }
}

function truncateText(text, maxLength = 60) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

function displayBlogs(articles) {
    const blogParent = document.querySelector('.news-content');
    blogParent.innerHTML = '';

    articles.forEach((article) => {
        const blogCard = document.createElement('div');
        blogCard.classList.add('news-content-div');
        blogCard.addEventListener('click', () => {
            window.open(article.url, '_blank');
        });

        const img = document.createElement('img');
        img.src = article.urlToImage || 'path/to/default-image.jpg';
        img.alt = article.title || 'No title available';
        img.classList.add('news-content-img');

        const textContainer = document.createElement('div');
        textContainer.classList.add('news-content-div-write');

        const title = document.createElement('h2');
        title.textContent = article.title || 'No title available';

        const description = document.createElement('p');
        description.textContent = truncateText(article.description || 'No description available');

        textContainer.appendChild(title);
        textContainer.appendChild(description);

        blogCard.appendChild(img);
        blogCard.appendChild(textContainer);

        blogParent.appendChild(blogCard);
    });
}

async function loadNews() {
    const articles = await fetchNewsByCategory(currentCategory, currentPage);
    displayBlogs(articles);
}

function setupCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.nav-ul a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            currentCategory = link.getAttribute('data-category');
            currentPage = 1; // Reset to first page when category changes
            await loadNews();
        });
    });
}

function showPage(page) {
    currentPage = page;
    loadNews();
}

document.addEventListener('DOMContentLoaded', () => {
    setupCategoryLinks();
    loadNews(); // Load initial news
});