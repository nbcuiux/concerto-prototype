/* This exports a data object which contains information about the
 * various widget that can be inserted into a post using the RTEditor */


var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var FormField = require('./Form.jsx');
var SlideDown = require('./SlideDown.jsx');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var getNewId = require("../idGen.js");

var RTEditorWidgets = {}



RTEditorWidgets.youtube = {

  name: "Insert YouTube Clip",

  displayComponent: class DisplayComponent extends React.Component {
    constructor() {
      super();
    }
    render() {
      return
        (<iframe width="560" height="315" src="https://www.youtube.com/embed/2GIsExb5jJU" frameborder="0" allowfullscreen></iframe>)
    }
  },

  getRenderHtml: function () {
    return '<iframe width="560" height="315" src="https://www.youtube.com/embed/m8rxXamfh5c" frameborder="0" allowfullscreen></iframe><p></p>';
  },

  editorComponent: React.createClass({
    save() {

      var widgetData = {
        link: "https://www.youtube.com/watch?v=2GIsExb5jJU"
      }

      this.props.save(widgetData);
    },
    render() {
      return (
        <div className="rte-widget__editor">
          <FormField.Text multiline={false} helpText="e.g. 'https://www.youtube.com/watch?v=2GIsExb5jJU'" label="Copy-paste Youtube url"/>
          <div className="rte__floating-form-submit">
            <button className="button button_style_fill-accent" onClick={this.save}>Save</button>
            <button className="button button_style_outline-gray" onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      );
    }
  }),

}


RTEditorWidgets.embed = {

  name: "Insert embedded content",

  displayComponent: class DisplayComponent extends React.Component {
    constructor() {
      super();
    }
    render() {
      return
        (<iframe width="560" height="315" src="https://www.youtube.com/embed/2GIsExb5jJU" frameborder="0" allowfullscreen></iframe>)
    }
  },

  getRenderHtml: function () {
    return '<iframe width="560" height="315" src="https://www.youtube.com/embed/m8rxXamfh5c" frameborder="0" allowfullscreen></iframe><p></p>';
  },

  editorComponent: React.createClass({
    save() {

      var widgetData = {
        link: "https://www.youtube.com/watch?v=2GIsExb5jJU"
      }

      this.props.save(widgetData);
    },
    render() {
      return (
        <div className="rte-widget__editor">
          <FormField.Select helpText="Choose which type of widget you are embedding" label="Embed type" placeholder="Select..." items={'["Facebook", "Twitter", "Youtube"]'} onChange={this.onChange}/>
          <FormField.Text multiline={false} helpText="Enter a URL (e.g. 'https://www.youtube.com/watch?v=2GIsExb5jJU')" label="URL"/>
          <div className="rte__floating-form-submit">
            <button className="button button_style_fill-accent" onClick={this.save}>Save</button>
            <button className="button button_style_outline-white" onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      );
    }
  }),

}




RTEditorWidgets.twitter = {

  name: "Insert YouTube Clip",

  getRenderHtml: function () {
    return '<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Tonight&#39;s the night!'
              + '<a href="https://twitter.com/hashtag/RHONY?src=hash">#RHONY</a> 9pmET followed by my special <a href="https://twitter.com/hashtag/BeforeTheyWereHousewives?src=hash">#BeforeTheyWereHousewives</a> 10pmET! Enjoy!!😘 <a href="https://twitter.com/Bravotv">@Bravotv</a> <a href="https://t.co/NwUwDgT6on">pic.twitter.com/NwUwDgT6on</a></p>&mdash; Luann de Lesseps (@CountessLuann) <a href="https://twitter.com/CountessLuann/status/745596226989658112">June 22, 2016</a>'
              + '</blockquote><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>';
  },

  displayComponent: class DisplayComponent extends React.Component {
    constructor() {
      super();
    }
    render() {
      return
        (<iframe width="560" height="315" src="https://www.youtube.com/embed/2GIsExb5jJU" frameborder="0" allowfullscreen></iframe>)
    }
  },

  editorComponent: React.createClass({
    save() {

      var widgetData = {
        link: "https://www.youtube.com/watch?v=2GIsExb5jJU"
      }

      this.props.save(widgetData);
    },
    render() {
      return (
        <div className="rte-widget__editor">
          <FormField.Text multiline={false} helpText="e.g. 'https://www.youtube.com/watch?v=2GIsExb5jJU'" label="Copy-paste Youtube url"/>
          <div className="rte__floating-form-submit">
            <button className="button button_style_fill-accent" onClick={this.save}>Save</button>
            <button className="button button_style_outline-gray" onClick={this.props.cancel}>Cancel</button>
          </div>
        </div>
      );
    }
  }),

}




