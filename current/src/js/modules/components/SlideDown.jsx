var React = require("react");
var ReactDOM = require("react-dom");
var classNames = require('classnames');
var DelayChain = require('../delayChain.js');
var $ = require("jquery");

var SlideDown = class SlideDown extends React.Component {
  constructor() {
    super();
  }

  componentDidMount() {
    if (this.props.isOpen === true) {
      var container = $(this.refs.container);
      container.css({
        "height" : "auto",
        "overflow": "visible"
      });
    }
  }

  open() {
    var dc = this.dc;
    var container = $(this.refs.container);
    var inner = $(this.refs.inner);
    var duration = 500;
    var innerHeight = inner.height();
    dc.cancel();
    dc.delay(1).then(function() {
      container.css({
        "height" : "0px",
        "overflow": "hidden"
      });
      return dc.delay(1);
    }).then(function () {
      container.css({
        "height" : innerHeight
      });
      return dc.delay(duration);
    }).then(function () {
      container.css({
        "height" : "auto",
        "overflow": "visible"
      });
    }).catch(function () {

    });    
  }

  close() {
    var dc = this.dc;
    var container = $(this.refs.container);
    var inner = $(this.refs.inner);
    var duration = 500;
    var innerHeight = inner.height();
    dc.cancel();
    dc.delay(1).then(function() {
      container.css({
        "height" : innerHeight,
        "overflow": "hidden"
      });
      return dc.delay(100);
    }).then(function () {
      container.css({
        "height" : "0px"
      });
    }).catch(function () {
      
    }); 
  }

  componentDidUpdate(prevProps) {
    var dc = this.dc;
    var container = $(this.refs.container);
    var inner = $(this.refs.inner);
    //var duration = this.props.duration;
    var duration = 500;
    // Open
    if (prevProps.isOpen === false && this.props.isOpen === true) {
      this.open();
    }
    // Close
    else if (prevProps.isOpen === true && this.props.isOpen === false) {
      this.close();
    }
  }
  render() {
    return (
      <div className="slide-down__container" ref="container">
        <div className="slide-down__inner" ref="inner">
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = SlideDown;