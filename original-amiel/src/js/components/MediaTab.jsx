
var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var FormField = require("./Form.jsx");



var MediaTab = React.createClass({

  getInitialState() {
  	console.log("Apparently re creating the MediaTab element");
    return {
    	items: this.props.items.slice()
    };
  },

  componentWillReceiveProps(nextProps) {
  	
  	console.log(nextProps.items);
  	
  	this.setState({
		items: this.state.items.concat(nextProps.items)
	});

  	/*
  	console.log("Inside component will recive props", this.state.items.length, nextProps.items.length);
  	if (this.state.items !== nextProps.items) {
  		
  		nextProps.items.forEach((item, index) => {
  			this.state.items.push(item);
  		});

  		console.log("The state items in compoenet wil revive props", this.state.items);

  		this.setState({
  			items: this.state.items.concat(nextProps.items)
  		});
  	}
  	*/
  },

  deleteFile(index) {
  	this.state.items.splice(index, 1);
  	this.setState({
  		items: this.state.items
  	});
  },

  toggleSelectFile(index) {
  	var item = this.state.items[index];
  	item.selected = !item.selected;
  	this.setState({
  		items: this.state.items
  	})
  },

  render() {

  	var items = this.state.items;

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
    				<div className={classnames} key={index}>
    					<div className="hidden file__id"></div>
    					<div className="file__img" style={imgStyle}>
	    					<div className="file__controls">
	    						<div className="file__checkmark" onClick={this.toggleSelectFile.bind(this, index)}></div>
	    						<div className="file__delete" onClick={this.deleteFile.bind(this, index)}></div>
	    						<div className="file__type">
	    							<i className="fa fa-camera"></i>
	    						</div>
	    						<button className="button button_style_outline-white">Edit</button>
	    					</div>
    					</div>
    					<div className="file__title file__title--media-card">{ fileData.title }</div>
    					<FormField.ComplexSelect
    					    helpText="Start typing the title of the content item, or the external URL" 
				            label="Usage" 
				            items={[]}
				            data={[]}
				            search={false}
				            allowCustom={false}
				            showComplex={false}
				            inputPlaceholder="e.g. 'http://yoursite.com' or choose a content item"
            			/>
    				</div>

    			)
    		})
    	}
    	</div>
    );
  }

});


module.exports = MediaTab;