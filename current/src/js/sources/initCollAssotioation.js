// data
//= data/data-association.js

function importSeries() {
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
        loadSeries();
    }
}

function loadSeries() {
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

function createPageSection(credit, section) {
    var addableRow = createPageRow({Link: ''});

    section.append(addableRow);
    addableObject = new Addable(addableRow);
    addableObject.removeItem(0);

    credit.forEach(function(c) {
        addableObject._addItem(createPageRow(c));
    });

    function createPageRow(c) {
        var creditRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
            roleWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            roleField = $('<input type="text"/>').addClass('input_style_light').val(c.role),
            namesField = $('<textarea></textarea>').addClass('input_style_light').val(c.names),
            namesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row');

        //namesField.elastic();
        roleWrapper.append(roleField);
        namesWrapper.append(namesField);
        creditRow.append(roleWrapper, namesWrapper);
        new Textfield(roleField.get(0), {
            label: 'Title',
            helpText: 'e.g Producer, Costume'
        });
    	new Textfield(namesField.get(0), {label: 'Name(s)'});
        $(namesWrapper).find('textarea').elastic();

        return creditRow;
    }
}

function initPageSection(section, data) {
    var addableRow = createPageLinkRow('');
    section.append(addableRow);
    addableObject = new Addable(addableRow);
}

function createPageLinkRow(link) {
    var pageRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),
        pageWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
        linkField = $('<input type="text"/>').addClass('input_style_light').val(link);

    pageWrapper.append(linkField);
    pageRow.append(pageWrapper);
    new Textfield(linkField.get(0), {
        label: 'Link',
        helpText: 'Fusce sodales finibus auctor. Nunc ipsum turpis, porttitor non sem id, luctus tincidunt diam.'
    });

    return pageRow;
}

function initSeriesSection(section) {
    function beforeAddSeries(el) {
        //Create selectbox
        var seriesSelectItem = new Selectbox(el.find('.js-selectbox.js-seriesSelect').get(0), {
            label: 'Series or Event',
            placeholder: 'Select Series or Event',
            items: dataSeries.sort(),
            unselect: '— None —'
        });

        var seasonSelectItem = new Selectbox(el.find('.js-selectbox.js-seasonSelect').get(0), {
            label: 'Season',
            placeholder: 'Select Season',
            items: dataSeasons.sort(function(a, b) {
                return a < b ? 1 : a > b ? -1 : 0;
            }),
            unselect: '— None —'
        });

        var episodeSelectItem = new Selectbox(el.find('.js-selectbox.js-episodeSelect').get(0), {
            label: 'Episode',
            placeholder: 'Select Episode',
            items: dataEpisodes.sort(function(a, b) {
                return a < b ? 1 : a > b ? -1 : 0;
            }),
            unselect: '— None —'
        });
    }

    function createEmptySeriesRow () {
        var seriesRow = $('<div></div>').addClass('cg__controls cg__controls_style_row'),

            seriesWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            seriesSelect = $('<div></div>').addClass('js-selectbox js-seriesSelect').css('min-width', '100px'),

            seasonWrapper = $('<div></div>').addClass('cg__control cg__control_style_row').css('max-width', 60),
            seasonSelect = $('<div></div>').addClass('js-selectbox js-seasonSelect'),

            episodeWrapper = $('<div></div>').addClass('cg__control cg__control_style_row'),
            episodeSelect = $('<div></div>').addClass('js-selectbox js-episodeSelect').css('min-width', '90px');

        seriesWrapper.append(seriesSelect);
        seasonWrapper.append(seasonSelect);
        episodeWrapper.append(episodeSelect);
        seriesRow.append(seriesWrapper, seasonWrapper, episodeWrapper);

        return seriesRow;
    }

    var seriesRow = createEmptySeriesRow();
    section.append(seriesRow);
    var addableObject = new Addable(seriesRow, {beforeAdd: beforeAddSeries});
    addableObject.removeItem(0);
    addableObject._addItem(createEmptySeriesRow(), beforeAddSeries);
    $(section).data("addable", addableObject);

    return addableObject;
}
