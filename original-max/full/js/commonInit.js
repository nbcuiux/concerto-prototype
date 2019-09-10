var scrollPosition;
var startDate = new Date();

//Sticky scrollbar
stickyTopbar = new StickyTopbar();

//Set active menu item
normilizeMenu();
normalizeRequiredCount();


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
          callback: handleBulkRemovelick,
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
          callback: handleBulkRemovelick,
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
  $(e.target).toggleClass('is-active button_style_outline-white button_style_outline-accent');
  $('.pr > .preview').toggleClass('focal line point');
  /*if ($(e.target).hasClass('is-active')) {
  $('.pr > .preview').removeClass('focal line point');
  $(e.target).removeClass('is-active');
} else {
$('.pr > .preview').addClass('focal line point');
$('.pr > .preview').removeClass('rect');
$('#focalRectToggle').removeClass('is-active');
$(e.target).addClass('is-active');
}*/

});
/* Handle Purposes scroll */
$('#purposeWrapper').scroll(function() {
  setPurposePagination();
});

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

function showAllPreviews() {
  $('#purposes').addClass('is-open');
  $('#previewImage').addClass('hidden');
  $('#previewControls').addClass('hidden');

  //Check if it is a mobile screen
  if (window.innerWidth < 650) {
    $("#purposes .c-Purposes-container .purpose").addClass('hidden');
    $("#purposes .c-Purposes-container .purpose.hidden").slice(0, 5).removeClass('hidden');
    $('#loadMore').removeClass('hidden');
  }
  //$('.preview.focal').addClass('full').removeClass('line');
  //$('#purposeToggle').children('span').text('Hide Preview');
}
function hideAllPreviews() {
  $('#purposes').removeClass('is-open');
  $('#previewImage').removeClass('hidden');
  $('#previewControls').removeClass('hidden');
}
function handleShowMore(e) {
  $("#purposes .c-Purposes-container .purpose.hidden").slice(0, 5).removeClass('hidden');
  if ($("#purposes .c-Purposes-container .purpose.hidden").length === 0) {
    $(e.target).addClass('hidden');
  }
}


//Selected Files actions
$('#bulkEdit').click(handleBulkEditButtonClick);
$('#multiEdit').click(handleMultiEditButtonClick);
$('#bulkRemove').click(handleBulkRemovelick);

function handleBulkRemovelick() {
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

//Init Cast collection
initCastSection($('#castSection').find('.controls__group'));
initCreditSection($('#creditSection').find('.controls__group'));

//Init Collection section
if ($('#collectionSection').find('.controls__group').length > 0) {
  initCollSection($('#collectionSection').find('.controls__group'));
}
if ($('#masterCollectionSection').find('.controls__group').length > 0) {
  initCollSection($('#masterCollectionSection').find('.controls__group'), collections, 'Collection');
}
if ($('#pageCollectionSection').find('.controls__group').length > 0) {
  initOneCollectionSection($('#pageCollectionSection').find('.controls__group'));
}


//Init Association section
if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
  initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
}
if ($('#collectionPageSection').find('.controls__group').length > 0) {
  initPageSection($('#collectionPageSection').find('.controls__group'), collections);
}

//Init Person name fields and Title
if ($('#personPrefixInput').get(0)) {
  var personPrefixInput = new Textfield($('#personPrefixInput').get(0), {
    label: 'Prefix',
    onInput: handlePersonTitleChange
  });
}
if ($('#personFirstInput').get(0)) {
  var personFirstInput = new Textfield($('#personFirstInput').get(0), {
    label: 'First Name',
    errMsg: 'Please enter the first name',
    onInput: handlePersonTitleChange
  });
}
if ($('#personMiddleInput').get(0)) {
  var personMiddleInput = new Textfield($('#personMiddleInput').get(0), {
    label: 'Middle Name',
    onInput: handlePersonTitleChange
  });
}
if ($('#personLastInput').get(0)) {
  var personLastInput = new Textfield($('#personLastInput').get(0), {
    label: 'Last Name',
    onInput: handlePersonTitleChange
  });
}
if ($('#personSuffixInput').get(0)) {
  var personSuffixInput = new Textfield($('#personSuffixInput').get(0), {
    label: 'Suffix',
    onInput: handlePersonTitleChange
  });
}


