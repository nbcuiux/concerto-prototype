
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var FormField = require("./Form.jsx");
import { Component } from "react"

console.log("The form field", FormField);


var contentItems = [
    {
        title: 'Friday 13th',
        id: 1001,
        type: 'Movie'
    },
    {
        title: 'Suits',
        id: 1002,
        type: 'Series'
    },
    {
        title: 'Some episode',
        id: 1002,
        type: 'Episode'
    },    
];


var usageItems = [
    "Call To Action Button - Primary",
    "Call To Action Button - Secondary", 
    "Image - Primary",
    "Text Link - Primary", 
    "Text Link - Secondary"
]




class LinkRepeater extends Component {


  constructor(props) {
    super(props);

    var id = 0;
    var newUsageItems = usageItems.map(function(item) {
      return {
        title: item,
        used: false,
        disabled: false,
        type: "",
        id: id++,
        usedBy: null
      }
    })

    this.state = {
      usageItems: newUsageItems,
      isSingle: 0
    }

  }

  toggleSingle (option) {
    this.setState({
      isSingle:option
    })
  }

  componentDidMount() {
    window.addedMediaItemsCallback = this.onAddedMediaItems;
  }

  onAddedMediaItems() {
    this.forceUpdate();
  }

  onSelectUsage(usageItem, repeaterIndex) {
    
    var usageItems = this.state.usageItems;
    var selectedUsages = this.state.selectedUsages;

    // Unselect the current selected usage, if it exists
    var currentSelectedItem = usageItems.find(function (i) {
      return i.usedBy === repeaterIndex;
    });

    if (currentSelectedItem) {
      currentSelectedItem.usedBy = null;
      currentSelectedItem.disabled = false;
    }

    var selectedItem = usageItems.find(function (i) {
      return usageItem.id === i.id;
    });

    selectedItem.disabled = true;
    selectedItem.usedBy = repeaterIndex;
    
    this.setState({
      usageItems: usageItems
    });
  }

  render() {
    var isSingleOption = (this.state.isSingle) ? 0 : 1;
    const Repeater = FormField.Repeater;
    return (
      <div className="link__repeater">
        <FormField.RadioToggle 
          label="Do you use one or many links?" 
          options={ [ "Single link", "Multiple links" ] } 
          selectedOption={this.state.isSingle} 
          onChange={this.toggleSingle.bind(this)}/>
        {
          (this.state.isSingle === 0) ?
            <LinkItemSingle contentItems={window.collectionItems} />
          :
            <Repeater>
              <LinkItem 
                usageItems={this.state.usageItems}
                contentItems={window.collectionItems}
                onSelectUsage={this.onSelectUsage} />
            </Repeater>
        }
      </div>
    );
  }

}

class LinkItemSingle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedTarget: 0
    }
  }

  onSelectTarget(newTarget) {
    this.setState({
      selectedTarget: newTarget
    });
  }

  render() {
    var isImage = false;
    var noImageWarning = false;

    console.log("The form fields", FormField);

    const ComplexSelect = FormField.ComplexSelect;

    return (
      <div className="link__item">     
        <div className={"controls__group" + (isImage ? " hidden": "")}>

        </div>
        <div className="controls__group">
          <ComplexSelect 
            helpText="Start typing the title of the content item, or the external URL" 
            label="URL / Content item" 
            items={this.props.contentItems}
            data={this.props.contentItems}
            search={true}
            allowCustom={true}
            search={true}
            showComplex={true}
            inputPlaceholder="e.g. 'http://yoursite.com' or choose a content item"/>

        </div> 
        <div className="controls__group">
          <input type="checkbox" className="toggle"  />
          <label>Open Link in new window</label>
        </div>            
      </div>
    );
  }

}






class LinkItem extends Component {


  constructor(props) {
    super(props);
    this.state = {
      selectedTarget: 0,
      selectedUsage: null      
    }
  }

  onSelectTarget(newTarget) {
    this.setState({
      selectedTarget: newTarget
    });
  }

  onSelectUsage(item, index) {
    
    var noImageWarning = false;
    var thisId = this.props.item.id;

    if (item.id == 2) {
      // Validate there are no iages
      if (window.galleryObjects.length == 0) {
        noImageWarning = true;
      }
    }

    this.props.onSelectUsage(item, thisId);

    this.setState({
      selectedUsage: item
    })
  }

  render() {

    var isImage = (this.state.selectedUsage && this.state.selectedUsage.id == 2);
    var noImageWarning = false;

    if (this.state.selectedUsage && this.state.selectedUsage.id == 2) {
      if (window.galleryObjects.length == 0) {
        noImageWarning = true;
        // Pulsate the card (terrible to do this inside render)
        $("#card-media").removeClass("is-active");
        setTimeout(function(){$("#card-media").addClass("is-active")},1);
      }
    }

    return (
      <div className="link__item">
        <div className="controls__group">
          <FormField.ComplexSelect 
            helpText="Choose where this link will appear" 
            label="Usage" 
            onSelect={this.onSelectUsage}
            items={this.props.usageItems} 
            search={false}
            showComplex={false}
            errorMsg={(noImageWarning) ? "Please add a primary image in the Media Tab!":""}/>  
        </div>      
        <div className={"controls__group" + (isImage ? " hidden": "")}>
          <FormField.Text multiline={false} helpText="Enter the button text" label="Display text"/>
        </div>
        <div className="controls__group">
          <FormField.ComplexSelect
            helpText="Start typing the title of the content item, or the external URL" 
            label="URL / Content item" 
            items={this.props.contentItems}
            data={this.props.contentItems}
            search={true}
            allowCustom={true}
            showComplex={true}
            inputPlaceholder="e.g. 'http://yoursite.com' or choose a content item"/>

        </div> 
        <div className="controls__group">
          <input type="checkbox" className="toggle"  />
          <label>Open Link in new window</label>
        </div>            
      </div>
    );
  }

}



module.exports = LinkRepeater;























