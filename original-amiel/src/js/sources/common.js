//Menu
//= menu.js

//selection
//= select.js

//Notifications
//= notification.js

//File functions
//= file/fileCaption.js
//= file/fileRearrange.js
//= file/fileEdit.js
//= file/fileActions.js

//File upload
//= file/filesUpload.js

//Tooltip
//= tooltip.js

//Modal Prompts and Windows
//= modal.js

//Asset library
//= data/data-assets.js
//= assetLibrary.js

//Required fields check
//= required.js

//Focal rectangle and point
//= file/focalRect.js

//Utilities
//= utilities.js

//Sticky topbar
//= stickyTopbar.js

//ScrollSpyNav
//= scrollSpyNav.js

//-------------------------------------------------------------------//
// Controls
//-------------------------------------------------------------------//
//textfields
//= controls/textfield.js

//selectbox
//= controls/selectbox.js

//Tagfields
//= controls/tagfield.js

//Dropdown
//= controls/dropdown.js

//Addable Fields
//= controls/addable.js

//Image Placeholders
//= controls/imagePlaceholder.js

//ComplexSelect
//= controls/complexSelectbox.js

/*
 * Initializations
 */

//Stickable
//= stickable.js

//Required Fields
//= normalizeRequiredCount.js


//Pagination
//= pagination.js



//Global variables
var editedFilesData = [],
editedFileData = {},
classList = [],
dataChanged = false, //Changes when user make any changes on edit screen;
lastSelected = null, //Index of last Selected element for multi select;
galleryObjects = [],
draftIsSaved = false,
disabledItems = [];
