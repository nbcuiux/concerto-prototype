;(function(window) {
    //'use strict';

    function ScrollSpyNav(el) {
        this.el = el;

        this._init();
        this._initEvents();
    }

    ScrollSpyNav.prototype._init = function() {
        this.options = {
            offset: this.el.dataset.topOffset
        };

        this.items = [].slice.call(this.el.getElementsByTagName('li')).map(function(el) {
            var itemId = el.dataset.href;
            return {navItem: el,
                    item: document.getElementById(itemId)};
        });
    };

    ScrollSpyNav.prototype._initEvents = function() {
        var self = this;

        window.addEventListener("optimizedScroll", function(e) {
            if (!self.scrollingToItem) {
                var mainItems = self.items.filter(function(item) {
                    if (item.item) {
                        var elBCR = item.item.getBoundingClientRect();
                        return elBCR.top > self.options.offset && elBCR.top < window.innerHeight / 2;
                    }
                    else {
                        return null;
                    }
                });

                if (mainItems.length > 0 && (!self.mainItem || self.mainItem !== mainItems[0])) {
                    self.mainItem = mainItems[0];
                    self.items.forEach(function(i) {
                        i.navItem.classList.remove(self.options.activeClass || 'is-active');
                    });
                    self.mainItem.navItem.classList.add(self.options.activeClass || 'is-active');
                }
            }
        });

        self.items.forEach(function(item) {
            item.navItem.addEventListener('click', function(e) {
                var href = '#' + e.target.dataset.href;
                var offsetTop = href === "#" ? 0 : $(href).offset().top - self.options.offset - 30;
                self.scrollingToItem = true;
                self.items.forEach(function(i) {
                    i.item.classList.remove(self.options.activeClass || 'is-active');
                    i.navItem.classList.remove(self.options.activeClass || 'is-active');
                });
                $(e.target).addClass(self.options.activeClass || 'is-active');


                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 300, function() {
                    self.scrollingToItem = false;
                    $(href).addClass(self.options.activeClass || 'is-active');

                });
            });
        });
    };

    function initScrollSpyNav() {
        [].slice.call(document.querySelectorAll('.js-scrollSpyNav')).forEach(function(el) {
            new ScrollSpyNav(el);
        });
    }
    initScrollSpyNav();

})(window);
