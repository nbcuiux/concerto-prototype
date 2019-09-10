var scrollPosition;
var startDate = new Date();

//Sticky scrollbar
stickyTopbar = new StickyTopbar();

//Normalizers
normilizeMenu();
normalizeRequiredCount();
normalizeSelecteion();

$('.js-content .files .section__files').disableSelection();

//Check for required fields
$('label.requiered').parent().children('input').on('blur', function(e) {
  if (checkField(e.target)) {
    markFieldAsNormal(e.target);
  } else {
    markFieldAsRequired(e.target);
  }
});


//Click on logo
$('.js-logo').click(handleLogoClick);
function handleLogoClick(e) {
  if (window.location.href.indexOf('create') >= 0 &&
  !draftIsSaved &&
  $('.js-content .file, .js-content .js-hasValue').length > 0) {
    new Modal({
      title: 'Leave Page?',
      text: 'You will lose all unsaved changes. Are you sure you want to leave this page?',
      confirmText: 'Leave Page',
      confirmAction: function() {
        window.location.href = 'dashboard.html';
      }
    });
  } else {
    window.location.href = 'dashboard.html';
  }
}

//Asset Library

$('#alCloseButton').click(closeAssetLibrary);
$('#alTopCloseButton').click(closeAssetLibrary);
$('#assetLibrary').click(function(e) {
  openAssetLibrary(e);
});

function openAssetLibrary(e, options) {
  scrollPosition = $('body').scrollTop();
  updateAssetLibrary();
  $('#al').removeClass('hidden');
  $('#al').addClass('modal');
  $('#wrapper').addClass('overflow');
  singleselect = false;
  $('#addFromALButton').text('Add Files');

  $('#addFromALButton').click(addFilesFromAssetLibrary);
  setModalKeyboardActions(addFilesFromAssetLibrary, closeAssetLibrary);
  $(e.target).blur();
}

function addFilesFromAssetLibrary(){
  lastSelected = null;
  addSelectedFiles();
  closeAssetLibrary();
  document.removeEventListener('keydown', handleEscKeydown);
  document.removeEventListener('keydown', handleEnterKeydown);
}
function closeAssetLibrary() {
  lastSelected = null;
  $('.al .files .section__files .file.selected').removeClass('selected');
  deselectAll();
  $('.modal').addClass('hidden').removeClass('modal');
  $('#wrapper').removeClass('overflow');
  $('#addFromALButton').unbind('click');
  $('body').scrollTop(scrollPosition);
  document.removeEventListener('keydown', handleEscKeydown);
  document.removeEventListener('keydown', handleEnterKeydown);
}

window.openAssetLibrary = openAssetLibrary;

$('#al').click(function(e) {
  $('#al .files .file.selected').removeClass('selected');
});
$('#al .files .section__files').disableSelection();

//Upload files
$('#uploadFiles').click(handleUploadFilesClick);
document.addEventListener('dragenter', handleDragEnter, true);
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleDrop, false);

//Draft function: Save, Cancel, Publish
function saveDraft() {
  showNotification('The draft is saved.');
  draftIsSaved = true;
}
function removeDraft() {
  new Modal({
    title: 'Cancel this Draft?',
    text: 'Are you sure you want to cancel and discard this draft?',
    confirmText: 'Cancel',
    confirmAction: function() {
      window.location.href = 'dashboard.html';
    },
    cancelAction: hideModalPrompt
  });
}
function publishDraft() {
  var itemName = $('.menu .is-active').text(),
  promptMsg = '';

  switch (itemName.toLowerCase()) {
    case 'person':
    promptMsg = 'Published person will become available to be added as part of a cast for a season/event. Are you sure you want to publish it?';
    break;

    case 'role':
    promptMsg = 'Published role will become available to be added as part of a cast for a season/event. Are you sure you want to publish it?';
    break;

    default:
    promptMsg = 'Published ' + itemName.toLowerCase() + ' will become available on the live site. Are you sure you would like to publish it?';
    break;

  }
  new Modal({
    title: 'Publish this ' + itemName + '?',
    text: promptMsg,
    confirmText: 'Publish',
    confirmAction: function() {
      hideModalPrompt();
      showNotification(itemName + ' is published.');
      draftIsSaved = true;
    },
    cancelAction: hideModalPrompt
  });
}

