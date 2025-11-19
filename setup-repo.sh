#!/bin/bash

# Repository Setup Script
# Replace YOUR_USERNAME with your actual GitHub username

echo "🚀 Setting up your new repository..."
echo ""

# You'll need to replace this URL with your actual repository URL
REPO_URL="https://github.com/YOUR_USERNAME/maintenance-incident-management.git"

echo "📋 Commands to run after creating your GitHub repository:"
echo ""
echo "1. Add your repository as remote origin:"
echo "   git remote add origin $REPO_URL"
echo ""
echo "2. Push your code to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Your repository will then be live at:"
echo "   https://github.com/YOUR_USERNAME/maintenance-incident-management"
echo ""
echo "✨ Ready for Railway deployment!"

# After you replace YOUR_USERNAME above, uncomment these lines:
# git remote add origin $REPO_URL
# git branch -M main
# git push -u origin main