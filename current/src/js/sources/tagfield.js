var actors = [
    'Adam Copeland',
    'Emily Rose',
    'Eric Balfour',
    'John Dunsworth',
    'Laura Mennell',
    'Lucas Bryant',
    'Richard Donat',
];

function focusTagField(e) {
    e.stopPropagation();
    var tagfield = $(e.target).hasClass('tagfield') ? $(e.target) : $(e.target).parents('tagfield'),
        input = tagfield.find('input'),
        span = tagfield.find('span'),
        menu = tagfield.find('.tagfield__menu');

    tagfield
        .addClass('tagfield_active')
        .unbind('click', focusTagField);

    if (tagfield.find('input').length === 0) {
        input = $('<input type="text" placeholder="type tag..."/>').addClass('tagfield__input').on('input focus', filterList);
        tagfield.append(input);}

    if (tagfield.find('.tagfield__menu').length === 0) {
        menu = $('<div></div>').addClass('tagfield__menu');
        var ul = $('<ul></ul>');

        actors.forEach(function(a) {
        ul.append($('<li></li>').text(a).click(handleTagMenuItemClick));
        });
        menu.append(ul);
        tagfield.append(menu);
    }

    span.addClass('hidden');
    input.focus();
    $('*')
        .not(tagfield)
        .not(menu)
        .not(input)
        .not('.tagfield__menu ul, .tagfield__menu li')
        .click(unfocusTagfield);
}
function handleTagMenuItemClick(e) {
    e.stopPropagation();
    console.log(e.target);
    var item = $(e.target),
        tagfield = item.parents('.tagfield'),
        input = tagfield.find('.tagfield__input'),
		tag = $('<div></div>').addClass('tag').text(item.text()),
		tagDelete = $('<div></div>').addClass('tag__delete').text('✕').on('click', deleteTag);

	tag.append(tagDelete);
	tag.insertBefore(input);
    input.focus();
    dataChanged = true;
}
function deleteTag(e) {
    e.stopPropagation();
    var tag = $(e.target).parents('.tag'),
        input = tag.parent().find('input');

    tag.remove();
    input.val('').focus();
}
function filterList(e) {
    var input = $(e.target),
        tagfield = input.parents('.tagfield'),
        ul = tagfield.find('ul');

    var filteredList = actors.filter(function(a) {
        return a.toLowerCase().indexOf(input.val()) >= 0;
    });
    ul.empty();
    filteredList.forEach(function(a) {
        ul.append($('<li></li>').text(a).click(handleTagMenuItemClick));
    });

    if (input.val().slice(-1) === ',') {
        var tag = $('<div></div>').addClass('tag').text(input.val().slice(0, -1)),
		    tagDelete = $('<div></div>').addClass('tag__delete').text('✕').on('click', deleteTag);

        input.val('');
        tag.append(tagDelete);
        tag.insertBefore(input);
        input.focus();
    }
}

function unfocusTagfield(e) {
    console.log(e);
    var tagfield = $('.tagfield'),
        input = tagfield.find('input'),
        span = tagfield.find('span'),
        menu = tagfield.find('.tagfield__menu'),
        tags = tagfield.find('.tag');

    tagfield.removeClass('tagfield_active').click(focusTagField);
    menu.remove();
    input.remove();

    if (tags.length === 0) {span.removeClass('hidden');}
    $('*').unbind('click', unfocusTagfield);
}
