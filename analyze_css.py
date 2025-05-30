import os
import re
from bs4 import BeautifulSoup
import shutil

def get_used_classes(html_file):
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    used_classes = set()
    
    # Get all elements with class attributes
    for element in soup.find_all(class_=True):
        classes = element['class']
        if isinstance(classes, list):
            used_classes.update(classes)
        else:
            used_classes.add(classes)
    
    return used_classes

def analyze_css_file(css_file, used_classes):
    with open(css_file, 'r', encoding='utf-8') as f:
        css_content = f.read()
    
    # Find all CSS class selectors
    class_selectors = set()
    for match in re.finditer(r'\.([a-zA-Z0-9_-]+)', css_content):
        class_selectors.add(match.group(1))
    
    # Find unused classes
    unused_classes = class_selectors - used_classes
    
    # Check if the file is mostly unused
    usage_ratio = len(used_classes.intersection(class_selectors)) / len(class_selectors) if class_selectors else 0
    
    return usage_ratio, unused_classes

def main():
    html_file = 'index.html'
    css_dir = 'css'
    trash_dir = 'css/ready_for_trash'
    
    # Get all used classes from HTML
    used_classes = get_used_classes(html_file)
    print(f"Found {len(used_classes)} used classes in HTML")
    
    # Analyze each CSS file
    for filename in os.listdir(css_dir):
        if filename.endswith('.css') and filename != 'all.css':
            css_file = os.path.join(css_dir, filename)
            usage_ratio, unused_classes = analyze_css_file(css_file, used_classes)
            
            print(f"\nAnalyzing {filename}:")
            print(f"Usage ratio: {usage_ratio:.2%}")
            print(f"Unused classes: {len(unused_classes)}")
            
            # If usage is below 20%, move to trash
            if usage_ratio < 0.2:
                print(f"Moving {filename} to trash (low usage)")
                shutil.move(css_file, os.path.join(trash_dir, filename))
            else:
                print(f"Keeping {filename} (sufficient usage)")

if __name__ == '__main__':
    main() 