/****************************************************************
 * CODE Filters
 ****************************************************************/

var storageUrlId = 'CodeFilterBackUrl';

!(function ($, document, window, undefined) {

    /**
     * Plugin name
     *
     * @var string
     */
    var _pluginName = 'collectionFiltering';

    /**
     * Constructor collectionFiltering_plugin
     *
     * @param $element Element Wrapping container div
     * @param options Options passed to public functions
     * @return collectionFiltering_plugin
     */
    var collectionFiltering_plugin = function ($element, options) {

        // Scope it
        var self = this;
        self.$element = $element;
        self.storagePanesId = false;
        self.storageUrlId = false;

        // Create local storage ID's
        if ($.code.localStorage) {
            self.storagePanesId = 'CodeFilterPanesState';
            self.storageUrlId = storageUrlId;
        }

        // Init
        self.init();
    };

    /**
     * init
     *
     * @access public
     * @return void
     */
    collectionFiltering_plugin.prototype.init = function () {

        var self = this;

        // Create ajax url from current url
        var path = window.location.pathname;
        path = path.substr(path.indexOf('collections'));
        var ajaxFilterUrl = "/" + path + '?view=filters-ajax';

        if ($.code.debug) {
            console.log('Filter init:', window.location.protocol + "//" + window.location.host + ajaxFilterUrl);
        }

        // Find the filter wrapper
        self.$filterWrapper = $('#filters [data-filter-wrapper]');

        // Get filter data from ajax
        $.get(ajaxFilterUrl).done(function (dataReceived) {

            // Remove comments
            dataReceived = dataReceived.replace(/<!--[\s\S]*?-->/g, "");

            // Render filters
            self.render(dataReceived);
        });

        // Catch change of radio inputs
        self.$element.on('change', 'input[type="checkbox"]', function () {

            // uncheck all others in this list
            $(this).closest('[data-key-filter]').find('input[type="checkbox"]').not(this).prop('checked', false);

            // Update url url parameters.
            self.updateUrl();
        });

        // catch click on 'remove a filter'.
        self.$element.on('click', '[data-remove-tag]', function (event) {
            event.preventDefault();

            // uncheck the checkbox
            var removeTagValue = $(this).data('remove-tag');
            self.$element.find('.filter-pane input[type="checkbox"][value="'+ removeTagValue +'"]').prop('checked', false);

            // update url
            self.updateUrl();
        });

        // catch click on 'clear all'
        self.$element.on('click', '[data-filter-clear_all]', function (event) {
            event.preventDefault();

            // uncheck all radio's
            self.$element.find('.filter-pane input[type="checkbox"]').prop('checked', false);

            // update url to nothing
            self.updateUrl();
        });

        // If localstorage
        if ($.code.localStorage) {

            // Catch click on open/close filter panes
            self.$element.on('click', '[data-collapsible-trigger], [data-collapsible-trigger-icon]', function () {

                // get current state
                self.filterState = {};

                self.$element.find('[data-filter]').each(function (i, el) {
                    var name = $(el).data('filter');
                    self.filterState[name] = $(el).hasClass('collapsible--is-open');
                });

                self.$element.find('[data-filter-list]').each(function (i, el) {
                    var name = $(el).data('filter-list');
                    self.filterState[name] = $(el).hasClass('collapsible--is-open');
                });

                // Store state in localstorage
                localStorage.setItem(self.storagePanesId, JSON.stringify(self.filterState));
            });
        }
    };

    /**
     * Render filters
     *
     * @access public
     * @return void
     */
    collectionFiltering_plugin.prototype.render = function (html) {
        var self = this;

        if ($.code.debug) {
            console.log('Filter data received:', $(html));
        }

        if (!$(html).children().length) {
          return;
        }

        var $filterHtml = $(html).children();

        // get options from html
        self.options = $filterHtml.data('filter-options');

        // Remove existing filters
        self.$filterWrapper.find('.filter-ajax').remove();

        // Add filters html to pane
        self.$filterWrapper.append($filterHtml);

        // set state of collapsible panes from local storage
        self.setTabState();

        // Show the element
        self.$element.find('.filter-load-wrapper:first').removeClass('filter-load-wrapper');
    };

    /**
     * Get state of Tabs
     *
     * @access public
     * @return void
     */
    collectionFiltering_plugin.prototype.setTabState = function () {
        var self = this;

        // Get tabs state from localstorage
        var backLinkData = localStorage.getItem(self.storagePanesId);
        if ($.code.localStorage && backLinkData) {
            self.filterState = JSON.parse(backLinkData);

            // Apply state to tabs
            $.each(self.filterState, function (name, isOpen) {
                var $pane = self.$element.find('[data-filter="' + name + '"]');
                if (name.indexOf('-list') > -1) {
                    $pane = self.$element.find('[data-filter-list="' + name + '"]');
                }

                if (isOpen) {

                    // Open the tab
                    $pane.addClass('collapsible--is-open');
                } else {

                    // Unless checked checkboxes
                    if ($pane.find('input:checked').length > 0) {
                        $pane.addClass('collapsible--is-open');

                    } else {
                        // Close the tab
                        $pane.removeClass('collapsible--is-open');
                    }
                }
            });
        }
    };

    /**
     * Update URL
     * Update the url with a given query.
     *
     * @access public
     * @return void
     */
    collectionFiltering_plugin.prototype.updateUrl = function () {
        var self = this;

        // Loop over the checked radios to build url Query
        var urlQuery = [];

        // loop all checked inputs
        self.$element.find('.filter-pane input[type="checkbox"]:checked').each(function () {
            var value = $(this).val();
            if (urlQuery.indexOf(value) === -1) {
                urlQuery.push(value);
            }
        });

        urlQuery = urlQuery.join('+');

        // Create path from current url
        var path = window.location.pathname;
        path = path.substr(path.indexOf('collections'));
        var paths = path.split("/");

        var page = 1;
        var current_page = getParameterByName('page');
        if (current_page != page) {
            page = current_page;
        }

        var view = 'grid';
        var current_view = getParameterByName('view');
        if (current_view != view) {
            view = current_view;
        }

        var sort_by = 'grid';
        var current_sort_by = getParameterByName('sort_by');
        if (current_sort_by != sort_by) {
            sort_by = current_sort_by;
        }

        if ($.code.localStorage) {
            // Store Url in storage so the Product Detail Page Back link can use it
            localStorage.setItem(self.storageUrlId, JSON.stringify({
                url: urlQuery,
                collection: paths[1],
                page: page,
                view: view,
                sort_by: sort_by
            }));
        }

        // create new url
        var filterUrl = "/" + paths[0] + '/' + paths[1] + '/' + urlQuery;

        // add view and sort_by to url (ignore paging)
        filterUrl = self.addtoUrl(filterUrl, 'view', view);
        filterUrl = self.addtoUrl(filterUrl, 'sort_by', sort_by);

        if ($.code.debug) {
            console.log('Filter update Url:', window.location.protocol + "//" + window.location.host + filterUrl);
        }

        window.location.href = filterUrl;
    };

    /**
     * Add param to url
     *
     * @return {string} [url]
     */
    collectionFiltering_plugin.prototype.addtoUrl = function (url, param, val) {
        var q = '';
        if (val) {
            if (url.indexOf('?') < 0) {
                q = '?';
            } else {
                q = '&';
            }
            url += q + param + '=' + val;
        }
        return url;
    };

    /**
     * collectionFiltering plugin
     *
     * @return jQuery objects
     */
    $.fn.collectionFiltering = function (options) {

        // Put args in array
        var args = Array.prototype.slice.call(arguments, 1);

        // Initialize the items
        return this.each(function () {

            // Store the element the plugin is set on
            var $element = $(this);

            // Guard if plugin was already initted
            var instance = $element.data('plugin_' + _pluginName);

            // If plugin was not innited
            if (!instance) {

                // Init plugin on element and set guard data on element
                $element.data('plugin_' + _pluginName, new collectionFiltering_plugin($element, options));
            } else {

                // If instance already created call method from plugin
                if (typeof options === 'string') {
                    instance[options].apply(instance, args);
                }
            }
        });
    };

})(jQuery, document, window);

