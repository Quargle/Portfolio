
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.44.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Navbar.svelte generated by Svelte v3.44.2 */

    const file$3 = "src/Navbar.svelte";

    function create_fragment$4(ctx) {
    	let navbar;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;

    	const block = {
    		c: function create() {
    			navbar = element("navbar");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "About";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "Projects";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "Contact";
    			attr_dev(a0, "href", "#welcome-section");
    			attr_dev(a0, "class", "svelte-19254ty");
    			add_location(a0, file$3, 3, 6, 41);
    			attr_dev(li0, "class", "svelte-19254ty");
    			add_location(li0, file$3, 3, 2, 37);
    			attr_dev(a1, "href", "#projects-header");
    			attr_dev(a1, "class", "svelte-19254ty");
    			add_location(a1, file$3, 4, 6, 89);
    			attr_dev(li1, "class", "svelte-19254ty");
    			add_location(li1, file$3, 4, 2, 85);
    			attr_dev(a2, "href", "#contact-section");
    			attr_dev(a2, "class", "svelte-19254ty");
    			add_location(a2, file$3, 5, 6, 140);
    			attr_dev(li2, "class", "svelte-19254ty");
    			add_location(li2, file$3, 5, 2, 136);
    			attr_dev(navbar, "id", "navbar");
    			attr_dev(navbar, "class", "nav svelte-19254ty");
    			add_location(navbar, file$3, 2, 0, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, navbar, anchor);
    			append_dev(navbar, li0);
    			append_dev(li0, a0);
    			append_dev(navbar, t1);
    			append_dev(navbar, li1);
    			append_dev(li1, a1);
    			append_dev(navbar, t3);
    			append_dev(navbar, li2);
    			append_dev(li2, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(navbar);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/About.svelte generated by Svelte v3.44.2 */

    const file$2 = "src/About.svelte";

    function create_fragment$3(ctx) {
    	let section;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let p1;
    	let t5;
    	let p2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			h1 = element("h1");
    			h1.textContent = "Peter Evans";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "Radiation Shielding Assessor";
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Software Developer";
    			t5 = space();
    			p2 = element("p");
    			p2.textContent = "Web Developer";
    			attr_dev(h1, "class", "svelte-7t168u");
    			add_location(h1, file$2, 2, 4, 38);
    			attr_dev(p0, "class", "svelte-7t168u");
    			add_location(p0, file$2, 3, 4, 63);
    			attr_dev(p1, "class", "svelte-7t168u");
    			add_location(p1, file$2, 4, 4, 103);
    			attr_dev(p2, "class", "svelte-7t168u");
    			add_location(p2, file$2, 5, 4, 133);
    			attr_dev(section, "id", "welcome-section");
    			attr_dev(section, "class", "svelte-7t168u");
    			add_location(section, file$2, 1, 2, 3);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, h1);
    			append_dev(section, t1);
    			append_dev(section, p0);
    			append_dev(section, t3);
    			append_dev(section, p1);
    			append_dev(section, t5);
    			append_dev(section, p2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('About', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/Projects.svelte generated by Svelte v3.44.2 */

    const file$1 = "src/Projects.svelte";

    function create_fragment$2(ctx) {
    	let section0;
    	let div0;
    	let h1;
    	let t1;
    	let section1;
    	let div1;
    	let h20;
    	let t3;
    	let h40;
    	let t5;
    	let div2;
    	let a0;
    	let h30;
    	let t7;
    	let p0;
    	let t9;
    	let a1;
    	let h31;
    	let t11;
    	let p1;
    	let t13;
    	let a2;
    	let h32;
    	let t15;
    	let p2;
    	let t17;
    	let a3;
    	let h33;
    	let t19;
    	let p3;
    	let t21;
    	let section2;
    	let div3;
    	let h21;
    	let t23;
    	let h41;
    	let t25;
    	let div4;
    	let a4;
    	let h34;
    	let t27;
    	let p4;
    	let t29;
    	let a5;
    	let h35;
    	let t31;
    	let p5;
    	let t33;
    	let a6;
    	let h36;
    	let t35;
    	let section3;
    	let div5;
    	let h22;
    	let t37;
    	let h42;
    	let t39;
    	let div6;
    	let a7;
    	let h37;
    	let t41;
    	let p6;
    	let t43;
    	let section4;
    	let div7;
    	let h23;
    	let t45;
    	let h43;
    	let t47;
    	let div8;
    	let a8;
    	let h38;
    	let t49;
    	let p7;

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "PROJECTS";
    			t1 = space();
    			section1 = element("section");
    			div1 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Static Web Pages";
    			t3 = space();
    			h40 = element("h4");
    			h40.textContent = "Made with pure HTML and CSS";
    			t5 = space();
    			div2 = element("div");
    			a0 = element("a");
    			h30 = element("h3");
    			h30.textContent = "Squirrel's Rest Refuge for Exhausted Squirrels";
    			t7 = space();
    			p0 = element("p");
    			p0.textContent = "An example of static pages based on HTML and CSS alone.";
    			t9 = space();
    			a1 = element("a");
    			h31 = element("h3");
    			h31.textContent = "Tribute";
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "A sample tribute page";
    			t13 = space();
    			a2 = element("a");
    			h32 = element("h3");
    			h32.textContent = "Survey Form";
    			t15 = space();
    			p2 = element("p");
    			p2.textContent = "Soliciting donations for Ice Cream";
    			t17 = space();
    			a3 = element("a");
    			h33 = element("h3");
    			h33.textContent = "Product Landing Page (WIP)";
    			t19 = space();
    			p3 = element("p");
    			p3.textContent = "Get your plutionum here";
    			t21 = space();
    			section2 = element("section");
    			div3 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Javascript Games";
    			t23 = space();
    			h41 = element("h4");
    			h41.textContent = "Simple pages made with HTML, CSS and Vanilla Javascript";
    			t25 = space();
    			div4 = element("div");
    			a4 = element("a");
    			h34 = element("h3");
    			h34.textContent = "Javascript Games";
    			t27 = space();
    			p4 = element("p");
    			p4.textContent = "A selection of simple games created using Javascript and CSS";
    			t29 = space();
    			a5 = element("a");
    			h35 = element("h3");
    			h35.textContent = "Drumkit";
    			t31 = space();
    			p5 = element("p");
    			p5.textContent = "A JavaScript Drumkit";
    			t33 = space();
    			a6 = element("a");
    			h36 = element("h3");
    			h36.textContent = "Etch-a-Sketch";
    			t35 = space();
    			section3 = element("section");
    			div5 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Svelte";
    			t37 = space();
    			h42 = element("h4");
    			h42.textContent = "Applications made with the trendiest new JavaScript Framework";
    			t39 = space();
    			div6 = element("div");
    			a7 = element("a");
    			h37 = element("h3");
    			h37.textContent = "A Svelte Project";
    			t41 = space();
    			p6 = element("p");
    			p6.textContent = "A simple counter that can be incremented";
    			t43 = space();
    			section4 = element("section");
    			div7 = element("div");
    			h23 = element("h2");
    			h23.textContent = "React";
    			t45 = space();
    			h43 = element("h4");
    			h43.textContent = "Applications made with the world's most popular JavaScript Framework";
    			t47 = space();
    			div8 = element("div");
    			a8 = element("a");
    			h38 = element("h3");
    			h38.textContent = "A React App";
    			t49 = space();
    			p7 = element("p");
    			p7.textContent = "This doesn't actually link to anything yet";
    			attr_dev(h1, "class", "svelte-t6ouh1");
    			add_location(h1, file$1, 3, 8, 79);
    			attr_dev(div0, "id", "projects-header");
    			attr_dev(div0, "class", "svelte-t6ouh1");
    			add_location(div0, file$1, 2, 4, 44);
    			attr_dev(section0, "id", "projects-header-section");
    			attr_dev(section0, "class", "svelte-t6ouh1");
    			add_location(section0, file$1, 1, 0, 1);
    			attr_dev(h20, "class", "svelte-t6ouh1");
    			add_location(h20, file$1, 9, 6, 234);
    			attr_dev(h40, "class", "svelte-t6ouh1");
    			add_location(h40, file$1, 10, 6, 266);
    			attr_dev(div1, "class", "category-header svelte-t6ouh1");
    			attr_dev(div1, "id", "static-projects");
    			add_location(div1, file$1, 8, 4, 177);
    			attr_dev(h30, "class", "svelte-t6ouh1");
    			add_location(h30, file$1, 15, 8, 474);
    			attr_dev(p0, "class", "svelte-t6ouh1");
    			add_location(p0, file$1, 16, 8, 538);
    			attr_dev(a0, "id", "squirrels-rest");
    			attr_dev(a0, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "href", "https://quargle.github.io/squirrels-rest/");
    			add_location(a0, file$1, 14, 6, 356);
    			attr_dev(h31, "class", "svelte-t6ouh1");
    			add_location(h31, file$1, 20, 8, 738);
    			attr_dev(p1, "class", "svelte-t6ouh1");
    			add_location(p1, file$1, 21, 8, 763);
    			attr_dev(a1, "id", "tribute");
    			attr_dev(a1, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "href", "https://quargle.github.io/static_pages/Greta.html");
    			add_location(a1, file$1, 19, 6, 619);
    			attr_dev(h32, "class", "svelte-t6ouh1");
    			add_location(h32, file$1, 25, 8, 966);
    			attr_dev(p2, "class", "svelte-t6ouh1");
    			add_location(p2, file$1, 26, 8, 995);
    			attr_dev(a2, "id", "form");
    			attr_dev(a2, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "href", "https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Survey_form/survey_form.html");
    			add_location(a2, file$1, 24, 6, 810);
    			attr_dev(h33, "class", "svelte-t6ouh1");
    			add_location(h33, file$1, 30, 8, 1237);
    			attr_dev(p3, "class", "svelte-t6ouh1");
    			add_location(p3, file$1, 31, 8, 1281);
    			attr_dev(a3, "id", "product-page");
    			attr_dev(a3, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a3, "target", "_blank");
    			attr_dev(a3, "href", "https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Product_landing_page/product_landing_page.html");
    			add_location(a3, file$1, 29, 6, 1055);
    			attr_dev(div2, "class", "category-content svelte-t6ouh1");
    			add_location(div2, file$1, 12, 4, 318);
    			attr_dev(section1, "class", "project-category svelte-t6ouh1");
    			attr_dev(section1, "id", "static-pages");
    			add_location(section1, file$1, 7, 0, 120);
    			attr_dev(h21, "class", "svelte-t6ouh1");
    			add_location(h21, file$1, 39, 6, 1478);
    			attr_dev(h41, "class", "svelte-t6ouh1");
    			add_location(h41, file$1, 40, 6, 1510);
    			attr_dev(div3, "class", "category-header svelte-t6ouh1");
    			attr_dev(div3, "id", "javascript-pages");
    			add_location(div3, file$1, 38, 4, 1420);
    			attr_dev(h34, "class", "svelte-t6ouh1");
    			add_location(h34, file$1, 49, 8, 1769);
    			attr_dev(p4, "class", "svelte-t6ouh1");
    			add_location(p4, file$1, 50, 8, 1803);
    			attr_dev(a4, "id", "js-games");
    			attr_dev(a4, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a4, "target", "_blank");
    			attr_dev(a4, "href", "https://quargle.github.io/Games/index.html");
    			add_location(a4, file$1, 44, 6, 1628);
    			attr_dev(h35, "class", "svelte-t6ouh1");
    			add_location(h35, file$1, 58, 8, 2080);
    			attr_dev(p5, "class", "svelte-t6ouh1");
    			add_location(p5, file$1, 59, 8, 2105);
    			attr_dev(a5, "id", "drumkit-game");
    			attr_dev(a5, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a5, "target", "_blank");
    			attr_dev(a5, "href", "https://quargle.github.io/Games/Drumkit/drumkit.html");
    			set_style(a5, "background-image", "url('')");
    			add_location(a5, file$1, 53, 6, 1891);
    			attr_dev(h36, "class", "svelte-t6ouh1");
    			add_location(h36, file$1, 66, 8, 2306);
    			attr_dev(a6, "id", "drumkit-game");
    			attr_dev(a6, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a6, "target", "_blank");
    			attr_dev(a6, "href", "https://quargle.github.io/Games/Etch-a-Sketch/sketch.html");
    			add_location(a6, file$1, 62, 6, 2153);
    			attr_dev(div4, "class", "category-content svelte-t6ouh1");
    			add_location(div4, file$1, 42, 4, 1590);
    			attr_dev(section2, "class", "project-category svelte-t6ouh1");
    			attr_dev(section2, "id", "javascript-pages-section");
    			add_location(section2, file$1, 37, 2, 1351);
    			attr_dev(h22, "class", "svelte-t6ouh1");
    			add_location(h22, file$1, 75, 8, 2498);
    			attr_dev(h42, "class", "svelte-t6ouh1");
    			add_location(h42, file$1, 76, 8, 2522);
    			attr_dev(div5, "class", "category-header svelte-t6ouh1");
    			attr_dev(div5, "id", "svelte-projects");
    			add_location(div5, file$1, 74, 6, 2439);
    			attr_dev(h37, "class", "svelte-t6ouh1");
    			add_location(h37, file$1, 84, 10, 2945);
    			attr_dev(p6, "class", "svelte-t6ouh1");
    			add_location(p6, file$1, 85, 10, 2981);
    			attr_dev(a7, "id", "svelte-tile");
    			attr_dev(a7, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a7, "href", "https://quargle.github.io/svelte-project/public/");
    			attr_dev(a7, "target", "_blank");
    			set_style(a7, "background-image", "url('https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg')");
    			set_style(a7, "background-color", "white");
    			add_location(a7, file$1, 79, 8, 2651);
    			attr_dev(div6, "class", "category-content svelte-t6ouh1");
    			add_location(div6, file$1, 78, 6, 2612);
    			attr_dev(section3, "class", "project-category svelte-t6ouh1");
    			attr_dev(section3, "id", "svelte-projects-section");
    			add_location(section3, file$1, 73, 2, 2369);
    			attr_dev(h23, "class", "svelte-t6ouh1");
    			add_location(h23, file$1, 93, 8, 3201);
    			attr_dev(h43, "class", "svelte-t6ouh1");
    			add_location(h43, file$1, 94, 8, 3224);
    			attr_dev(div7, "class", "category-header svelte-t6ouh1");
    			attr_dev(div7, "id", "react-projects");
    			add_location(div7, file$1, 92, 6, 3143);
    			attr_dev(h38, "class", "svelte-t6ouh1");
    			add_location(h38, file$1, 102, 10, 3596);
    			attr_dev(p7, "class", "svelte-t6ouh1");
    			add_location(p7, file$1, 103, 10, 3627);
    			attr_dev(a8, "id", "react-tile");
    			attr_dev(a8, "class", "project-tile svelte-t6ouh1");
    			attr_dev(a8, "href", "");
    			attr_dev(a8, "target", "_blank");
    			set_style(a8, "background-image", "url('https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg')");
    			set_style(a8, "background-color", "white");
    			add_location(a8, file$1, 97, 8, 3360);
    			attr_dev(div8, "class", "category-content svelte-t6ouh1");
    			add_location(div8, file$1, 96, 6, 3321);
    			attr_dev(section4, "class", "project-category svelte-t6ouh1");
    			attr_dev(section4, "id", "react-projects-section");
    			add_location(section4, file$1, 91, 2, 3074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div0);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div1);
    			append_dev(div1, h20);
    			append_dev(div1, t3);
    			append_dev(div1, h40);
    			append_dev(section1, t5);
    			append_dev(section1, div2);
    			append_dev(div2, a0);
    			append_dev(a0, h30);
    			append_dev(a0, t7);
    			append_dev(a0, p0);
    			append_dev(div2, t9);
    			append_dev(div2, a1);
    			append_dev(a1, h31);
    			append_dev(a1, t11);
    			append_dev(a1, p1);
    			append_dev(div2, t13);
    			append_dev(div2, a2);
    			append_dev(a2, h32);
    			append_dev(a2, t15);
    			append_dev(a2, p2);
    			append_dev(div2, t17);
    			append_dev(div2, a3);
    			append_dev(a3, h33);
    			append_dev(a3, t19);
    			append_dev(a3, p3);
    			insert_dev(target, t21, anchor);
    			insert_dev(target, section2, anchor);
    			append_dev(section2, div3);
    			append_dev(div3, h21);
    			append_dev(div3, t23);
    			append_dev(div3, h41);
    			append_dev(section2, t25);
    			append_dev(section2, div4);
    			append_dev(div4, a4);
    			append_dev(a4, h34);
    			append_dev(a4, t27);
    			append_dev(a4, p4);
    			append_dev(div4, t29);
    			append_dev(div4, a5);
    			append_dev(a5, h35);
    			append_dev(a5, t31);
    			append_dev(a5, p5);
    			append_dev(div4, t33);
    			append_dev(div4, a6);
    			append_dev(a6, h36);
    			insert_dev(target, t35, anchor);
    			insert_dev(target, section3, anchor);
    			append_dev(section3, div5);
    			append_dev(div5, h22);
    			append_dev(div5, t37);
    			append_dev(div5, h42);
    			append_dev(section3, t39);
    			append_dev(section3, div6);
    			append_dev(div6, a7);
    			append_dev(a7, h37);
    			append_dev(a7, t41);
    			append_dev(a7, p6);
    			insert_dev(target, t43, anchor);
    			insert_dev(target, section4, anchor);
    			append_dev(section4, div7);
    			append_dev(div7, h23);
    			append_dev(div7, t45);
    			append_dev(div7, h43);
    			append_dev(section4, t47);
    			append_dev(section4, div8);
    			append_dev(div8, a8);
    			append_dev(a8, h38);
    			append_dev(a8, t49);
    			append_dev(a8, p7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(section1);
    			if (detaching) detach_dev(t21);
    			if (detaching) detach_dev(section2);
    			if (detaching) detach_dev(t35);
    			if (detaching) detach_dev(section3);
    			if (detaching) detach_dev(t43);
    			if (detaching) detach_dev(section4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/Contact.svelte generated by Svelte v3.44.2 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.44.2 */
    const file = "src/App.svelte";

    function create_fragment(ctx) {
    	let link;
    	let script;
    	let script_src_value;
    	let t0;
    	let main;
    	let navbar;
    	let t1;
    	let about;
    	let t2;
    	let projects;
    	let t3;
    	let contact;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let br2;
    	let t7;
    	let br3;
    	let t8;
    	let br4;
    	let t9;
    	let p;
    	let current;
    	navbar = new Navbar({ $$inline: true });
    	about = new About({ $$inline: true });
    	projects = new Projects({ $$inline: true });
    	contact = new Contact({ $$inline: true });

    	const block = {
    		c: function create() {
    			link = element("link");
    			script = element("script");
    			t0 = space();
    			main = element("main");
    			create_component(navbar.$$.fragment);
    			t1 = space();
    			create_component(about.$$.fragment);
    			t2 = space();
    			create_component(projects.$$.fragment);
    			t3 = space();
    			create_component(contact.$$.fragment);
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			br2 = element("br");
    			t7 = space();
    			br3 = element("br");
    			t8 = space();
    			br4 = element("br");
    			t9 = space();
    			p = element("p");
    			p.textContent = "Sample text";
    			attr_dev(link, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "integrity", "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3");
    			attr_dev(link, "crossorigin", "anonymous");
    			add_location(link, file, 8, 1, 242);
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "integrity", "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p");
    			attr_dev(script, "crossorigin", "anonymous");
    			add_location(script, file, 9, 1, 454);
    			add_location(br0, file, 18, 1, 753);
    			add_location(br1, file, 19, 1, 761);
    			add_location(br2, file, 20, 1, 769);
    			add_location(br3, file, 21, 1, 777);
    			add_location(br4, file, 22, 1, 785);
    			add_location(p, file, 23, 1, 793);
    			attr_dev(main, "class", "svelte-329bu3");
    			add_location(main, file, 13, 0, 695);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			append_dev(document.head, script);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			mount_component(navbar, main, null);
    			append_dev(main, t1);
    			mount_component(about, main, null);
    			append_dev(main, t2);
    			mount_component(projects, main, null);
    			append_dev(main, t3);
    			mount_component(contact, main, null);
    			append_dev(main, t4);
    			append_dev(main, br0);
    			append_dev(main, t5);
    			append_dev(main, br1);
    			append_dev(main, t6);
    			append_dev(main, br2);
    			append_dev(main, t7);
    			append_dev(main, br3);
    			append_dev(main, t8);
    			append_dev(main, br4);
    			append_dev(main, t9);
    			append_dev(main, p);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);
    			transition_in(about.$$.fragment, local);
    			transition_in(projects.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(about.$$.fragment, local);
    			transition_out(projects.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			detach_dev(script);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_component(navbar);
    			destroy_component(about);
    			destroy_component(projects);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navbar, About, Projects, Contact });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
