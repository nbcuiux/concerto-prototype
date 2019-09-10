//Data
//= data/data-content.js
//= data/data-content-2.js

function Store(data, filters, sorting, pageItems, page) {
    this.data = data || [];
    this.filters = filters || [];
    this.sorting = sorting || {id: 'updateDate', direction: 'descending'};
    this.pageItems = pageItems || 10;
    this.page = page || 0;
    this.mainRender = undefined;

}

Store.prototype.setFilters = function(filters) {
    this.filters = filters;
};
Store.prototype.setData = function(data) {
    this.data = data;
};
Store.prototype.setSorting = function(sorting) {
    this.sorting = sorting;
};
Store.prototype.setItemsPerPage = function(pageItems) {
    this.pageItems = pageItems;
};
Store.prototype.setPage = function(page) {
    this.page = parseInt(page);
};
Store.prototype.content = function() {
    return contentPage(sortContent(filterContent(this.data, this.filters), this.sorting), this.pageItems, this.page);
};
Store.prototype.pagesNumber = function() {
    return Math.ceil(filterContent(this.data, this.filters).length / this.pageItems);
};
Store.prototype.setHeaderRender = function(render) {
    self.headerRender = render;
};
Store.prototype.setRowRender = function(render) {
    self.rowRender = render;
};
Store.prototype.setMainRender = function(render) {
    self.mainRender = render;
};
Store.prototype.setElement = function(element) {
    self.el = element;
};
Store.prototype.update = function() {
    var self = this;
    self.mainRender(self.el, self, self.headerRender, self.rowRender);
};

function filterContent(data, filters) {
    if (filters && filters.length > 0) {
        return filters.reduce(function(currentData, filter) {
            return currentData.filter(function(d) {
                return filterData(d, filter);
            });
        }, data);
    }
    else {
        return data;
    }
}

function filterData(item, filter) {
    switch (filter.id) {
        case 'tags':
            return filter.value.reduce(function(currentValue, v) {
                if (!currentValue) {
                    return currentValue;
                } else {
                    if (item[filter.id]) {
                        return item[filter.id].indexOf(v) > -1;
                    } else {
                        return false;
                    }
                }
            }, true);

        case 'categories':
            return filter.value.reduce(function(currentValue, v) {
                if (!currentValue) {
                    return currentValue;
                } else {
                    if (item[filter.id]) {
                        return item[filter.id].indexOf(v) > -1;
                    } else {
                        return false;
                    }
                }
            }, true);

        /*case 'status':
            return filter.value.reduce(function(currentValue, v) {
                if (!currentValue) {
                    return currentValue;
                } else {
                    if (item[filter.id]) {
                        return item[filter.id].indexOf(v) > -1;
                    } else {
                        return false;
                    }
                }
            }, true);*/

        case 'other':
            return filter.value.reduce(function(currentValue, v) {
                if (!currentValue) {
                    return currentValue;
                } else {
                    switch (v) {
                        case 'Created by Me':
                            return item.createdName === 'Devon Norris';

                        case 'Published':
                            return item.status === 'Published';

                        case 'Not published':
                            return item.status === 'Not published';
                    }
                }
            }, true);

        default:
            return item[filter.id] ? item[filter.id].toString().toLowerCase() === filter.value.toLowerCase() : false;
    }
}

function contentPage(content, itemsPerPage, page) {
    return content.slice(itemsPerPage * page, itemsPerPage * (page + 1));
}

