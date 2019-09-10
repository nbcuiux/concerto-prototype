/*Quick Edit File Title and Info */
function editFileTitle(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('input');
		input.type = 'text';
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
				fileInfo = input.parentNode;
				fileInfo.removeChild(input);
				fileInfo.classList.remove('edit');
				fileInfo.innerHTML = input.value;
			}
		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}
function editFileCaption(e) {
	if (!$('.al').hasClass('modal')) {
		var fileInfo = e.target;
		var fileInfoText = fileInfo.innerHTML;
		var input = document.createElement('textarea');
		//input.type = 'text'
		input.value = fileInfoText;

		input.addEventListener('blur', function(e) {
			var input = e.target;
			fileInfo = input.parentNode;
			fileInfo.removeChild(input);
			fileInfo.classList.remove('edit');
			fileInfo.innerHTML = input.value;
		});
		input.addEventListener('keypress', function(e) {
			if (e.keyCode == 13 || e.which == 13) {
				var input = e.target;
				fileInfo = input.parentNode;
				fileInfo.removeChild(input);
				fileInfo.classList.remove('edit');
				fileInfo.innerHTML = input.value;
			}

		});

		fileInfo.innerHTML = '';
		fileInfo.appendChild(input);
		fileInfo.classList.add('edit');
		input.focus();
	}
}

function deleteFile(file, files) {
	files = files.splice(files.indexOf(file), 1);
}
function deleteFileById(id, files) {
	var file = fileById(id, files);
	deleteFile(file, files);
}

function handleDeleteClick(e) {
	var itemName = $('.menu .is-active').text().toLowerCase();
	new Modal({
		title: 'Remove Asset?',
		text: 'Selected asset will be removed from this ' + itemName + '. Don’t worry, it won’t be removed from the Asset Library.',
		confirmText: 'Remove',
		confirmAction: function() {
			var fileId = $(e.target).parents('.file').find('.file__id').text();
			deleteFileById(fileId, galleryObjects);
			updateGallery();
		}
	});
}

$('.file-title').click(editFileTitle);
$('.file-caption').click(editFileCaption);
