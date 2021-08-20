/****************************************************************
* CODE collectionNav
****************************************************************/

!( function ( $, document, window, undefined ) {

    /**
    * Plugin name
    */
    var _pluginName = 'collectionNav';

    /**
    * @param $element Element Wrapping container div
    * @param options Options passed to public functions
    * @return collectionNav_plugin
    */
    var collectionNav_plugin = function ( $element, options ) {

        // scope it
        var self = this;
        self.$element = $element;

        self.storageId = 'CodeCollectionNav';

        // get current values
        self.sort_by = getParameterByName('sort_by');
        self.view = getParameterByName('view');
        self.page = parseInt(getParameterByName('page'));

        // collection sorter
        self.$element.find('[data-sort-collection]').each(function(){

            // set to current sorting
            var sortingData = $(this).data('sort-collection');
            if (sortingData.current != 'undefined') {
                $(this).find('[value="'+ sortingData.current +'"]').prop('selected', true);
            }
        });

        // init collection sorter
        self.$element.on('change', '[data-sort-collection]', function(event){

            // on change, reload with sorting parameter
            event.preventDefault();
            var sortingData = $(this).data('sort-collection');
            var newSorting = $(this).val();

            self.sort_by = '';

            // reset paging
            self.page = '';

            if ( newSorting != sortingData.default ) {
                self.sort_by = newSorting;
            }

            self.goToUrl();
        });

        // init collection grid/list view
        self.$element.on('change', '[data-collection-view]', function(event){

            // on change, reload page with viewing parameter
            event.preventDefault();
            var newView = $(this).val();

            self.view = newView;

            self.goToUrl();
        });

        // init collection paging
        self.$element.on('click', '[data-collection-nav-paging] a', function(event){
            event.preventDefault();

            // on change, reload page with page parameter
            var newPageUrl = $(this).attr('href');
            self.page = parseInt(getParameterByName('page', newPageUrl));

            self.goToUrl();
        });

        // THIS DOES NOT WORK WITH FILTERED COLLECTIONS
        if ($.code.localStorage) {

            // get stored collection objects from localstorage
            self.getCollectionsNav();

            // find links that point to this collection
            self.$element.find('[data-collection-nav-link]').each(function(){

                // get url of collection
                var url = $(this).data('collection-nav-link');

                // check if localstorage contains params for this url
                var urlData = self.collectionsParams[url];
                if ( !urlData ) { return; }

                // create new url
                var newUrl;
                if ( urlData && urlData.view ) {
                    newUrl = self.addtoUrl(url,'view',urlData.view);
                }
                if ( urlData && urlData.sort_by ) {
                    newUrl = self.addtoUrl(newUrl,'sort_by',urlData.sort_by);
                }
                if ( urlData && urlData.page ) {
                    newUrl = self.addtoUrl(newUrl,'page',urlData.page);
                }

                // update href with newUrl
                if ( newUrl ) {
                    $(this).attr('href', newUrl);
                }
            });
        }
    };

    /**
     * Toggle nav
     */
    collectionNav_plugin.prototype.addtoUrl = function(url, param, val) {
        var q = '';
        if ( val ) {
            if ( url.indexOf('?') < 0 ) {
                q = '?';
            } else {
                q = '&';
            }
            url += q + param + '=' + val;
        }
        return url;
    };

    /**
     * Go To Url
     */
    collectionNav_plugin.prototype.goToUrl = function() {
        var self = this;

        var path = window.location.pathname;
        var url = window.location.protocol + "//" + window.location.host + path;

        self.storeCollectionsNav(path);

        // create new url
        var newUrl = self.addtoUrl(url,'view',self.view);
        newUrl = self.addtoUrl(newUrl,'sort_by',self.sort_by);
        newUrl = self.addtoUrl(newUrl,'page',self.page);

        // go to url
        window.location = newUrl;
    };

    /**
     * get collections nav objects
     */
    collectionNav_plugin.prototype.getCollectionsNav = function() {
        var self = this;

        if ($.code.localStorage) {
            // get stored collection objects from localstorage
            self.collectionsParams = {};
            var storedCollectionsParams = localStorage.getItem(self.storageId);
            if ( storedCollectionsParams ) {
                self.collectionsParams = JSON.parse(storedCollectionsParams);
            }
        }
    };

    /**
     * Store collections nav objects
     */
    collectionNav_plugin.prototype.storeCollectionsNav = function(url) {
        var self = this;

        if ($.code.localStorage) {

            // get stored collection objects from localstorage
            self.getCollectionsNav();

            // add current / update the collection object in collection objects
            self.collectionsParams[url] = {
                page: self.page,
                view: self.view,
                sort_by: self.sort_by
            };

            // store the collection objects
            localStorage.setItem( self.storageId, JSON.stringify(self.collectionsParams) );
        }
    };

    /**
    * collectionNav plugin
    *
    * @return jQuery objects
    */
    $.fn.collectionNav = function ( options ) {

        // put args in array
        var args = Array.prototype.slice.call( arguments, 1 );

        // initialize the items
        return this.each( function () {

            // store the element the plugin is set on
            var $element = $( this );

            // guard if plugin was already initted
            var instance = $element.data( 'plugin_' + _pluginName );

            // if plugin was not innited
            if ( !instance ) {

                // init plugin on element and set guard data on element
                $element.data( 'plugin_' + _pluginName, new collectionNav_plugin( $element, options ) );
            } else {

                // if instance already created call method from plugin
                if ( typeof options === 'string' ) {
                    instance[ options ].apply( instance, args );
                }
            }
        } );
    };

} )( jQuery, document, window );
