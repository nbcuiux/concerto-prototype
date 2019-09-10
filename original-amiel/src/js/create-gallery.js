//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createGallery.js

$(document).ready(function() {
  //Common init
  //= sources/commonInit.js

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

  //Update Media Tab files
  updateGallery();  

  //Files section
  $('.js-content .files .section__files').disableSelection();
  $('.js-content .section__files').sortable({
    placeholder: 'file--placeholder',
    cursor: '-webkit-grabbing',
    items: '.file',
    start: function(e, ui) {
      var selectedImages = $('.js-content .files .file.selected');
      if (selectedImages.length > 1 ) {
        draggableImages = $('.js-content .files .file.selected').not(ui.item).clone(true);
        selectedImages = $('.js-content .files .file.selected').not(ui.item).clone(true);

        //Create files copies to Drag
        var targetFile_1 = ui.item.clone(true);
        var targetFile_2 = ui.item.clone(true);
        draggableImages = targetFile_1.add(draggableImages);//will past on a page after dragging stop
        selectedImages = selectedImages.add(targetFile_2);//this elements will dragging by user
        selectedImages.find('.file__arragement, .file__controls, .file__title, .file__caption, .c-File-coverProp').remove();

        selectedImages
        .removeClass('file_view_grid')
        .css('width', 250)
        .css('height', 170);

        selectedImages.each(function(i, el) {
          $(el).css('transform', 'rotate(' + Math.floor(Math.random()*60 - 60)/10 + 'deg) translate(' + Math.floor(Math.random()*200 - 200)/10 + 'px, ' + Math.floor(Math.random()*200 - 200)/10 + 'px)' );
        });

        $('.js-content .files .file.selected').not(ui.item).remove();
        draggableImages.addClass('file_dragging');
        ui.item.removeClass('file').addClass('dragFilesWrapper');
        ui.item.empty();
        ui.item.append(selectedImages);

        $('.js-content .section__files').sortable( "refresh" );
      } else {
        ui.item.addClass('is-dragging');
      }
    },
    stop: function(e, ui) {
      if (ui.item.hasClass('dragFilesWrapper')) {
        ui.item.after(draggableImages.removeAttr('style'));
        ui.item.remove();
        $(".selected").removeClass("file_dragging");
      } else {
        ui.item.removeClass('is-dragging');
      }
      $('.files .section__files .file').removeAttr('style');
      normalizeIndex();
    }
  });

  //Media card dropdowns
  //Small
  if (document.getElementById('galleryActionsSmall')) {
    var galleryActionDropdownSmall = new Dropdown(
      document.getElementById('galleryActionsSmall'),
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

  //Medium
  if (document.getElementById('galleryActionsMedium')) {
    var galleryActionDropdownMedium = new Dropdown(
      document.getElementById('galleryActionsMedium'),
      {
        items: [
          {
            innerHTML: '<i class="fa fa-arrow-up"></i><span class="">  Send to top</span>',
            callback: handleSendToTopClick,
            disabled: function() {return $('#moreActions').hasClass('disabled');}
          },
          {
            innerHTML: '<i class="fa fa-arrow-down"></i><span class="">  Send to bottom</span>',
            callback: handleSendToBottomClick,
            disabled: function() {return $('#moreActions').hasClass('disabled');}
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

  //Full
  if (document.getElementById('galleryActionsFull')) {
    var galleryActionDropdownFull = new Dropdown(
      document.getElementById('galleryActionsFull'),
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
            innerHTML: '<i class="fa fa-arrow-up"></i><span class="">  Send to top</span>',
            callback: handleSendToTopClick,
            disabled: function() {return $('#moreActions').hasClass('disabled');}
          },
          {
            innerHTML: '<i class="fa fa-arrow-down"></i><span class="">  Send to bottom</span>',
            callback: handleSendToBottomClick,
            disabled: function() {return $('#moreActions').hasClass('disabled');}
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
});
