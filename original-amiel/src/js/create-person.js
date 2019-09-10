//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Init Person name fields and Title
  if ($('#personPrefixInput').get(0)) {
    var personPrefixInput = new Textfield($('#personPrefixInput').get(0), {
      label: 'Prefix',
      onInput: handlePersonTitleChange
    });
  }
  if ($('#personFirstInput').get(0)) {
    var personFirstInput = new Textfield($('#personFirstInput').get(0), {
      label: 'First Name',
      errMsg: 'Please enter the first name',
      onInput: handlePersonTitleChange
    });
  }
  if ($('#personMiddleInput').get(0)) {
    var personMiddleInput = new Textfield($('#personMiddleInput').get(0), {
      label: 'Middle Name',
      onInput: handlePersonTitleChange
    });
  }
  if ($('#personLastInput').get(0)) {
    var personLastInput = new Textfield($('#personLastInput').get(0), {
      label: 'Last Name',
      onInput: handlePersonTitleChange
    });
  }
  if ($('#personSuffixInput').get(0)) {
    var personSuffixInput = new Textfield($('#personSuffixInput').get(0), {
      label: 'Suffix',
      onInput: handlePersonTitleChange
    });
  }


  function handlePersonTitleChange(e) {
    if ($('#personPrefixInput').val() || $('#personFirstInput').val() || $('#personMiddleInput').val() || $('#personLastInput').val() || $('#personSuffixInput').val()) {
      $('#personTitleText').text(
      $('#personPrefixInput').val() + ' ' +
      $('#personFirstInput').val() + ' ' +
      $('#personMiddleInput').val() + ' ' +
      $('#personLastInput').val() + ' ' +
      $('#personSuffixInput').val());
      $('.header__subhead').removeClass('is-hidden');
      $('.header__tooltip').addClass('is-disabled');
    } else {
      $('#personTitleText').text('New Pesron');
      $('.header__subhead').addClass('is-hidden');
      $('.header__tooltip').removeClass('is-disabled');
    }
  }
});
