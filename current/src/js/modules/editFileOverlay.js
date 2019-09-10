


import Overlay from "./Overlay"
import updateMediaCard from "./mediaCard"

if (!window.galleryObjects) {
  window.galleryObjects = [];
}


// This is designed to work with asset-library-overlay-new.html, make sure its there
const editFileOverlay = new Overlay(document.getElementById("file-edit-overlay"), {
  
  onOpen: function () {
    console.log("on open!")
  },

  onSave: function () {
    console.log("saving");
  },

  onClose: function () {
    console.log("clsoing");
  }

});


export default editFileOverlay






