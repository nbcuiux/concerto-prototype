// Data
//= data/data-postItems.js

//For render blurb
//= initPostSection.js

function initBlogSection(section) {
  var thumbnails = $('<div />').addClass('post-item-thumbnails'),
      moreThumbnail = $('<div />').addClass('post-item-thumb post-item-thumb--post-card').click(function() {createNewItemOverlay(thumbnails);}),
      moreIcon = $('<i />').addClass('post-item-thumb__icon fa fa-ellipsis-h'),
      moreTitle = $('<div />').addClass('post-item-thumb__title').text('more'),
      items = $('<div />').addClass('post-items').attr('id', 'postItems');
  for (var i = 0; i < 4; i++) {
    thumbnails.append(renderPostItemThumbnail(postItems[i], thumbnails).addClass('post-item-thumb--post-card').removeClass('post-item-thumb--overlay'));
  }

  thumbnails.append(moreThumbnail.append(moreIcon, moreTitle));
  section.append(items, thumbnails);
  items.sortable({
    items: '.post-item__wrapper',
    placeholder: 'post-item__placeholder',
    forcePlaceholderSize: true,
    handle: '.post-item__title',
    start: function(e, ui) {
      ui.item.addClass('is-dragging').removeClass('is-dropped');
      $(e.target).css('height', $(e.target).height());
      $('body').css('height', $('body').height());
      $('.post-item__wrapper').addClass('in-dragging-mode');
    },
    stop: function(e, ui) {
      ui.item.removeClass('is-dragging').addClass('is-dropped');
      $(e.target).css('height', '');
      $('body').css('height', '');
      $('.post-item__wrapper').removeClass('in-dragging-mode');
    }
  })
  $('#createNewTemplate').click(createNewTemplateOverlay);
}

