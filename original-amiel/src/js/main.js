var settings = require("./settings.js");
var mountComponents = require("./mountComponents.jsx");
var MediaTab = require("./components/MediaTab.jsx");
var React = require("react");
var ReactDOM = require("react-dom");


//var $ = require("jquery");
window.mountComponents = mountComponents;

$(document).ready(function () {
	mountComponents(document.body);
});



window.renderMediaTab = function(galleryItems) {
	
	var el = $(".js-media-tab")[0];

	var selectFile = (fileId) => {

	}

	var deleteFile = (fileId) => {
		console.log("attempting to delte fiel", fileId);
		deleteFileById(fileId, galleryObjects);
    	updateGallery();
	}


	if (el) {
		ReactDOM.render(
			<MediaTab
			  key="12345"
			  items ={galleryItems}
			  deleteFile={deleteFile}
			  selectFile={selectFile}
			/>,
			el
		)
	}
}