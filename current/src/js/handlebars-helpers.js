Handlebars.registerHelper("getTraySlideImageForNonXS", function(isEpisodic,
																imageOverridden, 
																imageSizeType,
																slide) {

	if (isEpisodic) {
		return "isEpisodic:" + slide.images.widget;
	}

	if (imageOverridden) {
		return "imageOverridden:" + slide.image;
	}

	if (imageSizeType && slide.assets && slide.assets.images && slide.assets.images[imageSizeType]) {
		return "slide.assets.images[imageSizeType]:" + slide.assets.images[imageSizeType].src;
	}

	return "default:" + slide.image;
});

Handlebars.registerHelper("getTraySlideImageSize", function(imageOverridden, 
															trayType, 
															configDefaultTrayType) {

	if (imageOverridden) {
		return "imageOverridden";
	}

	if (trayType) {
		return "size-" + trayType;
	}

	if (configDefaultTrayType) {
		return "size-" + configDefaultTrayType;
	}

	return "film-poster";
});

Handlebars.registerHelper("getFirstDefinedValue", function() {

	for (var ii = 0 ; ii < arguments.length - 1 ; ii++) {

		if (arguments[ii]) {
			return arguments[ii];
		}
	}

	return "";
});

Handlebars.registerHelper("loading", function() {
	return "<span class=\"ion-loading-c\"></span>";
});

Handlebars.registerHelper("svgIcon", function(iconClass) {
	var str = "<svg class='icon " + iconClass + "'><use xlink:href='#" + iconClass + "'></use></svg>";
	return str;
});

Handlebars.registerHelper("getPreferredImage", function(images, pref) {
	var src = "",
		prefSrc = "",
		errors = [];

	try {
		if(typeof(images) != "object") {
			return "Error: images is not an array";
		}
	} catch(ex) {
		return "Error: " + ex.message;
	}

	for(var i in images) {
		var img = images[i];
		try {
	 		if(typeof(img) == "object" && typeof(img["src"]) == "string" && typeof(img["type"]) == "string") {
				src = img.src;
				if(img.type == pref) {
					prefSrc = img.src;
				}
			}
		} catch(ex) {
			return "Error2: " + ex.message + " " + img.toString();
		}
	}

	if(prefSrc != "" && prefSrc != "null") {
		src = prefSrc;
	}

	return src;
});

Handlebars.registerHelper("encodeURIComponent", function(string) {
	return encodeURIComponent(string);
});

Handlebars.registerHelper("escape", function(string) {
	return string.replaceAll('"', '\"');
});

Handlebars.registerHelper("length", function(thing) {
	if(_.isArray(thing)) {
		return thing.length.toString();
	} else {
		return "";
	}
});

Handlebars.registerHelper("parseInt", function(thing) {
	return parseInt(thing);
});

Handlebars.registerHelper("toString", function(thing) {
	return thing.toString();
});

Handlebars.registerHelper("toLowerCase", function(str) {
	//if(_.isString(str)) {
		return str.toString().toLowerCase();
	//} else {
	//	return str;
	//}
});

Handlebars.registerHelper("representCommentAuthor", function(authorsEmail) {
	var str = "";
	if(_.isString(authorsEmail) && authorsEmail !== "") {
		for(var i = 0; i < 9 && i < (authorsEmail.length - 1); i++) {
			if(i === 0 || i === (authorsEmail.length - 1)) {
				str += authorsEmail[i];
			} else {
				str += "*";
			}
		}
		str += authorsEmail[authorsEmail.length - 1];
	}
	return str;
});

