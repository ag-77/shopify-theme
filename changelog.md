# Important Release Notes

## 2.10.1
Updated all gulp dependencies
Changed gulp js watcher logic
Changed js-behaviour of collapsible

## 2.10.0
Many many lighthouse/speed related fixes.
All pages pass lighthouse on Accessibility, Best Practices and SEO with a score of 100: https://codeinternetapplications.atlassian.net/browse/CSBT-355.
All classes follow BEM guidelines: .block-name__element-name--modifier-name as per http://getbem.com/naming.
Min width of site__main is now 360 as 320px devices drop below 3% https://gs.statcounter.com/screen-resolution-stats/mobile/europe
CBT Documentation will be in Confluence: https://codeinternetapplications.atlassian.net/wiki/spaces/CBT/

## 2.9.0
Replaced hardcoded urls's with the routes object
Themekit_ignores fix

## 2.8.0
- Use Shopify Predictive search
- Show Shopify Product Recommendations on PDP: https://shopify.dev/tutorials/develop-theme-recommended-products
- Product specs now support html tags from the metafields

## 2.7.0
Themekit "ignore_files" in config.yml.sample has changed to "ignores: - themekit_ignores". This points to the file "themekit_ignores" so all environments can use this same file to ignore files from uploading. One file to rule them all! By default the development environment still uses the "ignore_files" list, as it may be different from the other environments.

In the language files, products.product has been split up in different sections for "pricing", "badges" and "product" (general) to prevent the same key being used for pricing, badges and general translations.

## 2.6.0
All assets/code-theme- .js and .css are now ignored in the repository. This should save a lot of merge conflicts. This also means you CAN NOT deploy a theme directly after cloning it. You first have to do a build by running: $ npm run build. This will create all the js and css files in the assets folder.
Current npm scripts:
$ npm run init        - cleanup and build, when starting a new project
$ npm run build       - build all js and css to build/assets/
$ npm run buildjs     - build js only
$ npm run buildcss    - build css only
$ npm run cleanup     - remove the Code Base Theme related changelog.md and readme.md.
$ npm run deploy      - build and deploy to all environments from config.yml
$ npm run start       - start working on development, same as $ npm start
$ npm run start:stage - start working on stage environment
$ npm run openenvs    - open all environments from config.yml
$ npm run openadmins  - open all admins from config.yml (only usefull if you have logged in before)
$ npm run zip         - create a zip with the theme files for uploading to Shopify as a new theme

## 2.5.0 Valid html
All pages validate on https://validator.w3.org/, keep it that way!

## 2.4.8 Cart stock notice
When incrementing the quantity of a product in the cart, you will get a notice when you add more products then available.
The notice is triggered by adding the product instead of updating the quantity

## 2.4.5 Reload delay
Added a reloadDelay:300 to browsersync to prevent reloading to soon

## 2.4.0 SEO Breadcrumbs
The global-breadcrumbs snippet now creates an array of items from the main navigation and loops the array to create a nice breadcrumb list with SEO Microdata. It will always try to find the current page in the main navigation, if that fails it will use the flat Shopify-logic. Test your generated breadcrumbs here: https://search.google.com/structured-data/testing-tool.

## 2.3.0 Gulp environment menu
When typing 'npm start', a menu will show with all environments from config.yml for you to pick one from. When there is only one environment, it will just open it. When an environment is passed in the command like 'npm run start:stage', the menu will not show. Don't want to see the menu when developing? Use 'npm run start:dev', it's already in the package.json.

## 2.2.9 Form validation
Added "required" by default to forms as a simple fix to prevent double error-messages when there is > 1 form on a page. Html5 form check will prevent submitting the form with errors.

## 2.2.8 Parse SCSS local
All fonts pickers are now removed from settings, so there are no settings in the scss anymore. This allows us to parse the scss from gulp (latest sass version!) and not use the Shopify version 3.2.6. (22 February 2013) anymore. So all new sass features from the last 6 years are now at your fingertips! This of course also goes for code splitting. Check html-head-css.liquid how to create template specific css files.

## 2.2.6 Browsersync fix
Browsersync fix - browsersync would conflict with the way Shopify now changes the body tag, resulting in loads of half javascript being rendered in the body when developing.
