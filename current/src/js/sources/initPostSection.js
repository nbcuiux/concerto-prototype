function initPostList(el) {
  el.append(renderPostList());

  el.find('textarea').elastic();
  normilizeSection();
}

//Render
function renderPostList() {
  var list = $('<div />').addClass('sections-list'),
  addIcon = $('<i class="fa fa-plus-circle" />'),
  addText = $('<span> Add Section</span>'),
  addSection = $('<button />').addClass('button button_style_transparent-gray sections-list__add-section').click(handleAddSection).append(addIcon, addText),
  section = renderSection(1)

  list.sortable({
    items: '.list__section',
    placeholder: 'list__placeholder',
    start: function(e, ui) {
      ui.item.addClass('is-dragging');
      $(e.target).css('height', $(e.target).height());
      $('body').css('height', $('body').height());
    },
    stop: function(e, ui) {
      ui.item.removeClass('is-dragging');
      $(e.target).css('height', '');
      $('body').css('height', '');
    }
  });

  return list.append(section, addSection);
}

function renderSection(index, data) {
  var section = $('<div />').addClass('list__section'),
  sectionIndex = $('<div />').addClass('section__index').text('Blurb ' + index),
  sectionRemove = $('<div />').addClass('section__remove is-hidden').click(handleRemoveSection),
  sectionHandler = $('<div />').addClass('section__handler');

  return section.append(sectionHandler, sectionIndex, sectionRemove, renderSectionContent(index, data))
}

function renderSectionContent(index, data) {
  var content = $('<div />').addClass('section__content'),
  title = $('<input type="text" />'),
  description = $('<textarea />'),
  toggleLabel = $('<label>Media Type</label>').addClass('c-label c-label--top'),
  toggleItem1 = $('<li data-target="link" data-index="'+ index+ '">Embeded Link</li>').addClass('active').click(handleAssetToggle),
  toggleItem2 = $('<li data-target="file" data-index="'+ index+ '">Add / Upload</li>').click(handleAssetToggle)
  toggleGroup = $('<ul data-section=' + index + '></ul>').addClass('radioToggle').append(toggleItem1, toggleItem2),
  link = $('<input type="text"/>'),
  placeholder = $('<div />').addClass('section__placeholder').attr('data-name', 'File');

  content.append(title.wrap('<div class="controls__group"></div>').parent(), description.wrap('<div class="controls__group"></div>').parent(), toggleLabel.wrap('<div class="controls__group controls__group--asset-toggle"></div>').parent().append(toggleGroup), link.wrap('<div class="controls__group"  id="sectionLink' + index + '"></div>').parent(), placeholder.wrap('<div class="controls__group controls__group--placeholder hidden" id="sectionPlaceholder' + index + '"></div>').parent());

  var setionTitleInput = new Textfield(title.get(0), {
    label: 'Blurb Title'
  });
  var setionDescriptionInput = new Textfield(description.get(0), {
    label: 'Blurb Text'
  });
  description.elastic();

  var setionLinkInput = new Textfield(link.get(0), {
    label: 'Embeded Link',
    placeholder: 'http://'
  });

  placeholderControl = new ImagePlaceholder(placeholder.get(0), null, {alButton: 'Add File'})

  return content;
}


//Handler
function handleAddSection(e) {
  var index = $(e.target).parents('.sections-list').find('.list__section').length + 1;
  var section = renderSection(index);
  $(e.target).before(section);
  section.find('textarea').elastic();
  normilizeSection();
}

function handleRemoveSection(e) {
  $(e.target).parent('.list__section').remove();
  normilizeSection();
}
function normilizeSection() {
  var length = $('.list__section').length;
  if (length >= 2) {
    $('.section__remove').removeClass('is-hidden')
  } else {
    $('.section__remove').addClass('is-hidden')
  }
  $('.list__section').each(function(index, el) {
    $(el).find('.section__index').text('Blurb ' + Math.round(index + 1))
  })
}

function handleAssetToggle(e) {
  $(e.target).parent().children().removeClass('active');
  $(e.target).addClass('active');
  switch (e.target.dataset.target) {
    case 'link':
    $('#sectionLink'+ e.target.dataset.index).removeClass('hidden');
    $('#sectionPlaceholder'+ e.target.dataset.index).addClass('hidden');
    break;

    case 'file':
    $('#sectionLink'+ e.target.dataset.index).addClass('hidden');
    $('#sectionPlaceholder'+ e.target.dataset.index).removeClass('hidden');
    break;
  }
}
