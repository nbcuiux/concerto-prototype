var originalDivStyle, originalImgStyle, imageRatio;

/*Bulk Delete - which used to be bulkRemove */
$('.image-style__delete').click(

function deleteImageStyle(e) {

	new Modal({
        title: 'Delete Image Styles?',
        text: 'Selected image styles will be permanently deleted from the library. Are you sure you would like to delete them?',
        confirmText: 'Delete'
    });
	//if ($('#al')) {
	/*	$('#deleteFiles').toggleClass('modal hidden');
		$('.js-content .file.selected').addClass('sbr');
*/
});
/* Click on Add Styles */
$('#addStyles').click(function(e) {
	$('#as').removeClass('hidden');
	$('#as').addClass('modal'); //as
	$('#wrapper').addClass('overflow');
	$('.effect').detach();
	$('#viewAll').addClass('is-hidden');
	updateFilters();
	setModalKeyboardActions(saveImageStyle, handleCloseImageStyle);
	$(e.target).blur();
	dataChanged = false;
});
/* Close Add Styles */
$('#cancelImageStyle').click(handleCloseImageStyle);
$('#addImageStyle').click(saveImageStyle);

function handleCloseImageStyle() {
	console.log(dataChanged);
	if (dataChanged) {
		new Modal({
			dialog: true,
            title: 'Cancel Changes?',
            text: 'Any unsaved changes you made will be lost. Are you sure you want to cancel?',
            confirmText: 'Cancel',
            confirmAction: closeImageStyle,
            cancelAction: setModalKeyboardActions(saveImageStyle, handleCloseImageStyle)
		});
	} else {
		closeImageStyle();
	}
}
function closeImageStyle() {
	$('#as').removeClass('modal').addClass('hidden');
	$('#wrapper').removeClass('overflow');
	document.removeEventListener('keydown', handleEscKeydown);
	document.removeEventListener('keydown', handleEnterKeydown);
}
function saveImageStyle() {
	if ($('#as .js-required').not('.js-hasValue').length === 0) {
		var msg = 'The Image Style is saved as ' + $('#imageStyleName').val();
		closeImageStyle();
		showNotification(msg);
		document.removeEventListener('keydown', handleEscKeydown);
		document.removeEventListener('keydown', handleEnterKeydown);
	}
	else {
		$('#as .js-required').not('.js-hasValue').first().focus();
	}
}


function transformDiv(el, filters) {
	var div = document.getElementById(el.attr('id')),
		img = div.getElementsByTagName('img')[0],
		im = $(img);

	if (!originalDivStyle) {
		originalDivStyle = div.style;
	} else {
		div.style = originalDivStyle;
	}
	if (!originalImgStyle) {
		originalImgStyle = img.style;
	} else {
		img.style = originalImgStyle;
	}
	el.removeAttr('style');
	im.removeAttr('style');

	var imgWidth = img.clientWidth,//getBoundingClientRect.width;
		imgHeight = img.clientHeight;//getBoundingClientRect.height;
		//imageRatio = imgWidth/imgHeight;

	//console.log(el.attr('style'), originalStyle);
	for (var i=0; i< filters.length; i++) {
		var filter = filters[i];

		switch(filter.name) {
			case 'desaturate':
				im.css('-webkit-filter', 'grayscale(' + filter.value.saturation/100 + ')');
				break;

			case 'scale':
				el.css('width', filter.value.width);
				el.css('height', filter.value.height);
				if (!filter.value.ratio) {
					el.css('background-size', '100% 100%');
				}
				break;

			case 'crop':
				var w = el.width(),
					h = el.height(),
					size = w.toString() + 'px ' + h.toString()+ 'px';
				im.css('width', filter.value.width);
				im.css('height', filter.value.height);
				//el.css('background-position', 'center');
				//el.css('background-size', size);
				//im.css('max-height', 'none');
				//im.css('max-width', 'none');
				//im.css('height', imgHeight);
				//im.css('width', imgWidth);
				break;

			case 'rotate': {
				el.css('transform', 'rotate(' + filter.value.angle + 'deg)');
				if (filter.value.random && !filter.value.angle) {
					el.css('transform', 'rotate(' + (Math.random()*10 - 5) + 'deg)');
				}
				break;
			}
		}
	}
}
function disableFilter(e) {
	$(e.target).parents('.effect').toggleClass('is-disabled');
	if ($('.effect .switch:checked').length === 0) {
		$('#viewAllToggle').prop('checked', false);
	}
	if ($('.effect .switch:checked').length === $('.effect .switch').length) {
		$('#viewAllToggle').prop('checked', true);
	}
	updateFilters();
}

