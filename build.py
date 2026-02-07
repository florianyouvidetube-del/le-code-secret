import os
import markdown
from jinja2 import Environment, FileSystemLoader
from datetime import datetime
import shutil

# Configuration
CONTENT_DIR = 'content'
OUTPUT_DIR = 'docs'
TEMPLATE_DIR = 'templates'
STATIC_DIR = 'static'
SITE_URL = 'https://floriandesavigny.github.io/ghost-lunar' # Update with actual URL later

def build_site():
    # Setup Jinja2 environment
    env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
    article_template = env.get_template('article.html')
    index_template = env.get_template('index.html')

    # Ensure output directory exists
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR)
    
    # Copy static files
    if os.path.exists(STATIC_DIR):
        shutil.copytree(STATIC_DIR, os.path.join(OUTPUT_DIR, 'static'))

    posts = []

    # Process markdown files
    for filename in os.listdir(CONTENT_DIR):
        if filename.endswith(".md"):
            filepath = os.path.join(CONTENT_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # Convert Markdown to HTML
            md = markdown.Markdown(extensions=['meta', 'fenced_code', 'codehilite'])
            html_content = md.convert(content)
            meta = md.Meta

            # Extract metadata
            title = meta.get('title', ['Untitled'])[0]
            date = meta.get('date', ['2025-01-01'])[0]
            slug = filename.replace('.md', '')
            summary = meta.get('summary', [''])[0]
            
            post_data = {
                'title': title,
                'date': date,
                'slug': slug,
                'content': html_content,
                'summary': summary,
                'url': f"{slug}.html"
            }
            posts.append(post_data)

            # Render article page
            output_html = article_template.render(post=post_data, site_title="Le Code Secret")
            with open(os.path.join(OUTPUT_DIR, f"{slug}.html"), 'w', encoding='utf-8') as f:
                f.write(output_html)

    # Sort posts by date (newest first)
    posts.sort(key=lambda x: x['date'], reverse=True)

    # Render index page
    index_html = index_template.render(posts=posts, site_title="Le Code Secret")
    with open(os.path.join(OUTPUT_DIR, "index.html"), 'w', encoding='utf-8') as f:
        f.write(index_html)

    print(f"Site built successfully! {len(posts)} articles generated.")

if __name__ == "__main__":
    build_site()
