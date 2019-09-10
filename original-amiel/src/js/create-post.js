//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab-post.js

//Blurb section initializer
//= sources/initPostSection-full.js

//Association initialization
//= sources/initCollAssotioation.js

//Collection initialization
//= sources/initCollections.js

//Persons data
//= sources/data/data-persons.js

//New Gallery Media tab
//= sources/createMediaTab.js


$(document).ready(function() {
  //Common init functions for all pages
  //= sources/commonInit.js

  console.log(window.commonInit);


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
    initBlogSection($('#postList'));
  }

  //Init Association section
  if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
    initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
  }

  //Init Related posts collection
  if ($('#pageCollectionSection').find('.controls__group').length > 0) {
    initOneCollectionSection($('#pageCollectionSection').find('.controls__group'));
  }
  
});
