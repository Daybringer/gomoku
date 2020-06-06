#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build
git add .
read -p "Commit message:" commitMessage
git commit -m "$commitMessage"
git push origin master

# navigate into the build output directory
cd server

git add .
git commit -m "$commitMessage"
git push origin master

cd -