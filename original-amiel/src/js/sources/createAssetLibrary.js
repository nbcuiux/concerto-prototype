// Create DOM element for File from data
function createFileElement(f) {
  var fileData = f.fileData;

  //create basic element
  var file = $('<div></div>').addClass(fileClass(fileData)),
  fileIndex = $('<div></div>').addClass('hidden file__id').text(fileData.id),

  fileImg = $('<div></div>')
  .addClass('file__img')
  .css('background-image', 'url(' + fileData.url + ')'),
  fileControls = $('<div></div>').addClass('file__controls').click(toggleFileSelect),
  fileCheckmark = $('<div></div>').addClass('file__checkmark').click(toggleFileSelect),
  fileEdit = $('<button>Edit</button>').addClass('button button_style_outline-white').click(handleFiledEditButtonClick),
  fileProgressbar = $('<div></div>').addClass('c-File-progressBar hidden'),
  fileProgressbarLoaded = $('<div></div>').addClass('c-File-progressBar-loader'),

  fileTitle = $('<div></div>').addClass('file__title file__title_main').text(fileData.title),

  fileEditButton = $('<button>Edit</button>').addClass('button button_style_outline-gray u-visible-xs u-noMargin').click(handleFiledEditButtonClick);


  fileProgressbar.append(fileProgressbarLoaded);
  fileControls.append(fileCheckmark, fileTypeElement(fileData), fileEdit, fileProgressbar);
  fileImg.append(fileControls);

  file.append(fileIndex, fileImg, fileTitle, fileEditButton);

  return file;
}

function addFile(file) {
  var assetsLibrarySection = $('.files #assets'),
  justUploadedSection = $('.files #justUploaded');

  if (justUploadedSection.length === 0 && file.hasClass('justUploaded')) {
    justUploadedSection = $('<div></div>').addClass('section').attr('id', 'justUploaded');
    var sectionTitle = $('<div></div>').addClass('section__title'),
    sectionTitleText = $('<span></span>').addClass('section__title-text').text('Just Uploaded'),
    sectionFiles = $('<div></div>').addClass('section__files section__files_view_grid');

    sectionTitle.append(sectionTitleText);
    justUploadedSection.append(sectionTitle, sectionFiles);

    justUploadedSection.insertBefore(assetsLibrarySection);
  }

  if (file.hasClass('justUploaded')) {
    justUploadedSection.find('.section__files').append(file);
  }
  else {assetsLibrarySection.find('.section__files').append(file);}
  if (file.hasClass('js-loading')) {
    file.find('.c-File-progressBar').removeClass('hidden');
    file.find('.c-File-progressBar .c-File-progressBar-loader').animate({width: "100%"},
    2300,
    'linear',
    function() {this.parentNode.classList.add('hidden');}
  );
}
}

function updateGallery(scrollIndex) {
  var justUploaded = false;
  singleselect = false;

  // Remember position and selection of files
  $('.js-content .files .file').each(function(index, el) {
    var file = galleryObjects.filter(function(f) {
      return f.fileData.id === $(el).find('.file__id').text();
    })[0];
    if (file) {
      file.position = index;
      file.selected = $(el).hasClass('selected');
      file.justUploaded = $(el).hasClass('justUploaded');
    }
  });

  //Clear files section
  $('.files .section__files').empty();

  //Sort array acording files position
  galleryObjects.sort(function(a, b) {
    return a.position - b.position;
  });

  //Create files from data and add them to the page
  for (var i = 0; i<galleryObjects.length; i++ ) {
    var f = galleryObjects[i],
    file = createFileElement(f);

    if (f.selected) {file.addClass('selected');}
    if (f.justUploaded) {
      file.addClass('justUploaded');
      //f.justUploaded = false;
      justUploaded = true;
    }
    if (f.loading) {
      file.addClass('js-loading');
      f.loading = false;
    }
    addFile(file);
  }

  normalizeSelecteion();

  if (scrollIndex) {
    var scrollTop = $('.js-content .files #justUploaded').last().offset().top - 200;
    console.log(scrollTop);
    $('body').animate({
      scrollTop: scrollTop
    }, 400);
  }
}

function initGallery() {
  assetLibraryObjects.forEach(function(file) {
    galleryObjects.push({
      fileData: file,
      selected: false,
      position: 1000,
      caption: '',
      galleryCaption: false,
      justUploaded: false
    });
  });
  updateGallery();
}

/*
* Helpers functions
*/
function fileClass(fileData) {
  switch (fileData.type) {
    case 'image':
    return 'file file_view_grid js-imgFileType';

    case 'video':
    return 'file file_view_grid js-videoFileType';

    default:
    return 'file file_view_grid';
  }
}
function fileTypeElement(fileData) {
  switch (fileData.type) {
    case 'image':
    return $('<div><i class="fa fa-camera"></i></div>').addClass('file__type');

    case 'video':
    return $('<div><i class="fa fa-video-camera"></i></div>').addClass('file__type');

    default:
    return $('<div></div>').addClass('file__type');
  }
}
