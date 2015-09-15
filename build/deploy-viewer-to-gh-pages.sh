#!/bin/bash
set -ev

# setup ssh key
echo -e "Host github.com\n\tStrictHostKeyChecking no\nIdentityFile ~/.ssh/deploy.key\n" >> ~/.ssh/config
echo -e "$GITHUB_DEPLOY_KEY" | base64 -d > ~/.ssh/deploy.key
chmod 600 ~/.ssh/deploy.key

cd ../

# fetch and build vivliostyle-js-viewer
gem install compass
git clone --depth=1 --branch=master git@github.com:vivliostyle/vivliostyle-js-viewer.git vivliostyle-js-viewer
cd vivliostyle-js-viewer
npm run setup-local-vivliostyle ../vivliostyle.js
npm install
npm run build
npm run test-sauce

# make distribution package
version=$(grep '^ *"version":' node_modules/vivliostyle/package.json | sed -e 's/^.*"\([^"]*\)",$/\1/')
scripts/make-dist-package.sh ${version}

cd ../

# fetch gh-pages branch
git clone --depth=1 --branch=gh-pages git@github.com:vivliostyle/vivliostyle.js.git gh-pages
cd gh-pages

# git configuration
git config user.email "kwkbtr@vivliostyle.com"
git config user.name "kwkbtr (Travis CI)"

# update gh-pages branch
cp -R ../vivliostyle-js-viewer/build/* viewer/

zip="../vivliostyle-js-viewer/vivliostyle-js-viewer-latest.zip"
if [ -e ${zip} ]; then
    mv ${zip} downloads/
fi

git add .
git status
git commit -m "Update vivliostyle.js (original commit: $TRAVIS_COMMIT)"
git push origin gh-pages