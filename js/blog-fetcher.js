document.addEventListener('DOMContentLoaded', function() {
    const blogContainer = document.getElementById('blog-container');
    if (!blogContainer) return;

    // Show loading state
    blogContainer.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">Fetching latest wellness insights...</p>
        </div>
    `;

    // Global callback for JSONP
    window.handleBlogData = function(data) {
        const entries = data.feed.entry;
        if (!entries || entries.length === 0) {
            blogContainer.innerHTML = '<div class="col-12 text-center"><p>No blog posts found.</p></div>';
            return;
        }

        let html = '';
        // Display only the first 3 posts
        for (let i = 0; i < Math.min(entries.length, 3); i++) {
            const entry = entries[i];
            const title = entry.title.$t;
            const link = entry.link.find(l => l.rel === 'alternate').href;
            
            // Content snippet
            let content = entry.content ? entry.content.$t : (entry.summary ? entry.summary.$t : '');
            // Basic HTML tag stripping
            let snippet = content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120) + '...';
            
            // Image handling
            let imageUrl = 'img/blog-default.jpg'; 
            if (entry.media$thumbnail) {
                imageUrl = entry.media$thumbnail.url.replace('/s72-c/', '/s640/').replace('/s72-count/', '/s640/').replace('/s72-w319-h379-c/', '/s640/');
            }

            const authorName = entry.author && entry.author[0] ? entry.author[0].name.$t : 'Dwight Prentice';
            const authorImg = 'img/user.jpg'; 

            html += `
                <div class="col-xl-4 col-lg-6">
                    <div class="bg-light rounded overflow-hidden">
                        <div class="blog-img-wrapper" style="height: 250px; overflow: hidden;">
                            <img class="img-fluid w-100 h-100" src="${imageUrl}" style="object-fit: cover;" alt="${title}">
                        </div>
                        <div class="p-4">
                            <a class="h3 d-block mb-3 text-decoration-none" href="${link}" target="_blank">${title}</a>
                            <p class="m-0 text-muted">${snippet}</p>
                        </div>
                        <div class="d-flex justify-content-between border-top p-4">
                            <div class="d-flex align-items-center">
                                <img class="rounded-circle me-2" src="${authorImg}" width="25" height="25" alt="${authorName}">
                                <small>${authorName}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <a href="${link}" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill px-3">Read More</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
        blogContainer.innerHTML = html;
        
        // Clean up script tag
        const script = document.getElementById('blogger-jsonp');
        if (script) script.remove();
    };

    // Create JSONP script
    const script = document.createElement('script');
    script.id = 'blogger-jsonp';
    script.src = 'https://softlifemindset.blogspot.com/feeds/posts/default?alt=json-in-script&callback=handleBlogData';
    script.onerror = function() {
        blogContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="text-danger">Failed to load blog posts. Please <a href="https://softlifemindset.blogspot.com/" target="_blank">visit our blog directly</a>.</p>
            </div>
        `;
    };
    document.body.appendChild(script);
});

