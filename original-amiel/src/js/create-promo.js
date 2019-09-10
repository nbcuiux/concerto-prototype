//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Association initialization
//= sources/initCollAssotioation.js

//Collection initialization
//= sources/initCollections.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Promo wrapper title and title input
  if ($('#promoTitleInput').get(0)) {
    var promoTitleInput = new Textfield($('#promoTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#promoTitleText').text(e.target.value || 'New Promo Wrapper');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  if ($('#mediaPlaceholder1').length > 0) {
    var mediaPlaceholder1 = new ImagePlaceholder($('#mediaPlaceholder1').get(0), null, {alButton: 'Add File'});
  }
  if ($('#mediaPlaceholder2').length > 0) {
    var mediaPlaceholder2 = new ImagePlaceholder($('#mediaPlaceholder2').get(0), null, {alButton: 'Add File'});
  }

  var autocompleteItems = [
    'Explore Now',
    'Read More',
    'Watch Now'
  ];

  //Init Association section
  if ($('#collectionSeriesSection').find('.controls__group').length > 0) {
    initSeriesSection($('#collectionSeriesSection').find('.controls__group'));
  }
});
