# Javascripts in Code Base Theme

The folder "code" contains all js-plugins made by Code. All external downloaded javascripts like sliders etc. are to be put in the folder "ext". All files required in the "theme-" files will be concatenated when parsed.

All "theme-" scripts are parsed to "code-theme-" in the folder build/assets. A minified version is also parsed to the same folder with a .min.js extension. The file "code-theme-global.js" is loaded in the html head and is render blocking so keep it as small as possible. The file "code-theme-global-defer.js" is also loaded in the html head, but deferred to prevent render blocking.

A file that starts with "theme-template" is also parsed to the folder build/assets but is only loaded in the template it is named after, otherwise it will be preloaded. For example "theme-template-addresses.js" is only loaded in the "addresses" template. You can make more template specific files as long as the name equals the template name, but you will have to manually add them to template_js_arr in html-head-js/liquid.
