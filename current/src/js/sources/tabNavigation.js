function handleTabNavItemClick(e) {
    var tabId = $(e.target).attr('data-tab');
	$('.tabs .nav li').removeClass('active');
	$(e.target).addClass('active');
	$('.tab').removeClass('active');
	$(tabId).addClass('active');

    //For mobile navigation
    $(e.target).parent().removeClass('open');
	$('.tabs .nav > .mobileNav').text($(e.target).text().replace(/\d/g, ''));
}

function handleMobileNavClick(e) {
    $(e.target).parent().children('ul').toggleClass('open');
}
