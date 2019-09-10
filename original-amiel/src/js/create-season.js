//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Collection initialization
//= sources/initCollections.js

//Cast & Credit initialization
//= sources/initCastAndCredit.js

$(document).ready(function() {
  //= sources/commonInit.js

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

  if ($('#pageCollectionSection').find('.controls__group').length > 0) {
    initOneCollectionSection($('#pageCollectionSection').find('.controls__group'));
  }

  //Init Cast collection
  initCastSection($('#castSection').find('.controls__group'));
  initCreditSection($('#creditSection').find('.controls__group'));
});
