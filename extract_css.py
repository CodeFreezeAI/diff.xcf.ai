import os
import re
from bs4 import BeautifulSoup
import requests
from urllib.parse import urljoin

def extract_css_from_html(html_file):
    # Read the HTML file
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Parse HTML
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Get all CSS links
    css_links = soup.find_all('link', rel='stylesheet')
    
    # Extract inline styles
    inline_styles = soup.find_all('style')
    
    # Combine all CSS
    all_css = []
    
    # Process external CSS files
    for link in css_links:
        href = link.get('href')
        if href:
            # Handle relative paths
            if href.startswith('http'):
                css_url = href
            else:
                css_url = urljoin(os.path.dirname(html_file), href)
            
            try:
                response = requests.get(css_url)
                if response.status_code == 200:
                    all_css.append(response.text)
            except Exception as e:
                print(f"Error fetching {css_url}: {e}")
    
    # Process inline styles
    for style in inline_styles:
        if style.string:
            all_css.append(style.string)
    
    # Combine all CSS
    combined_css = '\n'.join(all_css)
    
    # Remove comments
    combined_css = re.sub(r'/\*.*?\*/', '', combined_css, flags=re.DOTALL)
    
    # Remove empty lines and whitespace
    combined_css = re.sub(r'\s+', ' ', combined_css)
    combined_css = re.sub(r'}\s*{', '}{', combined_css)
    
    return combined_css

def main():
    html_file = 'index.html'
    output_file = 'combined.css'
    
    try:
        css = extract_css_from_html(html_file)
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(css)
        print(f"CSS extracted and saved to {output_file}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    main() 