
var FormField = require("./components/Form.jsx");
//var RTEditor = require("./components/RTEditor.jsx");
var EditFileOverlay = require("./components/EditFileOverlay.jsx");
//var RTEditorWidgets = require("./components/RTEditorWidgets.jsx");
var React = require("react");
var ReactDOM = require("react-dom");
var LinkRepeater = require("./components/LinkRepeater.jsx");
var $ = require("jquery");

import MediaTab from "./components/MediaTab.jsx";


module.exports = function (container) {

	// Input fields
	$(container).find('.js-input').each(function() {

		var el = this;

		var props = {
			label: el.dataset.label,
			helpText: el.dataset.helpText,
			errMsg: el.dataset.errMsg,
			placeholder: el.placeholder,
			mask: el.dataset.mask,
			maxHeight: el.dataset.maxHeight
		}

		props.multiline = false;

		if (el.tagName == "TEXTAREA") {
			ReactDOM.render(
			  (<FormField.RTEditor 
			  	label={el.dataset.label}
				helpText={el.dataset.helpText}
				errMsg={el.dataset.errMsg}
				placeholder={el.placeholder}
				mask={el.dataset.mask}
				theme={el.dataset.theme}
				id={el.id}
				value={el.dataset.value}
				maxHeight={el.dataset.maxHeight}/>),
			  el.parentElement
			);
		}

		// Date pickers
		else if ($(el).hasClass("js-date")) {
			ReactDOM.render(
			  (<FormField.Date 
			  	label={el.dataset.label}
				helpText={el.dataset.helpText}
				errMsg={el.dataset.errMsg}
				placeholder={el.placeholder}
				mask={el.dataset.mask}
				maxHeight={el.dataset.maxHeight}
				theme={el.dataset.theme}
				id={el.id}
				value={el.dataset.value}
				multiline={props.multiline} />),
			  el.parentElement
			);
		}

		// Normal text inputes
		else {
			ReactDOM.render(
			  <FormField.Text 
			  	label={el.dataset.label}
				helpText={el.dataset.helpText}
				errMsg={el.dataset.errMsg}
				placeholder={el.placeholder}
				mask={el.dataset.mask}
				maxHeight={el.dataset.maxHeight}
				theme={el.dataset.theme}
				multiline={props.multiline}
				id={el.id}
				value={el.dataset.value}
			  />,
			  el.parentElement
			);
		}
	});

	// Rich text editor fields
	/*
    $(container).find(".js-rteditor").each(function(el) {
    	ReactDOM.render(
		  <RTEditor />,
		  this
		)
    });
*/

    // Radio Toggles
    $(container).find(".js-radio-toggle").each(function() {
    	var el = this;
    	var selectedOption = 0;
    	var containerId = el.dataset.containertoggleid;
    	$("#" + containerId).children().hide().eq(selectedOption).show();

    	var toggleContainers = function(index) {
    		$("#" + containerId).children().hide().eq(index).show();
    		selectedOption = index;
    		renderEl();
    	}

    	var renderEl = function() {
    		ReactDOM.render(
			  <FormField.RadioToggle
			  	label={el.dataset.label}
			  	selectedOption={selectedOption}
			  	options={JSON.parse(el.dataset.options)}
			  	onChange={toggleContainers} 
			  />,
			  el
			);
    	}

    	renderEl();
    	
    });


    // Link repeater field
    $(container).find(".js-link-repeater").each(function() {
    	var el = this;

    	var renderEl = function() {
    		ReactDOM.render(
			  <LinkRepeater />,
			  el
			);
    	}

    	renderEl();
    	
    });

    // EditFileOverlay
    /*
    $(container).find(".js-file-edit").each(function() {
    	console.log("mouting");
    	var el = this;
		ReactDOM.render(
		  <EditFileOverlay />,
		  el
		);
    });
*/

    // Listicle editor
    /*
    var ListicleEditor = RTEditorWidgets.listicle.editorComponent;
     $(container).find(".js-listicle-edit").each(function() {
    	var el = this;
		ReactDOM.render(
		  <ListicleEditor />,
		  el
		);
    });
*/

}