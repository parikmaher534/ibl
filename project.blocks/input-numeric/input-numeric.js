/**
 * Redefine block method
 */
IBL.blocks['input-numeric'].prototype._inputHandler = function() {
    if( /[^0-9]/g.test(this.value) ) {
        this.value = this.value.replace(/[^0-9]/gi, '');
    } else {
        console.log('Redefine example.....');
    }
};
