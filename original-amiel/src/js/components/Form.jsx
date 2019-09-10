
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var ImagePlaceholder = require("../sources/controls/imagePlaceholderNew.js");
var SlideDown = require('./SlideDown.jsx');
var getNewId = require("../sources/idGen.js");
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var FormField = {};

var idGen = require("../sources/idGen.js");

// Text field which can be either a single line, multiline and also
// features a rich text editor
FormField.Text = class Text extends React.Component {
  constructor(props) {
    super();
    var initialValue = props.value;
    this.state = {
      value: initialValue
    }
  }
  onChange(e) {
    var value = e.target.value;
    this.setState({"value": value});
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
  }
  componentDidMount() {
    // If we are multiline, we need to set the initial height and activate
    // elastic text areas
    if (this.props.multiline) {
      var input = this.refs.theInput;
      if (input.value === '') {
        input.rows = 1;
      }
      else {
        var width = input.getBoundingClientRect().width;
        var textWidth = input.value.length * 7;
        var re = /[\n\r]/ig;
        lineBrakes = input.value.match(re);
        row = Math.ceil(textWidth / width);
        row = row <= 0 ? 1 : row;
        row = this.props.maxHeight && row > this.props.maxHeight ? this.props.maxHeight : row;
        if (lineBrakes) {
          row += lineBrakes.length;
        }
        input.rows = row;
      }
      $(input).elastic();
    }
  }

  render() {
    var input = this.refs.theInput;
    var inputRender;
    var classnames = classNames({
      "input__field": true,
      "input_state_not-empty": (this.state.value),
      "input__field_style_dark": (this.props.theme === "dark")
    });
    // Render input for single line, textarea for multiline
    if (!this.props.multiline) {
      var inputRender = (<input id={this.props.id} ref="theInput" type="text" value={this.state.value} className={classnames} placeholder={this.props.placeholder} onBlur={this.onBlur} onFocus={this.onFocus} onChange={this.onChange.bind(this)} />)
    }
    else {
      var inputRender = (<textarea id={this.props.id} ref="theInput" type="text" value={this.state.value} className={classnames} placeholder={this.props.placeholder} onBlur={this.onBlur} onFocus={this.onFocus} onChange={this.onChange.bind(this)}></textarea>)
    }
    return (
      <div className="input__wrapper">
        {inputRender}
        <label className="input__label">{this.props.label}</label>
        <div className="input__blink"></div>
        <div className="input__help-text">{this.props.helpText}</div>
        <div className="input__err-msg">{this.props.errMsg}</div>
      </div>
    );
  }
}

