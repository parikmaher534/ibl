;var IBL = IBL || {
    blocks: { },
    DOM: { }
};


/* Init all blocks on the page */
window.addEventListener('load', function() {
    var els, elsArr, storage;

    blocksStorage = {};


    /** HELPER
     * Replace node by block template
     * @params {DOM} el Replaced node
     * @params {String} name Block name
     */
    function _appendTemplate(el, name, params) {
        var newNode = null,
            templateSource, tempNode;

        if( IBL.blocks[name].HTML ) {
            templateSource = Handlebars.compile(IBL.blocks[name].HTML());
            tempNode = document.createElement('div');
            
            tempNode.innerHTML = templateSource(params);
            newNode = tempNode.children[0];
            el.parentNode.replaceChild(newNode, el);
        }

        return newNode || el;
    };

    /**
     * Create uniq id for block
     * @params {DOM} dom Node which for we add uniq attr
     * @returns {Number} Uniq number
     */
    function _addUniq(dom) {
        var uniq = Date.now() + Math.random() * 100000000 << 0;
        dom.setAttribute('data-ibl-id', uniq);
        return uniq;
    }

    /**
     * Init dynamic added block
     * @params {Sring} name Block name
     * @params {DOM} el Block DOM node
     */
    IBL.initBlock = function(name, el) {
        var params = JSON.parse(el.getAttribute('data-params')),
            dom = _appendTemplate(el, name, params),
            uniq = _addUniq(dom);
        
        blocksStorage[uniq] = new IBL.blocks[name](dom, params);
        blocksStorage[uniq]._name = name;
        blocksStorage[uniq]._params = params;
    };

    /**
     * DOM append method
     * @params {DOM} ctx DOM node where we must append block
     * @params {String} name New block name
     * @params {Object} data Object with data for template
     */
    IBL.DOM.append = function(ctx, name, data) {
        var dom, uniq, wrapper,
            templateSource = Handlebars.compile(IBL.blocks[name].HTML());

        wrapper = document.createElement('div');
        wrapper.innerHTML = templateSource(data);
        dom = wrapper.firstChild;
        uniq = _addUniq(dom);
        
        ctx.appendChild(dom);
        
        blocksStorage[uniq] = new IBL.blocks[name](dom, data);
        blocksStorage[uniq]._name = name;
        blocksStorage[uniq]._params = data;
    };

    /**
     * Add class to node
     * @params {DOM} node Element which for need to add class
     * @params {String} classname Element class
     */
    IBL.DOM.addClass = function(node, classname) {
        var cls;
        if(~node.className.indexOf(classname)) return;
        cls = node.className.trim() + ' ' + classname.trim();
        node.className = cls;
    };

    /**
     * Remove class to node
     * @params {DOM} node Element which from need to remove class
     * @params {String} classname Element class
     */
    IBL.DOM.removeClass = function(node, classname) {
        var cls;
        if(!~node.className.indexOf(classname)) return;
        cls = node.className.trim();
        cls = cls.replace(classname, '').trim();
        node.className = cls;
    };
    
    /**
     * Get block by domElem
     * @params {DOM} node Dom element which block need to return
     * @returns {Object} IBL block object
     */    
    IBL.block = function(node) {
        var attr;
        if( node.constructor === NodeList ) {
            console.error('You pass the NodeList but function waiting for Node');
        } else {
            attr = node.getAttribute('data-ibl-id');
        }
        return blocksStorage[attr];
    };


    /* Init all blocks */
    Object.keys(IBL.blocks).forEach(function(name) {
        var dom, uniq, params;

        elsArr = [];
        els = Array.prototype.slice.apply(document.getElementsByClassName(name));

        if( els.length ) {
            els.forEach(function(el) {
                params = JSON.parse(el.getAttribute('data-params'));
                dom = _appendTemplate(el, name, params);
                uniq = _addUniq(dom);
                
                blocksStorage[uniq] = new IBL.blocks[name](dom, params);
                blocksStorage[uniq]._name = name;
                blocksStorage[uniq]._params = params;
            });
        }
    });

    console.log(blocksStorage)

}, false);
