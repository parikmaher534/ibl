;var IBL = IBL || {
    blocks: { },
    DOM: { }
};


/* Init all blocks on the page */
window.addEventListener('load', function() {
    var els, elsArr, blocksStorage;

    blocksStorage = {};

    /** HELPER
     * Replace node by block template
     * @params {DOM} el Replaced node
     * @params {String} name Block name
     */
    function _appendTemplate(el, name, params) {
        var newNode = null,
            templateSource, tempNode,
            block = _getBlock(name);

        if( block && block.HTML ) {
            templateSource = Handlebars.compile(block.HTML());
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
        var uniq = Date.now() + (Math.random() * 100000000 << 0);
        dom.setAttribute('data-ibl-id', uniq);
        return uniq;
    };

    /**
     * Get block by name
     * @params {String} name Block name
     * @returns {Object | null} Block object 
     */ 
    function _getBlock(name) {
        return IBL.blocks[name] || null;
    };

	/** 
	 * Run handler in text tick 
	 * @params {Function } fn Handler
	 */
	function _nextTick(fn) {
		setTimeout(fn, 0);	
	};
    
	
	/**
     * Init dynamic added block
     * @params {String} name Block name
     * @params {DOM} el Block DOM node
     */
    IBL.initBlock = function(name, el) {
        var params, dom, uniq, block;
        
        if( el ) {
            params = JSON.parse(el.getAttribute('data-params'));
            dom = _appendTemplate(el, name, params);
            uniq = _addUniq(dom);
            block = _getBlock(name);
          
            if( block ) {
                blocksStorage[uniq] = new block(dom);
                blocksStorage[uniq]._name = name;
                blocksStorage[uniq]._params = params;
                blocksStorage[uniq]._id = uniq;
                blocksStorage[uniq]._domElem = dom;
            }
        }
    };


    /**
     * DOM append method
     * @params {DOM} ctx DOM node where we must append block
     * @params {String} name New block name
     * @params {Object} data Object with data for template
     */
    IBL.DOM.append = function(ctx, name, data) {
        var dom, uniq, wrapper,
            block = _getBlock(name);

        if( ctx && block ) {
            templateSource = Handlebars.compile(block.HTML());

            wrapper = document.createElement('div');
            wrapper.innerHTML = templateSource(data);
            dom = wrapper.firstChild;
            uniq = _addUniq(dom);
            
            ctx.appendChild(dom);
           
			blocksStorage[uniq] = new block(dom);
			blocksStorage[uniq]._name = name;
			blocksStorage[uniq]._params = data;
			blocksStorage[uniq]._id = uniq;
			blocksStorage[uniq]._domElem = dom;
        }
    };

	/**
	 * Remove block and block Object
	 * @params {DOM} ctx DOM node
	 * @params {String} name Block name 
	 */
	IBL.DOM.remove = function(ctx, name) {
        var block = blocksStorage[ctx.getAttribute('data-ibl-id')];
		
		block._domElem.parentNode.removeChild(block._domElem);
		delete blocksStorage[ctx.getAttribute('data-ibl-id')];
    };

	/**
	 * Wrapper to add event for block
	 * @params {String} eventName event name
	 * @params {Object} ctx block object
	 * @params {Function} fn event handler
	 * @params {DOM} [elem] DOM node which event must be added 
	 */
	IBL.DOM.event = function(eventName, ctx, fn, elem) {
		_nextTick(function() {
			if( ctx ) {
				var block = blocksStorage[ctx._id];

				if( block ) {
					block.events = block.events || {};
					block.events[eventName] = block.events[eventName] || [];
					(elem || this.domElem).addEventListener(eventName, fn);
					block.events[eventName].push(fn);
				}
			};
		});
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
        var dom, uniq, params, block;

        elsArr = [];
        els = Array.prototype.slice.apply(document.getElementsByClassName(name));

        if( els.length ) {
            els.forEach(function(el) {
                params = JSON.parse(el.getAttribute('data-params'));
                dom = _appendTemplate(el, name, params);
                uniq = _addUniq(dom);
                block = _getBlock(name);
				origin = el.outerHTML;
              
				blocksStorage[uniq] = new block(dom);

				blocksStorage[uniq]._name = name;
				blocksStorage[uniq]._params = params;
				blocksStorage[uniq]._id = uniq;
				blocksStorage[uniq]._origin = origin;
				blocksStorage[uniq]._domElem = dom;
            });
        }
    });

    console.log(blocksStorage)

}, false);