FormField.RTEditor = class RTEditor extends React.Component {
  constructor(props) {
    super();
    this.id = idGen();
    var initialValue = props.value;
    this.state = {
      value: initialValue,
      expanded: false
    }
  }
  onChange(e) {
    var value = e.target.value;
    this.setState({"value": value});
    if (this.props.onChange) {
      this.props.onChange(this.props.name, value);
    }
  }

  onFocus(e) {
    e.preventDefault();
    e.stopPropagation();
    // We need this settimeout because for some reason if you don't have it,
    // the editor will fire a blur event immediately after the focus event
    setTimeout(function () {
      this.setState({
        expanded: true
      });
    }.bind(this), 100)

    //this.editor.focus(false);
  }

  initEditor(editor) {
    this.editor = editor;
    editor.on("focus", function(e) {
      e.stopImmediatePropagation();
    }.bind(this));
    editor.on("blur", function(e) {
      e.stopImmediatePropagation();
      this.setState({
        expanded: false
      })
      
    }.bind(this));
    editor.on("change", function(e) {
      var value = editor.getContent();
      this.setState({"value": value});
      if (this.props.onChange) {
        this.props.onChange(this.props.name, value);
      }
    }.bind(this));

    // To open up context menu on selecting text
    editor.on("mouseup", function (e) {
      var el = e.target;
      // Put this in a timeout so that if we click to clear the selection, we dont trigger
      // the menu
      setTimeout(function () {
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
      }, 100)
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expanded === false && this.state.expanded === true) {
      this.editor.focus(false);
    }
  }

  componentDidMount() {
    var self = this;
    tinymce.init({
      selector:'#rteditor-' + this.id,
      height: 200,
      menubar: false,
      toolbar: "bold italic underline link",
      contextmenu: "bold italic underline link",
      skin: "lightgray",
      plugins: "link noneditable contextmenu",

      setup: function (editor) {
        self.initEditor(editor);
      },
      skin_url: '/app.css',
      content_css : "/app.css",
      skin: "test",
      body_class: 'rte-content',
      auto_focus: false
    });
  }

  render() {
    var input = this.refs.theInput;
    var editor = this.refs.theEditor;
    var inputRender;
    var classnames = classNames({
      "input__field": true,
      "input_state_not-empty": (this.state.value)
    });

    var inputValue = "";

    if (this.editor) {
      inputValue = this.editor.getContent({format : 'text'});
    }
   

    return (
      <div className={"input__wrapper input__rteditor" + (this.state.expanded ? " input--expanded" : "") }>
        <SlideDown isOpen={this.state.expanded}>
          <div className="input__rteditor-editor">
            <div ref="theEditor" id={"rteditor-" + this.id }></div>
          </div>
        </SlideDown>
        <input ref="theInput" type="text" value={inputValue} className={classnames} placeholder={this.props.placeholder} onFocus={this.onFocus.bind(this)} onChange={this.onChange.bind(this)} />
        <label className="input__label">{this.props.label}</label>
        <div className="input__blink"></div>
        <div className="input__help-text">{this.props.helpText}</div>
        <div className="input__err-msg">{this.props.errMsg}</div>
      </div>
    );
  }
}


// Date picker widget
FormField.Date = class Date extends React.Component {
  constructor() {
    super();
    this.state= {
      value: ''
    }
  }
  componentDidMount() {
    var self = this;
    $(this.refs.theInput).datepicker({
      onSelect: function(dateText) {
        self.setState({"value": dateText});
      },
      changeMonth: true,
      changeYear: true
      /*monthNamesShort: [ "Januar", "Februar", "Marts", "April", "Maj", "Juni", "Juli", "August", "September", "Oktober", "November", "December" ]*/
    });
  }
  render() {
    var input = this.refs.theInput;
    var inputRender;
    var classnames = classNames({
      "input__field": true,
      "input_state_not-empty": (this.state.value)
    });
    return (
      <div className="input__wrapper">
        <input ref="theInput" type="text" value={this.state.value} className={classnames} />
        <label className="input__label">{this.props.label}</label>
        <div className="input__blink"></div>
        <div className="input__help-text">{this.props.helpText}</div>
        <div className="input__err-msg">{this.props.errMsg}</div>
      </div>
    );
  }
}



// Siple select dropdown
/*
FormField.Select = class Select extends React.Component {
  constructor() {
    super();
    this.state= {
      value: '',
      selectedIndex: null,
      highlightedIndex: null,
      isOpen: false
    }
  }
  componentDidMount() {
    
  }
  toggleOpen() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  highlightItem(index) {
    this.setState({
      highlightedIndex: index
    });
  }
  selectItem(index) {
    this.setState({
      selectedIndex: index,
      isOpen: false,
      highlightedIndex: null,
      value: this.props.items[index]
    })
  }
  onKeyDown(e) {
    console.log("on key down");
    e.preventDefault();
    e.stopPropagation();
    var index, length;
    switch (e.keyCode) {
      // Return key
      case 13:
        this.selectItem(this.state.highlightedIndex)
        break;
      // Escape
      case 27:
        this.setState({
          isOpen: false
        });
        break;

      // Up arrow
      case 38:
        if (this.state.isOpen) {
          this.setState({
            highlightedIndex: Math.max(this.state.highlightedIndex - 1, 0)
          })
        }
        else {
          this.setState({
            isOpen: true
          })
        }
        break;
      // Down arrow
      case 40:
        if (this.state.isOpen) {
          this.setState({
            highlightedIndex: Math.min(this.state.highlightedIndex + 1, this.props.items.length)
          })
        }
        else {
          this.setState({
            isOpen: true
          })
        }
        break;
    }
  }
  render() {
    var classnames = classNames({
      "select__wrapper": true,
      "select--open": (this.state.isOpen),
      "select--not-empty": this.state.value !== ''
    });
    return (
      <div className={classnames} onKeyDown={this.onKeyDown}>
        <div className="selectbox__field" onClick={this.toggleOpen.bind(this)}>{this.state.value}</div>
        <div className="selectbox__label">{this.props.label}</div>
        <div className="selectbox__list">
          <div className={"selectbox__list-item selectbox__list-item--text" + (this.state.highlightedIndex===0 ? " is-hightlighted" : "")}>None</div>
          <div className="selectbox__list-divider"></div>
            {
              this.props.items.map(function (item, index) {
                var classnames=classNames({
                  "selectbox__list-item": true,
                  "selectbox__list-item--text": true,
                  "is-hightlighted": this.state.highlightedIndex === index,
                  "is-active": this.state.selectedIndex === index
                });
                return (
                  <div className={classnames} key={index} onMouseOver={this.highlightItem.bind(this, index)} onClick={this.selectItem.bind(this, index)}>{item}</div>
                );
              }.bind(this))
            }
        </div>
      </div>
    );
  }
}
*/


FormField.Select = class Select extends React.Component {
  componentDidMount() {
    new Selectbox(this.refs.container, {
        label: this.props.label,
        helpText: this.props.helpText,
        errMsg: this.props.errMsg,
        placeholder: this.props.placeholder,
        items: JSON.parse(this.props.items),
        search: this.props.search,
        searchPlaceholder:this.props.searchPlaceholder,
        required: this.props.required,
        selectedItem: this.props.selectedItem,
        unselect: this.props.unselect,
        onSelect: this.props.onSelect
    });
  }
  render() {
    return (<div ref="container"></div>);
  }
}

FormField.ComplexSelectOld = class Select extends React.Component {
  componentDidMount() {
    new ComplexSelectbox(this.refs.container, {
        label: this.props.label,
        helpText: this.props.helpText,
        placeholder: this.props.placeholder,
        items: this.props.items,
        complexItems: true,
        sideNav: this.props.sideNav,
        itemCallback: this.props.itemCallback,
        data: this.props.data,
        search: this.props.search,
        allowCustom: this.props.allowCustom
    });
  }
  render() {
    return (<div ref="container"></div>);
  }
}


FormField.ComplexSelect = class ComplexSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state= {
      selectedOption: -1,
      textValue: "",
      isFocused: false,
      highlightedOption: -1,
      filteredItems: props.items
    }

    // We use native events to detect clicks on the document body
    this.documentClickHandler = (e) => {
      e.stopPropagation();
      var el = e.target;
      // Clicking outside this component
      if ($(el).closest(this.refs.container).length == 0) {
        this.unFocus();
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // Update the filtered items if there are new items
    this.setState({
      filteredItems: this.getFilteredItems(nextProps.items, this.state.textValue)
    })
  }

  getFilteredItems(items, value) {
    // Filters the items
    var filteredItems;
    if (this.props.search) {
      filteredItems = (value) ? 
        items.filter(function(item, index) {
          // Searches the string for our typed in one
          var result = (item.title).search(new RegExp(value, "i"));
          return (result !== -1);
        }.bind(this))
      :
        items;
    }
    else {
      filteredItems = items;
    }

    return filteredItems;
  }
 
  onFocus(e) {

    e.stopPropagation();
    e.preventDefault();
    
    this.setState({
      isFocused: true
    });

  }

  unFocus() {

    this.setState({
      isFocused: false
    });

  }

  onChange(e) {
    
    var value = e.target.value;
    var filteredItems = this.getFilteredItems(this.props.items, value);
    // If there are no filtered results, it means we are typing in a custom string.
    // In this case deselect the current selection
    var selectedOption = (filteredItems.length === 0) ? -1: this.state.selectedOption;

    this.setState({
      textValue: value,
      selectedOption: -1,
      filteredItems: filteredItems,
      selectedOption: selectedOption
    })
  }


  onKeyDown(e) {
    e.stopPropagation();
    var index, length;
    switch (e.keyCode) {
        // Return
        case 13:
          this.selectOption(this.state.filteredItems[this.state.highlightedOption]);
          e.preventDefault();
          break;
        // Escape
        case 27:
          this.unFocus();
          e.preventDefault();
          break;
        // Tab
        case 9:
          this.unFocus();
          break;
        // Up
        case 38:
          var newHighlightedOption = (this.state.highlightedOption <= 0) ? 0 : this.state.highlightedOption - 1;
          this.setState({
            highlightedOption: newHighlightedOption
          });
          e.preventDefault();
          break;

        // Down
        case 40:
          var highlightedOption = (this.state.highlightedOption >= this.state.filteredItems.length) ? this.state.filteredItems.length - 1 : this.state.highlightedOption + 1;
          this.setState({
            highlightedOption: highlightedOption
          });
          e.preventDefault();
          break;
    }
  }


  highlightOption(index) {
    this.setState({
      highlightedOption: index
    })
  }

  selectOption(item, e) {

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (item.disabled) {
      return;
    }

    this.setState({
      selectedOption: item,
      textValue: item.title,
      isFocused: false
    });

    if (this.props.onSelect) {
      this.props.onSelect(item);
    }
  }

  optionMousedown(index, e) {
    e.preventDefault();
    this.selectOption(index);
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    var self = this;

    if (!prevState.isFocused && this.state.isFocused) {
      if (this.props.search) {
        this.refs.theInput.focus();
      }
      document.addEventListener("click", self.documentClickHandler, false);
    }

    else if (prevState.isFocused && !this.state.isFocused) {
      document.removeEventListener("click", self.documentClickHandler, false);
    }
  }



  render() {

    var stateNotEmpty = (this.state.selectedOption >= 0 || this.state.textValue);

    var classnames = classNames({
      "selectbox__field": true,
      "selectbox__field--complex": true,
      "selectbox_state_not-empty": stateNotEmpty,
      "selectbox_state_focused": this.state.isFocused,
      "selectbox_state_open": false,
      "selectbox_state_err": this.props.errorMsg,
    });

    var placeholderText = (this.state.selectedOption >= 0) ? this.props.items[this.state.selectedOption].title : this.state.textValue;
    var selectedOption = this.state.selectedOption;
    var placeholder;

    if (!this.props.showComplex && this.state.selectedOption != -1) {
      placeholder= (
          <div className="selectbox__placeholder">{this.state.selectedOption.title}</div>
      )
    }
    else if (this.state.selectedOption != -1) {
      placeholder = (
        <div className="selectbox__placeholder-box">
          <ComplexListItem item={selectedOption} />
        </div>
      )
    }
    else if (this.state.textValue) {
      placeholder = (
        <div className="selectbox__placeholder-box">
          <div>{this.state.textValue}</div>
          <div>External URL</div>
        </div>
      )
    }
    else {
      placeholder = <div className="selectbox__placeholder"></div>
    }

    return (
      <div className="select__wrapper" ref="container">
        <div className={classnames} onClick={this.onFocus.bind(this)} onKeyDown={this.onKeyDown.bind(this)} tabIndex="0">
          {
            (this.props.search && this.state.isFocused) ?
              <input placeholder={this.props.inputPlaceholder} ref="theInput" type="text" value={this.state.textValue} className="selectbox__searchfield" onChange={this.onChange.bind(this)} onClick={function(e) {e.stopPropagation();}} />
            :
              placeholder
          }
        </div>
        <label className="selectbox__label">{this.props.label}</label>
        <div className="selectbox__help-text">{this.props.helpText}</div>
        <div className="selectbox__err-msg">{this.props.errorMsg}</div>
        <div className={(!this.state.isFocused ? " hidden" : "")}>
          <SelectList 
            items={this.state.filteredItems}
            highlightedOption={this.state.highlightedOption}
            selectedOption={this.state.selectedOption} 
            highlightOption={this.highlightOption.bind(this)} 
            selectOption={this.selectOption.bind(this)}
            showComplex={this.props.showComplex}
            />
        </div>
      </div>
    );
  }
}

const SelectList = class ComplexSelect extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    // Scrolls the container when the highlighted index changes to
    // reveal overflowed list items
    if (this.props.highlightedOption !== prevProps.highlightedOption) {
      var container  = $(this.refs.container);
      var listItem   = container.find("li.is-hightlighted");
      var top        = listItem.position().top - $(this.refs.offsetOrigin).position().top;
      var height     = container.height();
      if (top > (container.scrollTop() + height)) {
        container.animate({
          scrollTop: top 
        }, 200)
      }
      else if (top < container.scrollTop() - 50) {
        container.animate({
          scrollTop: top - 150 
        }, 200)
      }
    }
  }

  render() {
    return (
        <ul className="selectbox__list" ref="container">
          <li ref="offsetOrigin"></li>
          {
            this.props.items.map(function(item, index) {
              
              var classnames = classNames({
                "selectbox__list-item": true,
                "selectbox__list-item--complex": true,
                "is-hightlighted": this.props.highlightedOption===index,
                "selectbox__list-item--selected": (this.props.selectedOption) && (item.id === this.props.selectedOption.id),
                "selectbox__list-item--disabled": (item.disabled === true)
              });

              return (
                <li key={index} className={classnames} 
                    onMouseOver={this.props.highlightOption.bind(this, index)}
                    onClick={this.props.selectOption.bind(this, item)}>

                  {
                    this.props.showComplex ?
                      (
                        <div>
                          <ComplexListItem item={item} />
                        </div>
                      )
                    :
                      <div className="selectbox__list-item-title">{item.title}</div>
                  }
                </li>
              )
            }.bind(this))
          }
        </ul>
    );
  }



}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

