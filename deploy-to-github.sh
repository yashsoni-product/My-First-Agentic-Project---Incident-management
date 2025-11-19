#!/bin/bash

# Replace YOUR_USERNAME and REPO_NAME with your actual GitHub username and repository name
# Example: https://github.com/yashs/maintenance-incident-management.git

echo "Add your new repository remote:"
echo "git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo ""
echo "Push to your new repository:"
echo "git branch -M main"
echo "git push -u origin main"
echo ""
echo "After pushing, your repository will be ready for Railway deployment!"

# Uncomment and modify these lines with your actual repository URL:
# git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
# git branch -M main  
# git push -u origin main