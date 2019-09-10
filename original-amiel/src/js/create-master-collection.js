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

  //Init Collection section
  if ($('#masterCollectionSection').find('.controls__group').length > 0) {
    initCollSection($('#masterCollectionSection').find('.controls__group'), collections, 'Collection');
  }

  //Init Association section
  if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
    initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
  }
});
