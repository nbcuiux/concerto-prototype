// data
//= data/data-cast.js
//= data/data-characters.js
//= data/data-persons.js

function initCreditSection(section) {
  //After we add a new cast row, we need to make initialization to make textfields and selectboxes work properly
  function beforeAddCredit(el) {
    if (el.find('input.js-input').get(0)) {
      new Textfield(el.find('input.js-input').get(0), {
        label: 'Title',
        helpText: 'e.g Producer, Costume'
      });
    }
    if (el.find('textarea.js-input').get(0)) {
      new Textfield(el.find('textarea.js-input').get(0), {label: 'Name(s)'});
    }
    el.find('textarea').elastic();
  }
  var addableRow = createCreditRow();

  section.append(addableRow);
  addableObject = new Addable(addableRow, {afterAdd: beforeAddCredit, sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(createCreditRow(), beforeAddCredit);
}

function createCreditRow(credit) {
  var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
  roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  roleField = $('<input type="text"/>').addClass('js-input input_style_light').val(credit ? credit.role : ''),
  namesField = $('<textarea></textarea>').addClass('js-input input_style_light').val(credit ? credit.names : ''),
  namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

  roleWrapper.append(roleField);
  namesWrapper.append(namesField);
  creditRow.append(roleWrapper, namesWrapper);

  return creditRow;
}

function initCastSection(section) {
  function beforeAddCast(el) {
    //Create selectbox
    var personSelectItem = new Selectbox(el.find('.js-selectbox').get(0), {
      label: 'Person',
      placeholder: 'Select person',
      items: persons.sort(),
      unselect: '— None —'
    });
    //Create Tagfield
    var characterTagfieldItem = new Tagfield(el.find('.js-tagfield').get(0), {
      label: 'Role(s)',
      placeholder: 'Role(s)',
      items: persons.concat(characters).sort(),
      createTags: false
    });
  }

  var castRow = createEmptyCastRow();
  section.append(castRow);
  var addableObject = new Addable(castRow, {beforeAdd: beforeAddCast, sortable: true});
  addableObject.removeItem(0);
  addableObject._addItem(createEmptyCastRow(), beforeAddCast);

  return addableObject;
}

function createEmptyCastRow () {
  var castRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
  personWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  personSelect = $('<div></div>').addClass('js-selectbox'),
  characterWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
  characterTagfield = $('<div></div>').addClass('js-tagfield'),
  asText = $('<span></span>').addClass('cast__textDivider').text('as');

  personWrapper.append(personSelect);
  characterWrapper.append(characterTagfield);
  castRow.append(personWrapper, asText, characterWrapper);

  return castRow;
}