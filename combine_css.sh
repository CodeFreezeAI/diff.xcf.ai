#!/bin/bash

# Create output directory if it doesn't exist
mkdir -p css/combined

# Combine all CSS files
cat css/*.css > css/combined/all.css

# Remove comments and minify
sed -i '' 's/\/\*.*\*\///g' css/combined/all.css
sed -i '' 's/[[:space:]]\+/ /g' css/combined/all.css
sed -i '' 's/}[[:space:]]*{/}{/g' css/combined/all.css

echo "CSS files combined and minified in css/combined/all.css" 