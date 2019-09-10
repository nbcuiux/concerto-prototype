//;(function(window) {
    //'use strict';

    function ComplexSelectbox(el, options) {
        this.el = el;
        this.options = options;


        this._init();
        this._initEvents();
    }

    ComplexSelectbox.prototype._init = function() {
        this.customValue = "";
        this.activeItem = this.options.items.indexOf(this.options.selectedItem);
        this.options.unselect = this.options.unselect === true ? '— None —' : this.options.unselect;

        this.selectWrapper = document.createElement('div');
        this.selectWrapper.classList.add('select__wrapper');
        this.el.parentNode.insertBefore(this.selectWrapper, this.el);
        this.selectWrapper.appendChild(this.el);
        this.el.classList.remove('js-selectbox');
        this.el.classList.add('selectbox__field', 'selectbox__field--complex');


        if (this.activeItem >= 0) {
            this.el.classList.add('selectbox_state_not-empty', 'js-hasValue');
            this.el.innerHTML = this.options.items[this.activeItem];
            this._toggleAddable();
        }

        if (this.options.label) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.options.label;
            this.label.classList.add('selectbox__label');
            this.label.for = this.el.id;
            this.selectWrapper.appendChild(this.label);
        }
        if (this.options.helpText) {
            this.helpText = document.createElement('div');
            this.helpText.innerHTML = this.options.helpText;
            this.helpText.classList.add('selectbox__help-text');
            this.selectWrapper.appendChild(this.helpText);
        }
        if (this.options.errMsg) {
            this.errMsg = document.createElement('div');
            this.errMsg.innerHTML = this.options.errMsg;
            this.errMsg.classList.add('selectbox__err-msg');
            this.selectWrapper.appendChild(this.errMsg);
        }
    };

    ComplexSelectbox.prototype._initEvents = function() {
        var self = this;

        //Close list helper
        function closeList() {
            var inputValue;
            self.el.classList.remove('selectbox_state_open');
            if (self.list) {
                self.selectWrapper.removeChild(self.list);
                self.list = undefined;
            }
            if (self.searchField && self.searchField.parentNode === self.el) {
                inputValue = self.searchField.value;
                self.el.removeChild(self.searchField);
            }
            if (self.inputField && self.inputField.parentNode === self.el) {
                inputValue = self.inputField.value;
                self.el.removeChild(self.inputField);
            }
            if (self.activeItem >= 0) {
                self.el.innerHTML = self.options.items[self.activeItem];
            }
            else if (self.options.allowCustom === true) {
                self.el.innerHTML = self.customValue;
            }
            else {
                self.el.innerHTML = '';
            }
            document.removeEventListener('mousedown', handleSelectDocClick);
        }

        //Create list helper
        function createList(items, activeItem, searchText) {
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
            }

            self.list = document.createElement('ul');
            self.list.classList.add('selectbox__list');

            function listItem(item, index) {
                var itemClass = self.options.complexItems ? 'selectbox__list-item selectbox__list-item--complex' : 'selectbox__list-item selectbox__list-item--text',
                    itemElement = $('<li></li>').addClass(itemClass).text(item),
                    listHelper = $('<div></div>')
                                    .addClass('selectbox__list-item')
                                    .css('position', 'absolute')
                                    .css('z-index', '-1')
                                    .css('opacity', 0)
                                    .css('pointer-events', 'none')
                                    .css('overflow', 'visible')
                                    .css('white-space', 'nowrap')
                                    .text(item);

                self.selectWrapper.appendChild(listHelper.get(0));

                if (index > -1) {
                    itemElement.attr('data-index', index);
                }

                if (self.options.complexItems) {
                    itemElement.get(0).innerHTML = item;
                }

                if (searchText && !self.options.complexItems) {
                    itemElement.get(0).innerHTML = listItemText(item, searchText, $(self.list).width() < listHelper.width());
                }

                itemElement.on('mousedown', handleItemClick);
                itemElement.on('mouseover', handleItemMouseOver);

                listHelper.remove();
                return itemElement;
            }
            function listItemText(itemString, text, long) {
                var outputString = itemString;
                if (long) {
                    var words = itemString.split(' '),
                        searchIndex = words.reduce(function(currentIndex, word, index) {
                            outputString = word.toLowerCase().indexOf(text) > -1 && currentIndex === -1 ? index : currentIndex;
                        }, -1);

                    if (searchIndex >= 3) {
                        var stringEnd = words.slice(searchIndex).reduce(function(str, word) {
                            return str + ' ' + word;
                        });
                        var reg = /\.$/;
                        if (words[0].match(reg)) {
                            outputString = words[0] + ' ' + words[1] + ' ... ' + stringEnd;
                        } else {
                            outputString = words[0] + ' ... ' + stringEnd;
                        }
                    }
                }

                var startTextIndex = outputString.toLowerCase().indexOf(text.toLowerCase()),
                    endTextIndex = startTextIndex + text.length,
                    start = outputString.slice(0, startTextIndex),
                    middle = outputString.slice(startTextIndex, endTextIndex),
                    end = outputString.slice(endTextIndex),
                    item = document.createElement('div');

                item.appendChild(document.createTextNode(start));
                item.appendChild($('<span></span>').addClass('selectbox__list-highlight').text(middle).get(0));
                item.appendChild(document.createTextNode(end));

                return item.innerHTML;

            }
            function divider() {
                return $('<li></li>').addClass('selectbox__list-divider');
            }

            self.selectWrapper.appendChild(self.list);

            if (self.options.unselect && !searchText) {
                var newItem = listItem(self.options.unselect).addClass('is-hightlighted selectbox__list-unselect');
                self.list.appendChild(newItem.get(0));
                self.list.appendChild(divider().get(0));
            }

            items.forEach(function(item, i) {
                var newItem = listItem(item, self.options.items.indexOf(item));

                if (i === 0 && self.list.children.length === 0) {
                    newItem.addClass('is-hightlighted');
                }
                if (activeItem === i) {
                    newItem.addClass('is-active');
                }

                self.list.appendChild(newItem.get(0));
            });

            var fieldRect = self.el.getBoundingClientRect(),
                fieldOffsetTop = self.el.offsetTop,
                windowHeight = window.innerHeight,
                menuRect = self.list.getBoundingClientRect(),

                heightCheck = windowHeight - fieldRect.top - fieldRect.height - menuRect.height;

            self.list.style.top = heightCheck > 0 ? fieldOffsetTop + fieldRect.height + 5 + 'px' : fieldOffsetTop - menuRect.height - 10 + 'px';
        }

        function selectItem(item) {
            if (self.options.unselect && item.innerHTML === self.options.unselect) {
                self.activeItem = -1;
                self.el.classList.remove('selectbox_state_not-empty', 'js-hasValue');
            }
            else {
                self.activeItem = item.dataset.index;
                self.el.classList.add('selectbox_state_not-empty', 'js-hasValue');
            }
            self._toggleAddable();
            closeList();
            normalizeRequiredCount();
            if (self.options.itemCallback) {
                self.options.itemCallback(item, self);
            }
        }

        //Select click
        function handleSelectClick(e) {
            if (self.list) {
                closeList();
                if (!self.activeItem) {
                    self.el.innerHTML = '';
                }
            } else {

                if (self.options.items) {
                    //Check if there is any selected item. If not set the placeholder text
                    if (self.activeItem < 0) {
                        self.el.innerHTML = self.placeholder || 'Select';
                    }

                    //Check if search option is on or there is more than 10 items. If yes, add searcfield
                    if (self.options.search || self.options.items.length > 7) {
                        if (!self.searchField) {
                            self.searchField = document.createElement('input');
                            self.searchField.type = 'text';
                            self.searchField.classList.add('selectbox__searchfield');
                            self.searchField.placeholder = '';
                            self.searchField.addEventListener('input', handleSearchFieldInput);
                            self.searchField.addEventListener('keydown', handleKeyDown);
                            self.searchField.addEventListener('keyup', handleKeyUp);
                        } else {
                            self.el.addEventListener('keyup', handleKeyUp);
                            self.el.addEventListener('keyup', handleKeyUp);
                        }
                        self.el.innerHTML = '';
                        self.el.appendChild(self.searchField);2

                        if (self.activeItem >= 0) {
                            console.log("The active item", self.options.items[self.activeItem]);
                            self.searchField.value = self.options.items[self.activeItem].nodeValue;
                        }

                        else if (self.options.allowCustom) {
                            self.searchField.value = self.customValue;
                        }
                        else {
                            self.searchField.value = "";
                        }
                        self.searchField.focus();
                    } else {
                        self.inputField = document.createElement('input');
                        self.inputField.type = 'text';
                        self.inputField.style.opacity = 0;
                        self.inputField.style.position = 'absolute';
                        //self.searchField.addEventListener('input', handleSearchFieldInput);
                        self.inputField.addEventListener('keydown', handleKeyDown);
                        self.inputField.addEventListener('keyup', handleKeyUp);
                        self.el.appendChild(self.inputField);
                        self.inputField.focus();
                    }
                    self.el.classList.add('selectbox_state_open');
                    //createList(self.options.items, self.activeItem);
                    window.setTimeout(function(){document.addEventListener('mousedown', handleSelectDocClick);}, 100);
                }
            }
        }
        //Select item handler
        function handleItemClick(e) {
            e.stopPropagation();
            selectItem(e.target);
        }
        function handleItemMouseOver(e) {
            $(self.list).find('li').removeClass('is-hightlighted');
            $(e.target).addClass('is-hightlighted');
        }
        function handleSelectDocClick() {
            closeList();
        }

        //Fulter function for searcfield
        function handleSearchFieldInput(e) {
            var fItems = self.options.items.filter(function(i) {
                return i.toLowerCase().includes(e.target.value.toLowerCase());
            });
            createList(fItems, self.activeItem, e.target.value.toLowerCase());
        }

        function handleKeyUp(e) {
            // Records the custom value
            e.stopPropagation();
            self.customValue = self.searchField.value;
            console.log(self.customValue);
        }

        function handleKeyDown(e) {
            e.stopPropagation();
            var index, length;
            switch (e.keyCode) {
                case 13:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        selectItem(self.list.getElementsByClassName('is-hightlighted')[0]);
                    } else {
                        closeList();
                    }
                    break;

                case 27:
                    closeList();
                    break;

                case 38:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {

                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index > 0) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index - 1).addClass('is-hightlighted');

                            if (index < length - 1) {
                                if ($(self.list).find('li').eq(index + 1).position().top < 50) {
                                    $(self.list).animate({
                                        scrollTop: $(self.list).scrollTop() - $(self.list).height() > 0 ? $(self.list).scrollTop() - $(self.list).height() : 0
                                    }, 400);
                                }
                            }
                            if (index === 1) {
                                $(self.list).animate({
                                    scrollTop: 0
                                }, 400);
                            }
                        }
                    }
                    break;

                case 40:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        index = $(self.list).find('.is-hightlighted').index();
                        length = $(self.list).find('li').length;

                        if (index < length - 1) {
                            $(self.list).find('li').removeClass('is-hightlighted');
                            $(self.list).find('li').eq(index + 1).addClass('is-hightlighted');

                            if ($(self.list).height() < $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()) {
                                $(self.list).animate({
                                    scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index + 1).position().top +  $(self.list).find('li').eq(index + 1).outerHeight()
                                }, 400);
                            }
                        }
                        if (index === length) {
                            $(self.list).animate({
                                scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index).position().top + $(self.list).find('li').eq(index).height()
                            }, 400);
                        }
                    }
                    break;
            }
        }
        //Check if field is empty or not and change class accordingly
        $(self.el).on('click', handleSelectClick);
    };

    ComplexSelectbox.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    ComplexSelectbox.prototype.clear = function() {
        this.el.classList.remove('selectbox_state_not-empty', 'js-hasValue');
        this.el.innerHTML = '';
        this.activeItem = -1;
    };

    /*function initComplexSelectboxes() {
        [].slice.call(document.querySelectorAll('.js-complexComplexSelectbox')).forEach(function(el) {
            new ComplexSelectbox(el, {
                label: el.dataset.label,
                helpText: el.dataset.helpText,
                errMsg: el.dataset.errMsg,
                placeholder: el.dataset.placeholder,
                items: JSON.parse(el.dataset.items),
                search: el.dataset.search,
                searchPlaceholder:el.dataset.searchPlaceholder,
                required: el.dataset.required,
                selectedItem: el.dataset.selectedItem,
                unselect: el.dataset.unselect
            });
        });
    }

    initComplexSelectboxes();*/


//})(window);