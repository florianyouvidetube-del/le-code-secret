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
    // --- Header Scroll Effect (Robust) ---
    const header = document.querySelector('header');

    function updateHeader() {
        // Use a threshold to snap state
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Use passive listener for performance
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial check

    // --- Sticky Article Title Logic ---
    const stickyTitle = document.getElementById('sticky-title');
    const mainTitle = document.querySelector('.post-header h1');

    if (stickyTitle && mainTitle) {
        // Show sticky title when main title scrolls out of view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting && window.pageYOffset > 100) {
                    // Main title is gone and we scrolled down -> Show Sticky
                    stickyTitle.classList.add('visible');
                } else {
                    // Main title is back or we are at top -> Hide Sticky
                    stickyTitle.classList.remove('visible');
                }
            });
        }, {
            rootMargin: "-100px 0px 0px 0px" // Trigger when title hits top area
        });

        observer.observe(mainTitle);
    }
});
