document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    let posts = [];

    // Fetch the search index
    fetch('search.json')
        .then(response => response.json())
        .then(data => {
            posts = data;
        })
        .catch(error => console.error('Error fetching search index:', error));

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        searchResults.innerHTML = '';

        if (query.length < 2) return;

        const filteredPosts = posts.filter(post => {
            return post.title.toLowerCase().includes(query) ||
                post.summary.toLowerCase().includes(query);
        });

        filteredPosts.forEach(post => {
            const li = document.createElement('li');
            li.classList.add('search-result-item');
            li.innerHTML = `<a href="${post.url}">${post.title}</a><br><small>${post.summary}</small>`;
            searchResults.appendChild(li);
        });
    });
    // Scroll Effect for Header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
