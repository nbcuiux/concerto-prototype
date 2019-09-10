//Common js files
//= common.js

//Content files
//= sources/contentLibrary.js

//Series data
//= sources/data/data-filters.js


//Global variables
var globalFilters = [];



function getRevisionHistory(_data) {
    var person = Math.round(Math.random() * (persons.length-1));
    return "Revision was set to " + _data.status + " by <b>" + persons[person] + "</b>";
}

console.log("Versions >>");

$(document).ready(function() {

    //Common init functions
    //= commonInit.js
    console.log("Versions");

    console.log(collectionStore);

    //fill vids
    for (var i=0; i < collectionStore.data.length; i++) {
        var element = collectionStore.data[i];
        element.vid = 3650 + i;
        if (element.version == undefined) element.version = i;

        var newStatus = element.status;
        if (i % 6 == 0) {
            newStatus = "Draft";
        }
        element.status = newStatus;
        element.history = getRevisionHistory(element);
        element.updateDate = new moment().subtract(i, 'days').toDate();
    }


    renderContent($('#contentLibrary'), collectionStore, renderRevisionHeaderRow, renderRevisionRow);
    collectionStore.setElement($('#contentLibrary'));
    collectionStore.setMainRender(renderContent);
    collectionStore.setHeaderRender(renderRevisionHeaderRow);
    collectionStore.setRowRender(renderRevisionRow);


    if ($('#itemsPerPageSelectbox').get(0)) {
        itemsPerPageSelectbox = new Selectbox($('#itemsPerPageSelectbox').get(0), {
            label: 'Items Per Page',
            placeholder: 'Select number of Items',
            items: ['5', '10', '25', '50'],
            unselect: -1,
            selectedItem: '10',

            itemCallback: function(item, select) {

                store.setItemsPerPage(parseInt(item.innerHTML));
                //if (store.pagesNumber() > store.page + 1) {store.setPage()}
                store.setPage(0);
                renderContent($('#contentLibrary'), store, renderRevisionHeaderRow, renderRevisionRow);
                pagination._init();
            }
        });
    }

    var pagination = new Pagination($('#contentPagination'), collectionStore, renderData);
    pagination.customUpdateRow = renderRevisionRow;


    /*var pagination = new Pagination($('#contentPagination'), collectionStore, function(a,b,c,d) {
        console.log("renderData = ", a,b,c,d);
    });*/
    var filters = $( '#filters' );
    var datePickers = $( '.use-datepicker' );
    var titleSearch = filters.find("#filterTitle");

    if (document.getElementById('filterRevisionType')) {
        var typeSelect = new Selectbox(document.getElementById('filterRevisionType'), {
            label: 'Type',
            placeholder: 'Select Type',
            items: revisionsType.sort(),
            unselect: '— None —',
            itemCallback: handleFilterChange
        });
    }


    //Status
    if (document.getElementById('filterStatus')) {
        var statusSelect = new Selectbox(document.getElementById('filterStatus'), {
            label: 'Status',
            placeholder: 'Select Status',
            items: revisionsStatus.sort(),
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
        renderContent($('#contentLibrary'), collectionStore, renderRevisionHeaderRow, renderRevisionRow);
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
        statusSelect.clear();
        datePickers.find(".use-datepicker__trigger").text("");
        titleSearch.val("");


        //document.getElementById('filterMe').checked = false;

        $('#resetFilterButton').addClass('disabled');
    }


    function handleFilterChange(item, filter) {
        console.log("handleFilterChange", item, filter);
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

            case 'updateDate':
                return {
                    id: 'updateDate',
                    value: filter.value
                };

            case 'title':
                return {
                    id: 'title',
                    value: filter.value
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
        console.log("addFilter", filters, filter);
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


    
    //Date picker
    datePickers.each($.proxy(function(i, e) {
        // Jump to date
        var block = $(e);
        var container = block.find(".use-datepicker__container");
        var trigger = block.find(".use-datepicker__trigger");


        container.datepicker({
            onSelect: function(dateString, datepicker) {
                block.removeClass("use-datepicker--show");
                trigger.text(dateString);
                handleFilterChange(block[0], {
                    el : {
                        dataset : {
                            filterType : "updateDate"
                        }
                    },
                    value : dateString
                });
            },
            changeMonth: true,
            changeYear: true
        });

        trigger.click($.proxy(function(e){
            block.toggleClass("use-datepicker--show");
        }));
        trigger.blur($.proxy(function(e){
            //block.removeClass("use-datepicker--show");
        }));
    }, this));

    //title search
    titleSearch.on('change keyup paste', $.proxy(function(e){
        var currentVal = $(titleSearch).val();
        handleFilterChange(titleSearch[0], {
            el : {
                dataset : {
                    filterType : "title"
                }
            },
            value : currentVal
        });
    }, this));
});
