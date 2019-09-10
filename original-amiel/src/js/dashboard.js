//Common js files
//= sources/common.js

$(document).ready(function() {

  //Common init
  //= sources/commonInit.js

  //Dashboard FAvorites sortable
  $('#dashboardFavorites.js-sortable').sortable({
    placeholder: 'placeholder'
  });
  $('#dashboardFavorites.js-sortable').disableSelection();


  $('.set').click(function(e) {
    $(e.target).toggleClass('open');
  });

  $('.pannel .shortcut').draggable({
    connectToSortable: '.shortcuts',
    stop: function( e, ui ) {e.target.removeAttribute("style");}
  });

  $('*').not('.pannel, .pannel > .shortcut, .set').click(function() {
    $('.set').removeClass('open');
  });
});
