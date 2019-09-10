var settings = require("./settings.js");
var mountComponents = require("./mountComponents.jsx");
var MediaTab = require("./components/MediaTab.jsx");
var React = require("react");
var ReactDOM = require("react-dom");

import initEvents from "./initEvents";
import updateMediaCard from "./mediaCard";

//var $ = require("jquery");
window.mountComponents = mountComponents;

$(document).ready(function () {
	initEvents();
	mountComponents(document.body);
});


/* Put stuff into global so our crappy scripts can access it */
window.updateMediaCard = updateMediaCard;