function updateFilters(e) {

	var filters = [];
	$.each($('.effect').not('.is-hidden, .is-disabled'), function(i, el) {
		var filter = {};
		filter.name = el.getElementsByClassName('title')[0].innerHTML.toLowerCase();

		filter.value = {};
		var inputs = el.getElementsByClassName('values')[0].getElementsByTagName('input');
		for (var k = 0; k<inputs.length; k++) {
			var input = inputs[k];
			var inputName = input.id.split('-')[1];
			filter.value[inputName] = parseFloat(input.value.split(' ')[0]);
		}

		filters.push(filter);
	});
	transformDiv($('#img'), filters);

	dataChanged = true;
	console.log(dataChanged);

	if (filters.length === 0) {
		$('#viewAll').addClass('is-hidden');
		dataChanged = false;
	}
	console.log(dataChanged);
}
//$('.filter input').change(updateFilters);
function handleStartEditing(e) {
	if (e.target.type === 'text') {
		e.target.value = e.target.value.split(' ')[0];
		e.target.type = 'number';
	}
}
function handleEndEditing(e) {
	var type = e.target.id.split('-')[1];
	e.target.type='text';
	if (e.target.value) {
		switch (type) {
			case 'width':
				e.target.value = e.target.value + ' px';
				break;

			case 'height':
				e.target.value = e.target.value + ' px';
				break;

			case 'saturation':
				e.target.value = e.target.value + ' %';
				break;

			case 'angle':
				e.target.value = e.target.value + ' °';
				break;
		}
	}
}
function handleEditing(e) {
	var ratio = $(e.target).parents('.values').find('.ratio').get(0),
		targetType = e.target.id.split('-')[1],
		targetId = e.target.id.split('-'),
		otherField, id;

	if (ratio.checked && imageRatio) {

		if (targetType === 'width') {
			id = targetId[0] + '-height-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value / imageRatio).toString() + ' px';
		}
		else if (targetType === 'height') {
			id = targetId[0] + '-width-' + targetId[2];
			otherField = document.getElementById(id);
			otherField.value = Math.round(e.target.value * imageRatio).toString() + ' px';
		}
	}
	updateFilters(e);
}
function handleRatioToggle(e) {
	var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
}


