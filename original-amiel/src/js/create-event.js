//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

//Cast & Credit initialization
//= sources/initCastAndCredit.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Event title and title input
  if ($('#eventTitleInput').get(0)) {
    var eventTitleInput = new Textfield($('#eventTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#eventTitleText').text(e.target.value || 'New Event');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }

  //Event Type Selectbox
  if ($('#eventTypeSelectbox').get(0)) {
    new Selectbox($('#eventTypeSelectbox').get(0), {
      label: 'Event Type',
      items: ['Movie', 'Live Event', 'Web Event', 'Special', 'Holiday Special', 'Prequel'].sort(),
      placeholder: 'Select Series',
      itemCallback: function(target, selectbox) {
        if (target.innerHTML === 'Movie') {
          $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').removeClass('is-disabled');
        } else {
          $('#eventReleaseYear, #eventChannelOriginal, #eventAirTimes').addClass('is-disabled');
        }
      }
    });
  }

  //Init Cast collection
  initCastSection($('#castSection').find('.controls__group'));
  initCreditSection($('#creditSection').find('.controls__group'));
});
