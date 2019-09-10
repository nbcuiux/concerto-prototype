

import TransitionClass from "./TransitionClass"

var scrollPosition

window.openOverlays = [];

const Overlay = class Overlay {
  constructor(el, options) {

    this.el = el;
    this.options = options;
    this.existingOverlay = false;
    this.options = Object.assign({}, options);

    var self = this;

    $(el).find(".js-close-overlay").on("click", function () {
      self.close();
    })

    $(el).find(".js-overlay-save").on("click", function () {
      if (self.options.onSave) {
        self.options.onSave();
      }
      self.close();
    });

    this.handleEscKeydown = (e) => {
      e.stopPropagation();
      if (e.target === document.body && e.keyCode === 27) {this.close();}
    };
    

    this.handleEnterKeydown = (e) => {
      e.stopPropagation();
      if (e.target === document.body && e.keyCode === 13) {console.log("handle enter");}
    };
  }


  open() {

    this.originalScrollPosition = $('body').scrollTop();

    // If there is aready an overlay open, slide it away and slide this one in
    if (window.openOverlays.length > 0) {
      var currentOverlay = window.openOverlays[window.openOverlays.length - 1];
      $(this.el).addClass('modal--no-fade');
      $(this.el).addClass('modal');
      $(this.el).addClass('modal--slide-in-start');
      $(this.el).removeClass('hidden');   
      setTimeout(()=>{
        $(this.el).removeClass('modal--slide-in-start');
        currentOverlay.slideOut();
      }, 1);
    }
    else {
      /*
      $(this.el).removeClass('hidden');
      $(this.el).addClass('modal');
      */

      TransitionClass.add(this.el, "modal--shown", 500);
      var scrollTop = $(window).scrollTop();
      $('#wrapper').css({
        marginTop: -1 * scrollTop
      });
      $('#wrapper').addClass('overflow');
    }

    window.openOverlays.push(this);

    document.addEventListener('keydown', this.handleEscKeydown);
    document.addEventListener('keydown', this.handleEnterKeydown);

    if (this.options.onOpen) {
      this.options.onOpen();
    }
  }


  slideOut () {
    $(this.el).addClass('modal--slide-out');
  }


  slideIn () {
    $(this.el).removeClass("modal--slide-out");
  }
  

  close () {

    document.removeEventListener('keydown', this.handleEscKeydown);
    document.removeEventListener('keydown', this.handleEnterKeydown);

    // If there was an overlay open, slide it back
    if (window.openOverlays.length > 1) {
      var prevOverlay = window.openOverlays[window.openOverlays.length - 2];
      prevOverlay.slideIn();
      $(this.el).addClass('modal--slide-in-start');
      setTimeout(()=>{
        $(this.el).removeClass('modal--slide-in-start');
        $(this.el).removeClass('modal--no-fade');
        $(this.el).addClass('hidden');
      }, 300);
    }
    else {
        TransitionClass.remove(this.el, "modal--shown", 500);
        $('#wrapper').css({
          marginTop: 0 
        });
        $('#wrapper').removeClass('overflow');
    }
    window.openOverlays.pop();

    $('body').scrollTop(this.originalScrollPosition);

    if (this.options.onClose) {
      this.options.onClose();
    }
  }
}

export default Overlay