function CardsPlacement(maps) {
    this.maps = maps;
    this.mapIndex = -1;
    this._init();
}

CardsPlacement.prototype._init = function() {
    var self = this;

    function mapIndexForWidth(width, maps) {
        return maps.reduce(function(currentIndex, map, index) {
            var maxWidth = (map.maxWidth && map.maxWidth >= width) || !map.maxWidth,
                minWidth = (map.minWidth && map.minWidth <= width) || !map.minWidth;

            return maxWidth && minWidth ? index : currentIndex;
        }, -1);
    }

    function buildPageWithMap(map, parent) {
        var columns = map.cols.map(function(col) {
            var column = $('<div></div>').addClass(col.cls);
            col.cards.forEach(function(card) {
                column.append(parent.find('#' + card));
            });
            return column;
        });

        parent.empty();
        columns.forEach(function(column) {
            parent.append(column);
        });
        parent.removeClass('is-invisible');
    }

    function adjustLayout() {
        if (self.mapIndex !==  mapIndexForWidth(window.innerWidth, self.maps)) {
            self.mapIndex = mapIndexForWidth(window.innerWidth, self.maps);
            buildPageWithMap(self.maps[self.mapIndex], $('.js-content'));
        }
    }

    window.addEventListener('optimizedResize', adjustLayout);
    adjustLayout();
};
