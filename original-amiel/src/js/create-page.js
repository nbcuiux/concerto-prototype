//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab-post.js

//Blurb section initializer
//= sources/initBlurbSection.js

$(document).ready(function() {
  //Common init functions for all pages
  //= sources/commonInit.js

  //Static page title and title input
  if ($('#pageTitleInput').get(0)) {
    var pageTitleInput = new Textfield($('#pageTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#pageTitleText').text(e.target.value || 'New Static Page');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Init blurb section
  if ($('#pageList').length > 0) {
    initBlurbSection($('#pageList'), postBlurb, 'Blurb');
  }
});
