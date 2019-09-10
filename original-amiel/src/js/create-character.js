//Common js files
//= sources/common.js

//New Gallery Media tab
//= sources/createMediaTab.js

$(document).ready(function() {
  //= sources/commonInit.js

  //Init character name fields and Title
  if ($('#characterPrefixInput').get(0)) {
    var characterPrefixInput = new Textfield($('#characterPrefixInput').get(0), {
      label: 'Prefix',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterFirstInput').get(0)) {
    var characterFirstInput = new Textfield($('#characterFirstInput').get(0), {
      label: 'First Name',
      errMsg: 'Please enter the first name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterMiddleInput').get(0)) {
    var characterMiddleInput = new Textfield($('#characterMiddleInput').get(0), {
      label: 'Middle Name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterLastInput').get(0)) {
    var characterLastInput = new Textfield($('#characterLastInput').get(0), {
      label: 'Last Name',
      onInput: handlecharacterTitleChange
    });
  }
  if ($('#characterSuffixInput').get(0)) {
    var characterSuffixInput = new Textfield($('#characterSuffixInput').get(0), {
      label: 'Suffix',
      onInput: handlecharacterTitleChange
    });
  }

  function handlecharacterTitleChange(e) {
    if ($('#characterPrefixInput').val() || $('#characterFirstInput').val() || $('#characterMiddleInput').val() || $('#characterLastInput').val() || $('#characterSuffixInput').val()) {
      $('#characterTitleText').text(
      $('#characterPrefixInput').val() + ' ' +
      $('#characterFirstInput').val() + ' ' +
      $('#characterMiddleInput').val() + ' ' +
      $('#characterLastInput').val() + ' ' +
      $('#characterSuffixInput').val());
      $('.header__subhead').removeClass('is-hidden');
      $('.header__tooltip').addClass('is-disabled');
    } else {
      $('#characterTitleText').text('New Role');
      $('.header__subhead').addClass('is-hidden');
      $('.header__tooltip').removeClass('is-disabled');
    }
  }
});
