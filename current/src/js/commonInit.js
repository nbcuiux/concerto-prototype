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

function openAssetLibrary(e, options) {
    /*
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
    */
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
$('.uploadFiles').click(handleUploadFilesClick);
document.addEventListener('dragenter', handleDragEnter, true);
document.addEventListener('dragover', handleDragOver, false);
document.addEventListener('drop', handleDrop, false);



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



//Asset library dropdowns
//Small
/*
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
}*/
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

/*
$('#purposeWrapper').scroll(function() {
	setPurposePagination();
});
*/

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
    initCollSection($('#masterCollectionSection').find('.controls__group'), collections, 'Collections');
}

if ($('#masterCollectionSection').find('.controls__group').length > 0) {
    var link = document.location.href;
    if (link.indexOf("create-master-collection.html") > 0) {
        var data = collections.filter(function(obj){
            return obj.type.toLowerCase() == "collection";
        })
    }
    if (link.indexOf("create-collection.html") > 0) {
        var data = collections.filter(function(obj){
            return obj.type.toLowerCase() != "collection group";
        })
    }

    initCollSection($('#masterCollectionSection').find('.controls__group'), data, 'Collections');
}
if ($('#pageCollectionSection').find('.controls__group').length > 0) {
    initOneCollectionSection($('#pageCollectionSection').find('.controls__group'));
}
if ($('#websiteCollectionSection').find('.controls__group').length > 0) {
    initWebsiteCollectionSection($('#websiteCollectionSection').find('.controls__group'));
}
if ($('#rokuCollectionSection').find('.controls__group').length > 0) {
    initRokuCollectionSection($('#rokuCollectionSection').find('.controls__group'));
}
if ($('#androidCollectionSection').find('.controls__group').length > 0) {
    initAndroidCollectionSection($('#androidCollectionSection').find('.controls__group'));
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
        //$('.header__subhead').removeClass('is-hidden');
        $('.header__tooltip').addClass('is-disabled');
    } else {
        $('#personTitleText').text('New Pesron');
        //$('.header__subhead').addClass('is-hidden');
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
        //$('.header__subhead').removeClass('is-hidden');
        $('.header__tooltip').addClass('is-disabled');
    } else {
        $('#characterTitleText').text('New Role');
        //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
            //$('#seriesTitleText').text(e.target.value || 'New Series');
            if (e.target.value !== '') {
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
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
                //$('.header__subhead').removeClass('is-hidden');
            } else {
                //$('.header__subhead').addClass('is-hidden');
            }
        }
    });
}

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
