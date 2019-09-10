function initPageList(el) {
  el.append(renderPageList());

  el.find('textarea').elastic();
  normilizeSection();
}

//Render
function renderPageList() {
  var list = $('<div />').addClass('sections-list'),
      addIcon = $('<i class="fa fa-plus-circle" />'),
      addText = $('<span> Add Section</span>'),
      addSection = $('<button />').addClass('button button_style_transparent-gray sections-list__add-section').click(handleAddPageSection).append(addIcon, addText),
      section = renderPageSection(1)

  return list.append(section, addSection);
}

function renderPageSection(index, data) {
  var section = $('<div />').addClass('list__section'),
      sectionIndex = $('<div />').addClass('section__index').text('Blurb ' + index),
      sectionRemove = $('<div />').addClass('section__remove is-hidden').click(handleRemovePageSection),
      sectionHandler = $('<div />').addClass('section__handler');

  return section.append(sectionHandler, sectionIndex, sectionRemove, renderPageSectionContent(index, data))
}

function renderPageSectionContent(index, data) {
  var content = $('<div />').addClass('section__content'),
      title = $('<input type="text" />'),
      description = $('<textarea />');

  content.append(title.wrap('<div class="controls__group"></div>').parent(), description.wrap('<div class="controls__group"></div>').parent());

  var setionTitleInput = new Textfield(title.get(0), {
    label: 'Section Title'
  });
  var setionDescriptionInput = new Textfield(description.get(0), {
    label: 'Section Text'
  });
  description.elastic();

  return content;
}


//Handler
function handleAddPageSection(e) {
  var index = $(e.target).parents('.sections-list').find('.list__section').length + 1;
  var section = renderPageSection(index);
  $(e.target).before(section);
  section.find('textarea').elastic();
  normilizeSection();

}
function handleRemovePageSection(e) {
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
    $(el).find('.section__index').text('Section ' + Math.round(index + 1))
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
