function Pagination(el, store, updateFunction) {
    this.el = el;
    this.store = store;
    this.update = updateFunction;

    this._init();
}

Pagination.prototype._init = function() {
    var self = this;
    renderPagination();

    function handlePageClick(e) {
        var target = e.target.dataset.target || e.target.parentNode.dataset.target;
        switch (target) {
            case 'prev':
                self.store.setPage(self.store.page - 1 < 0 ? 0 : self.store.page - 1);
                break;
            case 'next':
                self.store.setPage(self.store.page + 1 === self.store.pagesNumber() ? self.store.pagesNumber() - 1 : self.store.page + 1);
                break;
        }

        self.update($('#libraryBody'), self.store, renderContentRow);
        renderPagination();
    }

    function renderPagination() {
        var links = $('<ul></ul>').addClass('pagination__list');
        self.el.empty();

        console.log(self.store.pagesNumber());

        if (self.store.pagesNumber() > 1) {
            //Prev
            var prevLink = $('<li><i class="fa fa-angle-left"></i></li>').addClass('pagination__prev').attr('data-target', 'prev').click(handlePageClick);
            if (self.store.page === 0) {prevLink.addClass('is-disabled');}
            links.append(prevLink);

            //Current page indicator
            //var currentPage = $('<li></li>').addClass('pagination__current').text(self.store.page + 1);
            //links.append(currentPage);

            //Next
            var nextLink = $('<li><i class="fa fa-angle-right"></i></li>').addClass('pagination__next').attr('data-target', 'next').click(handlePageClick);
            if (self.store.page === self.store.pagesNumber() - 1) {nextLink.addClass('is-disabled');}
            links.append(nextLink);

            self.el.append(links);
        }

        return self.el;
    }

};
