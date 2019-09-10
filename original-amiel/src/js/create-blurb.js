//Common js files
//= sources/common.js

$(document).ready(function() {
  //= sources/commonInit.js

  if ($('#mediaPlaceholder')) {
    var mediaPlaceholder = new ImagePlaceholder($('#mediaPlaceholder').get(0), null, {alButton: 'Add File'});
  }

  $('#mediaType li').click(function(e) {
    $('#mediaType li.active').removeClass('active');
    $(e.target).addClass('active')
    var target = $(e.target).attr('data-target');
    switch (target) {
      case 'externalLink':
      $('#externalLink').removeClass('hidden');
      $('#media').addClass('hidden');
      break;

      case 'media':
      $('#media').removeClass('hidden');
      $('#externalLink').addClass('hidden');
      break;
    }
  });

  //Handle page title to reflect title textbox
  if ($('#blurbTitleInput').get(0)) {
    var blurbTitleInput = new Textfield($('#blurbTitleInput').get(0), {
      label: 'Title',
      helpText: 'Mauris malesuada nibh nec leo porta maximus.',
      errMsg: 'Please fill the title',
      onInput: function(e) {
        $('#blurbTitleText').text(e.target.value || 'New Blurb');
        if (e.target.value !== '') {
          $('.header__subhead').removeClass('is-hidden');
        } else {
          $('.header__subhead').addClass('is-hidden');
        }
      }
    });
  }
});
