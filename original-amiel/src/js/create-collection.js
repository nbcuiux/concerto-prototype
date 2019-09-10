//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Collection initialization
//= sources/initCollections.js

//Association initialization
//= sources/initCollAssotioation.js

$(document).ready(function() {
  //= sources/commonInit.js

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

  //Init Collection section
  if ($('#collectionSection').find('.controls__group').length > 0) {
    initCollSection($('#collectionSection').find('.controls__group'));
  }

  //Init Association section
  if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
    initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
  }
});