const ComplexListItem = class ComplexListItem extends React.Component {
  render() {
    return (
      <div>
        <div className="selectbox__list-item-img"><img src={this.props.item.img} /></div>
        <div className="selectbox__list-item-title">{this.props.item.title}</div>
        <div className="selectbox__list-item-subtitle">
          {
            (this.props.item.type.capitalizeFirstLetter() + 
              (this.props.item.series ? (" - " + this.props.item.series) : "") +
              (this.props.item.season ? (" S" + this.props.item.season) : "") +
              (this.props.item.episode ? (" E" + this.props.item.episode) : "")
            )
          }

        </div>
        <div className="selectbox__list-item-status">Published</div>
      </div>
    )
  }
}




FormField.RadioToggle = class RadioToggle extends React.Component {
  constructor() {
    super();
  }  
  selectOption(index) {
    if (this.props.onChange) {
      this.props.onChange(index);
    }
  }
  render() {
    console.log("The options", this.props.options);
    return (
      <div>
        <label className="c-label c-label--top">{this.props.label}</label>
        <ul className="radioToggle">
          {
            this.props.options.map(function(item, index) {
              return (
                <li key={index} className={ (this.props.selectedOption === index ? "active" : "") } onClick={this.selectOption.bind(this, index)}>{item}</li>
              )
            }.bind(this))
          }
        </ul>
      </div>
    )
  }
}