function sortContent(content, sorting) {
    if (sorting.id === 'categories' || sorting.id === 'tags') {
        switch (sorting.direction) {
            case 'ascending':
                return content.sort(function(a, b) {
                    if (a[sorting.id] && b[sorting.id]) {
                        return a[sorting.id].sort()[0] > b[sorting.id].sort()[0] ? 1 : a[sorting.id].sort()[0] < b[sorting.id].sort()[0] ? -1 : 0;
                    } else if (!a[sorting.id] && !b[sorting.id]) {
                        return 0;
                    } else {
                        return a[sorting.id] ? 1 : -1;
                    }
                });

            case 'descending':
            return content.sort(function(a, b) {
                if (a[sorting.id] && b[sorting.id]) {
                    return a[sorting.id].sort()[0] > b[sorting.id].sort()[0] ? -11 : a[sorting.id].sort()[0] < b[sorting.id].sort()[0] ? 1 : 0;
                } else if (!a[sorting.id] && !b[sorting.id]) {
                    return 0;
                } else {
                    return a[sorting.id] ? -1 : 1;
                }
            });

            default:
                return content;
        }
    }
    else {
        switch (sorting.direction) {
            case 'ascending':
                return content.sort(function(a, b) {
                    return a[sorting.id] > b[sorting.id] ? 1 : a[sorting.id] < b[sorting.id] ? -1 : 0;
                });

            case 'descending':
            return content.sort(function(a, b) {
                return a[sorting.id] > b[sorting.id] ? -1 : a[sorting.id] < b[sorting.id] ? +1 : 0;
            });

            default:
                return content;
        }
    }
}



