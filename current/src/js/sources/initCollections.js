// data
//= data/data-collection.js

function createItemRow(c) {
    var itemRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
        itemWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
        itemSelect = $('<div></div>').addClass('js-selectbox');

    itemWrapper.append(itemSelect);
    itemRow.append(itemWrapper);
    var collectionSelectItem = itemComplexSelectbox(itemSelect.get(0));
    return itemRow;
}

function itemComplexSelectbox(el, data, callback, itemLabel) {
    var itemsData = data || collectionItems,
        itemCallback = callback || handleItemmClick;

    return new ComplexSelectbox(el, {
        label: itemLabel || 'Item',
        placeholder: itemLabel ? 'Select ' + itemLabel : 'Select Item',
        items: itemsData
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: itemCallback,
        data: itemsData,
        search: true
    });
}

function handleItemmClick(item, selectbox) {
    if ($(item).find('.selectbox__list-item-title').length > 0) {
        var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
        data = selectbox.options.data || collectionItems;
        var collectionItem = createCollectionItem(data.filter(function(item) {
            return item.id === id;
        })[0]);   
    } else {
        var collectionItem = createCollectionItem(item);
    }

    var addableItem = $(selectbox.selectWrapper).closest('.c-Addable-item');
    addableItem.empty().append(collectionItem);
    collectionItem.parents('.c-Addable-row').addClass('c-Addable-row--collection');
}

function createCollectionItem(item) {
    var collectionTemplate = Handlebars.compile($("#collection-element-simple").html());
    var collItem = $(collectionTemplate(item));
    var subCollections = collItem.find(".collection-item__collections");
    collItem.find(".collection-item__pick").click($.proxy(function(e){
        e.preventDefault();
        e.stopPropagation();
        collItem.toggleClass("collection-item--expanded");
    }, this));

    //filter all from collection groups
    initCollSection(subCollections, collections.filter(function(obj){ return obj.type.toLowerCase() != "collection group"; }), 'Content');

    //Collections
    if (item.collections != undefined) {

        var collectionsInstance = subCollections.data("addable");
        
        if (item.collections.length > 0) {
            subCollections.addClass("has-multipleRows");
        }

        $($(item.collections).get().reverse()).each($.proxy(function(i, elem) {
            selectboxInstance = collectionsInstance.selectBox;
            collectionsInstance.handleAddRow();
            handleItemmClick(elem, selectboxInstance);
        }));
    }





    return collItem;
}

function createListItem(item) {
    var listItem = $('<div></div>'),
        itemSubtitle = item.type.charAt(0).toUpperCase() + item.type.slice(1),
        listItemTitle = $('<div></div>').addClass('selectbox__list-item-title').text(item.title).attr('id', 'collectionItem-' + item.id),
        listItemSubtitle = $('<div></div>').addClass('selectbox__list-item-subtitle'),
        listItemTypeIcon;
    listItemSubtitle.text(itemSubtitle);
    listItem.append(listItemTitle, listItemSubtitle);
    return listItem.get(0).innerHTML;
}

function initCollSection(section, data, itemLabel, callback) {
    function beforeAddCollection(el) {
        return itemComplexSelectbox(el.find('.js-selectbox').get(0), data, callback, itemLabel);
    }

    function createEmptyCollRow () {
        var itemRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
            itemWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            itemSelect = $('<div></div>').addClass('js-selectbox');

            itemWrapper.append(itemSelect);
            return itemRow.append(itemWrapper);
    }

    var collRow = createEmptyCollRow();
    section.append(collRow);
    var addableObject = new Addable(collRow, {
        beforeAdd: beforeAddCollection, 
        placeholder: 'c-Addable-rowPlaceholder--collection', 
        sortable: true
    });
    addableObject.removeItem(0);
    addableObject._addItem(createEmptyCollRow(), beforeAddCollection);

    section.data("addable", addableObject);

    return addableObject;
}

function replaceComplexSelectboxWithCollectionRow(item, selectbox) {
    var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
        data = selectbox.options.data || collectionItems,
        collectionItem = createCollectionItem(data.filter(function(item) {
            return item.id === id;
        })[0]);

    //Create DOM elements
    var collectionRow = $('<div></div>').addClass('collection-row js-collectionRow'),
        collectionItemWrapper = $('<div></div>').addClass('collection-row__item-wrapper'),
        collectionRemoveButton = $('<button></button>').addClass('button--round button_style_outline-gray button--remove collection-row__button js-collectionRemoveButton').click(handleRemoveCollectionRow);

    collectionItemWrapper.append(collectionItem);
    collectionRow.append(collectionItemWrapper, collectionRemoveButton);

    //Insert new elements in DOM and remove list
    collectionRow.insertBefore(selectbox.selectWrapper);
    selectbox.selectWrapper.remove();
}

function handleRemoveCollectionRow(e) {
    var collectionRow = $(e.target).parents('.js-collectionRow'),
        collectionSelect = $('<div></div>').addClass('js-selectbox');

    collectionSelect.insertBefore(collectionRow);
    collectionRow.remove();

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initOneCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Collection Group',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initWebsiteCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Website Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initRokuCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Roku Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}

function initAndroidCollectionSection(section, data) {
    var collectionSelect = $('<div></div>').addClass('js-selectbox');
    section.append(collectionSelect);

    var collectionSelectItem = new ComplexSelectbox(collectionSelect.get(0), {
        label: 'Android Collection',
        placeholder: 'Select Collection',
        items: pageCollections
            .sort(function(a, b) {
                return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
            })
            .map(createListItem),
        complexItems: true,
        sideNav: true,
        itemCallback: replaceComplexSelectboxWithCollectionRow,
        data: pageCollections,
        search: true
    });
}
