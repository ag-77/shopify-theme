# Code Base Theme - Documentation
Use Gulp and Themekit to edit your online shop files. Gulp will concat all scss from dev/scss/theme.scss to build/assets/code-theme.scss and concat all js from dev/js/top and dev/js/bottom to build/assets/code-theme_top.js and build/assets/code-theme_bottom.js, including minified versions. ES6 can be used.

## Requirements
1. [Node.js](https://nodejs.org/en/download/)
2. [ThemeKit](https://shopify.github.io/themekit/)

## Work on an existing project

1. Clone the repo from bitbucket to your computer
2. Create config.yml from config.yml.sample
3. Open Terminal and enter your project directory
4. ```npm install```
5. ```npm start```

## Start a new project from code-base-theme (removing all commit history)

1. Create new repo for your project on bitbucket
2. Clone it to your computer into a new project directory
3. Clone/pull code-base-theme to your computer
4. Copy all contents (including all hidden files but NOT the hidden .git folder) from code-base-theme to your project directory
5. Open Terminal and enter your project directory
6. ```npm install``` to install all node modules
7. ```npm run zip``` to run the build script and create a zip with the theme files for uploading the theme to Shopify
8. Create new theme on Shopify
9. Upload the zip from your project directory
10. Remove the zip from your project directory!
11. Create config.yml from config.yml.sample to configure your environments. Keep both up to date!
12. ```npm run init``` to remove this readme.md and the CBT changelog and do a build
13. ```npm start``` to start developing!

## Node commands
```npm install```

Installs all node modules
___
```npm run zip```

Zip the theme into the root for uploading to a new Shopify Theme
___
```npm start``` or ```npm run start```

Opens the development site, using local gulp
___
```gulp```

Opens the development site, using global gulp, not recommended
___
```npm run start:nl```

Opens the nl site, using local gulp. You can create more scripts in package.json if needed.
___
```npm run openenvs```

Opens all environments from config.yml
___
```npm run openadmins```

Opens all environments admin sites from config.yml
___
```rm -rf node_modules/```

Removes folder node_modules


## Themekit commands

For deploying/downloading/removing files or themes, check the [ThemeKit documentation](https://shopify.github.io/themekit/commands/)
