//;(function(window) {
    //'use strict';

    var tagItems = [
        {
            tag: 'Adam Copeland',
            id: 0
        },
        {
            tag: 'Emily Rose',
            id: 1
        },
        {
            tag: 'Eric Balfour',
            id: 2
        },
        {
            tag: 'John Dunsworth',
            id: 3
        },
        {
            tag: 'Laura Mennell',
            id: 4
        },
        {
            tag: 'Lucas Bryant',
            id: 5
        },
        {
            tag: 'Richard Donat',
            id: 6
        }
    ];

    function DrupalTag(el, options, items) {
        this.el = $(el);
        this.options = options;
        console.log(options);
        this.itemsString = items; //Items string

        this._init();
        this._initEvents();
    }

    DrupalTag.prototype._init = function() {
        var self = this;

        this.wrapper = $('<div></div>').addClass('tagfield__wrapper').insertBefore(this.el).append(this.el);
        this.el.removeClass('js-tagfield').addClass('tagfield__field').text(this.items);

        if (this.options.label) {
            this.label = $('<div></div>').addClass('tagfield__label').text(this.options.label).attr('for', this.el.id);
            this.wrapper.append(this.label);
        }
        if (this.options.errMsg) {
            this.errMsg = $('<div></div>').addClass('tagfield__err-msg').text(this.options.label);
            this.wrapper.append(this.errMsg);
        }
        self._toggleAddable();
    };

    DrupalTag.prototype._initEvents = function() {
        var self = this;

        self.el.on('keydown', handleKeydown);

        //Close list helper
        function closeList() {
            self.list.remove();
            if (self.el.value === '') {
                self.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
            }
            document.removeEventListener('mousedown', handleDrupalTagDocClick);
            normalizeRequiredCount();
            self._toggleAddable();
        }

        //Create list helper
        function createList(items, activeItem, searchText) {
            function listItem(item, index) {
                var itemClass = 'selectbox__list-item selectbox__list-item--text',
                    itemElement = $('<li></li>').addClass(itemClass).text(item);

                if (index > -1) {
                    itemElement.attr('data-index', index);
                }
                itemElement.on('mousedown', handleItemClick);
                itemElement.on('mouseover', handleItemMouseOver);

                return itemElement;
            }

            if (self.list) {
                self.list.remove();
            }
            self.list = $('<ul></li>').addClass('tagfield__list');
            self.wrapper.append(self.list);

            items.forEach(function(item, i) {
                var newItem = listItem(item, self.options.items.indexOf(item));
                self.list.append(newItem);
            });

            var listRect = self.list.get(0).getBoundingClientRect();

            if (listRect.left + listRect.width > window.innerWidth) {
                self.list.get(0).style.right = 0;
            } else {
                self.list.get(0).style.left = 0;
            }

            var fieldRect = self.el.get(0).getBoundingClientRect(),
                fieldOffsetTop = self.el.get(0).offsetTop,
                windowHeight = window.innerHeight;

                heightCheck = windowHeight - fieldRect.top - fieldRect.height - listRect.height;

            self.list.get(0).style.top = heightCheck > 0 ? fieldOffsetTop + fieldRect.height + 5 + 'px' : fieldOffsetTop - listRect.height - 10 + 'px';

            window.setTimeout(function(){document.addEventListener('mousedown', handleDrupalTagDocClick);}, 100);
        }

        //Select item handler
        function selectTag(text) {
            console.log(text);
            var newTag = text,
                regexp = /\(\d{1,2}\)$/;
            if (!newTag.match(regexp)) {newTag += ' ('+ Math.round(10 + Math.random()*10) + ')';}
            regexp = /\ &/;
            if(!self.itemsString.match(regexp)) {self.itemsString += ' ';}
            if (self.itemsString.indexOf(text) === self.itemsString.length - text.length) {
                self.el.val(self.itemsString + ', ');
            } else {
                self.el.val(self.itemsString + self.options.items[index] + ', ');
            }


            self.itemsString = self.el.val();
            self.el.focus();
            self._toggleAddable();
            normalizeRequiredCount();
        }
        function handleItemClick(e) {
            //e.stopPropagation();
            selectTag(e.target.innerHTML);
        }
        function handleItemMouseOver(e) {
            self.list.find('li').removeClass('is-hightlighted');
            $(e.target).addClass('is-hightlighted');
        }
        function handleDrupalTagDocClick(e) {
            closeList();
        }

        function handleKeydown(e) {
            e.stopPropagation();
            var index, length,
                list = self.list ? self.list.get(0) : undefined;
            switch (e.keyCode) {
                case 13:
                    if (list && list.getElementsByClassName('is-hightlighted').length > 0) {
                        selectTag(self.list.find('.is-hightlighted').first().text());
                    }
                    break;

                case 27:
                    closeList();
                    self.el.blur();
                    break;

                case 38:
                    e.preventDefault();
                    if (list && list.getElementsByClassName('is-hightlighted').length > 0) {

                        index = self.list.find('.is-hightlighted').index();
                        length = self.list.find('li').length;

                        if (index > 0) {
                            self.list.find('li').removeClass('is-hightlighted');
                            self.list.find('li').eq(index - 1).addClass('is-hightlighted');

                            if (self.list.find('li').eq(index + 1).position().top < 50) {
                                self.list.animate({
                                    scrollTop: self.list.scrollTop() - self.list.height() > 0 ? self.list.scrollTop() - self.list.height() : 0
                                }, 400);
                            }
                            if (index === 1) {
                                self.list.animate({
                                    scrollTop: 0
                                }, 400);
                            }
                        }
                    }
                    break;

                case 40:
                    e.preventDefault();
                    if (self.list && self.list.get(0).getElementsByClassName('is-hightlighted').length > 0) {
                        index = self.list.find('.is-hightlighted').index();
                        length = self.list.find('li').length;

                        if (index < length - 1) {
                            self.list.find('li').removeClass('is-hightlighted');
                            self.list.find('li').eq(index + 1).addClass('is-hightlighted');

                            if (self.list.height() < self.list.find('li').eq(index + 1).position().top + self.list.find('li').eq(index + 1).outerHeight()) {
                                self.list.animate({
                                    scrollTop: self.list.scrollTop() + self.list.find('li').eq(index + 1).position().top + self.list.find('li').eq(index + 1).outerHeight()
                                }, 400);
                            }
                        }
                    }
                    break;
                case 8:
                    self.itemsString = e.target.value;
                    break;

                case 188:
                    var newTag = e.target.value.replace(', ', ',').split(',').pop().toLowerCase();
                    selectTag(newTag);
                    break;

                default:
                    var searchText = e.target.value.replace(', ', ',').split(',').pop().toLowerCase();
                    var fItems = self.options.items.filter(function(i) {
                        return i.toLowerCase().includes(searchText) && e.target.value.toLowerCase().indexOf(i.toLowerCase()) < 0;
                    });
                    createList(fItems, searchText);
            }
        }

        normalizeRequiredCount();
    };

    DrupalTag.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    DrupalTag.prototype.clear = function() {
        this.items = [];
        $(this.el).find('.tagfield__tag').remove();
        this.el.classList.remove('tagfield_state_not-empty', 'js-hasValue');
        this._toggleAddable();
    };
    DrupalTag.prototype.update = function() {
        if (this.items.length !== 0) {
            var tagString = this.items.reduce(function(prevString, item, i, array) {
                prevString += item.tag + ' (' + item.id + ')';
                if (i !== array.length - 1) {
                    prevString += ', ';
                }
                return prevString;
            }, '');
            this.el.val(tagString);
            self.el.addClass('tagfield_state_not-empty js-hasValue');

        } else {
            this.el.val('');
            self.el.removeClass('tagfield_state_not-empty js-hasValue');
        }
        self._toggleAddable();
        normalizeRequiredCount();
    };

    function initDrupalTags() {
        [].slice.call(document.querySelectorAll('.js-drupalTag')).forEach(function(el) {
            new DrupalTag(el, {
                label: el.dataset.label,
                errMsg: el.dataset.errMsg,
                items: JSON.parse(el.dataset.items)
            }, el.dataset.selectedItems || '');
        });
    }

    initDrupalTags();


//})(window);