Handlebars.registerHelper("if_user", function(rootContext, options) {
	if(rootContext && rootContext.user && rootContext.user.id) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("if_user_favorited", function(favoritesArray, thing_id, options) {

	var found = false;

	if(favoritesArray && favoritesArray.length > 0) {
		for(var i = 0; i < favoritesArray.length; i++) {
			var fav = favoritesArray[i];
			if(fav.id && fav.id == thing_id) {
				found = true;
				break;
			}
		}
	}

	// block level decisions for helper
	if(found) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("ifStringLongerThan", function(string, length, options) {
    if(string.length > length) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("ifOutsideLink", function(link, options) {
	if(link && link.toString().indexOf("/") !== 0) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
    switch (operator) {
        case "==":
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case "===":
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case "<":
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case "<=":
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case ">":
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case ">=":
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case "&&":
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case "||":
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper("ifNow", function (v1, v2, options) {
	var now = moment();
	var eventDate = moment(v1);
	var expiryDate = moment(v2);
	
	if ( (eventDate.diff(now) < 0) && (expiryDate.diff(now) > 0) )
	{
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("formatNumberDecimals", function(numberStr, decimalPlaces) {
	var numberAsFloat = parseFloat(numberStr);
	return numberAsFloat.toFixed(decimalPlaces);
});

Handlebars.registerHelper("formatDate", function(dateStr, format) {
	var tomoment = (dateStr === "") ? moment() : moment(dateStr);
	var str="";
	if(format == "_format_pretty_date_") {
		str = tomoment.format("MM-DD-YYYY");
	} else if(format == "_pretty_month_date_") {
		str = tomoment.format("LL");
		str = str.substr(0,str.indexOf(","));
	} else if(format == "_FULL-YEAR_") {
		str = tomoment.format("YYYY");
	} else if(format == "_format_date_only_") {
		str = tomoment.format("L");
	} else if(format == "_format_time_ago_") {
		str = tomoment.fromNow();
	} else if(format == "_format_time_duration_") {
		dateStr = (dateStr === "") ? "0" : dateStr;
		var hr = moment.duration(parseInt(dateStr), "seconds").hours();
		if(hr > 0) {
			str = moment.utc(parseInt(dateStr)*1000).format("H:mm:ss");
		} else {
			str = moment.utc(parseInt(dateStr)*1000).format("mm:ss");
		}
	} else if(format == "_format_time_duration_friendly_") {
		dateStr = (dateStr === "") ? "0" : dateStr;
		var hr = moment.duration(parseInt(dateStr), "seconds").hours();
		if(hr > 0) {
			var momentObj = moment.utc(parseInt(dateStr)*1000);
			str = momentObj.format("H") + " hr " + momentObj.format("mm") + " min";
		} else {
			str = moment.utc(parseInt(dateStr)*1000).format("mm") + " min";
		}
	} else {
		str = tomoment.format(format);
	}
	return str;
});

//usage: {{#charLimit someString 50}}
Handlebars.registerHelper("charLimit", function(str, limit) {
	var defaults = {
		ellipsis: "&hellip;"
	}

	var words = str.split(" "), ret = "";
	
	if(words.length > 1) {
		var wroteOnce = false;
		for(var i in words) {
			if((ret + words[i]).length <= limit) {
				ret = ret + ((wroteOnce) ? ' ' : '') + words[i];
				wroteOnce = true;
			} else {
				if(i < words.length) {
					var nextWordLength = words[i].length;
					var leftToLimit = limit - ret.length;

					// Break the next word if we can fit 75% of it in.
					// Also don't do this for short words. Breaking those
					// would be confusing
					if(nextWordLength > 3 && (Math.floor(leftToLimit / nextWordLength * 100) > 75)) {
						ret = ret + ' ' + words[i].substring(0, leftToLimit);
					}

					if(defaults.ellipsis) {
						ret = ret + defaults.ellipsis;
					}
					break;
				}
			}
		}
	} else {
		ret = str;
	}
	return ret;
});

Handlebars.registerHelper("compare", function(lvalue, rvalue, options) {
    if(arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
    }
    operator = options.hash.operator || "==";

    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '!==':      function(l,r) { return l !== r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; },
        'in':		function(l,r) { return (_.indexOf(r.split("|"), l) > -1); }
    }

    if(!operators[operator]) {
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
    }

    var result = operators[operator](lvalue,rvalue);

    if(result) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }

});

//Escape. Usage: {{ escape "stringToBeEscaped"}}
Handlebars.registerHelper("escape", function(variable) {
	return _.escape(variable);
});

// {{#join array ", "}}{{title}}{{/join}}
Handlebars.registerHelper("join", function(context, join, options) {
	var collection = [];
	for(var i in context) {
		collection.push(options.fn(context[i]));
	}
	return collection.join(join);
});

// Usage: {{ellipsify some.string.variable maxLength}}
Handlebars.registerHelper("ellipsify", function(string, maxLength) {
	if (!string) {
		return "";
	}

	var ellipsisText = "&hellip;";

	if (string.length > maxLength) {
		return string.substr(0, maxLength).trim() + ellipsisText;
	} else {
		return string.trim();
	}
});

//Get Value for a Key in map. Usage: {{ getInMap key mapObj }}
Handlebars.registerHelper("getInMap", function(key, mapObj) {
	return mapObj[key];
});

// Usage: {{#includes collection target}}SOME TEXT{{/includes}}
Handlebars.registerHelper("includes", function(collection, target, options) {

	if (_.includes(collection, target)) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

// Usage: {{#replace "search" "replace"}}SOME TEXT{{/replace}}
Handlebars.registerHelper("replace", function(search, replace, block) {
	// Strip HTML: (HTML messes up the character count rendering the helper useless)
	return block.fn(this).replace(search, replace);
});

Handlebars.registerHelper("indexPlusOne", function(index) {
	return (Math.floor(parseInt(index) + 1)).toString();
});

Handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator].toString();
});

Handlebars.registerHelper('json', function(context) {
	return JSON.stringify(context);
});

/**
 * Assumes ratingsObject adheres to:
 * {
 * 	"star": number,
 * 	"grade": "string"
 * }
 */
Handlebars.registerHelper("displayRatings", function(ratingsObject, type, id) {
	if(!_.isUndefined(ratingsObject) 
			&& !_.isUndefined(ratingsObject["star"]) 
			&& type == "star"
			&& _.isString(id)
	) {
		var stars = ["star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star"];
		var starRating = parseInt(ratingsObject.star);
		var userRated = false;
		if(!_.isUndefined(ratingsObject['userStar'])) {
			userRated = true;
			starRating = parseInt(ratingsObject.userStar);
		}
		if(starRating >= 1) {
			stars[0] = "star-icon ion-ios7-star active";
		}
		if(starRating >= 2) {
			stars[1] = "star-icon ion-ios7-star active";
		}
		if(starRating >= 3) {
			stars[2] = "star-icon ion-ios7-star active";
		}
		if(starRating >= 4) {
			stars[3] = "star-icon ion-ios7-star active";
		}
		if(starRating >= 5) {
			stars[4] = "star-icon ion-ios7-star active";
		}
		
		var starHtml = "<span data-content-id=\"" + id + "\" class=\"clickable rating star " + ((userRated) ? "given-rating" : "") + "\" data-hover-class=\"star-icon ion-ios7-star active\" data-exclude-class=\"star-icon ion-ios7-star\">"
			+ "<span class=\"" + stars[0] + "\" data-class=\"" + stars[0] + "\"></span>"
			+ "<span class=\"" + stars[1] + "\" data-class=\"" + stars[1] + "\"></span>"
			+ "<span class=\"" + stars[2] + "\" data-class=\"" + stars[2] + "\"></span>"
			+ "<span class=\"" + stars[3] + "\" data-class=\"" + stars[3] + "\"></span>"
			+ "<span class=\"" + stars[4] + "\" data-class=\"" + stars[4] + "\"></span>"
		+ "</span>";
		return starHtml;
		
	} else if(type == "grade") {
		return "grade";
	} else {
		return "Unsupported";
	}
});

Handlebars.registerHelper("displaySingleStarRating", function(numStars) {
		
		var stars = ["star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star", "star-icon ion-ios7-star"];
		if(numStars >= 1) {
			stars[0] = "star-icon ion-ios7-star active";
		}
		if(numStars >= 2) {
			stars[1] = "star-icon ion-ios7-star active";
		}
		if(numStars >= 3) {
			stars[2] = "star-icon ion-ios7-star active";
		}
		if(numStars >= 4) {
			stars[3] = "star-icon ion-ios7-star active";
		}
		if(numStars >= 5) {
			stars[4] = "star-icon ion-ios7-star active";
		}
		
		var starHtml = "<span class=\"rating star\">"
			+ "<span class=\"" + stars[0] + "\"></span>"
			+ "<span class=\"" + stars[1] + "\"></span>"
			+ "<span class=\"" + stars[2] + "\"></span>"
			+ "<span class=\"" + stars[3] + "\"></span>"
			+ "<span class=\"" + stars[4] + "\"></span>"
		+ "</span>";
		return starHtml;
});

function getNumOfInitialTrayImages(trayType) {
	if(trayType === "video") {
		return 5;
	} else if(trayType === "smallsquare") {
		return 15;
	} else {
		return 10;
	}
}

Handlebars.registerHelper("getNumOfInitialTrayImages", getNumOfInitialTrayImages);

// {{#lazyLoadTrayImages data.lazyLoad, data.trayType, @index}}<img src="{{image}}" />{{/lazyLoadTrayImages}}
Handlebars.registerHelper("lazyLoadTrayImages", function(isModuleLazyLoad, trayType, currentIndex, block) {
	var returnStr = block.fn(this);
	var numOfInitialTrayImages = getNumOfInitialTrayImages(trayType);
	
	// currentIndex is over the number of initial images to load (left/right)
	// Or if entire module is "lazyLoad"
	if((currentIndex > numOfInitialTrayImages) || isModuleLazyLoad) {
		returnStr = returnStr.split(" src=").join(" data-is-module-lazy-load=\"" + ((isModuleLazyLoad) ? "true" : "false") + "\" data-tray-type=\"" + trayType + "\" data-current-index=\"" + currentIndex + "\" src=\"\" data-src=");
	}
	return returnStr;
});

Handlebars.registerHelper("echo", function(input) {
	return input;
});

Handlebars.registerHelper("decode64", function(string) {
	var result = string;
	if (_.startsWith(string, "(!*)")) {
		result = '<img src="data:image/gif;base64,' + string.slice(4) + '" alt="img" />';
	}
	
	return result;
})



Handlebars.registerHelper("sentence", function(str) {
  if (str && typeof str === 'string') {
    var re = /((?:\S[^\.\?\!]*)[\.\?\!]*)/g;
    return str.replace(re, function(txt) {
      return txt.charAt(0).toUpperCase()
        + txt.substr(1).toLowerCase();
    });
  }
});

Handlebars.registerHelper("isCollection", function(str, options) {
	if ((str.toLowerCase() == "collection") || (str.toLowerCase() == "collection group")) {
		return options.fn(this);
	} else {
		return options.inverse(this);
	}
});

Handlebars.registerHelper("getStatusPrefix", function(str) {
	var _str = str.toLowerCase();
	if (_str == "not published") {
		return "--not-published";
	} else if (_str == "published") {
		return "--published";
	} else if (_str == "draft") {
		return "--draft";
	} else if (_str == "scheduled") {
		return "--scheduled";
	} else {
		return "--no-status";
	}
});