//
// Renders
//
function renderPostItem(item) {
  var itemWrapper = $('<div />').addClass('post-item__wrapper').attr('data-type', item.type),
      title = $('<div />').addClass('post-item__title').append($('<i />').addClass(item.iconClass), $('<span />').text(' ' + item.title)),
      remove = $('<div />').addClass('post-item__remove').click(handleRemoveItem),
      addNew = $('<div />').addClass('post-item__add-new').append($('<i />').addClass('fa fa-ellipsis-h')).click(handleAddNewClick),
      itemEl = $('<div />').addClass('post-item');

  return itemWrapper.append(itemEl.append(title, remove, renderPostItemContent(item.type)), addNew);
}
function renderPostItemContent(type) {
  var content = $('<div />').addClass('post-item__content');

  switch (type) {
    case 'source':
      var group = $('<div />').addClass('cg__controls cg__controls_style_row'),
          label = $('<input type="text" />').val('Source'),
          link = $('<input type="text" />');
      content.append(group.append(label.wrap('<div class="cg__control cg__control_style_row"></div>').parent(), link.wrap('<div class="cg__control cg__control_style_row"></div>').parent()));
      new Textfield(label.get(0), {label: 'Label'});
      new Textfield(link.get(0), {label: 'Link', placeholder: 'example.com/source-path'});
      break;

    case 'blurb':
      content.addClass('post-item__content--blurb').append(renderSectionContent(Date.now()).children());
      break;

    case 'title':
      var heading = $('<div />').addClass('post-content__heading');
      content.addClass('post-item__content--link').append(heading);
      headingEditor = new MediumEditor(heading.get(0), {
        toolbar: false,
        disableReturn: true,
        placeholder: {
          text: 'Type heading here'
        }
      });
      headingEditor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML !== '') {heading.addClass('js-hasValue');}
        else {heading.removeClass('js-hasValue');}
      });
      break;

    case 'link':
      var linkField = $('<div />').addClass('post-content__textarea post-content__link'),
          linkPreview = $('<div />').addClass('post-content__preview');
      content.addClass('post-item__content--link').append(linkField, linkPreview);
      editor = new MediumEditor(linkField.get(0), {
        toolbar: false,
        placeholder: {
          text: 'Type your embeded link here'
        },
        paste: {
          forcePlainText: false
        }
      });
      //Embeded link preview
      editor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML.includes('iframe') || element.innerHTML.includes('blockquote')) {
          regExp1 = /\&lt;/g;
          regExp2 = /\&gt;/g;
          innerHTML = element.innerHTML.replace(regExp1, '<').replace(regExp2, '>');
          if (!innerHTML.includes('iframe')) {innerHTML = '<iframe>' + innerHTML + '</iframe>';}

          linkPreview.html(innerHTML);
          linkPreview.addClass('has-preview js-hasValue');
          linkField.addClass('has-preview');
        } else {
          linkPreview.html('').removeClass('has-preview  js-hasValue');
          linkField.removeClass('has-preview');
        }
      })
      break;

    case 'file':
      var placeholder = $('<div />'),
          checkboxGroup = $('<div />').addClass('controls__group controls__group--toggle is-disabled').css('width', 'auto'),
          checkboxId = 'checkbox-' + Date.now(),
          checkbox = $('<input type="checkbox" />').addClass('toggle').attr('id', checkboxId),
          checkboxLabel = $('<label for="' + checkboxId + '" />').text('Autoplay');
      content.addClass('post-item__content--file').append(placeholder, checkboxGroup.append(checkbox, checkboxLabel));
      new ImagePlaceholder(placeholder.get(0), null, {
        alButton: 'Add File',
        onUpdate: function(p) {
          if (p.type === 'video') {checkboxGroup.removeClass('is-disabled');}
          else {checkboxGroup.addClass('is-disabled');}
        }
      });
      break;

    case 'text':
      var text = $('<div />').addClass('post-content__textarea');
      content.addClass('post-item__content--text').append(text);
      textEditor = new MediumEditor(text.get(0), {
        disableReturn: true,
        buttonLabels: 'fontawesome',
        toolbar: {
          buttons: ['bold', 'italic', 'anchor']
        }
      });
      textEditor.subscribe('editableInput', function(event, element) {
        if (element.innerHTML !== '') {heading.addClass('js-hasValue');}
        else {heading.removeClass('js-hasValue');}
      });
      break;
  }
  return content;
}
function renderTemplate(template, target) {
  var templateWrapper = $('<div />');
  template.items.forEach(function(item) {
    templateWrapper.append(renderPostItem(item));
  })
  return templateWrapper.children();
}
//
// Handlers
//
function handleAddNewClick(e) {
  var target = $(e.target).parents('.post-item__wrapper, .post-item-thumbnails');
  createNewItemOverlay(target);
}
function handleRemoveItem(e) {
  var item = $(e.target).parents('.post-item__wrapper');
  if (item.find('.js-hasValue').length > 0) {
    new Modal({
      dialog: true,
      title: 'Remove Item?',
      text: 'All item data will be lost. Are you sure you want to remove this item?',
      confirmText: 'Remove',
      confirmAction: function() {
        item.remove();
        checkItems();
      }
    })
  }
  else {
    item.remove();
    checkItems();
  }
}

