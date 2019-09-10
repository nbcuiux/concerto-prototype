//Common js files
//= common.js

//Content files
//= sources/contentLibrary.js

//Series data
//= sources/data/data-filters.js


//Global variables
var globalFilters = [];



$(document).ready(function() {

    //Common init functions
    //= commonInit.js

    renderContent($('#contentLibrary'), collectionStore, renderContentHeaderRow, renderContentRow);
    collectionStore.setElement($('#contentLibrary'));
    collectionStore.setMainRender(renderContent);
    collectionStore.setHeaderRender(renderContentHeaderRow);
    collectionStore.setRowRender(renderContentRow);

    //Sorting dropdown
    if (document.getElementById('sortContentDropdown')) {
        var galleryActionDropdownSmall = new Dropdown(
            document.getElementById('sortContentDropdown'),
            {
                items: [
                    {
                        innerHTML: '<span data-sort-id="title" data-sort-dir="ascending">Title A-Z</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        innerHTML: '<span data-sort-id="title" data-sort-dir="descending">Title Z-A</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        divider: true
                    },
                    {
                        innerHTML: '<span data-sort-id="type" data-sort-dir="ascending">Type A-Z</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        innerHTML: '<span data-sort-id="type" data-sort-dir="descending">Type Z-A</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        divider: true
                    },
                    {
                        innerHTML: '<span data-sort-id="series" data-sort-dir="ascending">Series A-Z</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        innerHTML: '<span data-sort-id="series" data-sort-dir="descending">Series Z-A</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        divider: true
                    },
                    {
                        innerHTML: '<span data-sort-id="updateDate" data-sort-dir="ascending">Update Date 0-9</span>',
                        callback: handleDropdownSorting
                    },
                    {
                        innerHTML: '<span data-sort-id="updateDate" data-sort-dir="descending">Update Date 9-0</span>',
                        callback: handleDropdownSorting
                    }
                ]
            }
        );
    }
    //Sorting handler function
    function handleDropdownSorting(e) {
        setContentSorting({id: e.target.dataset.sortId, direction: e.target.dataset.sortDir}, renderContentRow);
    }

    if ($('#itemsPerPageSelectbox').get(0)) {
        itemsPerPageSelectbox = new Selectbox($('#itemsPerPageSelectbox').get(0), {
            label: 'Items Per Page',
            placeholder: 'Select number of Items',
            items: ['5', '10', '25', '50'],
            unselect: -1,
            selectedItem: '10',

            itemCallback: function(item, select) {
                console.log(item.innerHTML);

                store.setItemsPerPage(parseInt(item.innerHTML));
                //if (store.pagesNumber() > store.page + 1) {store.setPage()}
                store.setPage(0);
                renderContent($('#contentLibrary'), store, renderContentHeaderRow, renderContentRow);
                pagination._init();
            }
        });
    }

    var pagination = new Pagination($('#contentPagination'), collectionStore, renderData);

    if (document.getElementById('filterType')) {
        var typeSelect = new Selectbox(document.getElementById('filterType'), {
            label: 'Type',
            placeholder: 'Select Type',
            items: collectionType.sort(),
            unselect: '— None —',
            itemCallback: handleFilterChange
        });
    }
    if (document.getElementById('filterSeries')) {
        var seriesSelect = new Selectbox(document.getElementById('filterSeries'), {
            label: 'Series or Event',
            placeholder: 'Select Series or Event',
            items: contentSeries.sort(),
            unselect: '— None —',
            itemCallback: handleFilterChange
        });
    }
    if (document.getElementById('filterSeason')) {
        var seasonSelect = new Selectbox(document.getElementById('filterSeason'), {
            label: 'Season',
            placeholder: 'Select Season',
            items: contentSeason.sort(function(a, b) {
                return a < b ? 1 : a > b ? -1 : 0;
            }),
            unselect: '— None —',
            itemCallback: handleFilterChange
        });
    }
    if (document.getElementById('filterEpisode')) {
        var episodeSelect = new Selectbox(document.getElementById('filterEpisode'), {
            label: 'Episode',
            placeholder: 'Select Episode',
            items: contentEpisode.sort(function(a, b) {
                return a < b ? 1 : a > b ? -1 : 0;
            }),
            unselect: '— None —',
            itemCallback: handleFilterChange
        });
    }
    if (document.getElementById('filterCategory')) {
        var categorySelect = new Tagfield(document.getElementById('filterCategory'), {
            label: 'Category',
            placeholder: 'Select Category(s)',
            items: contentCategories.sort(),
            itemCallback: handleFilterChange,
            deleteTagCallback: handleFilterChange
        });
    }
    //Tags
    if (document.getElementById('filterTags')) {
        var tagsSelect = new Tagfield(document.getElementById('filterTags'), {
            label: 'Tags',
            placeholder: 'Select Tag(s)',
            items: contentTags.sort(),
            itemCallback: handleFilterChange,
            deleteTagCallback: handleFilterChange
        });
    }

    //Status
    if (document.getElementById('filterStatus')) {
        var statusSelect = new Selectbox(document.getElementById('filterStatus'), {
            label: 'Status',
            placeholder: 'Select Status',
            items: contentStatus.sort(),
            itemCallback: handleFilterChange,
            unselect: '— None —'
        });
    }

    //Checkbox
    $('#filterMe').click(handleFilterByMy);

    //Other
    if (document.getElementById('filterOther')) {
        var otherSelect = new Tagfield(document.getElementById('filterOther'), {
            label: 'Other',
            placeholder: 'Select Option(s)',
            items: contentOther,
            itemCallback: handleFilterChange,
            deleteTagCallback: handleFilterChange
        });
    }

    $('#filterButton').click(handleApplyFilters);
    function handleApplyFilters() {
        collectionStore.setFilters(globalFilters);
        collectionStore.setPage(0);
        renderContent($('#contentLibrary'), collectionStore, renderContentHeaderRow, renderContentRow);
        pagination._init();
        //globalFilters = [];
        $('#filterButton').addClass('disabled');
        if ($('.c-Header-controls.header__controls--filter').hasClass('is-open')) {
            $('.c-Header-controls.header__controls--filter').removeClass('is-open');
        }
    handleCloseFilter();
    pagination._init();

    }

    $('#resetFilterButton').click(handleResetFilters);
    function handleResetFilters() {
        globalFilters = [];
        handleApplyFilters();
        typeSelect.clear();
        seriesSelect.clear();
        seasonSelect.clear();
        episodeSelect.clear();
        categorySelect.clear();
        tagsSelect.clear();
        statusSelect.clear();
        document.getElementById('filterMe').checked = false;

        $('#resetFilterButton').addClass('disabled');
    }


    function handleFilterChange(item, filter) {
        globalFilters = addFilter(globalFilters, filterForElement(item, filter));
        $('#filterButton').removeClass('disabled');
        if (globalFilters.length > 0) {
            $('#resetFilterButton').removeClass('disabled');
        } else {
            $('#resetFilterButton').addClass('disabled');
        }
    }
    function handleFilterByMy(e) {
        globalFilters = addFilter(globalFilters, {id: 'createdName', value: e.target.checked ? 'Devon Norris' : null});
        $('#filterButton').removeClass('disabled');
        if (globalFilters.length > 0) {
            $('#resetFilterButton').removeClass('disabled');
        } else {
            $('#resetFilterButton').addClass('disabled');
        }
    }
    function filterForElement(item, filter) {
        switch (filter.el.dataset.filterType) {
            case 'categories':
                return {
                    id: 'categories',
                    value: filter.items.length > 0 ? filter.items : null};

            case 'tags':
                return {
                    id: 'tags',
                    value: filter.items.length > 0 ? filter.items : null
                };

            case 'other':
                var pIndex = filter.items.indexOf('Published'),
                    npIndex = filter.items.indexOf('Not published');
                if (pIndex > -1 && npIndex > -1) {
                    fValue = [].concat(filter.items.slice(0, pIndex), filter.items.slice(pIndex + 1));
                    npIndex = fValue.indexOf('Not published');
                    fValue = [].concat(fValue.slice(0, npIndex), fValue.slice(npIndex + 1));

                    return {
                        id: 'other',
                        value: fValue.length > 0 ? fValue : null
                    };
                } else {
                    return {
                        id: 'other',
                        value: filter.items.length > 0 ? filter.items : null
                    };
                }
                return ;

            default:
                return {
                    id: filter.el.dataset.filterType,
                    value: filter.options.items[filter.activeItem]
                };
        }
    }



    function addFilter(filters, filter) {
        if (filter) {
            var sameFilter = filters.filter(function(f) {
                return f.id === filter.id;
            })[0];
            var index = filters.indexOf(sameFilter);

            if (index > -1) {
                if (filter.value) {
                    return [].concat(filters.slice(0, index), filter, filters.slice(index + 1));
                } else if (filters.length === 1) {
                    return [];
                } else {
                    return [].concat(filters.slice(0, index), filters.slice(index + 1));
                }

            } else {
                return filters.concat(filter);
            }
        }
        else {
            return filters;
        }
    }


    //Filter toggle
    $('#filterToggle').click(handleToggleFilter);
    function handleToggleFilter() {
        $('#filters').addClass('is-open');
        $('#menuToggle').addClass('is-hidden');
        $('.content__controls--library').addClass('is-hidden');
    }

    $('#closeFilter').click(handleCloseFilter);
    function handleCloseFilter() {
        $('#filters').removeClass('is-open');
        $('#menuToggle').removeClass('is-hidden');
        $('.content__controls--library').removeClass('is-hidden');
    }

});
