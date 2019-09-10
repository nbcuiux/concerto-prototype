function normilizeMenu() {
    var pageName = window.location.href.split('/').pop(),
        menuItems = $('.js-menu .js-menuItem');
        activeMenuItem = $('[data-target="' + pageName + '"]');

    menuItems.removeClass('is-active').click(handleMenuItemClick);
    activeMenuItem.addClass('is-active');
    activeMenuItem.parents('.menu__item').addClass('is-open');
}
function handleMenuItemClick(e) {
    e.stopPropagation();
    if ($(e.target).attr('data-target')) {
            if (window.location.href.indexOf('create') >= 0 &&
                !draftIsSaved &&
                $('.js-content .file, .js-content .js-hasValue').length > 0) {
                new Modal({
                    title: 'Leave Page?',
                    text: 'You will lose all the unsaved changes. Are you sure you want to leave this page?',
                    confirmText: 'Leave Page',
                    confirmAction: function() {
                        window.location.href = $(e.target).attr('data-target');
                    }
                });
            } else {
                window.location.href = $(e.target).attr('data-target');
            }
        //}
    } else {
        if ($(e.target).parents('.menu__item').hasClass('is-open')) {
            $(e.target).parents('.menu__item').removeClass('is-open');
        } else {
            $('.menu__item').removeClass('is-open');
        	$(e.target).parents('.menu__item').addClass('is-open');
        }
    }
}

$('#menuToggle').click(openMenu);
$('.js-menu > .js-close').click(closeMenu);

function openMenu(e) {
    e.stopPropagation();
    $('.js-menu').addClass('is-open');
    window.addEventListener('mousedown', closeMenu);
}
function closeMenu(e) {
    if ($(e.target).parents('.menu__list').length === 0) {
        $('.js-menu').removeClass('is-open');
        window.removeEventListener('mousedown', closeMenu);
    }
}
