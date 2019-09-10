function openMenu(el, data) {

    var width = $(el).find('input').outerWidth(),
        height = $(el).height(),
        offset = $(el).offset(),
        documentHeight = $(document).height(),
        bottomspace = documentHeight - offset.top - height - 200,

        bottom = bottomspace > 0 ? true : false,

        //console.log(offset.top, height, documentHeight, bottom, (offset.top + height + 200 - documentHeight));

        dropdown = $('<div></div>')
                    .addClass('dropdown__menu')
                    .addClass(function() {return bottom ? 'dropdown__menu_bottom' : 'dropdown__menu_up';})
                    .css('width', width)
                    .css('height', function() {return bottom ? bottomspace + 200 : 300;})
                    .attr('id', 'dropdownList'),
        search = $('<input type="text" placeholder="Show, season, episode or event"/>').addClass('dropdown__search').on('input', function(e) {filterList(e, data);}),
        list = $('<div></div').addClass('dropdown__list'),
        listUl = $('<ul></ul>');

    if (data) {
        for (var i = 0; i < data.length; i++) {
            var item = $('<li></li>').text(data[i]).click(itemSelect);
            listUl.append(item);
        }
    }

    list.append(listUl);
    dropdown.append(search, list);
    $(el).append(dropdown);//.unbind('click').click(closeDropDown);
    search.focus();
    $('*')
        .not($(el))
        .not(dropdown)
        .not(search)
        .not(list)
        .not('.dropdown__list ul, .dropdown__list li')
        .on('click', closeDropDown);
    //el.unbind()
}

function closeDropDown(e) {
    $('*').unbind('click', closeDropDown);
    $('#dropdownList').parents('.dropdown').blur();
    $('#dropdownList').remove();
    //$('.dropdown').click(function(event) {openMenu(event.target, showList);});
}

function filterList(e, data) {
    var ul = $(e.target).parents('.dropdown').find('ul');
    ul.empty();
    filteredData = data;
    if ($(e.target).val()) {
        filteredData = data.filter(function(d) {
            console.log(d, $(e.target).val(), d.indexOf($(e.target).val()));
            return d.indexOf($(e.target).val()) > -1;
        });
    }
    console.log(filteredData, data, $(e.target).val());
    if (filteredData) {
        for (var i = 0; i < data.length; i++) {
            var item = $('<li></li>').text(data[i]).click(itemSelect);
            ul.append(item);
        }
    }
}
function itemSelect(e) {
    var dropdown = $(e.target).parents('.dropdown'),
        input = dropdown.find('input');
    input.val($(e.target).text());
    dataChanged = true;
}