function handleEffectListItemClick(e) {
	var select = $(e.target).parent().parent(),
		item = $(e.target),
		spanString = select.children('span').text();

	if (!imageRatio) {
		var image = document.getElementById('img').getElementsByTagName('img')[0];
		imageRatio = image.offsetWidth/image.offsetHeight;
	}

	select.removeClass('open');
	$('#viewAll').removeClass('is-hidden');

	var title = $('<div></div>').addClass('title').text(item.text()),
		toggle = $('<input type="checkbox" checked/>').addClass('switch').change(disableFilter),
		close = $('<div></div>').addClass('close').click(removeEffect),
		header = $('<div></div>').addClass('header').append(toggle, title, close),
		values = $('<div></div>').addClass('values'),
		filter = $('<div></div>').addClass('effect open').append(header, values);

		fCount = $('.effect').length + 1;

	var width, height, ratio;

		switch(item.text().toLowerCase()) {


			case 'desaturate': {
				var saturation = $('<input type="number"/>')
							.attr('id', item.text().toLowerCase() + '-saturation-' + fCount)
							.css('width', '50%')
							.addClass('input__field_style_dark')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing);

				values.append(saturation);
				new Textfield(saturation.get(0), {
					label: 'Desaturation (%)'
				});
				break;
			}

			case 'crop': {
				width = $('<input type="text"/>')
						.attr('id', item.text().toLowerCase() + '-width-' + fCount)
						.addClass('input__field_style_dark')
						.on('input', handleEditing)
						.on('focus', handleStartEditing)
						.on('blur', handleEndEditing);

				height = $('<input type="text"/>')
						.attr('id', item.text().toLowerCase() + '-height-' + fCount)
						.addClass('input__field_style_dark')
						.on('input', handleEditing)
						.on('focus', handleStartEditing)
						.on('blur', handleEndEditing);

				ratio = $('<input type="checkbox" tabindex="-1"/>')
						.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
						.addClass('ratio')
						.change(handleRatioToggle);

				values.append(width, ratio, height);
				new Textfield(width.get(0), {
					label: 'Width (px)'
				});
				new Textfield(height.get(0), {
					label: 'Height (px)'
				});
				break;
			}
			case 'scale': {
				width = $('<input type="text"/>')
						.attr('id', item.text().toLowerCase() + '-width-' + fCount)
						.addClass('input__field_style_dark')
						.on('input', handleEditing)
						.on('focus', handleStartEditing)
						.on('blur', handleEndEditing);

				height = $('<input type="text"/>')
						.attr('id', item.text().toLowerCase() + '-height-' + fCount)
						.addClass('input__field_style_dark')
						.on('input', handleEditing)
						.on('focus', handleStartEditing)
						.on('blur', handleEndEditing);

				ratio = $('<input type="checkbox" tabindex="-1"/>')
						.attr('id', item.text().toLowerCase() + '-ratio-' + fCount)
						.addClass('ratio')
						.change(handleRatioToggle);

				values.append(width, ratio, height);
				new Textfield(width.get(0), {
					label: 'Width (px)'
				});
				new Textfield(height.get(0), {
					label: 'Height (px)'
				});
				break;
			}

			case 'rotate': {
				var angle = $('<input type="text"/>')
							.attr('id', item.text().toLowerCase() + '-angle-' + fCount)
							.addClass('input__field_style_dark')
							.css('width', '50%')
							.on('input', updateFilters)
							.on('focus', handleStartEditing)
							.on('blur', handleEndEditing);

				values.append(angle);
				new Textfield(angle.get(0), {
					label: 'Angle (deg)'
				});
				break;
			}
		}

		$('#effect_list').append(filter);
}
$('#effect_list').sortable();


/* Remove Effect */
function removeEffect(e) {
	$(e.target).parents('.effect').remove();
	updateFilters();
}

/* effect all button controls all the buttons */
$('#viewAllToggle').change(function(e) {
	$('.effect .header .switch').prop('checked', e.target.checked);
	if (e.target.checked) {$('.effect').removeClass('disabled');}
	else {$('.effect').addClass('disabled');}
	updateFilters();
});

$('.purpose .close').click(function(e) {

	if ($('.js-content .purpose.selected').length > 0) {
		$('#deleteFiles').toggleClass('modal hidden');
		$('.js-content .purpose.selected').addClass('sbr');
	} else {
		$('#deleteFiles').toggleClass('modal hidden');
		e.target.parentNode.parentNode.parentNode.classList.add('sbr');
	}
});
$('.purpose-controls').click(function(e) {
	e.target.parentNode.parentNode.classList.toggle('selected');
	if ($('.js-content .purpose.selected').length === $('.js-content .purpose').length) {
		$('#selectAll').toggleClass('all empty');
	} else if ($('.js-content  .purpose.selected').length > 0 && $('.ct .purpose.selected').length !== $('.ct .purpose')) {
		$('#selectAll').removeClass('all empty');
	} else if ($('.js-content .purpose.selected').length === 0) {
		$('#selectAll').addClass('empty');
	}
});

/* Effect pane */
function collapsePannel(e) {
	if ($(e.target).hasClass('title')) {
		$(e.target).parent().parent().toggleClass('open');
	} else {
		$(e.target).parent().toggleClass('open');
	}
}
