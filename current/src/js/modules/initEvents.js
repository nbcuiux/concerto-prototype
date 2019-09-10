import assetLibraryOverlay from "./assetLibraryOverlay"



function initEvents() {

	$(".media-lib__more").each($.proxy(function(i, element){
		$(element).click($.proxy(function(){
			$(this).toggleClass("media-lib__more--show");
		},element));
	}, this));


	console.log("media-lib__more = ",$(".media-lib__more"));

	$('.assetLibrary').click(function(e) {
			console.log("opening seet ibrary");
	    assetLibraryOverlay.open();
	});


	console.log("libs = ", $('.assetLibrary'));



}

export default initEvents;