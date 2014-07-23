/**
 * Input with numeric type
 * User can input only numeric
 */

;(function() {

    'use strict';

    IBL.blocks['input-numeric'] = function(el) {
		this._makeNumeric(el);
    };
    
    /**
     * Set handler for numeric inputs and cut symbols
     * @params {DOM} el Block DOM node
     */
    IBL.blocks['input-numeric'].prototype._makeNumeric = function(el) {
		IBL.DOM.event(
			'input', 
			this,   
			this._inputHandler,
			el.getElementsByClassName('input-numeric__input')[0]
		);
	};

    /**
     * Input type number handler
     */
    IBL.blocks['input-numeric'].prototype._inputHandler = function() {
        if( /[^0-9]/g.test(this.value) ) {
            this.value = this.value.replace(/[^0-9]/gi, '');
        };
    };

}());