$('#saveDraft').click(saveDraft);
$('#removeDraft').click(removeDraft);
$('#publishDraft').click(publishDraft);

//Top bar actions dropdown for mobile
if (document.getElementById('actionDropdown')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('actionDropdown'),
    {
      items: [
        {
          innerHTML: '<i class="fa fa-check"></i><span class="">  Save as draft</span>',
          callback: saveDraft
        },
        {
          innerHTML: '<i class="fa fa-ban"></i><span class="buttonText">  Cancel</span>',
          callback: removeDraft
        }
      ]
    }
  );
}

//Files more action dropdowns
if (document.getElementById('moreActions')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('moreActions'),
    {
      items: [
        {
          innerHTML: 'Send to top',
          callback: handleSendToTopClick
        },
        {
          innerHTML: 'Send to bottom',
          callback: handleSendToBottomClick
        }
      ]
    }
  );
}

//Media card dropdowns
//Small
if (document.getElementById('mediaActionsSmall')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('mediaActionsSmall'),
    {
      items: [
        {
          innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
          callback: handleUploadFilesClick
        },
        {
          innerHTML: '<i class="fa fa-folder-open"></i><span class="">  Add from library</span>',
          callback: function(e) {
            openAssetLibrary(e);
          }
        }
      ]
    }
  );
}
//Full
if (document.getElementById('mediaActionsFull')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('mediaActionsFull'),
    {
      items: [
        {
          innerHTML: '<i class="fa fa-pencil-square"></i><span class="">  Multi Edit</span>',
          callback: handleMultiEditButtonClick,
          disabled: function() {return $('#multiEdit').hasClass('disabled');}
        },
        {
          innerHTML: '<i class="fa fa-times-circle"></i><span class="">  Remove</span>',
          callback: handleBulkRemoveClick,
          disabled: function() {return $('#bulkRemove').hasClass('disabled');}
        },
        {
          divider: true
        },
        {
          innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
          callback: handleUploadFilesClick
        },
        {
          innerHTML: '<i class="fa fa-folder-open"></i><span class="">  Add from library</span>',
          callback: function(e) {
            openAssetLibrary(e);
          }
        }
      ]
    }
  );
}

//Asset library dropdowns
//Small
if (document.getElementById('assetActionsSmall')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('assetActionsSmall'),
    {
      items: [
        {
          innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
          callback: handleUploadFilesClick
        }
      ]
    }
  );
}
//Full
if (document.getElementById('assetActionsFull')) {
  var pageActionDropdown = new Dropdown(
    document.getElementById('assetActionsFull'),
    {
      items: [
        {
          innerHTML: '<i class="fa fa-pencil"></i><span class="">  Bulk Edit</span><span class="dropdown__warning"></span>',
          callback: handleMultiEditButtonClick,
          disabled: function() {return $('#bulkEdit').hasClass('disabled');},
          warning: function() {return !$('#bulkEdit').children('.button__warning').hasClass('is-hidden');}
        },
        {
          innerHTML: '<i class="fa fa-pencil-square"></i><span class="">  Multi Edit</span><span class="dropdown__warning"></span>',
          callback: handleMultiEditButtonClick,
          disabled: function() {return $('#multiEdit').hasClass('disabled');},
          warning: function() {return !$('#multiEdit').children('.button__warning').hasClass('is-hidden');}
        },
        {
          innerHTML: '<i class="fa fa-times-circle"></i><span class="">  Remove</span>',
          callback: handleBulkRemoveClick,
          disabled: function() {return $('#bulkRemove').hasClass('disabled');}
        },
        {
          divider: true
        },
        {
          innerHTML: '<i class="fa fa-upload"></i><span class="">  Upload files</span>',
          callback: handleUploadFilesClick
        }
      ]
    }
  );
}


