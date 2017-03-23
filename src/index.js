$.declarativePlugin = (name, obj) => {
    const declarativePluginObject = {
        refSelectors: {},

        refs: {},
        state: {},

        // in case no init-function is given
        init(){
            this.initFunctional();
        },

        initFunctional(){
            this.initRefSelectors();
            this.findRefs();
            this.applyDataAttributes();
        },

        initRefSelectors(){
            const refAttrSelectors = {};
            Array.from(this.$el.get(0).attributes).forEach(attr => {
                const match = attr.name.match(/^ref-(.*)/);
                if(!match || !match[1]){
                    return;
                }
                refAttrSelectors[match[1]] = attr.value;
            });
                
            this.refSelectors = Object.assign({}, this.refSelectors, refAttrSelectors);
        },

        findRefs(){
            $.each(this.refSelectors, (name, selector) => {
                let isGlobalSelector = false;
                let isStrictSelector = false;
                let $element = null;

                if(typeof selector === 'object'){
                    isGlobalSelector = selector.isGlobal === true;
                    isStrictSelector = selector.isStrict === true;
                    selector = selector.selector;
                }

                if(isGlobalSelector){
                    $element = $(selector);
                } else {
                    $element = this.$el.find(selector);
                }

                if(isStrictSelector && $element.length === 0){
                    return;
                }

                this.refs[name] = $element;
            });
        },

        render(){
            //throw new Error('render not implemented');
        },

        setState(newState, value){
            if(typeof newState !== 'object' && value){
                newState = { [newState]: value };
            }
            
            this.state = Object.assign(this.state, newState);
            this.render();
        },
    };

    Object.setPrototypeOf(obj, declarativePluginObject);
    return $.plugin(name, obj);
};
