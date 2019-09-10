
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var FormField = require('./Form.jsx');
var SlideDown = require('./SlideDown.jsx');
var RTEditorWidgets = require("./RTEditorWidgets.jsx");
//var assetLibraryOverlay = require("../sources/assetLibraryOverlay.js");

import assetLibraryOverlay from "../assetLibraryOverlay.js"
import Overlay from "../overlay"


/******************** Utility functions ********************/

// Returns a left and right html fragment by splitting
// a parent container at the caret position within that parent
// This method makes sure each fragment is valid html, ie
// will close off all tags on the split
var splitHtmlNodeInParent = function(parent) {

  var caretRange;
  var leftRange;
  var rightRange;
  var startNode, endNode;
  var position = 0;
  var caretOffset = 0;
  var win = window;
  var sel;

  // Get the offset of the caret within this editable block
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      caretRange = win.getSelection().getRangeAt(0);
    }
  }

  // Extract the html from the start of the editable block until wherever
  // the caret is
  leftRange = document.createRange();
  leftRange.setStart(parent,0);
  leftRange.setEnd(caretRange.startContainer,caretRange.startOffset);

  // Extract the html from the caret until the end of the editable block
  rightRange = document.createRange();
  rightRange.setStart(caretRange.startContainer,caretRange.startOffset);
  rightRange.setEnd(parent,parent.childNodes.length);

  return {
    left: leftRange.cloneContents(),
    right: rightRange.cloneContents()
  }
}

function getCaretRange() {
  var caretOffset = 0;
  var win = document.defaultView || document.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
          var range = win.getSelection().getRangeAt(0);
          return range;
      }
  }
  else if (document.selection) {
    return document.selection.createRange();
  }

  return false;
}


function restoreSelection(range) {
  var sel;
  if (range) {
      if (window.getSelection) {
          sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
      } else if (document.selection && range.select) {
          range.select();
      }
  }
}

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection) {
        return document.selection.createRange().text;
    }
    return "";
}





tinymce.PluginManager.add('stylebuttons', function(editor, url) {
  ['pre', 'p', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].forEach(function(name){
   editor.addButton("style-" + name, {
       tooltip: "Toggle " + name,
         text: name.toUpperCase(),
         onClick: function() { editor.execCommand('mceToggleFormat', false, name); },
         onPostRender: function() {
             var self = this, setup = function() {
                 editor.formatter.formatChanged(name, function(state) {
                     self.active(state);
                 });
             };
             editor.formatter ? setup() : editor.on('init', setup);
         }
     })
  });
});


/******************** COMPONENTS ********************/

var idGen = 0;
var getNewId = function() {
  return idGen++;
}


