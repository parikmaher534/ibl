/**
 * Static popup 
 */
;(function() {
    var Paranja, InitEvents,
        events = {}; 

    'use strict';


    IBL.blocks['popup-static'] = function(el, params) {
        this.params = params || {};
        this.domElem = el;
        
        if( !Paranja ) Paranja = createParanja();
        if( !InitEvents ) InitEvents = initEvents.apply(this);
        
        this._onPopupInit();
    };


    /* Private methods */
    IBL.blocks['popup-static'].prototype._onPopupInit = function() {
        if( this.params.close !== 'no' ) this._addClose();
    };

    IBL.blocks['popup-static'].prototype._setPosition = function() {
        this.domElem.style.marginTop = -(this.domElem.offsetHeight / 2) + 'px';
        this.domElem.style.marginLeft = -(this.domElem.offsetWidth / 2) + 'px';
    };

    IBL.blocks['popup-static'].prototype._addClose = function() {
        var close = document.createElement('div');
        
        close.className = 'popup-static__close';
        this.domElem.appendChild(close);

        close.addEventListener('click', this.hide.bind(this));
    }; 


    /**
     * Show popup
     */
    IBL.blocks['popup-static'].prototype.show = function() {
        IBL.DOM.addClass(this.domElem, 'popup-static_visible');
        IBL.DOM.addClass(Paranja, 'popup-static__paranja_visible');
        this._setPosition();    
    };
  
    /**
     * Hide popup
     */ 
    IBL.blocks['popup-static'].prototype.hide = function() {
        IBL.DOM.removeClass(this.domElem, 'popup-static_visible');
        IBL.DOM.removeClass(Paranja, 'popup-static__paranja_visible');
    };

 
    /** 
     * Create static popup dark background block 
     * @returns {DOM} Paranja block
     */
    function createParanja() {
        var paranja = document.createElement('div');
        paranja.className = 'popup-static__paranja';
        document.body.appendChild(paranja);
        return paranja;     
    };   

    /**
     * Once add evens for all popups ( Because only one popup can be shown on page )
     */
    function initEvents() {
        events['keyup'] = document.addEventListener('keyup', function(e) {
            if( e.keyCode === 27 ) this.hide();
        }.bind(this));

        return true;
    };
 
}());