//Init placeholders for images if any (cover, etc.)
window.imagePlaceholders = initImagePlaceholders();

//Focal point
$('#focalPointToggle').click(function(e) {
  //Hide focal rectangle
  $('#focalRectToggle')
    .removeClass('is-active button_style_outline-accent')
    .addClass('button_style_outline-white');
  $('#focalRect').addClass('is-hidden');
  $('.purposes__container .purpose.is-active').removeClass('is-active');

  //Check whether focal point is active
  if ($(e.target).hasClass('is-active')) {
    $(e.target)
      .removeClass('is-active button_style_outline-accent')
      .addClass('button_style_outline-white');
    $('#focalPoint').addClass('is-hidden');
    hideUsagePreviews();
  }
  else {
    //Set focal point toggle active
    $(e.target)
      .addClass('is-active button_style_outline-accent')
      .removeClass('button_style_outline-white');
    showUsagePreviews();
    $('#focalPoint').removeClass('is-hidden');
  }
});

//Focal rectangle
$('#focalRectToggle').click(function(e) {
  //Hide focal point
  $('#focalPointToggle')
    .removeClass('is-active button_style_outline-accent')
    .addClass('button_style_outline-white');
  $('#focalPoint').addClass('is-hidden');

  //Check whether focal point is active
  if ($(e.target).hasClass('is-active')) {
    $(e.target)
      .removeClass('is-active button_style_outline-accent')
      .addClass('button_style_outline-white');
    $('#focalRect').addClass('is-hidden');
    hideUsagePreviews();
  }
  else {
    //Set focal point toggle active
    $(e.target)
      .addClass('is-active button_style_outline-accent')
      .removeClass('button_style_outline-white');
    showUsagePreviews();
    // Adjust placement and size of rectangle according purpose size
    // We need to wait some time, so image preview size could be calculated correct
    window.setTimeout(function() {
      adjustRect($('.purposes__container .purpose-img').first());
      $('.purposes__container .purpose-img').unbind().click(function(e) {
  			adjustRect($(e.target));
  		});
      $('#focalRect').removeClass('is-hidden');
    }, 300);
    $('#purposeWrapper').animate( { scrollLeft: 0 }, 600);
  }
});
/* Handle Purposes scroll */
$('#purposeWrapper').scroll(function() {
  setPurposePagination();
});
$('.purposes__left').unbind('click').click(function(e) {
  $('#purposeWrapper').animate( { scrollLeft: '-=480' }, 600);
});
$('.purposes__right').unbind('click').click(function(e) {
  $('#purposeWrapper').animate( { scrollLeft: '+=480' }, 600);
});
//Helper function to change classes and show usage previews
function showUsagePreviews() {
  $('#filePreview').addClass('has-previews');
  $('#purposes').removeClass('is-hidden');
}
function hideUsagePreviews() {
  $('#filePreview').removeClass('has-previews');
  $('#purposes').addClass('is-hidden');
}

$('#focalPoint').draggable({
  containment: "#previewImg",
  scroll: false ,
  stop: function(e) {
    adjustFocalPoint();
    adjustPurpose($(e.target));
    dataChanged = true;
  }
});
/* Init Purpose Paginator */

function setPurposePagination() {
  var scrollOffset = $('#purposeWrapper').scrollLeft();
  var width = document.getElementById('purposeWrapper').getBoundingClientRect().width;
  var firstIndex = Math.floor(scrollOffset/140) + 1;
  var lastIndex = firstIndex + Math.round(width/140) - 1;
  var count = $('#purposeWrapper .purpose').length;

  lastIndex = lastIndex < count ? lastIndex : count;

  $('#p-paginator').text(firstIndex + ' — ' + lastIndex + ' of ' + count);
}

$('#showPreview').click(showAllPreviews);
$('#hidePurpose').click(hideAllPreviews);
$('#loadMore').click(handleShowMore);


