//Common js files
//= common.js

//New Gallery files
//= sources/data/asset-library-objects.js
//= sources/createAssetLibrary.js


//Global variables
var editedFilesData = [],
    editedFileData = {},
    classList = [],
    dataChanged = false, //Changes when user make any changes on edit screen;
    lastSelected = null, //Index of last Selected element for multi select;
    galleryObjects = [],
    draftIsSaved = false;


$(document).ready(function() {

    //Common init functions
    //= commonInit.js

    //Update files
    initGallery();

    $('.js-content .files .section__files').disableSelection();

});
