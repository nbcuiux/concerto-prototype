$('#purposeToggle').click(function(e) {
	if ($(e.target).children('span').text() === ' View all') {
		showAllPreviews();
	} else {
		collapseAllPreviews();
	}
});

$('#showPreview').click(showAllPreviews);

function showAllPreviews() {
    $('.preview.focal').addClass('full').removeClass('line');
    $('#purposeToggle').children('span').text(' Collapse');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-down').removeClass('fa-arrow-up');
    $('.purposes .purpose-img').unbind('click').click(handlePurposeClick);
    scrollPosition = $('#purposeWrapper').scrollLeft();

}

function collapseAllPreviews() {
    $('.preview.focal').addClass('line').removeClass('full');
    $('#purposeToggle').children('span').text(' View all');
    $('#purposeToggle').children('.fa').addClass('fa-arrow-up').removeClass('fa-arrow-down');
    $('.purposes .purpose-img').unbind('click').click(function(e) {
        adjustRect($(e.target));
    });
}

/* Click on Purpose */
function handlePurposeClick(e) {
	console.log(scrollPosition);
	var purpose = $(e.target).parent(),
		purposeWrapper = $('#purposeWrapper');

	var index = purpose.parent().children('.purpose').index(purpose),
		scrollOffset = index * 140;

	var scrollDelta = scrollOffset - scrollPosition,
		sds = scrollDelta > 0 ? '+=' + scrollDelta : '-=' + Math.abs(scrollDelta);

		console.log(sds);

	$('.preview.focal').toggleClass('line full');
	$('#purposeWrapper').scrollLeft(scrollPosition);
	$('#purposeToggle').children('.fa').toggleClass('fa-arrow-up fa-arrow-down');
	$('#purposeToggle').children('span').text(' View all');
	$('#purposeWrapper').animate( { scrollLeft: scrollOffset }, 600);
    $('.purposes-container .purpose').removeClass('active');
    purpose.addClass('active');
    $('.purposes .purpose-img').unbind().click(function(e) {
        adjustRect($(e.target));
    });
}
