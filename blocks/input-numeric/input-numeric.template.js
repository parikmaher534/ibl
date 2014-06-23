IBL.blocks['input-numeric'].HTML = function() {
    return '<div class="input-numeric">'+
                '<input type="text" class="input-numeric__input" {{#if placeholder}} placeholder="{{placeholder}}" {{/if}} />'+
           '</div>';
};
