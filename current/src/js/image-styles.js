//Common js files
//= common.js

//Img Styles
//= sources/imgStyles.js


$(document).ready(function() {

    //Common Init
    //= commonInit.js
    var dataChanged = false;

    if (document.getElementById('addEffect')) {
    	var effectsDropdown = new Dropdown(
    		document.getElementById('addEffect'),
    		{
    			items: [
    				{
    					text: 'Crop',
    					callback: handleEffectListItemClick
    				},
    				{
    					text: 'Scale',
    					callback: handleEffectListItemClick
    				},
    				{
    					text: 'Rotate',
    					callback: handleEffectListItemClick
    				},
    				{
    					text: 'Desaturate',
    					callback: handleEffectListItemClick
    				}
    			]
    		}
    	);
    }
});
