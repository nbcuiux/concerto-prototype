//;(function(window) {
    //'use strict';

    function MultiSelectbox(el, options) {
        this.el = el;
        this.options = options;

        this._init();
        this._initEvents();
    }

    MultiSelectbox.prototype._init = function() {
        var self = this;

        this.items = this.options.initialItems || [];

        this.multiSelectboxWrapper = document.createElement('div');
        this.multiSelectboxWrapper.classList.add('multi-selectbox__wrapper');
        this.el.parentNode.insertBefore(this.multiSelectboxWrapper, this.el);
        this.multiSelectboxWrapper.appendChild(this.el);
        this.el.classList.remove('js-multiSelectbox');
        this.el.classList.add('multi-selectbox__field');

        if (this.options.label) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.options.label;
            this.label.classList.add('multi-selectbox__label');
            this.label.for = this.el.id;
            this.multiSelectboxWrapper.appendChild(this.label);
        }
        if (this.options.errMsg) {
            this.errMsg = document.createElement('div');
            this.errMsg.innerHTML = 'Please fill out required field';
            this.errMsg.classList.add('multi-selectbox__err-msg');
            this.multiSelectboxWrapper.appendChild(this.errMsg);
        }

        if (this.items.length > 0) {
            self.el.classList.add('multi-selectbox_state_not-empty', 'js-hasValue');
            self.items.forEach(function(item) {
                self.el.appendChild(self._createTag(item));
            });
        } else {
            self.el.innerHTML = 'None';
        }
        self._toggleAddable();
    };

    MultiSelectbox.prototype._initEvents = function() {
        var self = this;

        //Close list helper
        function closeList() {
            self.el.classList.remove('multi-selectbox_state_open');
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
                self.list = undefined;
            }
            if (self.searchField) {
                self.el.removeChild(self.searchField);
            }
            if (self.helperField && self.helperField.parentNode === self.el) {
                self.el.removeChild(self.helperField);
            }
            if (self.el.getElementsByClassName('multi-selectbox__tag').length === 0) {
                self.el.classList.remove('multi-selectbox_state_not-empty', 'js-hasValue');
                self.el.innerHTML = 'None';
            }
            document.removeEventListener('mousedown', handleMultiSelectboxDocClick);
            normalizeRequiredCount();
            self._toggleAddable();
        }

        //Create list helper
        function createList(items, activeItem) {
            if (self.list) {
                self.list.parentNode.removeChild(self.list);
            }

            self.list = document.createElement('ul');
            self.list.classList.add('multi-selectbox__list');

            function listItem(item, index) {
                var itemClass = 'multi-selectbox__list-item multi-selectbox__list-item--text',
                    itemElement = $('<li></li>').addClass(itemClass).text(item);

                if (index > -1) {
                    itemElement.attr('data-index', index);
                } else {
                    itemElement.attr('data-index', -1);
                }

                itemElement.on('mousedown', handleItemClick);
                itemElement.on('mouseover', handleItemMouseOver);

                return itemElement;
            }
            function divider() {
                return $('<li></li>').addClass('multi-selectbox__list-divider');
            }

            var newItem = listItem('— None —', -1).addClass('is-hightlighted multi-selectbox__list-unselect');
            self.list.appendChild(newItem.get(0));
            self.list.appendChild(divider().get(0));

            items.forEach(function(item, i) {
                var newItem = listItem(item, self.options.items.indexOf(item));

                if (i === 0 && self.list.children.length === 0) {
                    newItem.addClass('is-hightlighted');
                }
                if (self.items.indexOf(item) > -1) {
                    newItem.addClass('is-active');
                }

                self.list.appendChild(newItem.get(0));
            });

            self.multiSelectboxWrapper.appendChild(self.list);

            var fieldRect = self.el.getBoundingClientRect(),
                fieldOffsetTop = self.el.offsetTop,
                windowHeight = window.innerHeight,
                menuRect = self.list.getBoundingClientRect(),

                heightCheck = windowHeight - fieldRect.top - fieldRect.height - menuRect.height;

            self.list.style.top = heightCheck > 0 ? fieldOffsetTop + fieldRect.height + 5 + 'px' : fieldOffsetTop - menuRect.height - 10 + 'px';
        }

        //Select click
        function handleMultiSelectboxClick(e) {
            if (self.list) {
                closeList();
            } else if (self.options.items) {
                self.helperField = document.createElement('input');
                self.helperField.type = 'text';
                self.helperField.classList.add('js-helperInput');
                self.helperField.style.opacity = 0;
                self.helperField.style.zIndex = -1;
                self.helperField.style.position = 'absolute';
                self.helperField.addEventListener('keydown', handleKeyDown);
                self.multiSelectboxWrapper.appendChild(self.helperField);
                self.helperField.focus();

                self.el.classList.add('multi-selectbox_state_open');
                createList(self.options.items, self.activeItem);
                window.setTimeout(function(){document.addEventListener('mousedown', handleMultiSelectboxDocClick);}, 100);
            }
        }
        //Select item handler
        function selectTag(el) {
            if (self.el.getElementsByClassName('multi-selectbox__tag').length === 0) {
                if (self.el.getElementsByClassName('multi-selectbox__searchfield').length === 1) {
                    self.el.innerHTML = '';
                    self.el.appendChild(self.searchField);
                } else if (self.el.getElementsByClassName('js-helperInput').length === 1) {
                    self.el.innerHTML = '';
                    self.el.appendChild(self.helperField);
                } else {
                    self.el.innerHTML = '';
                }
            }


            if (self.searchField) {
                self.el.insertBefore(self._createTag(el.innerHTML), self.searchField);
            } else {
                self.el.appendChild(self._createTag(el.innerHTML));
            }
            self.items.push(el.innerHTML);

            self.el.classList.add('multi-selectbox_state_not-empty', 'js-hasValue');

            if (self.searchField) {
                self.searchField.value = '';
                self.searchField.focus();
                createList(self.options.items);
            } else if (self.helperField) {
                self.helperField.value = '';
                self.helperField.focus();
                createList(self.options.items);
            }
            self._toggleAddable();
            normalizeRequiredCount();

            if (self.options.itemCallback) {
                self.options.itemCallback(el, self);
            }
        }
        function handleItemClick(e) {
            if (parseInt(e.target.dataset.index) === -1) {
                self.clear();
            } else {
                selectTag(e.target);
            }
            closeList();
        }
        function handleItemMouseOver(e) {
            $(self.list).find('li').removeClass('is-hightlighted');
            $(e.target).addClass('is-hightlighted');
        }
        function handleMultiSelectboxDocClick(e) {
            closeList();
        }

        //Fulter function for searcfield
        function handleSearchFieldInput(e) {
            var fItems = self.options.items.filter(function(i) {
                return i.toLowerCase().includes(e.target.value.toLowerCase());
            });
            createList(fItems, self.activeItem, e.target.value.toLowerCase());

            if (e.target.value.slice(-1) === ',' && self.options.createTags) {
                self.el.insertBefore(self._createTag(e.target.value.slice(0, -1)), self.searchField);
                self.el.classList.add('multi-selectbox_state_not-empty', 'js-hasValue');
                e.target.value = '';
                e.target.focus();
                createList(self.options.items);
                self._toggleAddable();
            }
        }

        function handleKeyDown(e) {
            e.stopPropagation();
            var index, length;
            switch (e.keyCode) {
                case 13:
                    if (self.list && self.list.getElementsByClassName('is-hightlighted').length > 0) {
                        selectTag(self.list.getElementsByClassName('is-hightlighted')[0]);
                        closeList();
                    } else if (e.target.value !== '' && self.options.createTags) {
                        self.el.insertBefore(self._createTag(e.target.value), self.searchField);
                        e.target.value = '';
                        e.target.focus();
                        createList(self.options.items);
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

                            if ($(self.list).find('li').eq(index + 1).position().top < 50) {
                                $(self.list).animate({
                                    scrollTop: $(self.list).scrollTop() - $(self.list).height() > 0 ? $(self.list).scrollTop() - $(self.list).height() : 0
                                }, 400);
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
                                    scrollTop: $(self.list).scrollTop() + $(self.list).find('li').eq(index + 1).position().top + $(self.list).find('li').eq(index + 1).outerHeight()
                                }, 400);
                            }
                        }
                    }
                    break;
            }
        }

        //Delete tag handle
        function handleDeleteTag(e) {
            e.stopPropagation();
            var tag = e.target.parentNode;

            tag.removeChild(e.target);
            var tagTitle = tag.innerHTML,
                tagIndex = self.items.indexOf(tagTitle);
            if (tagIndex > -1) {
                self.items = [].concat(self.items.slice(0, tagIndex), self.items.slice(tagIndex + 1));
            }

            self.el.removeChild(tag);

            if (self.el.getElementsByClassName('multi-selectbox__tag').length === 0) {
                self.el.classList.remove('multi-selectbox_state_not-empty', 'js-hasValue');
                if (self.el.classList.contains('multi-selectbox_state_open')) {
                    self.el.innerHTML = self.options.placefolder || 'Select from the list';
                }
            }
            self._toggleAddable();


        }

        //Check if field is empty or not and change class accordingly
        $(this.multiSelectboxWrapper).on('click', '.multi-selectbox__field', handleMultiSelectboxClick);
        normalizeRequiredCount();

    };

    //Autoresize textarea
    MultiSelectbox.prototype._autosize = function() {
        if (this.el.value === '') {this.el.rows = 1;}
        else {
            var width = this.el.getBoundingClientRect().width,
                span = document.createElement('span'),
                textWidth = this.el.value.length * 7,
                row = Math.ceil(textWidth / width);

            row = row <= 0 ? 1 : row;
            row = this.options.maxHeight && row > this.options.maxHeight ? this.options.maxHeight : row;

            this.el.rows = row;
        }
    };

    //Create Tag Helper
    MultiSelectbox.prototype._createTag = function(tagName) {
        var self = this;
        var tag = document.createElement('div'),
            delTag = document.createElement('div');

        tag.classList.add('multi-selectbox__tag');
        tag.innerHTML = tagName;

        delTag.classList.add('multi-selectbox__tag-delete');
        delTag.innerHTML = '✕';
        delTag.addEventListener('click', function(e) {
            e.stopPropagation();
            self._deleteTag(e.target.parentNode);
        });

        tag.appendChild(delTag);

        return tag;
    };

    MultiSelectbox.prototype._deleteTag = function(tag) {
        this.el.removeChild(tag);

        $(tag).find('.multi-selectbox__tag-delete').remove();
        var tagTitle = tag.innerHTML,
            tagIndex = this.items.indexOf(tagTitle);
        if (tagIndex > -1) {
            this.items = [].concat(this.items.slice(0, tagIndex), this.items.slice(tagIndex + 1));
        }

        if (this.el.getElementsByClassName('multi-selectbox__tag').length === 0) {
            this.el.classList.remove('multi-selectbox_state_not-empty', 'js-hasValue');
            this.el.innerHTML = 'None';
        }
        this._toggleAddable();

        if (this.options.deleteTagCallback) {
            this.options.deleteTagCallback(tag, this);
        }
    };
    MultiSelectbox.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    MultiSelectbox.prototype.clear = function() {
        this.items = [];
        $(this.el).find('.multi-selectbox__tag').remove();
        this.el.classList.remove('multi-selectbox_state_not-empty', 'js-hasValue');
        this._toggleAddable();
    };

    function initMultiSelectboxs() {
        [].slice.call(document.querySelectorAll('.js-multiSelectbox')).forEach(function(el) {
            new MultiSelectbox(el, {
                label: el.dataset.label,
                helpText: el.dataset.helpText,
                errMsg: el.dataset.errMsg,
                placeholder: el.dataset.placeholder,
                items: JSON.parse(el.dataset.items),
                search: el.dataset.search,
                searchPlaceholder: el.dataset.searchPlaceholder,
                initialItems: el.dataset.selectedItems ? JSON.parse(el.dataset.selectedItems) : ''
            });
        });
    }

    initMultiSelectboxs();


//})(window);
