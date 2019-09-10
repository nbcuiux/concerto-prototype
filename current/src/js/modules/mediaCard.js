import MediaTab from "./components/MediaTab.jsx"
import ReactDOM from "react-dom"
import React from "react"

function updateMediaCard(items) {

  var mediaTabEl = $("#js-media-tab")[0];

  const uniqueItems = items.filter((item,index) => {
    return window.galleryObjects.findIndex(existing => {
      return existing.fileData.id === item.fileData.id
    }) === -1;
  })

  window.galleryObjects = window.galleryObjects.concat(uniqueItems);
  var galleryObjects = window.galleryObjects;

  if (mediaTabEl) {

    var selectFile = (fileId) => {
    }
    var deleteFile = (fileId) => {
      console.log("attempting to delte fiel", fileId);
      deleteFileById(fileId, galleryObjects);
    }

    ReactDOM.render(
      <MediaTab
        key="12345"
        items ={galleryObjects}
        deleteFile={deleteFile}
        selectFile={selectFile}
      />,
      mediaTabEl
    )
  }

}

export default updateMediaCard;