function handleShowMore(e) {
  $("#purposes .c-Purposes-container .purpose.hidden").slice(0, 5).removeClass('hidden');
  if ($("#purposes .c-Purposes-container .purpose.hidden").length === 0) {
    $(e.target).addClass('hidden');
  }
}


//Selected Files actions
$('#bulkEdit').click(handleBulkEditButtonClick);
$('#multiEdit').click(handleMultiEditButtonClick);
$('#bulkRemove').click(handleBulkRemoveClick);

function handleBulkRemoveClick() {
  var filesToDelete = $('.js-content .files .file.selected'),
  itemName = $('.menu .is-active').text().toLowerCase(),
  assetLibrary = itemName === 'asset library',
  msgTitle = assetLibrary? 'Delete Assets?' : 'Remove Assets?',
  mesgText = assetLibrary? 'Selected asset(s) will be deleted from the asset library. Are you sure you want to delete them?' : 'Selected asset(s) will be removed from this ' + itemName + '. Don’t worry, it won’t be deleted from the Asset Library.',
  btnName = assetLibrary? 'Delete' : 'Remove';
  new Modal({
    title: msgTitle,
    text: mesgText,
    confirmText: btnName,
    confirmAction: function() {
      filesToDelete.each(function(i, el) {
        var id = $(el).find('.file__id').text();
        deleteFileById(id, galleryObjects);
      });
      updateGallery();
    },
    cancelAction: function() {
      $('.js-content .files .file.sbr').removeClass('sbr');
    }
  });
}

//File Edit Save and Cancel
$('#saveChanges').click(saveImageEdit);
$('#cancelChanges').click(cancelImageEdit);
$('#fpTopCloseButton').click(cancelImageEdit);

//File Edit field changes
$('#title').on('input', function(e) {saveTitle();});
$('#caption').on('input', function(e) {saveCaption();});
$('#description').on('input', function(e) {saveDescription();});
$('#resolution').on('change', function(e) {saveResolution();});
$('#altText').on('input', function(e) {saveAltText();});

//Handle selections
$('#selectAll').click(function(e) {
  if ($(e.target).hasClass('empty')) {
    selectAll();
  } else {
    deselectAll();
  }
});
$('#deselectAll').click(function(e) {deselectAll();});

//Init addable fields
initAddableFields();





//autoexpandable textarea
$( 'textarea' ).elastic();

/*
* Cards
*/

//Foldable cards
$('.js-foldable .js-foldedToggle').click(handleFoldedToggleClick);
function handleFoldedToggleClick(e) {
  var card = $(e.target).parents('.js-foldable');
  if (card.hasClass('is-folded')) {
    card.removeClass('is-folded');
  } else {
    card.addClass('is-folded');
  }
}
//Sticky card header
$('.js-stickyOnMobile').each(function(index, el) {
  var sticky = new Stickable(el, {
    maxWidth: 600,
    boundary: true,
    offset: 50
  });
});
$('.js-sectionTitle').each(function(index, el) {
  var sticky = new Stickable(el, {
    maxWidth: 600,
    boundary: '#media-card',
    offset: 104
  });
});

//Animation end handle
window.addEventListener('animationend', function(e) {
  switch (e.animationName) {
    case 'collectionItem-pulse-out':
    $(e.target).removeClass('is-appearing');
    return e;

    case 'img-wrapper-slide-left':
    $(e.target).removeClass('is-slidingLeft');
    return e;

    case 'img-wrapper-slide-right':
    $(e.target).removeClass('is-slidingRight');
    return e;

    default:
    return e;
  }
});




//Recurring toggle
$('#recurringToggle').on('change', function(e) {
  if (e.target.checked) {
    $('#recuringTime').removeClass('is-disabled');
  } else {
    $('#recuringTime').addClass('is-disabled');
  }
});

console.log(window.settings);

if (window.settings.IS_MVP) {
  $("body").addClass("is-mvp");
}


/*
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openAssetLibrary: openAssetLibrary
  }
}
*/