var RTEditor = class RTEditor extends React.Component {
  constructor() {
    super();
    this.id = getNewId();
    this.state = {
      widgetEditor: null,
      widgetEditorOpen: false,
      widgets: [
        {
          id: 0,
          type: "contentLink",
          data: {
            linkType: "internal",
            url: "",
            linkText: "Hello"
          }
        },
        {
          id: 1,
          type: "youtube",
          data: {
            youtubeVideoId: 3
          }
        },
      ]
    }

  }

  openWidgetEditor(type, buttonEl, args) {
    var widgetProps = RTEditorWidgets[type];
    var editor = <RTEditor.widgetForm editor={this.editor} type={type} insertWidget={this.insertWidget.bind(this)} cancelWidget={this.cancelWidget.bind(this)}/>
    $("#rte-overlay .overlay-title").text(widgetProps.name);
    ReactDOM.render(
        editor,
        $("#rte-overlay").find(".rte-overlay-content")[0]
    )
    this.rteOverlay.open();
  }

  cancelWidget() {
    var self = this;
    this.setState({
      widgetEditorOpen: false
    });
    this.rteOverlay.close();
  }

  insertWidget(widgetType, widgetData) {
    var widgetProps = RTEditorWidgets[widgetType];
    this.editor.selection.setContent(widgetProps.getRenderHtml(widgetData));
    this.editor.focus();
    this.setState ({
      widgetEditorOpen: false
    });
    this.rteOverlay.close();

  }

  insertMediaFiles(files) {
    var $html = $("<div class='rte-content__image-group'></div>");
    files.forEach(function(file, index) {
      $html.append("<div class='rte-content__image-item'><img src='" + file.fileData.url  + "' /></div>");
    });
    this.editor.insertContent($("<div />").append($html).html() + "<p></p>");
    this.editor.focus();
  }

  setupEditor(editor) {
    var self = this;
    
    this.editor = editor;
    this.listicleOverlay = new Overlay(document.getElementById("listicle-overlay"),
      {
        onSave: function () {
          self.insertWidget("listicle", {});
        }
    });

    $(".listicle-overlay").find(".js-listicle-overlay-cancel").on("click", function () {
      new Modal({
        dialog: true,
        title: 'Cancel Changes?',
        text: 'Any unsaved changes you made will be lost. Are you sure you want to cancel?',
        confirmText: 'Cancel',
        confirmAction: function() {
          console.log("confirming");
          self.listicleOverlay.close();
          document.removeEventListener('keydown', handleEscKeydown);
          document.removeEventListener('keydown', handleEnterKeydown);
        },
        cancelAction: function () {

        }
      });
    }); 

    this.rteOverlay = new Overlay(document.getElementById("rte-overlay"));
    
    editor.addButton('gallery', {
      text: 'Gallery',
      icon: 'fa-image'
    });
    editor.addButton('listicle', {
      text: 'Listicle',
      icon: 'tablerowprops',
      onclick: function (e) {
        self.listicleOverlay.open();
      }
    });
    editor.addButton('embed', {
      text: 'Embed',
      icon: "code",
      onclick: function (e) {
        self.openWidgetEditor("embed", e.target);
      }
    });
    editor.addButton('media', {
      text: 'Media',
      icon: 'media',
      onclick: function (e) {
        assetLibraryOverlay.setOnSelectCallback(self.insertMediaFiles.bind(self));
        assetLibraryOverlay.open();
      }
    });
    editor.addButton('upload', {
      text: 'Upload',
      icon: 'upload',
      onclick: function (e) {
        handleUploadFilesClick(e, function(files) {
          self.insertMediaFiles(files);
        });
      }
    });    
    editor.addButton('contentLink', {
      text: 'Link',
      icon: 'link',
      onclick: function (e) {
        self.openWidgetEditor("contentLink", e.target);
      }
    });
    editor.addMenuItem('contentLink', {
      text: 'Link',
      icon: 'link',
      onclick: function (e) {
        self.openWidgetEditor("contentLink", e.target);
      }
    });
    editor.on("click", function (e) {
      var el = e.target;
      // Edit listicle when you click the placeholder inside the rteditor
      if ($(el).hasClass("js-listicle-edit") || $(el).closest(".js-listicle-edit").length > 0) {
        self.listicleOverlay.open();
      }
    })

    // To open up context menu on selecting text
    editor.on("NodeChange", function (e) {
      var el = e.target;
      // Put this in a timeout so that if we click to clear the selection, we dont trigger
      // the menu

        var selection = editor.selection.getContent({format: 'text'});
        if (selection) {
          var range = editor.selection.getRng();
          var r = range.getBoundingClientRect();
          var top = (r.top);
          var left = r.left;
          //var left = (r.left + (0.5* r.width) - 50);//this will align the right edges together
          var pos = tinymce.DOM.getPos(editor.getContentAreaContainer());

          editor.fire("contextmenu", e);

          $(".mce-contextmenu").css({
            left: pos.x + left,
            top: pos.y + top - 50
          })
        }
        else {
          $(".mce-contextmenu").hide();
        }
    })
  }

  componentDidMount() {

    var self = this;
    var toolbar = "undo redo | bold italic blockquote style-p style-h1 | alignleft aligncenter alignright |  media upload contentLink embed gallery listicle";

    tinymce.init({
      selector: "#rte-editor-" + this.id,
      height: 500,
      menubar: false,
      toolbar: toolbar,
      contextmenu: "bold italic underline contentLink",
      skin: "lightgray",
      plugins: "link image stylebuttons noneditable contextmenu",

      setup: function (editor) {
        self.setupEditor(editor);
      },
      skin_url: '/app.css',
      content_css : "/app.css",
      skin: "test",
      body_class: 'rte-content'
    });
  }
  render() {
    var editor = this.editor;
    return(
      <div className="rte__wrapper">
        <div className={"rte__widget-wrapper" + (this.state.widgetEditorOpen ? " rte__widget-wrapper--open" : "")}>
          <SlideDown isOpen={this.state.widgetEditorOpen}>
            <RTEditor.widgetForm editor={editor} type={this.state.widgetEditor} insertWidget={this.insertWidget.bind(this)} cancelWidget={this.cancelWidget.bind(this)}/>
          </SlideDown>
          <div className="rte__widget-triangle" ref="widgetTriangle">
          </div>
        </div>
        <textarea id={"rte-editor-" + this.id} ref="theEditor"></textarea>
      </div>
    )
  }
}