RTEditorWidgets.contentLink = {

  name: "Insert link",

  getRenderHtml: function (args) {
    return '<a href="' + args.url + '">' + args.displayText + '</a>';
  },

  displayComponent: class DisplayComponent extends React.Component {
    constructor() {
      super();
    }
    render() {
      return
        (<iframe width="560" height="315" src="https://www.youtube.com/embed/2GIsExb5jJU" frameborder="0" allowfullscreen></iframe>)
    }
  },

  editorComponent: React.createClass({
  getInitialState() {

    var selection = (this.props.editor) ? this.props.editor.selection.getContent({format: 'text'}) : null;

    var widgetData = {
      url: "",
      displayText: selection
    }

    return {
      typeOption: 0,
      widgetData: this.props.intialWidgetData || widgetData
    }
  },
  toggleType(index) {
    this.setState({
      typeOption: index
    })
  },
  save() {
    this.props.save(this.state.widgetData);
  },
  onChange(field, value) {
    var widgetData = this.state.widgetData;
    widgetData[field] = value;
    this.setState({
      widgetData: widgetData
    });
  },
  render() {


    var selection = (this.props.editor) ? this.props.editor.selection.getContent({format: 'text'}) : null;

    return (
      <div className="rte-widget__editor">
        <div className={"rte-widget__link-external" + (this.state.typeOption !== 0 ? " hidden" : "") }>
            <div className="controls__group">
              <FormField.Text value={selection} multiline={false} helpText="e.g. 'Click here to see our blog'" name="displayText" label="Link Text" onChange={this.onChange}/>
            </div>
            <div className="controls__group">
              <FormField.Text multiline={false} helpText="e.g. 'http://yoursite.com'" name="url" label="URL" onChange={this.onChange}/>
            </div>
          </div>
          <div className={"rte-widget__link-internal" + (this.state.typeOption !== 1 ? " hidden" : "") }>
            <div className="controls__group">
              <FormField.Text multiline={false} helpText="e.g. 'Click here to see our blog'" label="Link text" onChange={this.onChange}/>
            </div>
            <div className="controls__group">
              <FormField.Select helpText="" label="Type/Choose a content item to link to" placeholder="Select content item" items={'["Blog", "Friday 13th", "Some page"]'} onChange={this.onChange}/>
            </div>
          </div>
        <div className="rte__floating-form-submit">
          <button className="button button_style_fill-accent" onClick={this.save}>Save</button>
          <button className="button button_style_outline-white" onClick={this.props.cancel}>Cancel</button>
        </div>
      </div>
    );
    }
  }),

}