$(document).ready(function () {

    // Init filters
    $('#filters').collectionFiltering();

    // Get filter url data
    var backLinkData = localStorage.getItem(storageUrlId);
    if (backLinkData) {
        backLinkData = JSON.parse(backLinkData);

        // Find backlink on product detail page
        var $backLink = $('[data-filter="backlink"]');

        // if we are on product detail page
        if ($backLink.length) {
            var backUrl = $backLink.attr('href');
            var backUrlCollection = backUrl.replace('/collections/', '');

            // If backlink goes to the collection we filtered last time, apply the filtering and paging to the url
            if (backUrlCollection == backLinkData.collection) {

                var pager = '';
                if (backLinkData.page > 1) {
                    pager = '?page=' + backLinkData.page;
                }

                // change url of product backlink to include the filter parameters
                $backLink.attr('href', '/' + backLinkData.url + pager);
            }
        }
    }

    // if we are on a collection page
    if ($('#filters').length) {

        var current_page = getParameterByName('page') || 1;

        // if data exists
        if (backLinkData) {

            // get page from data
            var page = parseInt(backLinkData.page);

            // if we changed page
            if (current_page != page) {

                // Store Url in storage so the Product Detail Page Back link can use it
                localStorage.setItem(storageUrlId, JSON.stringify({
                    url: backLinkData.url,
                    collection: backLinkData.collection,
                    page: current_page
                }));
            }
        } else {

            var path = window.location.pathname;
            path = path.substr(path.indexOf('collections'));
            var paths = path.split("/");

            var page_current = getParameterByName('page');
            var collection = paths[1];

            // Store Url in storage so the Product Detail Page Back link can use it
            localStorage.setItem(storageUrlId, JSON.stringify({
                url: path,
                collection: collection,
                page: page_current
            }));
        }
    }
}).on('shopify:section:load', function (e) {

    var $parentSection = $('#shopify-section-' + e.detail.sectionId);

    // Filter: init
    if ($parentSection.hasClass('filter-section')) {
        $('#filters').collectionFiltering('init');
    }
});