RTEditor.widgetForm = class RTEditor extends React.Component {
  constructor() {
      super();
      this.state = {
        currentWidget: null
      }
  }
  render() {
    if (this.props.type === null) {
      return (null);
    }

    var widgetProps = RTEditorWidgets[this.props.type];
    var EditorComponent = widgetProps.editorComponent;

    return (
      <div className="rte-dialog">
        <EditorComponent editor={this.props.editor} cancel={this.props.cancelWidget} save={this.props.insertWidget.bind(this, this.props.type)}></EditorComponent>
      </div>
    );
  }
}

// Rich text editor
var RTEditorOld = class RTEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      contentItems: [],
      currentEditingIndex: null,
      hasSelection: false,
      caret: {
        position: 0,
        contentIndex: 0
      }
    }

    this.caret = {
      contentItemIndex: 0,
      position: 0
    }
  }

  componentDidMount() {
    // Set up click and mouse down events in order to detect selections
    var updateSelection = function () {
      var selectionText = getSelectedText();
      if (selectionText && this.state.hasSelection === false) {
        this.setState({
          hasSelection: true
        })
      }
      else if ((selectionText === undefined || selectionText.length === 0) && this.state.hasSelection === true) {
        this.setState({
          hasSelection: false
        })
      }
    }

    // Bind mouse and keyboard events to trigger updateSelection, which will check
    // if there is a new selection
    $("body").on("mouseup", updateSelection.bind(this));
    $("body").on("keyup", updateSelection.bind(this));
  }

  // This will tell us which editing container is currently being used,
  // if any
  getEditingContainer() {
    var el = getCaretRange().startContainer;
    var container = $(el).closest(".rte__editable");
    if (container.length) {
      return container[0];
    }
    else {
      return null;
    }
  }

  insertWidget(type) {

    // Get the html node for content editable div (we aren't manipulating any
    // DOM directly here, just reading, so it's safe)
    //var caretRange = getCaretRange();
    var editingItemEl = this.getEditingContainer();
    var editingItemIndex = $(editingItemEl).index();
    var frags = splitHtmlNodeInParent(editingItemEl);

    // Unfortunately we need to insert the fragments into the DOM to get the html as string
    var l      = $(this.refs.fragContainer).html(frags.left).html();
    var r      = $(this.refs.fragContainer).html(frags.right).html();

    var widget = {
      type: type,
      id: getNewId(),
      data: null
    };

    console.log("the new widget", widget);

    var newContentItems = this.state.contentItems;
    // Delete the current content item
    newContentItems.splice(editingItemIndex, 1);
    // Insert the left, right and new widget content
    newContentItems.splice(editingItemIndex, 0, l, widget, r);

    this.setState({
      contentItems: newContentItems
    });
  }

  deleteWidget(index) {
    var items = this.state.contentItems;
    if (items[index] && typeof items[index] === "object") {
      items.splice(index, 1);

      // After deleting the widget node, check if the before and after nodes
      // are both text, and if so, combine them
      console.log("the items after deleting widget", items);
      if (typeof items[index-1] === "string" && typeof items[index] === "string") {
        items[index-1] = items[index-1] + items[index];
        items.splice(index, 1);
      }

      this.setState({
        contentItems: items
      })
    }
  }

  saveWidget(index, data) {
    var items = this.state.contentItems;
    if (items[index] && typeof items[index] === "object") {
      items[index].data = data;
      this.setState({
        contentItems: items
      })
    }
  }

  updateContent(index, html) {

    var arr = this.state.contentItems;

    // If we have an empty text block, delete the content node
    console.log("The html", html);
    //if ($(html).text().trim() === "") {
    //  console.log("empty");
    //  arr.splice(index, 1);
    //}
    //else {
      arr[index] = html;
    //}

    this.setState({
      contentItems: arr
    })

    console.log("content updated:", this.state.contentItems);
  }

  updateCaret(index, caretPosition) {
    this.caret = {
      contentItemIndex: index,
      position: caretPosition,
      hasSelection: (getSelectedText().length > 0)
    }
  }

  startEditing() {
    if (this.state.contentItems.length === 0) {
      this.state.contentItems.push("");
      this.setState({
        contentItems: this.state.contentItems
      })
    }
  }

  render() {
    return (
      <div className="rte" ref="theEditor">
        <RTEditor.toolbar
          insertWidget={this.insertWidget.bind(this)}
        />
        <RTEditor.content
          startEditing={this.startEditing.bind(this)}
          contentItems={this.state.contentItems}
          updateContent={this.updateContent.bind(this)}
          updateCaret={this.updateCaret.bind(this)}
          deleteWidget={this.deleteWidget.bind(this)}
          saveWidget={this.saveWidget.bind(this)}/>
        <div className="rte__frag-container" ref="fragContainer"></div>
        <RTEditor.floatingToolbar hasSelection={this.state.hasSelection} />
      </div>
    );
  }
}



