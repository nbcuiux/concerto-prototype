//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Collection initialization
//= sources/initCollections.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Series type toggle
  $('#seriesTypeToggle li').click(function(e) {
    $(e.target).parent().children('.active').removeClass('active');
    $(e.target).addClass('active');
    if (e.target.innerHTML === "Web Series") {
      $('#seriesProgTimeframe, #seriesSceduleDuration').addClass('is-disabled');
    } else if (e.target.innerHTML === "TV Series") {
      $('#seriesProgTimeframe, #seriesSceduleDuration').removeClass('is-disabled');
    }
  });

  //Series title and title input
  if ($('#seriesTitleInput').get(0)) {
    var seriesTitleInput = new Textfield($('#seriesTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#seriesTitleText').text(e.target.value || 'New Series');
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
});