FormField.Media = class Select extends React.Component {
  constructor() {
    super();
  }  

  componentDidMount() {
    //this.refs.theEl;
    new ImagePlaceholder(this.refs.theEl, null, {
      alButton: this.props.gallerySelectSubmitText,
    });
  }

  render() {
    return (
      <div ref="theEl">
      </div>
    )
  }
}




// Repeater widget

FormField.Repeater = React.createClass({
  getInitialState() {
    return {
      items: [{
        id: getNewId()
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
      id: getNewId()
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
        var top = $(this.refs.container).find(".repeater__item").eq(index-1).offset().top - 130;
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


    // We use the child as a template to build other items in the list
    var child = this.props.children;

    return (
      <div className="repeater__wrapper" ref="container">
        <div className="rte-widget__heading">Listicle items</div>
        <div className="rte-widget__listicle-list">
          <ReactCSSTransitionGroup transitionName="repeater__item" transitionEnterTimeout={1000} transitionLeaveTimeout={300}>
            {
              this.state.items.map(function(item, index) {


                // Clone the child component, using it as a template
                var newItem = React.cloneElement(child, { item: item });

                return (
                  <div className="repeater__item" key={item.id} draggable={true} onDragStart={this.drag.bind(this, index)} onDrop={this.reorder.bind(this,index)} >
                    {newItem}
                    <div className="c-Addable-row-dragHandler"></div>
                    {
                      (this.state.items.length > 1) ?
                        <div className="repeater__remove">
                          <div className="button--round button_style_outline-gray button--remove" onClick={this.removeItem.bind(this, index)}>
                          </div>
                        </div>
                      :
                        null
                    }                    

                  </div>
                );
              }.bind(this))
            }
          </ReactCSSTransitionGroup>
        </div>
        <div className="repeater__add" onClick={this.addItem}>
          <i className="fa fa-plus"></i>Add item
        </div>
      </div>
    );
  }
});



var ListicleItem = React.createClass({
  componentDidMount() {
    // Scrolls viewport to newly create items
    var top = $(this.refs.container).offset().top - 130;
    $("html, body").animate({
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
          <FormField.RadioToggle selectedOption={this.state.attachmentType} options={["Media", "Content item", "Embedded item"]} label="What type of attachment would you like to use?" onChange={this.toggleType}/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 0 ? " hidden" : "")}>
          <FormField.Media gallerySelectSubmitText="Add to listicle"/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 1 ? " hidden" : "")}>
          <FormField.Select helpText="" label="Type/Choose a content item to link to" placeholder="Select content item" items={'["Blog", "Friday 13th", "Some page"]'} onChange={this.onChange}/>
        </div>
        <div className={"controls__group" + (this.state.attachmentType !== 2 ? " hidden" : "")}>
          <FormField.Text multiline={false} helpText="Copy/paste your embed URL from Youtube, Facebook or Twitter" label="Embed url"/>
        </div>
        <div className="controls__group">
          <FormField.Text multiline={false} helpText="Please enter a title for this item" label="Title"/>
        </div>
        <div className="controls__group">
          <FormField.RTEditor helpText="Please enter some content for this item" label="Content"/>
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







module.exports = FormField;