//
// Helpers
//
//Check if there are a items on a blog page and change ui accordingly
function checkItems() {
  if ($('#postItems .post-item__wrapper').length > 0) {
    $('#createNewTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#createNewTemplate').addClass('disabled').prop('disabled', true);
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- ADD ITEMS OVERLAY --------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/

function createNewItemOverlay(target) {
  var scrollPosition = $('body').scrollTop();
      overlay = $('<div />').addClass('modal modal--full').attr('id', 'newItemOverlay'),
      close = $('<div></div>').addClass('modal__close').click(function() {newOverlayClose(overlay, scrollPosition)}),
      thumbnails = $('<div />').addClass('post-item-thumbs'),

      sectionData = [
        {
          type: 'items',
          items: postItems
        }
      ];
  if (getTemplates()) {
    sectionData.push({
      type: 'templates',
      title: 'Templates',
      items: getTemplates()
    })
  }

  sectionData.forEach(function(section) {
    thumbnails.append(renderPostItemThumbnailSection(section, target))
  });

  $(document).on('keydown', function(e) {postDocumentKeydown(e, overlay, scrollPosition);});
  $('body').append(overlay.append(close, thumbnails));
  $('#wrapper').addClass('overflow');
}
function updateNewItemOverlay() {
  var thumbnails = $('.post-item-thumbs');
  thumbnails.empty();
  var sectionData = [
    {
      type: 'items',
      items: postItems
    }
  ];
  if (getTemplates()) {
    sectionData.push({
      type: 'templates',
      title: 'Templates',
      items: getTemplates()
    })
  }
  sectionData.forEach(function(section) {
    thumbnails.append(renderPostItemThumbnailSection(section, target))
  });
}
//
// Renders
//
function renderPostItemThumbnailSection(data, target) {
  var section = $('<div />').addClass('post-item-section post-item-section--' + data.type),
      title = $('<div />').addClass('post-item-section__title').text(data.title),
      items = $('<div />').addClass('post-item-section__items');

  data.items.forEach(function(item) {
    items.append(renderPostItemThumbnail(item, target));
  });

  return section.append(title, items);
}
function renderPostItemThumbnail(item, target) {
  var thumb = $('<div />').addClass('post-item-thumb post-item-thumb--overlay').attr('data-type', item.type).click(function(e) {itemThumbClick(e, item, target);});

  switch (item.type) {
    case 'template':
      var descriptionString = item.items.reduce(function(acc, itemData, i) {
        return i === 0 ? acc + itemData.title : acc + ', ' + itemData.title;
      }, ''),
          title = $('<div />').addClass('post-item-thumb__title').text(item.title),
          description = $('<div />').addClass('post-item-thumb__description').text(descriptionString),
          remove = $('<div />').addClass('post-item-thumb__remove').click(handleRemoveTemplateClick);
      return thumb.addClass('post-item-thumb--template').attr('data-id', item.id).append(title, description, remove);

    default:
      var icon = $('<i />').addClass('post-item-thumb__icon ' + item.iconClass),
          title = $('<div />').addClass('post-item-thumb__title').text(item.title);
      return thumb.addClass('post-item-thumb--item').append(icon, title);
  }
}

//
// Handlers
//
function handleRemoveTemplateClick(e) {
  new Modal({
    dialog: true,
    title: 'Remove Template?',
    text: 'All item data will be lost. Are you sure you want to remove this template?',
    confirmText: 'Remove',
    confirmAction: function() {
      var section = $(e.target).parents('.post-item-section');
      $(e.target).parents('.post-item-thumb').remove();
      removeTemplate(parseInt($(e.target).parents('.post-item-thumb').attr('data-id')));
      if (section.find('.post-item-thumb').length === 0) {
        section.remove();
      }
    },
    cancelAction: function() {} // Should be updated
  })
}

function itemThumbClick(e, item, target) {
  if (!$(e.target).hasClass('post-item-thumb__remove')) {
    var itemsToInsert;
    switch (item.type) {
      case 'template':
        itemsToInsert = renderTemplate(item);
        break;

      default:
        itemsToInsert = renderPostItem(item);
    }
    if (target.hasClass('post-item-thumbnails')) {
      $('#postItems').append(itemsToInsert);
    } else {
      target.after(itemsToInsert);
    }
    $('#newItemOverlay .modal__close').click();
    var itemBottomEnd = itemsToInsert.last().get(0).getBoundingClientRect().top + itemsToInsert.last().height();
    if (itemBottomEnd + 60 > $(window).height()) {
      $('body').animate( { scrollTop: '+=' + Math.round(itemBottomEnd + 60 - $(window).height()).toString() }, 400);
    }
    checkItems();
  }
}


/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- TEMPLATES ----------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/

function createNewTemplateOverlay() {
  var scrollPosition = $('body').scrollTop();
      overlay = $('<div />').addClass('modal modal--full').attr('id', 'newTemplateOverlay'),
      close = $('<div></div>').addClass('modal__close').click(function() {newOverlayClose(overlay, scrollPosition)}),
      template = $('<div />').addClass('new-template'),
      titleField = $('<input type="text" required />').addClass('js-required is-required input__field_style_dark').attr('id', 'templateNameField'),
      itemElements = $('#postItems .post-item__wrapper'), //get items that user past into blog page
      items = itemElements.map(function(index, el) {
        return postItems.filter(function(item) {return item.type === $(el).attr('data-type')})[0]
      }).get(),
      controls = $('<div />').addClass('modal__controls modal__controls--bottom'),
      saveButton = $('<button disabled />').addClass('button button_style_fill-accent disabled').attr('id', 'saveTemplate').text('Create Template').click(function() {saveTemplateClick(overlay, scrollPosition);}),
      cancelButton = $('<button />').addClass('button button_style_outline-white').text('Cancel').click(function() {newOverlayClose(overlay, scrollPosition)});

  template.append(titleField, renderTemplateItemList(items));
  new Textfield(titleField.get(0), {
    label: 'Template Name',
    onInput: handleTemplateNameFieldInput,
    errMsg: 'Please fill the template name'
  });

  $(document).on('keydown', function(e) {postDocumentKeydown(e, overlay, scrollPosition);});
  $('body').append(overlay.append(close, template, controls.append(saveButton, cancelButton)));
  $('#wrapper').addClass('overflow');
}

//
// Store functions
//
function getTemplates() {
  if (window.localStorage.getItem('templates')) {
    return JSON.parse(window.localStorage.getItem('templates'));
  }
  return false;
}
function addTemplate(template) {
  var templates = getTemplates() || [];
  templates.push(template);
  window.localStorage.setItem('templates', JSON.stringify(templates));
}
function getTemplate(id) {
  return getTemplates() ? getTemplates().filter(function(t) {return t.id === id})[0] : false;
}
function removeTemplate(id) {
  var newTemplates = getTemplates().filter(function(t) {return t.id !== id});
  if (newTemplates.length > 0) {
    window.localStorage.setItem('templates', JSON.stringify(newTemplates));
    return true;
  } else {
    window.localStorage.removeItem('templates');
    return true;
  }
  return false;
}
function checkTemplateName(name) {
  return getTemplates() ? getTemplates().filter(function(t) {return t.title === name;}).lenght > 0 : false;
}

//
// Renders
//
function renderTemplateItemList(items) {
  var list = $('<div />').addClass('nt__list').attr('id', 'newTemplateItems');
  items.forEach(function(item) {
    list.append(renderTemplateItem(item));
  });
  return list;
}
function renderTemplateItem(item) {
  var itemEl = $('<div />').addClass('nt-item is-selected').attr('data-type', item.type).click(handleTemplateItemClick),
      checkmark = $('<div />').addClass('nt-item__checkmark'),
      title = $('<div />').addClass('nt-item__title').append($('<i />').addClass('nt-item__icon ' + item.iconClass), $('<span />').text(' ' + item.title));

  return itemEl.append(checkmark, title);
}

//
// Handlers
//
function handleTemplateItemClick(e) {
  var target = $(e.target).hasClass('nt-item') ? $(e.target) : $(e.target).parents('.nt-item');
  target.toggleClass('is-selected');
  checkTemplateItems();
}
function saveTemplateClick(overflow, scrollPosition) {
  var name = $('#templateNameField').val(),
      selectedItems = $('#newTemplateItems .nt-item.is-selected'),
      templateItems = selectedItems.map(function(index, el) {
        return postItems.filter(function(item) {return item.type === $(el).attr('data-type')})[0]
      }).get()

  addTemplate({
    title: name,
    type: 'template',
    items: templateItems,
    id: Date.now()
  });
  newOverlayClose(overlay, scrollPosition);
  showNotification('New template "' + name + '" was saved.')
}

function handleTemplateNameFieldInput(e) {
  if ($(e.target).val() !== '') {
    $('#saveTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#saveTemplate').addClass('disabled').prop('disabled', true);
  }
}

//
// Helpers
//
//Check if there are selected templates items on a overlay and change ui accordingly
function checkTemplateItems() {
  if ($('#newTemplateItems .nt-item.is-selected').length > 0 && $('#templateNameField').val() !== '') {
    $('#saveTemplate').removeClass('disabled').prop('disabled', false);
  } else {
    $('#saveTemplate').addClass('disabled').prop('disabled', true);
  }
}

/*------------------------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------- COMMON -------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------------------------------------*/


function newOverlayClose(overlay, scrollPosition) {
  overlay.remove();
  $(document).off('keydown');
  $('#wrapper').removeClass('overflow');
  if (scrollPosition) {
    $('body').scrollTop(scrollPosition);
  }
}
function postDocumentKeydown(e, overlay, scrollPosition) {
  if (e.keyCode === 27) {newOverlayClose(overlay, scrollPosition);}
}
