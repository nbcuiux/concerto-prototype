//Common js files
//= common.js


$(document).ready(function() {
    var contentType = [
        'Series',
        'Season',
        'Episode',
        'Event',
        'Gallery'
    ];

    //Common init
    //= commonInit.js
    

    //Activate dropdown (select with search)
    $('.dropdown').click(function(e) {openMenu(e.target, showList);});

    //Select menu
    $('.select').click(openSelect);
    $('.select li').click(setSelect);

    //Dashboard
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

    var cardBody = $('.favorites');
    cardBody.find('.card__body .shortcut .shortcut-remove').click($.proxy(function(e) {
        e.stopPropagation();
        e.preventDefault();

        var closestShortcut = $(e.target).closest(".shortcut");
        closestShortcut.remove();

        if (cardBody.find(".card__body .shortcut").length == 0) {
            cardBody.addClass("favorites--empty");
        }


        //remove first parent .shortcut
    }, this));

    $('*').not('.pannel, .pannel > .shortcut, .set').click(function() {
    	//if (!$(e.target).hasClass('set')) {
    		$('.set').removeClass('open');
    	//}

    });

    //convert img svgs to inline
    $(function(){
        jQuery('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');
        
            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');
        
                // Add replaced image's ID to the new SVG
                if(typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if(typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass+' replaced-svg');
                }
        
                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                
                // Check if the viewport is set, else we gonna set it if we can.
                if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                    $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
                }
        
                // Replace image with new SVG
                $img.replaceWith($svg);
        
            }, 'xml');
        
        });
    });


    if (document.getElementById('filterType')) {
        var typeSelect = new Selectbox(document.getElementById('filterType'), {
            label: 'Type',
            placeholder: 'Select Type',
            items: contentType.sort(),
            itemCallback: handleFilterChange
        });
    }

    function handleFilterChange(item, filter) {
    }


    $(".search__icon").click($.proxy(function(e){

        var target = $(e.target);
        var wrapper = target.closest(".search-wrapper");
        console.log("wrapper = ", wrapper);
        wrapper.toggleClass("search-wrapper--expanded");
    }, this));

});
