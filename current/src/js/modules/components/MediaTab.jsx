
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var FormField = require("./Form.jsx");

import { Component } from "react"




const usageOptions = [
  {
    id: "Primary",
    title: "Primary"
  },
  {
    id: "Secondary",
    title: "Secondary"
  }, 

]



export default class MediaTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: props.items.slice()
    }
  }

  componentWillReceiveProps(nextProps) {
  	
  	console.log(nextProps.items);
  	
  	this.setState({
		  items: nextProps.items.slice()
    });
	}

  deleteFile(index) {
    this.props.deleteFile(this.state.items[index].fileData.id);
    this.state.items.splice(index, 1);
  	this.setState({
  		items: this.state.items
  	});
  }

  toggleSelectFile(index) {
  	var item = this.state.items[index];
  	item.selected = !item.selected;
  	this.setState({
  		items: this.state.items
  	})
  }

  selectUsage(index, usage) {
    const { items } = this.state;
    items[index].usage = usage.id;
    console.log("select usage", usage, index);
    this.setState({
      items: items
    })
  }

  edit(index, e) {
    const item = this.state.items[index];
    this.props.editFiles([item]);
  }

  render() {

  	var items = this.state.items;

    let theseUsageOptions = usageOptions.filter(option => {

      if (items.findIndex(item => item.usage === option.id) === -1) {
        return true;
      }
      else {
        return false;
      }

    })

    return (
    	<div className="section__files section__files_view_grid">
    	{	
    		items.map((item, index)=>{

    			var fileData = item.fileData;
    			var imgStyle = {
    				backgroundImage: "url(" + fileData.url + ")"
    			}

    			var classnames = classNames({
    				'file': true,
    				'file_type_img': fileData.type === "image",
    				'file_view_grid': true,
    				'justUploaded': item.justUploaded,
    				'selected': item.selected
    			});

    			return (
    				<div className={classnames} key={fileData.id}>
    					<div className="hidden file__id"></div>
    					<div className="file__img" style={imgStyle}>
	    					<div className="file__controls">
	    						<div className="file__checkmark" onClick={this.toggleSelectFile.bind(this, index)}></div>
	    						<div className="file__delete" onClick={this.deleteFile.bind(this, index)}></div>
	    						<div className="file__type">
	    							<i className="fa fa-camera"></i>
	    						</div>
	    						<button className="button button_style_outline-white" onClick={this.edit.bind(this, index)}>Edit</button>
	    					</div>
    					</div>
    					<div className="file__title file__title--media-card">{ fileData.title }</div>
    					<FormField.ComplexSelect
    					    helpText="Start typing the title of the content item, or the external URL" 
				            label="Usage" 
				            items={theseUsageOptions}
				            data={[]}
				            search={false}
				            allowCustom={false}
				            showComplex={false}
                    onSelect={this.selectUsage.bind(this, index)}
				            inputPlaceholder="e.g. 'http://yoursite.com' or choose a content item"
            			/>
    				</div>

    			)
    		})
    	}
    	</div>
    );
  }

}

MediaTab.defaultProps = {
  editFiles: window.editFiles
}


module.exports = MediaTab;