RTEditor.toolbar = class Toolbar extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="post-item-thumbnails unselectable">
        <div className="post-item-thumb post-item-thumb--item post-item-thumb--post-card" onClick={this.props.openWidgetEditor.bind(this,"facebook")}>
          <i className="post-item-thumb__icon fa fa-code"></i>
          <div className="post-item-thumb__title">Embed</div>
        </div>
        <div className="post-item-thumb post-item-thumb--item post-item-thumb--post-card" onClick={this.props.openWidgetEditor.bind(this,"youtube")}>
          <i className="post-item-thumb__icon fa fa-youtube"></i>
          <div className="post-item-thumb__title">Youtube</div>
        </div>
        <div className="post-item-thumb post-item-thumb--item post-item-thumb--post-card" onClick={this.props.openWidgetEditor.bind(this,"listicle")}>
          <i className="post-item-thumb__icon fa fa-list"></i>
          <div className="post-item-thumb__title">Listicle</div>
        </div>
      </div>
    );
  }
}


RTEditor.floatingToolbar =  class FloatingToolbar extends React.Component {
  constructor() {
    super();
    this.state = {
      isVisible: false,
      currentForm: null, // Current form is a flag to say which sub form is loaded
      selectedRange: null
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.state.isVisible === true && prevState.isVisible === false) {
      // Position the toolbar near the selection
      var el = this.refs.theToolbar;
      var r= getCaretRange().getBoundingClientRect();
      var relative= $(".rte")[0].getBoundingClientRect();
      el.style.top =(r.bottom -relative.top)+'px';//this will place ele below the selection
      el.style.right=-(r.right - relative.right - (0.5* r.width) + 50)+'px';//this will align the right edges together
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasSelection !== this.props.hasSelection) {
      this.setState({
        isVisible: nextProps.hasSelection
      })
    }
  }

  onMouseLeave() {
    return;
    this.setState({
      isVisible: false
    });
  }

  addLink() {
    var selectedRange = getCaretRange();
    this.setState({
      currentForm: "link",
      selectedRange: selectedRange
    });
  }

  applyEdit(type, args) {
    switch (type) {
      case "bold":
        document.execCommand("bold", true);
        break;
      case "italic":
        document.execCommand("italic", true);
        break;
      case "link":
        // Restore the previous selected range
        if (this.state.selectedRange) {
          restoreSelection(this.state.selectedRange);
        }
        document.execCommand("createLink", true, args.href);
        break;
    }


    this.setState({
      isVisible: false,
      currentForm: null
    });

  }

  cancelForm() {
    this.setState({
      isVisible: false,
      currentForm: null
    })
  }

  render() {
    return (
      <div ref="theToolbar" className={"rte__floating-toolbar unselectable" + (this.state.isVisible ? "" : " rte__floating-toolbar--hidden")} onMouseLeave={this.onMouseLeave.bind(this)}>

        <div className={"rte__button-list" + (this.state.currentForm !== null ? " rte__button-list--hidden" : "")}>
          <div className="rte__button--small" onClick={this.applyEdit.bind(this, "bold")}>
            <i className="fa fa-bold"></i>
          </div>
          <div className="rte__button--small" onClick={this.applyEdit.bind(this, "italic")}>
            <i className="fa fa-italic"></i>
          </div>
          <div className="rte__button--small" onClick={this.addLink.bind(this)}>
            <i className="fa fa-link"></i>
          </div>
        </div>

        <div className="rte__floating-toolbar-form">
          {
            (() => {
              switch (this.state.currentForm) {
                case null:
                  return null;
                case "link":
                  return <RTEditor.linkForm cancel={this.cancelForm.bind(this)} applyEdit={this.applyEdit.bind(this)}/>;
              }
            })()
          }
        </div>
      </div>
    );
  }
}



/************ Sub forms on the floating popup ****************/

