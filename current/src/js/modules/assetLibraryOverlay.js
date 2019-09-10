


import Overlay from "./Overlay"
import updateMediaCard from "./mediaCard"

if (!window.galleryObjects) {
  window.galleryObjects = [];
}


// This is designed to work with asset-library-overlay-new.html, make sure its there
const assetLibraryOverlay = new Overlay(document.getElementById("asset-library"), {
  
  onOpen: function () {
    updateAssetLibrary();
    window.singleselect = true;
    $('#addFromALButton').text('Add Files');
  },

  onSave: function () {
    console.log("saving");
    addFilesFromAssetLibrary();
  },

  onClose: function () {
    lastSelected = null;
    $('#asset-library .files .section__files .file.selected').removeClass('selected');
    deselectAll();
  }

});

assetLibraryOverlay.setOnSelectCallback = function (callback) {
  onSelectCallback = callback
}

// This is the asset library put into a common JS module
var assetLibraryObjects = require("../sources/data/data-assets.js");

var scrollPosition;
var galleryObjects = [];
var startDate = new Date();

$('.js-content .files .section__files').disableSelection();


var onSelectCallback = null;

//Asset Library

function addFilesFromAssetLibrary(){
  lastSelected = null;
  var selected = getSelectedFiles();
  if (onSelectCallback !== null) {
    onSelectCallback(selected);
  }
  else {
    
    updateMediaCard(selected);
    //updateGallery(galleryObjects.length);
  }
}

function getSelectedFiles() {
  var galleryObjects = [];
  var selectedFiles = $('#asset-library .files .section__files .file.selected');
  if (selectedFiles.length > 0) {
    selectedFiles.each(function(i, el) {
      var fileId = $(el).find('.file__id').text();
      var file = assetLibraryObjects.filter(function(f) {
        return f.id === fileId;
      })[0];
      //if (!fileById(fileId, galleryObjects)) {
      galleryObjects.push({
        fileData: file,
        selected: false,
        position: 1000,
        caption: '',
        galleryCaption: false,
        justUploaded: false
      });
      //}

    });
    //updateGallery(galleryObjects.length);
  }
  return galleryObjects;
}



function closeAssetLibrary() {
  
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

/*
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    openAssetLibrary: openAssetLibrary
  }
}
*/

export default assetLibraryOverlay






