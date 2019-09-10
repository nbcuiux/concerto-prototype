// data
//= data/data-cast.js
//= data/data-characters.js
//= data/data-persons.js

function importCast() {
    var creditSection = $('#creditSection'),
        castSection = $('#castSection'),
        seasonHasCast = creditSection.find('.js-hasValue').length > 0 || castSection.find('.js-hasValue').length > 0; //CHeck if credit section or cast section have filled fields or selectboxes or tagfields

    if (seasonHasCast) {
        new Modal({
            title: 'Import Cast & Credit?',
            text: 'The new Cast & Credit will overwrite and replace the existing Cast & Credit information. Are you sure you would like to import?',
            confirmText: 'Import',
            confirmAction: loadCast,
            dialog: true
        });
    } else {
        loadCast();
    }
}

function loadCast() {
    var castSection = $('#castSection'),
        castSectionBody = castSection.find('.controls__group'),
        creditSection = $('#creditSection'),
        creditSectionBody = creditSection.find('.controls__group'),
        cast = castAndCredit.cast,
        credit = castAndCredit.credit;

    castSectionBody.empty();
    creditSectionBody.empty();

    createCastSection(cast, castSectionBody);
    createCreditSection(credit, creditSectionBody);

    hideCastImport();
}

function createCreditSection(credit, section) {
    var addableRow = createCreditRow({role: '', names: ''});
    function beforeAddCredit(el) {
        new Textfield(el.find('input.js-input').get(0), {
            label: 'Title',
            helpText: 'e.g Producer, Costume'
        });

        new Textfield(el.find('textarea.js-input').get(0), {label: 'Name(s)'});
        el.find('textarea').elastic();
    }

    section.append(addableRow);
    addableObject = new Addable(addableRow, {beforeAdd: beforeAddCredit, sortable: true});
    addableObject.removeItem(0);

    credit.forEach(function(c) {
        addableObject._addItem(createCreditRow(c));
    });

    function createCreditRow(c) {
        var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
            roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            roleField = $('<input type="text"/>').addClass('js-input input_style_light').val(c.role),
            namesField = $('<textarea></textarea>').addClass('js-input input_style_light').val(c.names).attr('rows', 1),
            namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

        //namesField.elastic();
        roleWrapper.append(roleField);
        namesWrapper.append(namesField);
        creditRow.append(roleWrapper, namesWrapper);

        return creditRow;
    }
}

function initCreditSection(section) {
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
        namesField = $('<textarea></textarea>').addClass('js-input input_style_light').val(credit ? credit.names : '').attr('rows', 1),
        namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

    roleWrapper.append(roleField);
    namesWrapper.append(namesField);
    creditRow.append(roleWrapper, namesWrapper);

    return creditRow;
}

function createCastSection(cast, section) {
    var addableObject = initCastSection(section);
    addableObject.removeItem(0);

    cast.forEach(function(c) {
        addableObject._addItem(createCastRow(c));
    });

    function createCastRow(c) {
        var castRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),

            personWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            personSelect = $('<div></div>').addClass('js-selectbox'),

            characterWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            characterTagfield = $('<div></div>').addClass('js-tagfield'),

            asText = $('<span></span>').addClass('cast__textDivider').text('as'),
            roles = persons.concat(characters).sort();

        personWrapper.append(personSelect);
        characterWrapper.append(characterTagfield);
        castRow.append(personWrapper, asText, characterWrapper);

        var personSelectItem = new Selectbox(personSelect.get(0), {
            label: 'Person',
            placeholder: 'Select person',
            items: persons.sort(),
            selectedItem: c.person,
            unselect: '— None —'
        });

        var characterTagfieldItem = new MultiSelectbox(characterTagfield.get(0), {
            label: 'Role(s)',
            items: roles,
            initialItems: c.role
        });

        return castRow;
    }
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
        var characterTagfieldItem = new MultiSelectbox(el.find('.js-tagfield').get(0), {
            label: 'Role(s)',
            items: persons.concat(characters).sort()
        });
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

    var castRow = createEmptyCastRow();
    section.append(castRow);
    var addableObject = new Addable(castRow, {beforeAdd: beforeAddCast, sortable: true});
    addableObject.removeItem(0);
    addableObject._addItem(createEmptyCastRow(), beforeAddCast);

    return addableObject;
}

function showCastImport() {
    $('#importCastSection').removeClass('hidden');
}
function hideCastImport() {
    $('#importCastSection').addClass('hidden');
}
