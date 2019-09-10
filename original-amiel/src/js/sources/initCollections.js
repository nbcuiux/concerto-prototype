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
    var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
        data = selectbox.options.data || collectionItems;
    var collectionItem = createCollectionItem(data.filter(function(item) {
            return item.id === id;
        })[0]);
    var addableItem = $(selectbox.selectWrapper).parents('.c-Addable-item');
    addableItem.empty().append(collectionItem);
    collectionItem.parents('.c-Addable-row').addClass('c-Addable-row--collection');
}

function createCollectionItem(item) {
    var collItem = $('<div></div>').addClass('collection-item is-appearing js-hasValue'),
        collItemWrapper = $('<div></div>').addClass('collection-item__wrapper'),
        //collItemImage = $('<div></div>').addClass('collection-item__image is-empty'),
        collItemTitle = $('<div></div>').addClass('collection-item__title').text(item.title),
        itemInfo = item.type.charAt(0).toUpperCase() + item.type.slice(1),
        collItemInfo = $('<div></div>').addClass('collection-item__info'),
        collItemDescription = $('<div></div>').addClass('collection-item__description'),
        collItemEditButton = $('<button></button>').addClass('button button_style_outline-gray collection-item__edit').text('Edit');

    /*if (item.img) {
        collItemImage.css('background-image', 'url(' + item.img + ')').removeClass('is-empty');
    }*/
    /*switch (item.type) {
        case 'video':
            collItemTypeIcon = $('<div><i class="fa fa-video-camera"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;
        case 'gallery':
            collItemTypeIcon = $('<div><i class="fa fa-picture-o"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;
        case 'episode':
            collItemTypeIcon = $('<div></div>').addClass('collection-item__type collection-item__type--image collection-item__type--episode');
            collItemImage.append(collItemTypeIcon);
            break;

        case 'cast':
            collItemTypeIcon = $('<div><i class="fa fa-users"></i></div>').addClass('collection-item__type');
            collItemImage.append(collItemTypeIcon);
            break;

        case 'collection':
            collItemImage = undefined;
            if (item.assets) {itemInfo = itemInfo + ' | ' + item.assets.toString() + ' assets';}
            break;

        case 'collection group':
            collItemImage = undefined;
            if (item.assets) {itemInfo = itemInfo + ' | ' + item.assets.toString() + ' collections';}
            break;

        default:
            break;
    }
    collItem.append(collItemImage);*/

    collItemWrapper.append(collItemTitle);

    /*if (item.description) {
        collItemDescription.text(item.description);
        collItemWrapper.append(collItemDescription);
    }*/

    /*if (item.subtype) {
        itemInfo = itemInfo + ' (' + item.subtype + ')';
    }
    if (item.series) {
        itemInfo = itemInfo + ' | ' + item.series;
    }*/
    collItemInfo.text(itemInfo);
    collItemWrapper.append(collItemInfo);
    collItem.append(collItemWrapper);

    /*if (item.target) {
        collItemEditButton.click(function(e) {
            window.open(item.target,'_blank');
        });
        collItem.append(collItemEditButton);
    }*/

    return collItem;
}

function createListItem(item) {
    var listItem = $('<div></div>'),
        itemSubtitle = item.type.charAt(0).toUpperCase() + item.type.slice(1),
        listItemTitle = $('<div></div>').addClass('selectbox__list-item-title').text(item.title).attr('id', 'collectionItem-' + item.id),
        listItemSubtitle = $('<div></div>').addClass('selectbox__list-item-subtitle'),
        listItemTypeIcon;

    /*switch (item.type) {
        case 'video':
            listItemTypeIcon = $('<div><i class="fa fa-video-camera"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'gallery':
            listItemTypeIcon = $('<div><i class="fa fa-picture-o"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'episode':
            listItemTypeIcon = $('<div><i class="fa fa-file-video-o"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'image':
            listItemTypeIcon = $('<div><i class="fa fa-camera"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        case 'cast':
            listItemTypeIcon = $('<div><i class="fa fa-users"></i></div>').addClass('selectbox__list-item-type');
            listItem.append(listItemTypeIcon);
            break;

        default:
            break;
    }*/

    /*if (item.subtype) {
        itemSubtitle = itemSubtitle + ' (' + item.subtype + ')';
    }*/
    /*if (item.series) {
        itemSubtitle = itemSubtitle + ' | ' + item.series;
    }
    if (item.assets) {
        itemSubtitle = itemSubtitle + ' | ' + item.assets.toString();
        if (item.type === 'collection group') {itemSubtitle = itemSubtitle + ' collections';}
        else {itemSubtitle = itemSubtitle + ' assets';}
    }*/
    listItemSubtitle.text(itemSubtitle);
    listItem.append(listItemTitle, listItemSubtitle);



    /*if (item.img) {
        var listItemImage = $('<div></div>').addClass('selectbox__list-item-image').css('background-image', 'url(' + item.img + ')');



        listItem.append(listItemImage);
    }*/

    return listItem.get(0).innerHTML;
}

function initCollSection(section, data, itemLabel) {
    function beforeAddCollection(el) {
        var collectionSelectItem = itemComplexSelectbox(el.find('.js-selectbox').get(0), data, null, itemLabel);
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
    var addableObject = new Addable(collRow, {beforeAdd: beforeAddCollection, placeholder: 'c-Addable-rowPlaceholder--collection', sortable: true});
    addableObject.removeItem(0);
    addableObject._addItem(createEmptyCollRow(), beforeAddCollection);

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