// data
//= data/data-post-blurbs.js


//
// Renders
//
function renderBlurbRow(item) {
  var itemRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
  itemWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  itemSelect = $('<div></div>').addClass('js-selectbox');

  itemWrapper.append(itemSelect);
  itemRow.append(itemWrapper);
  //var collectionSelectItem = blurbSelectbox(itemSelect.get(0));
  return itemRow;
}
function renderBlurbItem(item) {
  var blurbItem = $('<div></div>').addClass('blurb-item is-appearing is-folded js-hasValue'),
  blurbExpandToggle = $('<div></div>').addClass('blurb-item__expand-toggle').click(handleBlurbExpandToggle),
  blurbItemTitle = $('<div></div>').addClass('blurb-item__title').text(item.title),
  blurbItemDescription = $('<div></div>').addClass('blurb-item__description').text(item.description),
  blurbAsset = $('<div></div>'),
  blurbItemEditButton = $('<button></button>').addClass('button button_style_outline-gray blurb-item__edit').text('Edit').click(function() {window.open('create-blurb.html','_blank');});

  switch (item.asset.type) {
    case 'link':
      blurbAsset.addClass('blurb-item__asset blurb-item__asset--link').text(item.asset.link)
      break;

    case 'video':
      blurbAsset.addClass('blurb-item__asset blurb-item__asset--video').css('background-image', 'url(' + item.asset.link + ')')
      break;
  }

  return blurbItem.append(blurbExpandToggle, blurbItemTitle, blurbItemDescription, blurbAsset, blurbItemEditButton);
}

function renderBlurbListItem(item) {
  var listItem = $('<div></div>'),
  listItemTitle = $('<div></div>').addClass('selectbox__list-item-title').text(item.title).attr('id', 'blurbItem-' + item.id),
  listItemSubtitle = $('<div></div>').addClass('selectbox__list-item-subtitle').text(item.description);

  listItem.append(listItemTitle, listItemSubtitle);
  return listItem.get(0).innerHTML;
}


//
// Handlers
//
function handleBlurbExpandToggle(e) {
  $(e.target).parents('.blurb-item').toggleClass('is-folded is-expanded');
}

function handleBlurbListItemClick(item, selectbox) {
  var id = parseInt($(item).find('.selectbox__list-item-title').attr('id').split('-')[1]),
  data = selectbox.options.data || postBlurb;
  var blurbItem = renderBlurbItem(data.filter(function(blurb) {
    return blurb.id === id;
  })[0]);
  var addableItem = $(selectbox.selectWrapper).parents('.c-Addable-item');
  addableItem.empty().append(blurbItem);
  blurbItem.parents('.c-Addable-row').addClass('c-Addable-row--collection');
}

//
// Init
//

function initBlurbSection(section, data, itemLabel) {
  function beforeAddBlurb(el) {
    var blurbSelectItem = blurbSelectbox(el.find('.js-selectbox').get(0), data, undefined, itemLabel);
  }

  var blurbRow = renderBlurbRow();
  section.append(blurbRow);
  var addableObject = new Addable(blurbRow, {beforeAdd: beforeAddBlurb, placeholder: 'c-Addable-rowPlaceholder--collection', sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(renderBlurbRow(), beforeAddBlurb);

  return addableObject;
}


//
// Helpers
//
function blurbSelectbox(el, data, callback, itemLabel) {
  var itemsData = data || postBlurb,
  itemCallback = callback || handleBlurbListItemClick;

  return new Selectbox(el, {
    label: itemLabel || 'Blurb',
    placeholder: itemLabel ? 'Select ' + itemLabel : 'Select Blurb',
    items: itemsData
      .sort(function(a, b) {
        return a.title > b.title ? 1 : a.title < b.title ? -1 : 0;
      })
      .map(renderBlurbListItem),
    complexItems: true,
    sideNav: true,
    itemCallback: itemCallback,
    data: itemsData,
    search: true,
    unselect: -1
  });
}