RTEditorWidgets.listicle = {

  name: "Insert Standard Listicle",

  getRenderHtml: function () {
    return '<div class="rte-content__placeholder rte-content__listicle mceNonEditable" contenteditable="false" data-widget-type="listicle">' +
              '<div class="rte-content__listicle-edit js-listicle-edit"><i class="fa fa-pencil"></i></div>' +
              '<div class="listicle__content-item"><div class="preview__image-img"><img src="img/content/listicle-img-3.jpg"></div><div class="listicle__heading">S1 Ep 3 - Choices</div><div class="listicle__description">In &quot;eps1.2_d3bug.mkv,&quot; Elliot explains to his therapist Krista how we&#39;re duped into having a false sense of making choices.</div></div>' +
              '<div class="listicle__content-item"><div class="preview__image-img"><img src="img/content/listicle-img-2.jpg"></div><div class="listicle__heading">S1 Ep 4 - Withdrawal</div><div class="listicle__description">In this clip from &quot;eps1.3_da3m0ns.mp4,&quot; Elliot&#39;s calm voiceover narrates his torturous detox from morphine.</div></div>' +
              '<div class="listicle__content-item"><div class="preview__image-img"><img src="img/content/listicle-img-1.jpg"></div><div class="listicle__heading">S1 Ep 6 - Shayla&#39;s Fate</div><div class="listicle__description">During the final moments of &quot;eps1.5_br4ve-trave1er.asf,&quot; the realization of what has happened to Shayla washes over Elliot in a long take.</div></div>' +
            '</div><p></p>';
  },

  displayComponent: class DisplayComponent extends React.Component {
    constructor() {
      super();
    }
    render() {
      return
        (<iframe width="560" height="315" src="https://www.youtube.com/embed/2GIsExb5jJU" frameborder="0" allowfullscreen></iframe>)
    }
  },

  editorComponent: React.createClass({
    getInitialState() {
      return {
        items: [{
          id: getNewId(),
          title: "blah",
          description: "blah",
          media: "51"
        }]
      }
    },
    save() {

      var widgetData = {
        link: "https://www.youtube.com/watch?v=2GIsExb5jJU"
      }

      this.props.save(widgetData);
    },
    addItem() {
      var items = this.state.items;
      items.push({
        id: getNewId(),
        title: "blah",
        description: "blah",
        media: "51"
      });
      this.setState({
        items: items
      });
    },
    removeItem(index) {
      var items = this.state.items;
      items.splice(index, 1);
      this.setState({
        items: items
      });


      if (index === items.length) {
          // Scrolls viewport to item before the one deleted, only if we deleted the last
          var top = $(this.refs.container).find(".listicle__item").eq(index-1).offset().top - 130;
          $("html, body").animate({
            scrollTop: top
          })
      }
    },
    reorder: function(droppedIndex) {
      var items = this.state.items;
      var draggedItem = items[this.currentDraggedIndex];
      // remove from aoriginal place
      items.splice(this.currentDraggedIndex, 1);
      items.splice(droppedIndex, 0, draggedItem);
      this.setState({
        items: items
      });
    },
    drag: function(draggedIndex) {
      this.currentDraggedIndex = draggedIndex;
    },
    componentDidUpdate() {

    },
    render() {
      return (
        <div className="rte-widget__editor" ref="container">
          <div className="rte-widget__heading">Listicle items</div>
          <div className="rte-widget__listicle-list">
            <ReactCSSTransitionGroup transitionName="listicle__item" transitionEnterTimeout={1000} transitionLeaveTimeout={300}>
              {
                this.state.items.map(function(item, index) {
                  return (
                    <ListicleItem index={index} key={item.id} item={item} drag={this.drag.bind(this,index)} reorder={this.reorder.bind(this,index)} removeItem={this.removeItem.bind(this, index)} showRemove={this.state.items.length > 1} />
                  );
                }.bind(this))
              }
            </ReactCSSTransitionGroup>
          </div>
          <div className="listicle__add" onClick={this.addItem}>
            <i className="fa fa-plus"></i>Add item
          </div>
        </div>
      );
    }
  }),

}

var ListicleItem = React.createClass({
  componentDidMount() {
    // Scrolls viewport to newly create items
    var top = $(this.refs.container).offset().top - 130;
    $(".listicle-overlay").animate({
      scrollTop: top
    })
  },
  getInitialState(){
    return({
      attachmentType: 0
    })
  },
  toggleType(index) {
    this.setState({
      attachmentType: index
    });
  },
  render() {
    return (
      <div ref="container" className="listicle__item" draggable={true} onDragStart={this.props.drag} onDrop={this.props.reorder} >
        <div className="listicle__count">{this.props.index + 1}</div>
        <div className="c-Addable-row-dragHandler"></div>
        <label className="input__label-isolated">Attachment</label>
        <div className="controls__group">
          <FormField.RadioToggle selectedOption={this.state.attachmentType} options={["Media", "Embedded item"]} label="Select an attachment type" onChange={this.toggleType}/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 0 ? " hidden" : "")}>
          <FormField.Media gallerySelectSubmitText="Add to listicle" singleSelect={true}/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 2 ? " hidden" : "")}>

          <FormField.Select helpText="" label="Type/Choose a content item to link to" placeholder="Select content item" items={'["Blog", "Friday 13th", "Some page"]'} onChange={this.onChange}/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 1 ? " hidden" : "")}>
          <FormField.Select helpText="Choose which type of widget you are embedding" label="Embed type" placeholder="Select..." items={'["Facebook", "Twitter", "Youtube"]'} onChange={this.onChange}/>
          <FormField.Text multiline={false} helpText="Copy/paste your embed URL from Youtube, Facebook or Twitter" label="Embed url"/>
        </div>
        <div className="controls__group">
          <FormField.RTEditor helpText="Please enter a title for this item" label="Title"/>
        </div>
        <div className="controls__group">
          <FormField.RTEditor helpText="Please enter content for this item" label="Content"/>
        </div>
        {
          (this.props.showRemove) ?
            <div className="listicle__remove">
              <div className="button--round button_style_outline-gray button--remove" onClick={this.props.removeItem}>
              </div>
            </div>
          :
            null
        }
      </div>
    )
  }
});






module.exports = RTEditorWidgets;