RTEditor.linkForm = class LinkForm extends React.Component {
  constructor() {
    super();
  }

  save() {
    this.props.applyEdit("link", {
      href: "www.blah.com"
    });
  }

  render() {
    return (
      <div className="rte__floating-form">
        <div className="rte__floating-form-heading">
          <header className="card__section-title">
            <h4 className="card__section-header">Add link</h4>
          </header>
        </div>
        <div className="rte__floating-form-body">
          <FormField.Text multiline={false} helpText="Enter the URL where this anchor should link to" label="Enter URL"/>
          <div className="rte__floating-form-submit">
            <button className="button button_style_fill-accent" onClick={this.save.bind(this)}>Save</button>
            <button className="button button_style_outline-gray" onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}


RTEditor.content = class Content extends React.Component {
  constructor() {
    super();
  }
  onMouseDown (e) {
    if (this.props.contentItems.length === 0) {
      this.props.startEditing();
      e.preventDefault();
    }
  }
  componentDidUpdate (prevProps) {
    if (prevProps.contentItems.length === 1) {
      $(".rte__editable").focus();
    }
  }
  deleteWidget(index) {
    this.props.deleteWidget(index);
  }
  saveWidget(index, data) {
    this.props.saveWidget(index, data);
  }
  render() {
    return (
      <div className="rte__content">
        <div className="rte__box" onMouseDown={this.onMouseDown.bind(this)}>
          {
           (this.props.contentItems.length === 0) ?
              <span className="rte__helper">Enter or copy-paste your text</span>
            :
              null
          }
          <div className="rte__content-list">
            {
              this.props.contentItems.map(function(item, index) {
                if (typeof item === "string") {
                  return <RTEditor.textBlock html={item} index={index} updateContent={this.props.updateContent} updateCaret={this.props.updateCaret} />
                }

                if (typeof item === "object") {
                  return <RTEditor.widget contentIndex={index} key={item.id} widget={item} deleteWidget={this.deleteWidget.bind(this, index)} saveWidget={this.saveWidget.bind(this, index)} />
                }
              }.bind(this))
            }
          </div>
          <div className="rte__text-block">
          </div>
        </div>
      </div>
    );
  }
}


/***************** WIDGET ********************/


RTEditor.widget = class Widget extends React.Component {
  constructor() {
    super();
    this.state = {
      mode: "edit" // can be "view" or "edit"
    }
  }

  save(data) {
    this.setState({
      mode: "view",
    })
    this.props.saveWidget(this.props.contentIndex, data);
  }

  delete() {

  }

  componentWillReceiveProps(nextProps) {
    console.log("will recive");
    console.log(nextProps);
    console.log(this.props);
    console.log(this.state);
    // If we have just made a change to data, ie we edited this,
    // change state to view mode
    if (nextProps.widget.data !== this.props.widget.data &&
        this.state.mode === "edit") {
      console.log("looks like we just made an edit!!");
    }
  }

  render() {
    console.log("rendering eidget", this.props);
    var content;
    var data = this.props.widget.data;

    switch (this.state.mode) {

      case "edit":
        var widgetProps = RTEditorWidgets[this.props.widget.type];
        var EditorComponent = widgetProps.editorComponent;
        console.log("The editor component", EditorComponent);
        return (
          <div className="rte__widget">
            <div className="rte__widget-editor">
              <div className="rte__widget-title">
                <span>{widgetProps.name}</span>
                <div className="rte__widget-remove"></div>
              </div>
              <div>
                <EditorComponent data={data} cancel={this.props.deleteWidget} save={this.props.saveWidget}></EditorComponent>
              </div>
            </div>
          </div>

        );
    }

    return null;
  }
}





/***************** Text editor blocks ******************/


RTEditor.textBlock = class TextBlock extends React.Component {
  constructor() {
    super();
  }
  updateContent(event) {
    this.props.updateContent(this.props.index, event.target.value);
  }
  updateCaret(position) {
    this.props.updateCaret(this.props.index, position);
  }
  render() {
    var handleChange = function(event) {
      this.setState({html: event.target.value});
    }.bind(this);

    return (<ContentEditable html={this.props.html} onChange={this.updateContent.bind(this)} updateCaret={this.updateCaret.bind(this)} />);
  }
}

var ContentEditable = class ContentEditable extends React.Component {
    render() {
        return <div
            className="rte__editable"
            ref="theDiv"
            onInput={this.emitChange.bind(this)}
            onBlur={this.emitChange.bind(this)}
            onKeyDown={this.updateCaret.bind(this)}
            onMouseUp={this.updateCaret.bind(this)}
            contentEditable
            dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
    }
    shouldComponentUpdate(nextProps){
        return nextProps.html !== this.refs.theDiv.innerHTML;
    }
    updateCaret(event) {
      var position = 0;
      this.props.updateCaret(position);
    }
    emitChange() {
        var html = this.refs.theDiv.innerHTML;
        if (this.props.onChange && html !== this.lastHtml) {
            this.props.onChange({
                target: {
                    value: html
                }
            });
        }
        this.lastHtml = html;
    }
}




module.exports = RTEditor;
