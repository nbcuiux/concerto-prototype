//;(function(window) {
//    'use strict';

    function Textfield(el, options) {
        this.el = el;
        this.options = options;

        this._init();
        this._initEvents();
    }

    Textfield.prototype._init = function() {
        var self = this;
        this.el.placeholder = '';

        this.fieldWrapper = document.createElement('div');
        this.fieldWrapper.classList.add('input__wrapper');
        this.el.parentNode.insertBefore(this.fieldWrapper, this.el);
        this.fieldWrapper.appendChild(this.el);
        this.el.classList.remove('js-input');
        this.el.classList.add('input__field');

        if (this.el.value !== '') {
            this.el.classList.add('input_state_not-empty', 'js-hasValue');
            normalizeRequiredCount();
            this._toggleAddable();
        }

        if (this.el.type === 'textarea') {
            this.el.row = this.el.row || 3;
            $(this.el).elastic();
        }
        if (this.el.classList.contains('js-datepicker')) {
            var id = 'datePicker' + Math.round(Math.random()*10000);
            this.el.id = id;
            $(this.el).datepicker({
                onSelect: function() {
                    $('#' + id).addClass('input_state_not-empty js-hasValue');
                    self._toggleAddable();
                },
                changeMonth: true,
                changeYear: true
                /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
            });
        }


        if (this.el.id === 'startDate') {
            $(this.el).datepicker({
                onSelect: function(dateString, datepicker) {
                    $('#startDate').addClass('input_state_not-empty js-hasValue');
                    startDate = dateString;
                    self._toggleAddable();
                },
                changeMonth: true,
                changeYear: true
                /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
            });
        }
        if (this.el.id === 'endDate') {
            $(this.el).datepicker({
                onSelect: function(dateString, datepicker) {
                    $('#endDate').addClass('input_state_not-empty js-hasValue');
                    self._toggleAddable();
                },
                beforeShow: function(element, datepicker) {
                    $('#endDate').datepicker('option', 'defaultDate', startDate);
                },
                changeMonth: true,
                changeYear: true
                /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
            });
        }








        if (this.options.label) {
            this.label = document.createElement('label');
            this.label.innerHTML = this.options.label;
            this.label.classList.add('input__label');
            this.label.for = this.el.id;
            this.fieldWrapper.appendChild(this.label);
        }

        this.blink = document.createElement('div'); //Use as a helper to make blink animation on focus field
        this.blink.classList.add('input__blink');
        this.fieldWrapper.appendChild(this.blink);

        if (this.options.errMsg) {
            this.errMsg = document.createElement('div');
            this.errMsg.innerHTML = 'Please fill out required field';
            this.errMsg.classList.add('input__err-msg');
            this.fieldWrapper.appendChild(this.errMsg);
        }
    };

    Textfield.prototype._initEvents = function() {
        var self = this;
        //Check if field is empty or not and change class accordingly
        $(this.el).on('blur', function(e) {
            e.target.classList.remove('input_state_err');
            if (e.target.value !== '') {
                e.target.classList.add('input_state_not-empty', 'js-hasValue');
            } else {
                e.target.classList.remove('input_state_not-empty', 'js-hasValue');
            }
            e.target.placeholder = '';
            if (e.target.required && !e.target.value) {
                e.target.classList.add('input_state_err');
            }
            self._toggleAddable();
            normalizeRequiredCount();
        });

        //On focus event
        $(this.el).on('focus', function(e) {
        });

        //On change event
        $(this.el).on('change', function(e) {
            e.target.classList.remove('input_state_err');
            if (e.target.value !== '') {
                e.target.classList.add('input_state_not-empty', 'js-hasValue');
            } else {
                e.target.classList.remove('input_state_not-empty', 'js-hasValue');
            }
            e.target.placeholder = '';
            if (self.options.onChange) {
                self.options.onChange(e);
            }
            self._toggleAddable();
            normalizeRequiredCount();
        });

        //On input event
        $(self.el).on('input', function(e) {
            e.target.classList.remove('input_state_err');
            if (e.target.value !== '') {
                e.target.classList.add('input_state_not-empty', 'js-hasValue');
            } else {
                e.target.classList.remove('input_state_not-empty', 'js-hasValue');
            }
            e.target.placeholder = '';
            if (self.options.onInput) {
                self.options.onInput(e);
            }
            self._toggleAddable();
            normalizeRequiredCount();
        });

        //autoresize for textarea
        /*if (self.el.type === 'textarea') {
            $(self.el).on('keyup', function(e) {
                self._autosize();
            });
            $(self.el).on('input paste', function(e) {
                self._autosize();
            });
            $(self.el).on('keydown', function(e) {
                e.stopPropagation();

                if (e.keyCode === 13) {
                    self.el.rows++;
                }
            });
        }*/
    };

    //Autoresize textarea
    Textfield.prototype._autosize = function() {
        if (this.el.value === '') {this.el.rows = 1;}
        else {
            var width = this.el.getBoundingClientRect().width,
                span = document.createElement('span'),
                textWidth = this.el.value.length * 7,
                re = /[\n\r]/ig;
                lineBrakes = this.el.value.match(re);
                row = Math.ceil(textWidth / width);

            row = row <= 0 ? 1 : row;
            row = this.options.maxHeight && row > this.options.maxHeight ? this.options.maxHeight : row;

            if (lineBrakes) {
                row += lineBrakes.length;
            }

            this.el.rows = row;
        }
    };

    Textfield.prototype._toggleAddable = function() {
        if ($(this.el).parents('.js-addableWrapper').length > 0) {
            if ($(this.el).hasClass('js-hasValue')) {
                $(this.el).parents('.js-addableWrapper').addClass('js-hasValue');
            } else {
                $(this.el).parents('.js-addableWrapper').removeClass('js-hasValue');
            }
        }
    };

    function initTextfields() {
        [].slice.call(document.querySelectorAll('.js-input')).forEach(function(el) {
            new Textfield(el, {
                label: el.dataset.label,
                helpText: el.dataset.helpText,
                errMsg: el.dataset.errMsg,
                placeholder: el.placeholder,
                mask: el.dataset.mask,
                maxHeight: el.dataset.maxHeight
            });
        });
    }

    initTextfields();


//})(window);
