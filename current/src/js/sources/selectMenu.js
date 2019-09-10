/* Select control */
function openSelect(e) {
	console.log('openSelect', e.target);
	$(e.target).toggleClass('open');
	$('*').not('.select li, .select').on('click', closeSelect);
}
function setSelect(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (select.hasClass('multiple')) {
		if (item.hasClass('active')) {
			item.removeClass('active');
			var searchString = itemText + ", ";
			var index = spanString.slice(spanString.search(searchString));
			var newSpan = spanString();
		}
		$(e.target).toggleClass('active');
		var string;
		select.children('span').text();

	} else {
		select = e.target.parentNode.parentNode;
		var span = select.getElementsByTagName('span')[0];
		span.innerHTML = e.target.innerHTML;
		select.classList.add('selected');
		select.classList.remove('open');
		var items = select.getElementsByTagName('li');
		for (var i=0; i<items.length; i++) {
			items[i].classList.remove('active');
		}
		e.target.classList.add('active');
	}
	//console.log(select.parent());
	if ($(select).parent().hasClass('file-purpose')) {
		if ($('.ct .file.selected').length > 0) {
			$('.ct .file.selected .select').addClass('selected');
			$('.ct .file.selected .select span').text(e.target.innerHTML);
			deselectAll();
		}
	}
	dataChanged = true;
}
function closeSelect(e) {
	if (!$(e.target).hasClass('select')) {
		if ($('.select').hasClass('open')) {
			$('.select').removeClass('open');
			$('*').unbind('click', closeSelect);
		}
	}
}
