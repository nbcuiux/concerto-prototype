//Common js files
//= common.js

//New Gallery Media tab
//= sources/createMediaTab-post.js

//Blurb section initializer
//= sources/initPostSection.js

//Global variables
var editedFilesData = [],
    editedFileData = {},
    classList = [],
    dataChanged = false, //Changes when user make any changes on edit screen;
    lastSelected = null, //Index of last Selected element for multi select;
    galleryObjects = [],
    draftIsSaved = false;

$(document).ready(function() {
  //Common init functions for all pages
  //= commonInit.js


  //Post title and title input
  if ($('#postTitleInput').get(0)) {
    var postTitleInput = new Textfield($('#postTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#postTitleText').text(e.target.value || 'New Post');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Init blurb section
  if ($('#postList').length > 0) {
    initPostList($('#postList'));
  }
});
