//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Cast & Credit initialization
//= sources/initCastAndCredit.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Episode title and title input
  if ($('#episodeTitleInput').get(0)) {
    var episodeTitleInput = new Textfield($('#episodeTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#episodeTitleText').text(e.target.value || 'New Episode');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Episode type toggle
  $('#episodeTypeToggle li').click(function(e) {
    $(e.target).parent().children('.active').removeClass('active');
    $(e.target).addClass('active');
    if (e.target.innerHTML === "Web Episode") {
      $('#episodeOriginalDate, #episodeSupDate, #episodeTvRating').addClass('is-disabled');
    } else if (e.target.innerHTML === "TV Episode") {
      $('#episodeOriginalDate, #episodeSupDate, #episodeTvRating').removeClass('is-disabled');
    }
  });

  //Init Cast collection
  initCastSection($('#castSection').find('.controls__group'));
  initCreditSection($('#creditSection').find('.controls__group'));
});