//Render functions
function renderContent(element, store, headerRender, rowRender) {
    var firstItem = store.page * store.pageItems + 1,
        lastItem = (store.page + 1) * store.pageItems,
        itemsAmount = filterContent(store.data, store.filters).length;

    lastItem = lastItem > itemsAmount ? itemsAmount : lastItem;
    var itemsNumberString = firstItem.toString() + ' — ' + lastItem.toString() + ' of ' + itemsAmount;
    if (itemsAmount === 0) {itemsNumberString = '0';}
    var itemsTextString =  store.filters.length > 0 ? ' Results' : ' Total';
    $('#contentResults .content__results-number').text(itemsNumberString);
    $('#contentResults .content__results-text').text(itemsTextString);

    element.empty();
    var content = store.content();

    var table = $('<table></table>').addClass('library__table'),
        tableHeader = $('<thead></thead>').addClass('library__header'),
        tableBody = $('<tbody></tbody>').addClass('library__body').attr('id', 'libraryBody');

    if (itemsAmount > 0) {
        element.append(tableHeader.append(headerRender(store)));
    }

    content.forEach(function(data) {
        tableBody.append(rowRender(data));
    });

    element.append(table.append(tableHeader, tableBody));
}
function renderData(element, store, rowRender) {
    var firstItem = store.page * store.pageItems + 1,
        lastItem = (store.page + 1) * store.pageItems,
        itemsAmount = filterContent(store.data, store.filters).length;

    lastItem = lastItem > itemsAmount ? itemsAmount : lastItem;
    var itemsNumberString = firstItem.toString() + ' — ' + lastItem.toString() + ' of ' + itemsAmount;
    if (itemsAmount === 0) {itemsNumberString = '0';}
    var itemsTextString =  store.filters.length > 0 ? ' Results' : ' Total';
    $('#contentResults .content__results-number').text(itemsNumberString);
    $('#contentResults .content__results-text').text(itemsTextString);

    element.empty();
    var content = store.content();

    content.forEach(function(data) {
        element.append(rowRender(data));
    });
}
function renderContentHeaderRow(store) {
    var row = $('<tr></tr>').addClass('library__row library__row--header'),
        thumbnailCell = $('<div></div>').addClass('library__cell library__cell--header').text('Thumbnail'),
        titleCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'title')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Title')
                        .parent(),
        typeCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'type')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Type')
                        .parent(),
        statusCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'status')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Status')
                        .parent(),
        seriesCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'series')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Series / Event')
                        .parent(),
        seasonCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'season')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Season')
                        .parent(),
        episodeCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'episode')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Episode')
                        .parent(),
        updatedCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'updateDate')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Updated')
                        .parent(),
        createdCell = $('<th></th>').addClass('library__cell library__cell--header library__cell--sortable')
                        .attr('data-sort-id', 'createdDate')
                        .click(handleHeaderContentSorting)
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Created')
                        .parent(),
        categoriesCell = $('<th></th>').addClass('library__cell library__cell--header')
                        .attr('data-sort-id', 'categories')
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Categories')
                        .parent(),
        tagsCell = $('<th></th>').addClass('library__cell library__cell--header')
                        .attr('data-sort-id', 'tags')
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Tags')
                        .parent(),
        promosCell = $('<th></th>').addClass('library__cell library__cell--header')
                        .attr('data-sort-id', 'tags')
                        .append($('<span></span>').addClass('library__cell-header-text'))
                        .find('.library__cell-header-text')
                        .text('Promos')
                        .parent();

    row.append(thumbnailCell, titleCell, typeCell, statusCell, seriesCell, seasonCell, episodeCell, updatedCell, createdCell, categoriesCell, tagsCell, promosCell);
    row.find('.library__cell--header[data-sort-id="' + store.sorting.id + '"]').addClass('js-' + store.sorting.direction);

    return row;
}
function renderContentRow(data) {
    var row = $('<tr></tr>')
                .addClass('library__row library__row--content is-folded')
                .attr('data-target', 'create-' + data.type.toLowerCase() + '.html');

        timeOptions = {
            hour: 'numeric',
            minute: 'numeric'
        };

    //Thumbnail
    var thumbnailCell = $('<div></div>').addClass('library__cell');
    if (data.thumbnail) {
        var thumbnail = $('<div></div>').addClass('library__cell-thumbnail').css('background-image', 'url(' + data.thumbnail +')');
        thumbnailCell.append(thumbnail);
    }
    row.append(thumbnailCell);


    //Title
    var titleCell = $('<td></td>').addClass('library__cell'),
        titleLabel = $('<div></div>').addClass('library__cell-label').text('Title'),
        title = $('<div></div>').addClass('library__cell-value library__cell-value--title').text(data.title);
    row.append(titleCell.append(title));


    //Type
    var typeCell = $('<td></td>').addClass('library__cell'),
        typeLabel = $('<div></div>').addClass('library__cell-label').text('Type'),
        type = $('<div></div>').addClass('library__cell-value is-shortable').text(data.type);
    row.append(typeCell.append(type));


    //Status
    var statusCell = $('<td></td>').addClass('library__cell'),
        statusLabel = $('<div></div>').addClass('library__cell-label').text('Status'),
        status = $('<div></div>')
                    .addClass('library__cell-value')
                    .addClass(data.status.toLowerCase() === 'published' ? 'library__cell-value--published' : '')
                    .addClass(data.status.toLowerCase() === 'not published' ? 'library__cell-value--not-published' : '')
                    .text(data.status);
    row.append(statusCell.append(status));


    //Series
    var seriesCell = $('<div></div>').addClass('library__cell'),
        seriesLabel = $('<div></div>').addClass('library__cell-label').text('Series / Event'),
        series = $('<div></div>').addClass('library__cell-value').text(data.series || '--');
    if (!data.series) {seriesCell.addClass('is-empty');}
    row.append(seriesCell.append(series));


    //Season
    var seasonCell = $('<div></div>').addClass('library__cell'),
        seasonLabel = $('<div></div>').addClass('library__cell-label').text('Season'),
        season = $('<div></div>').addClass('library__cell-value').text(data.season || '--');
    if (!data.season) {seasonCell.addClass('is-empty');}
    row.append(seasonCell.append(seasonLabel, season));


    //Episode
    var episodeCell = $('<div></div>').addClass('library__cell'),
        episodeLabel = $('<div></div>').addClass('library__cell-label').text('Episode'),
        episode = $('<div></div>').addClass('library__cell-value').text(data.episode || '--');
    if (!data.episode) {episodeCell.addClass('is-empty');}
    row.append(episodeCell.append(episodeLabel, episode));


    //Update
    var updateCell = $('<div></div>').addClass('library__cell'),
        updateLabel = $('<div></div>').addClass('library__cell-label').text('Updated'),
        updateValue = $('<div></div>').addClass('library__cell-value'),
        updateDate = $('<div></div>').addClass('library__value-date')
                                     .text(data.updateDate.toLocaleDateString('en-US') + ' ' + data.updateDate.toLocaleTimeString('en-US', timeOptions));
        updateName = $('<div></div>').addClass('library__value-name').text('by ' + data.updateName);
    updateValue.append(updateDate, updateName);
    row.append(updateCell.append(updateValue));


    //Create
    var createCell = $('<div></div>').addClass('library__cell'),
        createLabel = $('<div></div>').addClass('library__cell-label').text('Created'),
        createdValue = $('<div></div>').addClass('library__cell-value'),
        createDate = $('<div></div>').addClass('library__value-date')
                                     .text(data.createdDate.toLocaleDateString('en-US') + ' ' + data.createdDate.toLocaleTimeString('en-US', timeOptions));
        createName = $('<div></div>').addClass('library__value-name').text('by ' + data.createdName);
    createdValue.append(createDate, createName);
    row.append(createCell.append(createLabel, createdValue));


    //Categories
    var categoriesCell = $('<div></div>').addClass('library__cell is-empty'),
        categoriesLabel = $('<div></div>').addClass('library__cell-label').text('Categories'),
        catRegExp = /,/g,
        categories = $('<div></div>').addClass('library__cell-value').text(data.categories ? data.categories.toString().replace(catRegExp, ', ') : '--');
    categoriesCell.append(categoriesLabel, categories);
    categoriesCell.removeClass('is-empty');
    row.append(categoriesCell);

    //Tags
    var tagsCell = $('<div></div>').addClass('library__cell is-empty');
    var tagsLabel = $('<div></div>').addClass('library__cell-label').text('Tags'),
        tagRegExp = /,/g,
        tags = $('<div></div>').addClass('library__cell-value').text(data.tags ? data.tags.toString().replace(tagRegExp, ', ') : '--');
    tagsCell.append(tagsLabel, tags);
    tagsCell.removeClass('is-empty');
    row.append(tagsCell);


    //PRomos
    var promosCell = $('<div></div>').addClass('library__cell'),
        promosLabel = $('<div></div>').addClass('library__cell-label').text('Promos'),
        promos = $('<div></div>').addClass('library__cell-value').text(data.promos || '--');
    if (!data.promos) {promosCell.addClass('is-empty');}
    row.append(promosCell.append(promosLabel, promos));


    //Edit button
    var rowEdit = $('<div></div>')
                    .addClass('library__row-edit')
                    .click(function(e) {
                        window.location.href = $(e.target).parents('.library__row--content').attr('data-target');
                    });
    row.append(rowEdit);

    //Row End
    var rowEnd = $('<div></div>').addClass('library__row-end').click(function(e) {
        $(e.target).parent().toggleClass('is-folded');
    });
    row.append(rowEnd);

    return row;
}


//Store init
var store = new Store(content);
var collectionStore = new Store(collections);


//UI Actions
function handleHeaderContentSorting(e) {
    var id = e.target.dataset.sortId,
        direction = $(e.target).hasClass('js-ascending') ? 'descending' : 'ascending';

    if (id === 'updateDate' || id === 'createdDate') {
        direction = $(e.target).hasClass('js-descending') ? 'ascending' : 'descending';
    }
    if ($(e.target).hasClass('js-descending') || $(e.target).hasClass('js-ascending')) {
        $(e.target).toggleClass('js-ascending js-descending');
    } else {
        $('.js-ascending, .js-descending').removeClass('js-ascending js-descending');
        $(e.target).addClass('js-' + direction);
    }

    setContentSorting({id: id, direction: direction});
}
function setContentSorting(sorting) {
    store.setSorting(sorting);
    renderData($('#libraryBody'), store, renderContentRow);
    //renderContent($('#contentLibrary'), store, renderContentHeaderRow, renderContentRow);
}
