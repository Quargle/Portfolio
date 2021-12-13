<<<<<<< HEAD

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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    /* src\Navbar.svelte generated by Svelte v3.44.2 */

    const file$5 = "src\\Navbar.svelte";

    function create_fragment$5(ctx) {
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
    			add_location(a0, file$5, 3, 6, 44);
    			attr_dev(li0, "class", "svelte-19254ty");
    			add_location(li0, file$5, 3, 2, 40);
    			attr_dev(a1, "href", "#projects-header");
    			attr_dev(a1, "class", "svelte-19254ty");
    			add_location(a1, file$5, 4, 6, 93);
    			attr_dev(li1, "class", "svelte-19254ty");
    			add_location(li1, file$5, 4, 2, 89);
    			attr_dev(a2, "href", "#contact-section");
    			attr_dev(a2, "class", "svelte-19254ty");
    			add_location(a2, file$5, 5, 6, 145);
    			attr_dev(li2, "class", "svelte-19254ty");
    			add_location(li2, file$5, 5, 2, 141);
    			attr_dev(navbar, "id", "navbar");
    			attr_dev(navbar, "class", "nav svelte-19254ty");
    			add_location(navbar, file$5, 2, 0, 4);
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props) {
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
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\About.svelte generated by Svelte v3.44.2 */

    const file$4 = "src\\About.svelte";

    function create_fragment$4(ctx) {
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
    			add_location(h1, file$4, 2, 4, 40);
    			attr_dev(p0, "class", "svelte-7t168u");
    			add_location(p0, file$4, 3, 4, 66);
    			attr_dev(p1, "class", "svelte-7t168u");
    			add_location(p1, file$4, 4, 4, 107);
    			attr_dev(p2, "class", "svelte-7t168u");
    			add_location(p2, file$4, 5, 4, 138);
    			attr_dev(section, "id", "welcome-section");
    			attr_dev(section, "class", "svelte-7t168u");
    			add_location(section, file$4, 1, 2, 4);
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\ProjectTile.svelte generated by Svelte v3.44.2 */

    const file$3 = "src\\ProjectTile.svelte";

    function create_fragment$3(ctx) {
    	let a;
    	let h3;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			a = element("a");
    			h3 = element("h3");
    			h3.textContent = `${/*title*/ ctx[2]}`;
    			t1 = space();
    			p = element("p");
    			p.textContent = `${/*text*/ ctx[3]}`;
    			attr_dev(h3, "class", "svelte-1wfd4oz");
    			add_location(h3, file$3, 14, 4, 367);
    			attr_dev(p, "class", "svelte-1wfd4oz");
    			add_location(p, file$3, 15, 4, 389);
    			attr_dev(a, "id", /*id*/ ctx[0]);
    			attr_dev(a, "class", "project-tile svelte-1wfd4oz");
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "href", /*link*/ ctx[1]);
    			set_style(a, "background-image", "url('" + /*background*/ ctx[4] + "')");
    			add_location(a, file$3, 9, 0, 232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, h3);
    			append_dev(a, t1);
    			append_dev(a, p);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
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

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProjectTile', slots, []);
    	let { project } = $$props;
    	const id = project.id;
    	const link = project.link;
    	const title = project.title;
    	const text = project.text;
    	const tools = project.tools;
    	const background = project.background;
    	const writable_props = ['project'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ProjectTile> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('project' in $$props) $$invalidate(5, project = $$props.project);
    	};

    	$$self.$capture_state = () => ({
    		project,
    		id,
    		link,
    		title,
    		text,
    		tools,
    		background
    	});

    	$$self.$inject_state = $$props => {
    		if ('project' in $$props) $$invalidate(5, project = $$props.project);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, link, title, text, background, project];
    }

    class ProjectTile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { project: 5 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProjectTile",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*project*/ ctx[5] === undefined && !('project' in props)) {
    			console.warn("<ProjectTile> was created without expected prop 'project'");
    		}
    	}

    	get project() {
    		throw new Error("<ProjectTile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set project(value) {
    		throw new Error("<ProjectTile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Projects.svelte generated by Svelte v3.44.2 */
    const file$2 = "src\\Projects.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    // (77:4) {#each projects as project }
    function create_each_block(ctx) {
    	let projecttile;
    	let current;

    	projecttile = new ProjectTile({
    			props: { project: /*project*/ ctx[8] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(projecttile.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(projecttile, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(projecttile.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(projecttile.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(projecttile, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(77:4) {#each projects as project }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let h1;
    	let t1;
    	let div1;
    	let current;
    	let each_value = /*projects*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "PROJECTS";
    			t1 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "class", "svelte-1q320sp");
    			add_location(h1, file$2, 72, 8, 2251);
    			attr_dev(div0, "id", "projects-header");
    			attr_dev(div0, "class", "svelte-1q320sp");
    			add_location(div0, file$2, 71, 4, 2215);
    			attr_dev(div1, "class", "projects-content svelte-1q320sp");
    			add_location(div1, file$2, 75, 2, 2286);
    			attr_dev(section, "id", "projects-section");
    			add_location(section, file$2, 70, 0, 2178);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, h1);
    			append_dev(section, t1);
    			append_dev(section, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*projects*/ 1) {
    				each_value = /*projects*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
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

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const projects = [];

    	const tribute = {
    		id: "tribute",
    		link: "https://quargle.github.io/static_pages/Greta.html",
    		title: "Tribute",
    		text: "A sample tribute page",
    		tools: "HTML and CSS",
    		background: ''
    	};

    	projects.push(tribute);

    	const squirrels = {
    		id: "squirrels-rest",
    		link: "https://quargle.github.io/squirrels-rest/",
    		title: "Squirrel's Rest Refuge for Exhausted Squirrels",
    		text: "An example of static pages based on HTML and CSS alone.",
    		tools: "HTML and CSS",
    		background: ''
    	};

    	projects.push(squirrels);

    	const surveyForm = {
    		id: "survey-form",
    		link: "https://quargle.github.io/static_pages/survey_form.html",
    		title: "Survey Form",
    		text: "A simple form written in HTML and CSS",
    		tools: "HTML and CSS",
    		background: 'logos/survey-form-transparent.png'
    	};

    	projects.push(surveyForm);

    	const drumkit = {
    		id: "drumkit",
    		link: "https://quargle.github.io/Games/Drumkit/drumkit.html",
    		title: "Drumkit",
    		text: "A JavaScript Drumkit",
    		tools: "JavaScript, HTML and CSS",
    		background: ''
    	};

    	projects.push(drumkit);

    	const sketch = {
    		id: "etch-a-sketch",
    		link: "https://quargle.github.io/Games/Etch-a-Sketch/sketch.html",
    		title: "Etch-a-Sketch",
    		text: "",
    		tools: "JavaScript, HTML and CSS",
    		background: ''
    	};

    	projects.push(sketch);

    	const svelteCounter = {
    		id: "svelte-counter",
    		link: "https://quargle.github.io/svelte-project/public/",
    		title: "Svelte Counter",
    		text: "A simple counter that can be incremented and decremented",
    		tools: "Svelte",
    		background: "logos/svelte-transparent.png"
    	}; //background: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg"

    	projects.push(svelteCounter);

    	const reactCounter = {
    		id: "react-counter",
    		link: "",
    		title: "React Counter",
    		text: "This doesn't actually link to anything yet",
    		tools: "React",
    		background: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"
    	};

    	projects.push(reactCounter);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ProjectTile,
    		projects,
    		tribute,
    		squirrels,
    		surveyForm,
    		drumkit,
    		sketch,
    		svelteCounter,
    		reactCounter
    	});

    	return [projects];
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

    /* src\Contact.svelte generated by Svelte v3.44.2 */

    const file$1 = "src\\Contact.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let div0;
    	let h2;
    	let t1;
    	let div1;
    	let a0;
    	let t3;
    	let a1;
    	let t5;
    	let a2;

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			h2 = element("h2");
    			h2.textContent = "Contact Me";
    			t1 = space();
    			div1 = element("div");
    			a0 = element("a");
    			a0.textContent = "GitHub Profile";
    			t3 = space();
    			a1 = element("a");
    			a1.textContent = "Cerberus Nuclear";
    			t5 = space();
    			a2 = element("a");
    			a2.textContent = "Twitter";
    			attr_dev(h2, "class", "svelte-1231phr");
    			add_location(h2, file$1, 2, 6, 80);
    			attr_dev(div0, "class", "contact-section-header");
    			add_location(div0, file$1, 1, 4, 36);
    			attr_dev(a0, "id", "profile-link");
    			attr_dev(a0, "class", "contact-tile svelte-1231phr");
    			attr_dev(a0, "href", "https://github.com/Peter-Evans-Cerberus");
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$1, 6, 6, 162);
    			attr_dev(a1, "id", "cerberus-website");
    			attr_dev(a1, "class", "contact-tile svelte-1231phr");
    			attr_dev(a1, "href", "https://cerberusnuclear.com/");
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$1, 7, 6, 293);
    			attr_dev(a2, "id", "twitter");
    			attr_dev(a2, "class", "contact-tile svelte-1231phr");
    			attr_dev(a2, "href", "https://twitter.com/quargy");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$1, 8, 6, 420);
    			attr_dev(div1, "id", "contact-section-body");
    			attr_dev(div1, "class", "svelte-1231phr");
    			add_location(div1, file$1, 5, 4, 123);
    			attr_dev(section, "id", "contact-section");
    			attr_dev(section, "class", "svelte-1231phr");
    			add_location(section, file$1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, h2);
    			append_dev(section, t1);
    			append_dev(section, div1);
    			append_dev(div1, a0);
    			append_dev(div1, t3);
    			append_dev(div1, a1);
    			append_dev(div1, t5);
    			append_dev(div1, a2);
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

    /* src\App.svelte generated by Svelte v3.44.2 */
    const file = "src\\App.svelte";

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
    			attr_dev(link, "href", "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css");
    			attr_dev(link, "rel", "stylesheet");
    			attr_dev(link, "integrity", "sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3");
    			attr_dev(link, "crossorigin", "anonymous");
    			add_location(link, file, 8, 1, 250);
    			if (!src_url_equal(script.src, script_src_value = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")) attr_dev(script, "src", script_src_value);
    			attr_dev(script, "integrity", "sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p");
    			attr_dev(script, "crossorigin", "anonymous");
    			add_location(script, file, 9, 1, 463);
    			attr_dev(main, "class", "svelte-1f1ihnp");
    			add_location(main, file, 13, 0, 708);
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
=======
var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let l,c;function i(t,e){return l||(l=document.createElement("a")),l.href=e,t===l.href}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function p(t){return document.createElement(t)}function f(){return t=" ",document.createTextNode(t);var t}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function g(t){c=t}const m=[],v=[],$=[],b=[],k=Promise.resolve();let y=!1;function w(t){$.push(t)}let S=!1;const _=new Set;function x(){if(!S){S=!0;do{for(let t=0;t<m.length;t+=1){const e=m[t];g(e),j(e.$$)}for(g(null),m.length=0;v.length;)v.pop()();for(let t=0;t<$.length;t+=1){const e=$[t];_.has(e)||(_.add(e),e())}$.length=0}while(m.length);for(;b.length;)b.pop()();y=!1,S=!1,_.clear()}}function j(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(w)}}const q=new Set;let C;function T(t,e){t&&t.i&&(q.delete(t),t.i(e))}function M(t,e,n,s){if(t&&t.o){if(q.has(t))return;q.add(t),C.c.push((()=>{q.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function E(t){t&&t.c()}function H(t,n,r,l){const{fragment:c,on_mount:i,on_destroy:a,after_update:u}=t.$$;c&&c.m(n,r),l||w((()=>{const n=i.map(e).filter(o);a?a.push(...n):s(n),t.$$.on_mount=[]})),u.forEach(w)}function A(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function L(t,e){-1===t.$$.dirty[0]&&(m.push(t),y||(y=!0,k.then(x)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function R(e,o,r,l,i,a,u,p=[-1]){const f=c;g(e);const h=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:i,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||f.$$.root};u&&u(h.root);let m=!1;if(h.ctx=r?r(e,o.props||{},((t,n,...s)=>{const o=s.length?s[0]:n;return h.ctx&&i(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),m&&L(e,t)),n})):[],h.update(),m=!0,s(h.before_update),h.fragment=!!l&&l(h.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);h.fragment&&h.fragment.l(t),t.forEach(d)}else h.fragment&&h.fragment.c();o.intro&&T(e.$$.fragment),H(e,o.target,o.anchor,o.customElement),x()}g(f)}class P{$destroy(){A(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function D(e){let n;return{c(){n=p("navbar"),n.innerHTML='<li class="svelte-1c29wvv"><a href="#welcome-section" class="svelte-1c29wvv">About</a></li> \n  <li class="svelte-1c29wvv"><a href="#projects-header" class="svelte-1c29wvv">Projects</a></li> \n  <li class="svelte-1c29wvv"><a href="#contact-section" class="svelte-1c29wvv">Contact</a></li>',h(n,"id","navbar"),h(n,"class","nav svelte-1c29wvv")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class O extends P{constructor(t){super(),R(this,t,null,D,r,{})}}function B(e){let n;return{c(){n=p("section"),n.innerHTML='<h1 class="svelte-7t168u">Peter Evans</h1> \n    <p class="svelte-7t168u">Radiation Shielding Assessor</p> \n    <p class="svelte-7t168u">Software Developer</p> \n    <p class="svelte-7t168u">Web Developer</p>',h(n,"id","welcome-section"),h(n,"class","svelte-7t168u")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class W extends P{constructor(t){super(),R(this,t,null,B,r,{})}}function G(e){let n,s,o,r,l;return{c(){n=p("a"),s=p("img"),r=f(),l=p("h3"),l.textContent=`${e[2]}`,i(s.src,o=e[3])||h(s,"src",o),h(s,"alt","A logo related to the project"),h(s,"class","svelte-jwbfy2"),h(l,"class","svelte-jwbfy2"),h(n,"id",e[0]),h(n,"class","project-tile svelte-jwbfy2"),h(n,"target","_blank"),h(n,"href",e[1])},m(t,e){u(t,n,e),a(n,s),a(n,r),a(n,l)},p:t,i:t,o:t,d(t){t&&d(n)}}}function N(t,e,n){let{project:s}=e;const o=s.id,r=s.link,l=s.title;s.text,s.tools;const c=s.image;return t.$$set=t=>{"project"in t&&n(4,s=t.project)},[o,r,l,c,s]}class F extends P{constructor(t){super(),R(this,t,N,G,r,{project:4})}}function J(t,e,n){const s=t.slice();return s[8]=e[n],s}function Q(e){let n,s;return n=new F({props:{project:e[8]}}),{c(){E(n.$$.fragment)},m(t,e){H(n,t,e),s=!0},p:t,i(t){s||(T(n.$$.fragment,t),s=!0)},o(t){M(n.$$.fragment,t),s=!1},d(t){A(n,t)}}}function U(t){let e,n,o,r,l,c=t[0],i=[];for(let e=0;e<c.length;e+=1)i[e]=Q(J(t,c,e));const g=t=>M(i[t],1,1,(()=>{i[t]=null}));return{c(){e=p("section"),n=p("div"),n.innerHTML='<h1 class="svelte-4c4eac">PROJECTS</h1>',o=f(),r=p("div");for(let t=0;t<i.length;t+=1)i[t].c();h(n,"id","projects-header"),h(n,"class","svelte-4c4eac"),h(r,"class","projects-content svelte-4c4eac"),h(e,"id","projects-section")},m(t,s){u(t,e,s),a(e,n),a(e,o),a(e,r);for(let t=0;t<i.length;t+=1)i[t].m(r,null);l=!0},p(t,[e]){if(1&e){let n;for(c=t[0],n=0;n<c.length;n+=1){const s=J(t,c,n);i[n]?(i[n].p(s,e),T(i[n],1)):(i[n]=Q(s),i[n].c(),T(i[n],1),i[n].m(r,null))}for(C={r:0,c:[],p:C},n=c.length;n<i.length;n+=1)g(n);C.r||s(C.c),C=C.p}},i(t){if(!l){for(let t=0;t<c.length;t+=1)T(i[t]);l=!0}},o(t){i=i.filter(Boolean);for(let t=0;t<i.length;t+=1)M(i[t]);l=!1},d(t){t&&d(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(i,t)}}}function I(t){const e=[];e.push({id:"tribute",link:"https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Tribute_page/Greta.html",title:"Tribute Page",text:"A sample tribute page",tools:"HTML and CSS",image:"logos/greta-tribute.png"});e.push({id:"squirrels-rest",link:"https://quargle.github.io/squirrels-rest/",title:"Squirrel's Rest",text:"An example of static pages based on HTML and CSS alone.",tools:"HTML and CSS",image:"logos/squirrel-opaque.png"});e.push({id:"survey-form",link:"https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Survey_form/survey_form.html",title:"Survey Form",text:"A simple form written in HTML and CSS",tools:"HTML and CSS",image:"logos/survey-form-opaque.png"});e.push({id:"drumkit",link:"https://quargle.github.io/Games/Drumkit/drumkit.html",title:"Drumkit",text:"A JavaScript Drumkit",tools:"JavaScript, HTML and CSS",image:"logos/drumkit.png"});e.push({id:"etch-a-sketch",link:"https://quargle.github.io/Games/Etch-a-Sketch/sketch.html",title:"Etch-a-Sketch",text:"",tools:"JavaScript, HTML and CSS",image:"logos/sketch.png"});e.push({id:"svelte-counter",link:"https://quargle.github.io/svelte-project/public/",title:"Svelte Counter",text:"A simple counter that can be incremented and decremented",tools:"Svelte",image:"logos/svelte-counter.png"});return e.push({id:"react-counter",link:"",title:"React Counter",text:"This doesn't actually link to anything yet",tools:"React",image:"https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}),[e]}class X extends P{constructor(t){super(),R(this,t,I,U,r,{})}}function Y(e){let n;return{c(){n=p("section"),n.innerHTML='<div class="contact-section-header"><h2 class="svelte-1vqlvb7">Contact Me</h2></div> \n    \n    <div id="contact-section-body" class="svelte-1vqlvb7"><a id="profile-link" class="contact-tile svelte-1vqlvb7" href="https://github.com/Quargle" target="_blank">GitHub Profile</a> \n      <a id="cerberus-website" class="contact-tile svelte-1vqlvb7" href="https://cerberusnuclear.com/" target="_blank">Cerberus Nuclear</a> \n      <a id="twitter" class="contact-tile svelte-1vqlvb7" href="https://twitter.com/quargy" target="_blank">Twitter</a></div>',h(n,"id","contact-section"),h(n,"class","svelte-1vqlvb7")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class z extends P{constructor(t){super(),R(this,t,null,Y,r,{})}}function K(e){let n,s,o,r,l,c,g,m,v,$,b,k,y;return c=new O({}),m=new W({}),$=new X({}),k=new z({}),{c(){n=p("link"),s=p("script"),r=f(),l=p("main"),E(c.$$.fragment),g=f(),E(m.$$.fragment),v=f(),E($.$$.fragment),b=f(),E(k.$$.fragment),document.title="Pete's Portfolio Site",h(n,"href","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"),h(n,"rel","stylesheet"),h(n,"integrity","sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"),h(n,"crossorigin","anonymous"),i(s.src,o="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")||h(s,"src","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"),h(s,"integrity","sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"),h(s,"crossorigin","anonymous"),h(l,"class","svelte-1ytypgf")},m(t,e){a(document.head,n),a(document.head,s),u(t,r,e),u(t,l,e),H(c,l,null),a(l,g),H(m,l,null),a(l,v),H($,l,null),a(l,b),H(k,l,null),y=!0},p:t,i(t){y||(T(c.$$.fragment,t),T(m.$$.fragment,t),T($.$$.fragment,t),T(k.$$.fragment,t),y=!0)},o(t){M(c.$$.fragment,t),M(m.$$.fragment,t),M($.$$.fragment,t),M(k.$$.fragment,t),y=!1},d(t){d(n),d(s),t&&d(r),t&&d(l),A(c),A(m),A($),A(k)}}}return new class extends P{constructor(t){super(),R(this,t,null,K,r,{})}}({target:document.body,props:{name:"world"}})}();
>>>>>>> 7d2dd0f93f21d387dd66f29d61288a8afd08c9c9
//# sourceMappingURL=bundle.js.map