function handlePersonTitleChange(e) {
  if ($('#personPrefixInput').val() || $('#personFirstInput').val() || $('#personMiddleInput').val() || $('#personLastInput').val() || $('#personSuffixInput').val()) {
    $('#personTitleText').text(
      $('#personPrefixInput').val() + ' ' +
      $('#personFirstInput').val() + ' ' +
      $('#personMiddleInput').val() + ' ' +
      $('#personLastInput').val() + ' ' +
      $('#personSuffixInput').val());
      $('.header__subhead').removeClass('is-hidden');
      $('.header__tooltip').addClass('is-disabled');
    } else {
      $('#personTitleText').text('New Pesron');
      $('.header__subhead').addClass('is-hidden');
      $('.header__tooltip').removeClass('is-disabled');
    }
  }

  //Init character name fields and Title
  if ($('#characterPrefixInput').get(0)) {
    var characterPrefixInput = new Textfield($('#characterPrefixInput').get(0), {
      label: 'Prefix',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterFirstInput').get(0)) {
    var characterFirstInput = new Textfield($('#characterFirstInput').get(0), {
      label: 'First Name',
      errMsg: 'Please enter the first name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterMiddleInput').get(0)) {
    var characterMiddleInput = new Textfield($('#characterMiddleInput').get(0), {
      label: 'Middle Name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterLastInput').get(0)) {
    var characterLastInput = new Textfield($('#characterLastInput').get(0), {
      label: 'Last Name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterSuffixInput').get(0)) {
    var characterSuffixInput = new Textfield($('#characterSuffixInput').get(0), {
      label: 'Suffix',
      onInput: handlecharacterTitleChange
    });
  }

  function handlecharacterTitleChange(e) {
    if ($('#characterPrefixInput').val() || $('#characterFirstInput').val() || $('#characterMiddleInput').val() || $('#characterLastInput').val() || $('#characterSuffixInput').val()) {
      $('#characterTitleText').text(
        $('#characterPrefixInput').val() + ' ' +
        $('#characterFirstInput').val() + ' ' +
        $('#characterMiddleInput').val() + ' ' +
        $('#characterLastInput').val() + ' ' +
        $('#characterSuffixInput').val());
        $('.header__subhead').removeClass('is-hidden');
        $('.header__tooltip').addClass('is-disabled');
      } else {
        $('#characterTitleText').text('New Role');
        $('.header__subhead').addClass('is-hidden');
        $('.header__tooltip').removeClass('is-disabled');
      }
    }

    //Season title and title input
    if ($('#seasonTitleInput').get(0)) {
      var seasonTitleInput = new Textfield($('#seasonTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#seasonTitleText').text(e.target.value || 'New Season');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Gallery title and title input
    if ($('#galleryTitleInput').get(0)) {
      var galleryTitleInput = new Textfield($('#galleryTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#galleryTitleText').text(e.target.value || 'New Gallery');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Series title and title input
    if ($('#seriesTitleInput').get(0)) {
      var seriesTitleInput = new Textfield($('#seriesTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#seriesTitleText').text(e.target.value || 'New Series');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Series title and title input
    if ($('#episodeTitleInput').get(0)) {
      var episodeTitleInput = new Textfield($('#episodeTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#episodeTitleText').text(e.target.value || 'New Episode');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Series title and title input
    if ($('#eventTitleInput').get(0)) {
      var eventTitleInput = new Textfield($('#eventTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#eventTitleText').text(e.target.value || 'New Event');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Collection title and title input
    if ($('#collectionTitleInput').get(0)) {
      var collectionTitleInput = new Textfield($('#collectionTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#collectionTitleText').text(e.target.value || 'New Collection');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }
    //Master collection title and title input
    if ($('#masterCollectionTitleInput').get(0)) {
      var collectionTitleInput = new Textfield($('#masterCollectionTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#masterCollectionTitleText').text(e.target.value || 'New Collection Group');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //Promo wrapper title and title input
    if ($('#promoTitleInput').get(0)) {
      var promoTitleInput = new Textfield($('#promoTitleInput').get(0), {
        label: 'Title',
        helpText: 'Mauris malesuada nibh nec leo porta maximus.',
        errMsg: 'Please fill the title',
        onInput: function(e) {
          $('#promoTitleText').text(e.target.value || 'New Promo Wrapper');
          if (e.target.value !== '') {
            $('.header__subhead').removeClass('is-hidden');
          } else {
            $('.header__subhead').addClass('is-hidden');
          }
        }
      });
    }

    //autoexpandable textarea
    $( 'textarea' ).elastic();

    if ($('#eventTypeSelectbox').get(0)) {
      new Selectbox($('#eventTypeSelectbox').get(0), {
        label: 'Event Type',
        items: ['Movie', 'Live Event', 'Web Event', 'Special', 'Holiday Special', 'Prequel'/*, 'Recurring Event'*/].sort(),
        placeholder: 'Select Series',
        itemCallback: function(target, selectbox) {
          console.log(target, target.innerHTML, target.innerHTML === 'Movie', target.innerHTML === 'Recurring Event', selectbox);
          if (target.innerHTML === 'Movie') {
            $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').removeClass('is-disabled');
            //$('#recuringTime').addClass('hidden');
          } /*else if (target.innerHTML === 'Recurring Event') {
            $('#recuringTime').removeClass('hidden')
            $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').addClass('hidden');
          }*/ else {
            $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').addClass('is-disabled');
          }
        }
      });
    }

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

    //Series type toggle
    $('#seriesTypeToggle li').click(function(e) {
      $(e.target).parent().children('.active').removeClass('active');
      $(e.target).addClass('active');
      if (e.target.innerHTML === "Web Series") {
        $('#seriesProgTimeframe, #seriesSceduleDuration').addClass('is-disabled');
      } else if (e.target.innerHTML === "TV Series") {
        $('#seriesProgTimeframe, #seriesSceduleDuration').removeClass('is-disabled');
      }
    });
    //Episode type toggle
    $('#episodeTypeToggle li').click(function(e) {
      $(e.target).parent().children('.active').removeClass('active');
      $(e.target).addClass('active');
      if (e.target.innerHTML === "Web Episode") {
        $('#episodeOriginalDate, #episodeSupDate, #episodeTvRating').addClass('is-disabled');
      } else if (e.target.innerHTML === "TV Episode") {
        $('#episodeOriginalDate, #episodeSupDate, #episodeTvRating').removeClass('is-disabled');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb25Jbml0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBzY3JvbGxQb3NpdGlvbjtcbnZhciBzdGFydERhdGUgPSBuZXcgRGF0ZSgpO1xuXG4vL1N0aWNreSBzY3JvbGxiYXJcbnN0aWNreVRvcGJhciA9IG5ldyBTdGlja3lUb3BiYXIoKTtcblxuLy9TZXQgYWN0aXZlIG1lbnUgaXRlbVxubm9ybWlsaXplTWVudSgpO1xubm9ybWFsaXplUmVxdWlyZWRDb3VudCgpO1xuXG5cbi8vQ2xpY2sgb24gbG9nb1xuJCgnLmpzLWxvZ28nKS5jbGljayhoYW5kbGVMb2dvQ2xpY2spO1xuZnVuY3Rpb24gaGFuZGxlTG9nb0NsaWNrKGUpIHtcbiAgaWYgKHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJ2NyZWF0ZScpID49IDAgJiZcbiAgIWRyYWZ0SXNTYXZlZCAmJlxuICAkKCcuanMtY29udGVudCAuZmlsZSwgLmpzLWNvbnRlbnQgLmpzLWhhc1ZhbHVlJykubGVuZ3RoID4gMCkge1xuICAgIG5ldyBNb2RhbCh7XG4gICAgICB0aXRsZTogJ0xlYXZlIFBhZ2U/JyxcbiAgICAgIHRleHQ6ICdZb3Ugd2lsbCBsb3NlIGFsbCB1bnNhdmVkIGNoYW5nZXMuIEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBsZWF2ZSB0aGlzIHBhZ2U/JyxcbiAgICAgIGNvbmZpcm1UZXh0OiAnTGVhdmUgUGFnZScsXG4gICAgICBjb25maXJtQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgICAgfVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ2Rhc2hib2FyZC5odG1sJztcbiAgfVxufVxuXG4vL0Fzc2V0IExpYnJhcnlcblxuJCgnI2FsQ2xvc2VCdXR0b24nKS5jbGljayhjbG9zZUFzc2V0TGlicmFyeSk7XG4kKCcjYWxUb3BDbG9zZUJ1dHRvbicpLmNsaWNrKGNsb3NlQXNzZXRMaWJyYXJ5KTtcbiQoJyNhc3NldExpYnJhcnknKS5jbGljayhmdW5jdGlvbihlKSB7XG4gIG9wZW5Bc3NldExpYnJhcnkoZSk7XG59KTtcbmZ1bmN0aW9uIG9wZW5Bc3NldExpYnJhcnkoZSwgb3B0aW9ucykge1xuICBzY3JvbGxQb3NpdGlvbiA9ICQoJ2JvZHknKS5zY3JvbGxUb3AoKTtcbiAgdXBkYXRlQXNzZXRMaWJyYXJ5KCk7XG4gICQoJyNhbCcpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcbiAgJCgnI2FsJykuYWRkQ2xhc3MoJ21vZGFsJyk7XG4gICQoJyN3cmFwcGVyJykuYWRkQ2xhc3MoJ292ZXJmbG93Jyk7XG4gIHNpbmdsZXNlbGVjdCA9IGZhbHNlO1xuICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudGV4dCgnQWRkIEZpbGVzJyk7XG5cbiAgJCgnI2FkZEZyb21BTEJ1dHRvbicpLmNsaWNrKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSk7XG4gIHNldE1vZGFsS2V5Ym9hcmRBY3Rpb25zKGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSwgY2xvc2VBc3NldExpYnJhcnkpO1xuICAkKGUudGFyZ2V0KS5ibHVyKCk7XG59XG5cbmZ1bmN0aW9uIGFkZEZpbGVzRnJvbUFzc2V0TGlicmFyeSgpe1xuICBsYXN0U2VsZWN0ZWQgPSBudWxsO1xuICBhZGRTZWxlY3RlZEZpbGVzKCk7XG4gIGNsb3NlQXNzZXRMaWJyYXJ5KCk7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBoYW5kbGVFc2NLZXlkb3duKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVudGVyS2V5ZG93bik7XG59XG5mdW5jdGlvbiBjbG9zZUFzc2V0TGlicmFyeSgpIHtcbiAgbGFzdFNlbGVjdGVkID0gbnVsbDtcbiAgJCgnLmFsIC5maWxlcyAuc2VjdGlvbl9fZmlsZXMgLmZpbGUuc2VsZWN0ZWQnKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcbiAgZGVzZWxlY3RBbGwoKTtcbiAgJCgnLm1vZGFsJykuYWRkQ2xhc3MoJ2hpZGRlbicpLnJlbW92ZUNsYXNzKCdtb2RhbCcpO1xuICAkKCcjd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdycpO1xuICAkKCcjYWRkRnJvbUFMQnV0dG9uJykudW5iaW5kKCdjbGljaycpO1xuICAkKCdib2R5Jykuc2Nyb2xsVG9wKHNjcm9sbFBvc2l0aW9uKTtcbiAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGhhbmRsZUVzY0tleWRvd24pO1xuICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgaGFuZGxlRW50ZXJLZXlkb3duKTtcbn1cblxuJCgnI2FsJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAkKCcjYWwgLmZpbGVzIC5maWxlLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XG59KTtcbiQoJyNhbCAuZmlsZXMgLnNlY3Rpb25fX2ZpbGVzJykuZGlzYWJsZVNlbGVjdGlvbigpO1xuXG4vL1VwbG9hZCBmaWxlc1xuJCgnI3VwbG9hZEZpbGVzJykuY2xpY2soaGFuZGxlVXBsb2FkRmlsZXNDbGljayk7XG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdkcmFnZW50ZXInLCBoYW5kbGVEcmFnRW50ZXIsIHRydWUpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCBoYW5kbGVEcmFnT3ZlciwgZmFsc2UpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGhhbmRsZURyb3AsIGZhbHNlKTtcblxuLy9EcmFmdCBmdW5jdGlvbjogU2F2ZSwgQ2FuY2VsLCBQdWJsaXNoXG5mdW5jdGlvbiBzYXZlRHJhZnQoKSB7XG4gIHNob3dOb3RpZmljYXRpb24oJ1RoZSBkcmFmdCBpcyBzYXZlZC4nKTtcbiAgZHJhZnRJc1NhdmVkID0gdHJ1ZTtcbn1cbmZ1bmN0aW9uIHJlbW92ZURyYWZ0KCkge1xuICBuZXcgTW9kYWwoe1xuICAgIHRpdGxlOiAnQ2FuY2VsIHRoaXMgRHJhZnQ/JyxcbiAgICB0ZXh0OiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGNhbmNlbCBhbmQgZGlzY2FyZCB0aGlzIGRyYWZ0PycsXG4gICAgY29uZmlybVRleHQ6ICdDYW5jZWwnLFxuICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGFzaGJvYXJkLmh0bWwnO1xuICAgIH0sXG4gICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgfSk7XG59XG5mdW5jdGlvbiBwdWJsaXNoRHJhZnQoKSB7XG4gIHZhciBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCksXG4gIHByb21wdE1zZyA9ICcnO1xuXG4gIHN3aXRjaCAoaXRlbU5hbWUudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ3BlcnNvbic6XG4gICAgcHJvbXB0TXNnID0gJ1B1Ymxpc2hlZCBwZXJzb24gd2lsbCBiZWNvbWUgYXZhaWxhYmxlIHRvIGJlIGFkZGVkIGFzIHBhcnQgb2YgYSBjYXN0IGZvciBhIHNlYXNvbi9ldmVudC4gQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIHB1Ymxpc2ggaXQ/JztcbiAgICBicmVhaztcblxuICAgIGNhc2UgJ3JvbGUnOlxuICAgIHByb21wdE1zZyA9ICdQdWJsaXNoZWQgcm9sZSB3aWxsIGJlY29tZSBhdmFpbGFibGUgdG8gYmUgYWRkZWQgYXMgcGFydCBvZiBhIGNhc3QgZm9yIGEgc2Vhc29uL2V2ZW50LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gcHVibGlzaCBpdD8nO1xuICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICBwcm9tcHRNc2cgPSAnUHVibGlzaGVkICcgKyBpdGVtTmFtZS50b0xvd2VyQ2FzZSgpICsgJyB3aWxsIGJlY29tZSBhdmFpbGFibGUgb24gdGhlIGxpdmUgc2l0ZS4gQXJlIHlvdSBzdXJlIHlvdSB3b3VsZCBsaWtlIHRvIHB1Ymxpc2ggaXQ/JztcbiAgICBicmVhaztcblxuICB9XG4gIG5ldyBNb2RhbCh7XG4gICAgdGl0bGU6ICdQdWJsaXNoIHRoaXMgJyArIGl0ZW1OYW1lICsgJz8nLFxuICAgIHRleHQ6IHByb21wdE1zZyxcbiAgICBjb25maXJtVGV4dDogJ1B1Ymxpc2gnLFxuICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgaGlkZU1vZGFsUHJvbXB0KCk7XG4gICAgICBzaG93Tm90aWZpY2F0aW9uKGl0ZW1OYW1lICsgJyBpcyBwdWJsaXNoZWQuJyk7XG4gICAgICBkcmFmdElzU2F2ZWQgPSB0cnVlO1xuICAgIH0sXG4gICAgY2FuY2VsQWN0aW9uOiBoaWRlTW9kYWxQcm9tcHRcbiAgfSk7XG59XG5cbiQoJyNzYXZlRHJhZnQnKS5jbGljayhzYXZlRHJhZnQpO1xuJCgnI3JlbW92ZURyYWZ0JykuY2xpY2socmVtb3ZlRHJhZnQpO1xuJCgnI3B1Ymxpc2hEcmFmdCcpLmNsaWNrKHB1Ymxpc2hEcmFmdCk7XG5cbi8vVG9wIGJhciBhY3Rpb25zIGRyb3Bkb3duIGZvciBtb2JpbGVcbmlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWN0aW9uRHJvcGRvd24nKSkge1xuICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhY3Rpb25Ecm9wZG93bicpLFxuICAgIHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLWNoZWNrXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBTYXZlIGFzIGRyYWZ0PC9zcGFuPicsXG4gICAgICAgICAgY2FsbGJhY2s6IHNhdmVEcmFmdFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1iYW5cIj48L2k+PHNwYW4gY2xhc3M9XCJidXR0b25UZXh0XCI+ICBDYW5jZWw8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogcmVtb3ZlRHJhZnRcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgKTtcbn1cblxuLy9GaWxlcyBtb3JlIGFjdGlvbiBkcm9wZG93bnNcbmlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbW9yZUFjdGlvbnMnKSkge1xuICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb3JlQWN0aW9ucycpLFxuICAgIHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbm5lckhUTUw6ICdTZW5kIHRvIHRvcCcsXG4gICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVNlbmRUb1RvcENsaWNrXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpbm5lckhUTUw6ICdTZW5kIHRvIGJvdHRvbScsXG4gICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVNlbmRUb0JvdHRvbUNsaWNrXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gICk7XG59XG5cbi8vTWVkaWEgY2FyZCBkcm9wZG93bnNcbi8vU21hbGxcbmlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zU21hbGwnKSkge1xuICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZWRpYUFjdGlvbnNTbWFsbCcpLFxuICAgIHtcbiAgICAgIGl0ZW1zOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXVwbG9hZFwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgVXBsb2FkIGZpbGVzPC9zcGFuPicsXG4gICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZVVwbG9hZEZpbGVzQ2xpY2tcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtZm9sZGVyLW9wZW5cIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIEFkZCBmcm9tIGxpYnJhcnk8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgb3BlbkFzc2V0TGlicmFyeShlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gICk7XG59XG4vL0Z1bGxcbmlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWVkaWFBY3Rpb25zRnVsbCcpKSB7XG4gIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21lZGlhQWN0aW9uc0Z1bGwnKSxcbiAgICB7XG4gICAgICBpdGVtczogW1xuICAgICAgICB7XG4gICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1wZW5jaWwtc3F1YXJlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBNdWx0aSBFZGl0PC9zcGFuPicsXG4gICAgICAgICAgY2FsbGJhY2s6IGhhbmRsZU11bHRpRWRpdEJ1dHRvbkNsaWNrLFxuICAgICAgICAgIGRpc2FibGVkOiBmdW5jdGlvbigpIHtyZXR1cm4gJCgnI211bHRpRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBSZW1vdmU8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogaGFuZGxlQnVsa1JlbW92ZWxpY2ssXG4gICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjYnVsa1JlbW92ZScpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGRpdmlkZXI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgaW5uZXJIVE1MOiAnPGkgY2xhc3M9XCJmYSBmYS1mb2xkZXItb3BlblwiPjwvaT48c3BhbiBjbGFzcz1cIlwiPiAgQWRkIGZyb20gbGlicmFyeTwvc3Bhbj4nLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBvcGVuQXNzZXRMaWJyYXJ5KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgKTtcbn1cblxuLy9Bc3NldCBsaWJyYXJ5IGRyb3Bkb3duc1xuLy9TbWFsbFxuaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNTbWFsbCcpKSB7XG4gIHZhciBwYWdlQWN0aW9uRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzc2V0QWN0aW9uc1NtYWxsJyksXG4gICAge1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICApO1xufVxuLy9GdWxsXG5pZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Fzc2V0QWN0aW9uc0Z1bGwnKSkge1xuICB2YXIgcGFnZUFjdGlvbkRyb3Bkb3duID0gbmV3IERyb3Bkb3duKFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhc3NldEFjdGlvbnNGdWxsJyksXG4gICAge1xuICAgICAgaXRlbXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtcGVuY2lsXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBCdWxrIEVkaXQ8L3NwYW4+PHNwYW4gY2xhc3M9XCJkcm9wZG93bl9fd2FybmluZ1wiPjwvc3Bhbj4nLFxuICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNidWxrRWRpdCcpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO30sXG4gICAgICAgICAgd2FybmluZzogZnVuY3Rpb24oKSB7cmV0dXJuICEkKCcjYnVsa0VkaXQnKS5jaGlsZHJlbignLmJ1dHRvbl9fd2FybmluZycpLmhhc0NsYXNzKCdpcy1oaWRkZW4nKTt9XG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBpbm5lckhUTUw6ICc8aSBjbGFzcz1cImZhIGZhLXBlbmNpbC1zcXVhcmVcIj48L2k+PHNwYW4gY2xhc3M9XCJcIj4gIE11bHRpIEVkaXQ8L3NwYW4+PHNwYW4gY2xhc3M9XCJkcm9wZG93bl9fd2FybmluZ1wiPjwvc3Bhbj4nLFxuICAgICAgICAgIGNhbGxiYWNrOiBoYW5kbGVNdWx0aUVkaXRCdXR0b25DbGljayxcbiAgICAgICAgICBkaXNhYmxlZDogZnVuY3Rpb24oKSB7cmV0dXJuICQoJyNtdWx0aUVkaXQnKS5oYXNDbGFzcygnZGlzYWJsZWQnKTt9LFxuICAgICAgICAgIHdhcm5pbmc6IGZ1bmN0aW9uKCkge3JldHVybiAhJCgnI211bHRpRWRpdCcpLmNoaWxkcmVuKCcuYnV0dG9uX193YXJuaW5nJykuaGFzQ2xhc3MoJ2lzLWhpZGRlbicpO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdGltZXMtY2lyY2xlXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBSZW1vdmU8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogaGFuZGxlQnVsa1JlbW92ZWxpY2ssXG4gICAgICAgICAgZGlzYWJsZWQ6IGZ1bmN0aW9uKCkge3JldHVybiAkKCcjYnVsa1JlbW92ZScpLmhhc0NsYXNzKCdkaXNhYmxlZCcpO31cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGRpdmlkZXI6IHRydWVcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIGlubmVySFRNTDogJzxpIGNsYXNzPVwiZmEgZmEtdXBsb2FkXCI+PC9pPjxzcGFuIGNsYXNzPVwiXCI+ICBVcGxvYWQgZmlsZXM8L3NwYW4+JyxcbiAgICAgICAgICBjYWxsYmFjazogaGFuZGxlVXBsb2FkRmlsZXNDbGlja1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICApO1xufVxuXG5cbi8vSW5pdCBwbGFjZWhvbGRlcnMgZm9yIGltYWdlcyBpZiBhbnkgKGNvdmVyLCBldGMuKVxud2luZG93LmltYWdlUGxhY2Vob2xkZXJzID0gaW5pdEltYWdlUGxhY2Vob2xkZXJzKCk7XG5cbi8vRm9jYWwgcG9pbnRcbiQoJyNmb2NhbFBvaW50VG9nZ2xlJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAkKGUudGFyZ2V0KS50b2dnbGVDbGFzcygnaXMtYWN0aXZlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLXdoaXRlIGJ1dHRvbl9zdHlsZV9vdXRsaW5lLWFjY2VudCcpO1xuICAkKCcucHIgPiAucHJldmlldycpLnRvZ2dsZUNsYXNzKCdmb2NhbCBsaW5lIHBvaW50Jyk7XG4gIC8qaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdpcy1hY3RpdmUnKSkge1xuICAkKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdmb2NhbCBsaW5lIHBvaW50Jyk7XG4gICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbn0gZWxzZSB7XG4kKCcucHIgPiAucHJldmlldycpLmFkZENsYXNzKCdmb2NhbCBsaW5lIHBvaW50Jyk7XG4kKCcucHIgPiAucHJldmlldycpLnJlbW92ZUNsYXNzKCdyZWN0Jyk7XG4kKCcjZm9jYWxSZWN0VG9nZ2xlJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuJChlLnRhcmdldCkuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xufSovXG5cbn0pO1xuLyogSGFuZGxlIFB1cnBvc2VzIHNjcm9sbCAqL1xuJCgnI3B1cnBvc2VXcmFwcGVyJykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICBzZXRQdXJwb3NlUGFnaW5hdGlvbigpO1xufSk7XG5cbiQoJyNmb2NhbFBvaW50JykuZHJhZ2dhYmxlKHtcbiAgY29udGFpbm1lbnQ6IFwiI3ByZXZpZXdJbWdcIixcbiAgc2Nyb2xsOiBmYWxzZSAsXG4gIHN0b3A6IGZ1bmN0aW9uKGUpIHtcbiAgICBhZGp1c3RGb2NhbFBvaW50KCk7XG4gICAgYWRqdXN0UHVycG9zZSgkKGUudGFyZ2V0KSk7XG4gICAgZGF0YUNoYW5nZWQgPSB0cnVlO1xuICB9XG59KTtcbi8qIEluaXQgUHVycG9zZSBQYWdpbmF0b3IgKi9cblxuZnVuY3Rpb24gc2V0UHVycG9zZVBhZ2luYXRpb24oKSB7XG4gIHZhciBzY3JvbGxPZmZzZXQgPSAkKCcjcHVycG9zZVdyYXBwZXInKS5zY3JvbGxMZWZ0KCk7XG4gIHZhciB3aWR0aCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwdXJwb3NlV3JhcHBlcicpLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB2YXIgZmlyc3RJbmRleCA9IE1hdGguZmxvb3Ioc2Nyb2xsT2Zmc2V0LzE0MCkgKyAxO1xuICB2YXIgbGFzdEluZGV4ID0gZmlyc3RJbmRleCArIE1hdGgucm91bmQod2lkdGgvMTQwKSAtIDE7XG4gIHZhciBjb3VudCA9ICQoJyNwdXJwb3NlV3JhcHBlciAucHVycG9zZScpLmxlbmd0aDtcblxuICBsYXN0SW5kZXggPSBsYXN0SW5kZXggPCBjb3VudCA/IGxhc3RJbmRleCA6IGNvdW50O1xuXG4gICQoJyNwLXBhZ2luYXRvcicpLnRleHQoZmlyc3RJbmRleCArICcg4oCUICcgKyBsYXN0SW5kZXggKyAnIG9mICcgKyBjb3VudCk7XG59XG5cbiQoJyNzaG93UHJldmlldycpLmNsaWNrKHNob3dBbGxQcmV2aWV3cyk7XG4kKCcjaGlkZVB1cnBvc2UnKS5jbGljayhoaWRlQWxsUHJldmlld3MpO1xuJCgnI2xvYWRNb3JlJykuY2xpY2soaGFuZGxlU2hvd01vcmUpO1xuXG5mdW5jdGlvbiBzaG93QWxsUHJldmlld3MoKSB7XG4gICQoJyNwdXJwb3NlcycpLmFkZENsYXNzKCdpcy1vcGVuJyk7XG4gICQoJyNwcmV2aWV3SW1hZ2UnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICQoJyNwcmV2aWV3Q29udHJvbHMnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG5cbiAgLy9DaGVjayBpZiBpdCBpcyBhIG1vYmlsZSBzY3JlZW5cbiAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDwgNjUwKSB7XG4gICAgJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2VcIikuYWRkQ2xhc3MoJ2hpZGRlbicpO1xuICAgICQoXCIjcHVycG9zZXMgLmMtUHVycG9zZXMtY29udGFpbmVyIC5wdXJwb3NlLmhpZGRlblwiKS5zbGljZSgwLCA1KS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XG4gICAgJCgnI2xvYWRNb3JlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICB9XG4gIC8vJCgnLnByZXZpZXcuZm9jYWwnKS5hZGRDbGFzcygnZnVsbCcpLnJlbW92ZUNsYXNzKCdsaW5lJyk7XG4gIC8vJCgnI3B1cnBvc2VUb2dnbGUnKS5jaGlsZHJlbignc3BhbicpLnRleHQoJ0hpZGUgUHJldmlldycpO1xufVxuZnVuY3Rpb24gaGlkZUFsbFByZXZpZXdzKCkge1xuICAkKCcjcHVycG9zZXMnKS5yZW1vdmVDbGFzcygnaXMtb3BlbicpO1xuICAkKCcjcHJldmlld0ltYWdlJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAkKCcjcHJldmlld0NvbnRyb2xzJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xufVxuZnVuY3Rpb24gaGFuZGxlU2hvd01vcmUoZSkge1xuICAkKFwiI3B1cnBvc2VzIC5jLVB1cnBvc2VzLWNvbnRhaW5lciAucHVycG9zZS5oaWRkZW5cIikuc2xpY2UoMCwgNSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICBpZiAoJChcIiNwdXJwb3NlcyAuYy1QdXJwb3Nlcy1jb250YWluZXIgLnB1cnBvc2UuaGlkZGVuXCIpLmxlbmd0aCA9PT0gMCkge1xuICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgfVxufVxuXG5cbi8vU2VsZWN0ZWQgRmlsZXMgYWN0aW9uc1xuJCgnI2J1bGtFZGl0JykuY2xpY2soaGFuZGxlQnVsa0VkaXRCdXR0b25DbGljayk7XG4kKCcjbXVsdGlFZGl0JykuY2xpY2soaGFuZGxlTXVsdGlFZGl0QnV0dG9uQ2xpY2spO1xuJCgnI2J1bGtSZW1vdmUnKS5jbGljayhoYW5kbGVCdWxrUmVtb3ZlbGljayk7XG5cbmZ1bmN0aW9uIGhhbmRsZUJ1bGtSZW1vdmVsaWNrKCkge1xuICB2YXIgZmlsZXNUb0RlbGV0ZSA9ICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zZWxlY3RlZCcpLFxuICBpdGVtTmFtZSA9ICQoJy5tZW51IC5pcy1hY3RpdmUnKS50ZXh0KCkudG9Mb3dlckNhc2UoKSxcbiAgYXNzZXRMaWJyYXJ5ID0gaXRlbU5hbWUgPT09ICdhc3NldCBsaWJyYXJ5JyxcbiAgbXNnVGl0bGUgPSBhc3NldExpYnJhcnk/ICdEZWxldGUgQXNzZXRzPycgOiAnUmVtb3ZlIEFzc2V0cz8nLFxuICBtZXNnVGV4dCA9IGFzc2V0TGlicmFyeT8gJ1NlbGVjdGVkIGFzc2V0KHMpIHdpbGwgYmUgZGVsZXRlZCBmcm9tIHRoZSBhc3NldCBsaWJyYXJ5LiBBcmUgeW91IHN1cmUgeW91IHdhbnQgdG8gZGVsZXRlIHRoZW0/JyA6ICdTZWxlY3RlZCBhc3NldChzKSB3aWxsIGJlIHJlbW92ZWQgZnJvbSB0aGlzICcgKyBpdGVtTmFtZSArICcuIERvbuKAmXQgd29ycnksIGl0IHdvbuKAmXQgYmUgZGVsZXRlZCBmcm9tIHRoZSBBc3NldCBMaWJyYXJ5LicsXG4gIGJ0bk5hbWUgPSBhc3NldExpYnJhcnk/ICdEZWxldGUnIDogJ1JlbW92ZSc7XG4gIG5ldyBNb2RhbCh7XG4gICAgdGl0bGU6IG1zZ1RpdGxlLFxuICAgIHRleHQ6IG1lc2dUZXh0LFxuICAgIGNvbmZpcm1UZXh0OiBidG5OYW1lLFxuICAgIGNvbmZpcm1BY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgICAgZmlsZXNUb0RlbGV0ZS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgIHZhciBpZCA9ICQoZWwpLmZpbmQoJy5maWxlX19pZCcpLnRleHQoKTtcbiAgICAgICAgZGVsZXRlRmlsZUJ5SWQoaWQsIGdhbGxlcnlPYmplY3RzKTtcbiAgICAgIH0pO1xuICAgICAgdXBkYXRlR2FsbGVyeSgpO1xuICAgIH0sXG4gICAgY2FuY2VsQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICAgICQoJy5qcy1jb250ZW50IC5maWxlcyAuZmlsZS5zYnInKS5yZW1vdmVDbGFzcygnc2JyJyk7XG4gICAgfVxuICB9KTtcbn1cblxuLy9GaWxlIEVkaXQgU2F2ZSBhbmQgQ2FuY2VsXG4kKCcjc2F2ZUNoYW5nZXMnKS5jbGljayhzYXZlSW1hZ2VFZGl0KTtcbiQoJyNjYW5jZWxDaGFuZ2VzJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcbiQoJyNmcFRvcENsb3NlQnV0dG9uJykuY2xpY2soY2FuY2VsSW1hZ2VFZGl0KTtcblxuLy9GaWxlIEVkaXQgZmllbGQgY2hhbmdlc1xuJCgnI3RpdGxlJykub24oJ2lucHV0JywgZnVuY3Rpb24oZSkge3NhdmVUaXRsZSgpO30pO1xuJCgnI2NhcHRpb24nKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZUNhcHRpb24oKTt9KTtcbiQoJyNkZXNjcmlwdGlvbicpLm9uKCdpbnB1dCcsIGZ1bmN0aW9uKGUpIHtzYXZlRGVzY3JpcHRpb24oKTt9KTtcbiQoJyNyZXNvbHV0aW9uJykub24oJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtzYXZlUmVzb2x1dGlvbigpO30pO1xuJCgnI2FsdFRleHQnKS5vbignaW5wdXQnLCBmdW5jdGlvbihlKSB7c2F2ZUFsdFRleHQoKTt9KTtcblxuLy9IYW5kbGUgc2VsZWN0aW9uc1xuJCgnI3NlbGVjdEFsbCcpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgaWYgKCQoZS50YXJnZXQpLmhhc0NsYXNzKCdlbXB0eScpKSB7XG4gICAgc2VsZWN0QWxsKCk7XG4gIH0gZWxzZSB7XG4gICAgZGVzZWxlY3RBbGwoKTtcbiAgfVxufSk7XG4kKCcjZGVzZWxlY3RBbGwnKS5jbGljayhmdW5jdGlvbihlKSB7ZGVzZWxlY3RBbGwoKTt9KTtcblxuLy9Jbml0IGFkZGFibGUgZmllbGRzXG5pbml0QWRkYWJsZUZpZWxkcygpO1xuXG4vL0luaXQgQ2FzdCBjb2xsZWN0aW9uXG5pbml0Q2FzdFNlY3Rpb24oJCgnI2Nhc3RTZWN0aW9uJykuZmluZCgnLmNvbnRyb2xzX19ncm91cCcpKTtcbmluaXRDcmVkaXRTZWN0aW9uKCQoJyNjcmVkaXRTZWN0aW9uJykuZmluZCgnLmNvbnRyb2xzX19ncm91cCcpKTtcblxuLy9Jbml0IENvbGxlY3Rpb24gc2VjdGlvblxuaWYgKCQoJyNjb2xsZWN0aW9uU2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKS5sZW5ndGggPiAwKSB7XG4gIGluaXRDb2xsU2VjdGlvbigkKCcjY29sbGVjdGlvblNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykpO1xufVxuaWYgKCQoJyNtYXN0ZXJDb2xsZWN0aW9uU2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKS5sZW5ndGggPiAwKSB7XG4gIGluaXRDb2xsU2VjdGlvbigkKCcjbWFzdGVyQ29sbGVjdGlvblNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJyksIGNvbGxlY3Rpb25zLCAnQ29sbGVjdGlvbicpO1xufVxuaWYgKCQoJyNwYWdlQ29sbGVjdGlvblNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykubGVuZ3RoID4gMCkge1xuICBpbml0T25lQ29sbGVjdGlvblNlY3Rpb24oJCgnI3BhZ2VDb2xsZWN0aW9uU2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKSk7XG59XG5cblxuLy9Jbml0IEFzc29jaWF0aW9uIHNlY3Rpb25cbmlmICgkKCcjY29sbGVjdGlvblNlcmllc1NlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykubGVuZ3RoID4gMCkge1xuICBpbml0U2VyaWVzU2VjdGlvbigkKCcjY29sbGVjdGlvblNlcmllc1NlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykpO1xufVxuaWYgKCQoJyNjb2xsZWN0aW9uUGFnZVNlY3Rpb24nKS5maW5kKCcuY29udHJvbHNfX2dyb3VwJykubGVuZ3RoID4gMCkge1xuICBpbml0UGFnZVNlY3Rpb24oJCgnI2NvbGxlY3Rpb25QYWdlU2VjdGlvbicpLmZpbmQoJy5jb250cm9sc19fZ3JvdXAnKSwgY29sbGVjdGlvbnMpO1xufVxuXG4vL0luaXQgUGVyc29uIG5hbWUgZmllbGRzIGFuZCBUaXRsZVxuaWYgKCQoJyNwZXJzb25QcmVmaXhJbnB1dCcpLmdldCgwKSkge1xuICB2YXIgcGVyc29uUHJlZml4SW5wdXQgPSBuZXcgVGV4dGZpZWxkKCQoJyNwZXJzb25QcmVmaXhJbnB1dCcpLmdldCgwKSwge1xuICAgIGxhYmVsOiAnUHJlZml4JyxcbiAgICBvbklucHV0OiBoYW5kbGVQZXJzb25UaXRsZUNoYW5nZVxuICB9KTtcbn1cbmlmICgkKCcjcGVyc29uRmlyc3RJbnB1dCcpLmdldCgwKSkge1xuICB2YXIgcGVyc29uRmlyc3RJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3BlcnNvbkZpcnN0SW5wdXQnKS5nZXQoMCksIHtcbiAgICBsYWJlbDogJ0ZpcnN0IE5hbWUnLFxuICAgIGVyck1zZzogJ1BsZWFzZSBlbnRlciB0aGUgZmlyc3QgbmFtZScsXG4gICAgb25JbnB1dDogaGFuZGxlUGVyc29uVGl0bGVDaGFuZ2VcbiAgfSk7XG59XG5pZiAoJCgnI3BlcnNvbk1pZGRsZUlucHV0JykuZ2V0KDApKSB7XG4gIHZhciBwZXJzb25NaWRkbGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3BlcnNvbk1pZGRsZUlucHV0JykuZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdNaWRkbGUgTmFtZScsXG4gICAgb25JbnB1dDogaGFuZGxlUGVyc29uVGl0bGVDaGFuZ2VcbiAgfSk7XG59XG5pZiAoJCgnI3BlcnNvbkxhc3RJbnB1dCcpLmdldCgwKSkge1xuICB2YXIgcGVyc29uTGFzdElucHV0ID0gbmV3IFRleHRmaWVsZCgkKCcjcGVyc29uTGFzdElucHV0JykuZ2V0KDApLCB7XG4gICAgbGFiZWw6ICdMYXN0IE5hbWUnLFxuICAgIG9uSW5wdXQ6IGhhbmRsZVBlcnNvblRpdGxlQ2hhbmdlXG4gIH0pO1xufVxuaWYgKCQoJyNwZXJzb25TdWZmaXhJbnB1dCcpLmdldCgwKSkge1xuICB2YXIgcGVyc29uU3VmZml4SW5wdXQgPSBuZXcgVGV4dGZpZWxkKCQoJyNwZXJzb25TdWZmaXhJbnB1dCcpLmdldCgwKSwge1xuICAgIGxhYmVsOiAnU3VmZml4JyxcbiAgICBvbklucHV0OiBoYW5kbGVQZXJzb25UaXRsZUNoYW5nZVxuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBoYW5kbGVQZXJzb25UaXRsZUNoYW5nZShlKSB7XG4gIGlmICgkKCcjcGVyc29uUHJlZml4SW5wdXQnKS52YWwoKSB8fCAkKCcjcGVyc29uRmlyc3RJbnB1dCcpLnZhbCgpIHx8ICQoJyNwZXJzb25NaWRkbGVJbnB1dCcpLnZhbCgpIHx8ICQoJyNwZXJzb25MYXN0SW5wdXQnKS52YWwoKSB8fCAkKCcjcGVyc29uU3VmZml4SW5wdXQnKS52YWwoKSkge1xuICAgICQoJyNwZXJzb25UaXRsZVRleHQnKS50ZXh0KFxuICAgICAgJCgnI3BlcnNvblByZWZpeElucHV0JykudmFsKCkgKyAnICcgK1xuICAgICAgJCgnI3BlcnNvbkZpcnN0SW5wdXQnKS52YWwoKSArICcgJyArXG4gICAgICAkKCcjcGVyc29uTWlkZGxlSW5wdXQnKS52YWwoKSArICcgJyArXG4gICAgICAkKCcjcGVyc29uTGFzdElucHV0JykudmFsKCkgKyAnICcgK1xuICAgICAgJCgnI3BlcnNvblN1ZmZpeElucHV0JykudmFsKCkpO1xuICAgICAgJCgnLmhlYWRlcl9fc3ViaGVhZCcpLnJlbW92ZUNsYXNzKCdpcy1oaWRkZW4nKTtcbiAgICAgICQoJy5oZWFkZXJfX3Rvb2x0aXAnKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJCgnI3BlcnNvblRpdGxlVGV4dCcpLnRleHQoJ05ldyBQZXNyb24nKTtcbiAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAkKCcuaGVhZGVyX190b29sdGlwJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgfVxuICB9XG5cbiAgLy9Jbml0IGNoYXJhY3RlciBuYW1lIGZpZWxkcyBhbmQgVGl0bGVcbiAgaWYgKCQoJyNjaGFyYWN0ZXJQcmVmaXhJbnB1dCcpLmdldCgwKSkge1xuICAgIHZhciBjaGFyYWN0ZXJQcmVmaXhJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2NoYXJhY3RlclByZWZpeElucHV0JykuZ2V0KDApLCB7XG4gICAgICBsYWJlbDogJ1ByZWZpeCcsXG4gICAgICBvbklucHV0OiBoYW5kbGVjaGFyYWN0ZXJUaXRsZUNoYW5nZVxuICAgIH0pO1xuICB9XG4gIGlmICgkKCcjY2hhcmFjdGVyRmlyc3RJbnB1dCcpLmdldCgwKSkge1xuICAgIHZhciBjaGFyYWN0ZXJGaXJzdElucHV0ID0gbmV3IFRleHRmaWVsZCgkKCcjY2hhcmFjdGVyRmlyc3RJbnB1dCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdGaXJzdCBOYW1lJyxcbiAgICAgIGVyck1zZzogJ1BsZWFzZSBlbnRlciB0aGUgZmlyc3QgbmFtZScsXG4gICAgICBvbklucHV0OiBoYW5kbGVjaGFyYWN0ZXJUaXRsZUNoYW5nZVxuICAgIH0pO1xuICB9XG4gIGlmICgkKCcjY2hhcmFjdGVyTWlkZGxlSW5wdXQnKS5nZXQoMCkpIHtcbiAgICB2YXIgY2hhcmFjdGVyTWlkZGxlSW5wdXQgPSBuZXcgVGV4dGZpZWxkKCQoJyNjaGFyYWN0ZXJNaWRkbGVJbnB1dCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdNaWRkbGUgTmFtZScsXG4gICAgICBvbklucHV0OiBoYW5kbGVjaGFyYWN0ZXJUaXRsZUNoYW5nZVxuICAgIH0pO1xuICB9XG4gIGlmICgkKCcjY2hhcmFjdGVyTGFzdElucHV0JykuZ2V0KDApKSB7XG4gICAgdmFyIGNoYXJhY3Rlckxhc3RJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2NoYXJhY3Rlckxhc3RJbnB1dCcpLmdldCgwKSwge1xuICAgICAgbGFiZWw6ICdMYXN0IE5hbWUnLFxuICAgICAgb25JbnB1dDogaGFuZGxlY2hhcmFjdGVyVGl0bGVDaGFuZ2VcbiAgICB9KTtcbiAgfVxuICBpZiAoJCgnI2NoYXJhY3RlclN1ZmZpeElucHV0JykuZ2V0KDApKSB7XG4gICAgdmFyIGNoYXJhY3RlclN1ZmZpeElucHV0ID0gbmV3IFRleHRmaWVsZCgkKCcjY2hhcmFjdGVyU3VmZml4SW5wdXQnKS5nZXQoMCksIHtcbiAgICAgIGxhYmVsOiAnU3VmZml4JyxcbiAgICAgIG9uSW5wdXQ6IGhhbmRsZWNoYXJhY3RlclRpdGxlQ2hhbmdlXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVjaGFyYWN0ZXJUaXRsZUNoYW5nZShlKSB7XG4gICAgaWYgKCQoJyNjaGFyYWN0ZXJQcmVmaXhJbnB1dCcpLnZhbCgpIHx8ICQoJyNjaGFyYWN0ZXJGaXJzdElucHV0JykudmFsKCkgfHwgJCgnI2NoYXJhY3Rlck1pZGRsZUlucHV0JykudmFsKCkgfHwgJCgnI2NoYXJhY3Rlckxhc3RJbnB1dCcpLnZhbCgpIHx8ICQoJyNjaGFyYWN0ZXJTdWZmaXhJbnB1dCcpLnZhbCgpKSB7XG4gICAgICAkKCcjY2hhcmFjdGVyVGl0bGVUZXh0JykudGV4dChcbiAgICAgICAgJCgnI2NoYXJhY3RlclByZWZpeElucHV0JykudmFsKCkgKyAnICcgK1xuICAgICAgICAkKCcjY2hhcmFjdGVyRmlyc3RJbnB1dCcpLnZhbCgpICsgJyAnICtcbiAgICAgICAgJCgnI2NoYXJhY3Rlck1pZGRsZUlucHV0JykudmFsKCkgKyAnICcgK1xuICAgICAgICAkKCcjY2hhcmFjdGVyTGFzdElucHV0JykudmFsKCkgKyAnICcgK1xuICAgICAgICAkKCcjY2hhcmFjdGVyU3VmZml4SW5wdXQnKS52YWwoKSk7XG4gICAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICQoJy5oZWFkZXJfX3Rvb2x0aXAnKS5hZGRDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoJyNjaGFyYWN0ZXJUaXRsZVRleHQnKS50ZXh0KCdOZXcgUm9sZScpO1xuICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAkKCcuaGVhZGVyX190b29sdGlwJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9TZWFzb24gdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gICAgaWYgKCQoJyNzZWFzb25UaXRsZUlucHV0JykuZ2V0KDApKSB7XG4gICAgICB2YXIgc2Vhc29uVGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3NlYXNvblRpdGxlSW5wdXQnKS5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGl0bGUnLFxuICAgICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgJCgnI3NlYXNvblRpdGxlVGV4dCcpLnRleHQoZS50YXJnZXQudmFsdWUgfHwgJ05ldyBTZWFzb24nKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9HYWxsZXJ5IHRpdGxlIGFuZCB0aXRsZSBpbnB1dFxuICAgIGlmICgkKCcjZ2FsbGVyeVRpdGxlSW5wdXQnKS5nZXQoMCkpIHtcbiAgICAgIHZhciBnYWxsZXJ5VGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2dhbGxlcnlUaXRsZUlucHV0JykuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnVGl0bGUnLFxuICAgICAgICBoZWxwVGV4dDogJ01hdXJpcyBtYWxlc3VhZGEgbmliaCBuZWMgbGVvIHBvcnRhIG1heGltdXMuJyxcbiAgICAgICAgZXJyTXNnOiAnUGxlYXNlIGZpbGwgdGhlIHRpdGxlJyxcbiAgICAgICAgb25JbnB1dDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICQoJyNnYWxsZXJ5VGl0bGVUZXh0JykudGV4dChlLnRhcmdldC52YWx1ZSB8fCAnTmV3IEdhbGxlcnknKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9TZXJpZXMgdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gICAgaWYgKCQoJyNzZXJpZXNUaXRsZUlucHV0JykuZ2V0KDApKSB7XG4gICAgICB2YXIgc2VyaWVzVGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI3Nlcmllc1RpdGxlSW5wdXQnKS5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGl0bGUnLFxuICAgICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgJCgnI3Nlcmllc1RpdGxlVGV4dCcpLnRleHQoZS50YXJnZXQudmFsdWUgfHwgJ05ldyBTZXJpZXMnKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9TZXJpZXMgdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gICAgaWYgKCQoJyNlcGlzb2RlVGl0bGVJbnB1dCcpLmdldCgwKSkge1xuICAgICAgdmFyIGVwaXNvZGVUaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCgkKCcjZXBpc29kZVRpdGxlSW5wdXQnKS5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGl0bGUnLFxuICAgICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgJCgnI2VwaXNvZGVUaXRsZVRleHQnKS50ZXh0KGUudGFyZ2V0LnZhbHVlIHx8ICdOZXcgRXBpc29kZScpO1xuICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL1NlcmllcyB0aXRsZSBhbmQgdGl0bGUgaW5wdXRcbiAgICBpZiAoJCgnI2V2ZW50VGl0bGVJbnB1dCcpLmdldCgwKSkge1xuICAgICAgdmFyIGV2ZW50VGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2V2ZW50VGl0bGVJbnB1dCcpLmdldCgwKSwge1xuICAgICAgICBsYWJlbDogJ1RpdGxlJyxcbiAgICAgICAgaGVscFRleHQ6ICdNYXVyaXMgbWFsZXN1YWRhIG5pYmggbmVjIGxlbyBwb3J0YSBtYXhpbXVzLicsXG4gICAgICAgIGVyck1zZzogJ1BsZWFzZSBmaWxsIHRoZSB0aXRsZScsXG4gICAgICAgIG9uSW5wdXQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAkKCcjZXZlbnRUaXRsZVRleHQnKS50ZXh0KGUudGFyZ2V0LnZhbHVlIHx8ICdOZXcgRXZlbnQnKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9Db2xsZWN0aW9uIHRpdGxlIGFuZCB0aXRsZSBpbnB1dFxuICAgIGlmICgkKCcjY29sbGVjdGlvblRpdGxlSW5wdXQnKS5nZXQoMCkpIHtcbiAgICAgIHZhciBjb2xsZWN0aW9uVGl0bGVJbnB1dCA9IG5ldyBUZXh0ZmllbGQoJCgnI2NvbGxlY3Rpb25UaXRsZUlucHV0JykuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnVGl0bGUnLFxuICAgICAgICBoZWxwVGV4dDogJ01hdXJpcyBtYWxlc3VhZGEgbmliaCBuZWMgbGVvIHBvcnRhIG1heGltdXMuJyxcbiAgICAgICAgZXJyTXNnOiAnUGxlYXNlIGZpbGwgdGhlIHRpdGxlJyxcbiAgICAgICAgb25JbnB1dDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICQoJyNjb2xsZWN0aW9uVGl0bGVUZXh0JykudGV4dChlLnRhcmdldC52YWx1ZSB8fCAnTmV3IENvbGxlY3Rpb24nKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIC8vTWFzdGVyIGNvbGxlY3Rpb24gdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gICAgaWYgKCQoJyNtYXN0ZXJDb2xsZWN0aW9uVGl0bGVJbnB1dCcpLmdldCgwKSkge1xuICAgICAgdmFyIGNvbGxlY3Rpb25UaXRsZUlucHV0ID0gbmV3IFRleHRmaWVsZCgkKCcjbWFzdGVyQ29sbGVjdGlvblRpdGxlSW5wdXQnKS5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGl0bGUnLFxuICAgICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgJCgnI21hc3RlckNvbGxlY3Rpb25UaXRsZVRleHQnKS50ZXh0KGUudGFyZ2V0LnZhbHVlIHx8ICdOZXcgQ29sbGVjdGlvbiBHcm91cCcpO1xuICAgICAgICAgIGlmIChlLnRhcmdldC52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5yZW1vdmVDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5oZWFkZXJfX3N1YmhlYWQnKS5hZGRDbGFzcygnaXMtaGlkZGVuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL1Byb21vIHdyYXBwZXIgdGl0bGUgYW5kIHRpdGxlIGlucHV0XG4gICAgaWYgKCQoJyNwcm9tb1RpdGxlSW5wdXQnKS5nZXQoMCkpIHtcbiAgICAgIHZhciBwcm9tb1RpdGxlSW5wdXQgPSBuZXcgVGV4dGZpZWxkKCQoJyNwcm9tb1RpdGxlSW5wdXQnKS5nZXQoMCksIHtcbiAgICAgICAgbGFiZWw6ICdUaXRsZScsXG4gICAgICAgIGhlbHBUZXh0OiAnTWF1cmlzIG1hbGVzdWFkYSBuaWJoIG5lYyBsZW8gcG9ydGEgbWF4aW11cy4nLFxuICAgICAgICBlcnJNc2c6ICdQbGVhc2UgZmlsbCB0aGUgdGl0bGUnLFxuICAgICAgICBvbklucHV0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgJCgnI3Byb21vVGl0bGVUZXh0JykudGV4dChlLnRhcmdldC52YWx1ZSB8fCAnTmV3IFByb21vIFdyYXBwZXInKTtcbiAgICAgICAgICBpZiAoZS50YXJnZXQudmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykucmVtb3ZlQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuaGVhZGVyX19zdWJoZWFkJykuYWRkQ2xhc3MoJ2lzLWhpZGRlbicpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9hdXRvZXhwYW5kYWJsZSB0ZXh0YXJlYVxuICAgICQoICd0ZXh0YXJlYScgKS5lbGFzdGljKCk7XG5cbiAgICBpZiAoJCgnI2V2ZW50VHlwZVNlbGVjdGJveCcpLmdldCgwKSkge1xuICAgICAgbmV3IFNlbGVjdGJveCgkKCcjZXZlbnRUeXBlU2VsZWN0Ym94JykuZ2V0KDApLCB7XG4gICAgICAgIGxhYmVsOiAnRXZlbnQgVHlwZScsXG4gICAgICAgIGl0ZW1zOiBbJ01vdmllJywgJ0xpdmUgRXZlbnQnLCAnV2ViIEV2ZW50JywgJ1NwZWNpYWwnLCAnSG9saWRheSBTcGVjaWFsJywgJ1ByZXF1ZWwnLyosICdSZWN1cnJpbmcgRXZlbnQnKi9dLnNvcnQoKSxcbiAgICAgICAgcGxhY2Vob2xkZXI6ICdTZWxlY3QgU2VyaWVzJyxcbiAgICAgICAgaXRlbUNhbGxiYWNrOiBmdW5jdGlvbih0YXJnZXQsIHNlbGVjdGJveCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHRhcmdldCwgdGFyZ2V0LmlubmVySFRNTCwgdGFyZ2V0LmlubmVySFRNTCA9PT0gJ01vdmllJywgdGFyZ2V0LmlubmVySFRNTCA9PT0gJ1JlY3VycmluZyBFdmVudCcsIHNlbGVjdGJveCk7XG4gICAgICAgICAgaWYgKHRhcmdldC5pbm5lckhUTUwgPT09ICdNb3ZpZScpIHtcbiAgICAgICAgICAgICQoJyNldmVudFJlbGVhc2VZZWFyLCAjZXZlbnRDaGFubmVsT3JpZ2luYWwsICNldmVudEFpclRpbWVzJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAvLyQoJyNyZWN1cmluZ1RpbWUnKS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgICAgICAgfSAvKmVsc2UgaWYgKHRhcmdldC5pbm5lckhUTUwgPT09ICdSZWN1cnJpbmcgRXZlbnQnKSB7XG4gICAgICAgICAgICAkKCcjcmVjdXJpbmdUaW1lJykucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpXG4gICAgICAgICAgICAkKCcjZXZlbnRSZWxlYXNlWWVhciwgI2V2ZW50Q2hhbm5lbE9yaWdpbmFsLCAjZXZlbnRBaXJUaW1lcycpLmFkZENsYXNzKCdoaWRkZW4nKTtcbiAgICAgICAgICB9Ki8gZWxzZSB7XG4gICAgICAgICAgICAkKCcjZXZlbnRSZWxlYXNlWWVhciwgI2V2ZW50Q2hhbm5lbE9yaWdpbmFsLCAjZXZlbnRBaXJUaW1lcycpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAqIENhcmRzXG4gICAgKi9cblxuICAgIC8vRm9sZGFibGUgY2FyZHNcbiAgICAkKCcuanMtZm9sZGFibGUgLmpzLWZvbGRlZFRvZ2dsZScpLmNsaWNrKGhhbmRsZUZvbGRlZFRvZ2dsZUNsaWNrKTtcbiAgICBmdW5jdGlvbiBoYW5kbGVGb2xkZWRUb2dnbGVDbGljayhlKSB7XG4gICAgICB2YXIgY2FyZCA9ICQoZS50YXJnZXQpLnBhcmVudHMoJy5qcy1mb2xkYWJsZScpO1xuICAgICAgaWYgKGNhcmQuaGFzQ2xhc3MoJ2lzLWZvbGRlZCcpKSB7XG4gICAgICAgIGNhcmQucmVtb3ZlQ2xhc3MoJ2lzLWZvbGRlZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FyZC5hZGRDbGFzcygnaXMtZm9sZGVkJyk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vU3RpY2t5IGNhcmQgaGVhZGVyXG4gICAgJCgnLmpzLXN0aWNreU9uTW9iaWxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICAgIGJvdW5kYXJ5OiB0cnVlLFxuICAgICAgICBvZmZzZXQ6IDUwXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuanMtc2VjdGlvblRpdGxlJykuZWFjaChmdW5jdGlvbihpbmRleCwgZWwpIHtcbiAgICAgIHZhciBzdGlja3kgPSBuZXcgU3RpY2thYmxlKGVsLCB7XG4gICAgICAgIG1heFdpZHRoOiA2MDAsXG4gICAgICAgIGJvdW5kYXJ5OiAnI21lZGlhLWNhcmQnLFxuICAgICAgICBvZmZzZXQ6IDEwNFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL0FuaW1hdGlvbiBlbmQgaGFuZGxlXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2FuaW1hdGlvbmVuZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIHN3aXRjaCAoZS5hbmltYXRpb25OYW1lKSB7XG4gICAgICAgIGNhc2UgJ2NvbGxlY3Rpb25JdGVtLXB1bHNlLW91dCc6XG4gICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1hcHBlYXJpbmcnKTtcbiAgICAgICAgcmV0dXJuIGU7XG5cbiAgICAgICAgY2FzZSAnaW1nLXdyYXBwZXItc2xpZGUtbGVmdCc6XG4gICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nTGVmdCcpO1xuICAgICAgICByZXR1cm4gZTtcblxuICAgICAgICBjYXNlICdpbWctd3JhcHBlci1zbGlkZS1yaWdodCc6XG4gICAgICAgICQoZS50YXJnZXQpLnJlbW92ZUNsYXNzKCdpcy1zbGlkaW5nUmlnaHQnKTtcbiAgICAgICAgcmV0dXJuIGU7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvL1NlcmllcyB0eXBlIHRvZ2dsZVxuICAgICQoJyNzZXJpZXNUeXBlVG9nZ2xlIGxpJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgJChlLnRhcmdldCkucGFyZW50KCkuY2hpbGRyZW4oJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAkKGUudGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICBpZiAoZS50YXJnZXQuaW5uZXJIVE1MID09PSBcIldlYiBTZXJpZXNcIikge1xuICAgICAgICAkKCcjc2VyaWVzUHJvZ1RpbWVmcmFtZSwgI3Nlcmllc1NjZWR1bGVEdXJhdGlvbicpLmFkZENsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgfSBlbHNlIGlmIChlLnRhcmdldC5pbm5lckhUTUwgPT09IFwiVFYgU2VyaWVzXCIpIHtcbiAgICAgICAgJCgnI3Nlcmllc1Byb2dUaW1lZnJhbWUsICNzZXJpZXNTY2VkdWxlRHVyYXRpb24nKS5yZW1vdmVDbGFzcygnaXMtZGlzYWJsZWQnKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAvL0VwaXNvZGUgdHlwZSB0b2dnbGVcbiAgICAkKCcjZXBpc29kZVR5cGVUb2dnbGUgbGknKS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAkKGUudGFyZ2V0KS5wYXJlbnQoKS5jaGlsZHJlbignLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICQoZS50YXJnZXQpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIGlmIChlLnRhcmdldC5pbm5lckhUTUwgPT09IFwiV2ViIEVwaXNvZGVcIikge1xuICAgICAgICAkKCcjZXBpc29kZU9yaWdpbmFsRGF0ZSwgI2VwaXNvZGVTdXBEYXRlLCAjZXBpc29kZVR2UmF0aW5nJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LmlubmVySFRNTCA9PT0gXCJUViBFcGlzb2RlXCIpIHtcbiAgICAgICAgJCgnI2VwaXNvZGVPcmlnaW5hbERhdGUsICNlcGlzb2RlU3VwRGF0ZSwgI2VwaXNvZGVUdlJhdGluZycpLnJlbW92ZUNsYXNzKCdpcy1kaXNhYmxlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy9SZWN1cnJpbmcgdG9nZ2xlXG4gICAgJCgnI3JlY3VycmluZ1RvZ2dsZScpLm9uKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XG4gICAgICBpZiAoZS50YXJnZXQuY2hlY2tlZCkge1xuICAgICAgICAkKCcjcmVjdXJpbmdUaW1lJykucmVtb3ZlQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKCcjcmVjdXJpbmdUaW1lJykuYWRkQ2xhc3MoJ2lzLWRpc2FibGVkJyk7XG4gICAgICB9XG4gICAgfSk7Il0sImZpbGUiOiJjb21tb25Jbml0LmpzIiwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
