var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}let l,i;function c(t,e){return l||(l=document.createElement("a")),l.href=e,t===l.href}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode.removeChild(t)}function p(t){return document.createElement(t)}function f(){return t=" ",document.createTextNode(t);var t}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function m(t){i=t}const g=[],v=[],$=[],b=[],y=Promise.resolve();let k=!1;function S(t){$.push(t)}let j=!1;const x=new Set;function _(){if(!j){j=!0;do{for(let t=0;t<g.length;t+=1){const e=g[t];m(e),q(e.$$)}for(m(null),g.length=0;v.length;)v.pop()();for(let t=0;t<$.length;t+=1){const e=$[t];x.has(e)||(x.add(e),e())}$.length=0}while(g.length);for(;b.length;)b.pop()();k=!1,j=!1,x.clear()}}function q(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}const w=new Set;let C;function T(t,e){t&&t.i&&(w.delete(t),t.i(e))}function M(t,e,n,s){if(t&&t.o){if(w.has(t))return;w.add(t),C.c.push((()=>{w.delete(t),s&&(n&&t.d(1),s())})),t.o(e)}}function A(t){t&&t.c()}function E(t,n,r,l){const{fragment:i,on_mount:c,on_destroy:a,after_update:u}=t.$$;i&&i.m(n,r),l||S((()=>{const n=c.map(e).filter(o);a?a.push(...n):s(n),t.$$.on_mount=[]})),u.forEach(S)}function H(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function L(t,e){-1===t.$$.dirty[0]&&(g.push(t),k||(k=!0,y.then(_)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function R(e,o,r,l,c,a,u,p=[-1]){const f=i;m(e);const h=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:p,skip_bound:!1,root:o.target||f.$$.root};u&&u(h.root);let g=!1;if(h.ctx=r?r(e,o.props||{},((t,n,...s)=>{const o=s.length?s[0]:n;return h.ctx&&c(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),g&&L(e,t)),n})):[],h.update(),g=!0,s(h.before_update),h.fragment=!!l&&l(h.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);h.fragment&&h.fragment.l(t),t.forEach(d)}else h.fragment&&h.fragment.c();o.intro&&T(e.$$.fragment),E(e,o.target,o.anchor,o.customElement),_()}m(f)}class P{$destroy(){H(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}function D(e){let n;return{c(){n=p("navbar"),n.innerHTML='<li class="svelte-1jr7lyi"><a href="#welcome-section" class="svelte-1jr7lyi">About</a></li> \n  <li class="svelte-1jr7lyi"><a href="#projects-header" class="svelte-1jr7lyi">Projects</a></li> \n  <li class="svelte-1jr7lyi"><a href="#contact-section" class="svelte-1jr7lyi">Contact</a></li>',h(n,"id","navbar"),h(n,"class","nav svelte-1jr7lyi")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class O extends P{constructor(t){super(),R(this,t,null,D,r,{})}}function B(e){let n;return{c(){n=p("section"),n.innerHTML='<h1 class="svelte-7t168u">Peter Evans</h1> \n    <p class="svelte-7t168u">Radiation Shielding Assessor</p> \n    <p class="svelte-7t168u">Software Developer</p> \n    <p class="svelte-7t168u">Web Developer</p>',h(n,"id","welcome-section"),h(n,"class","svelte-7t168u")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class W extends P{constructor(t){super(),R(this,t,null,B,r,{})}}function G(e){let n,s,o,r,l;return{c(){n=p("a"),s=p("img"),r=f(),l=p("h3"),l.textContent=`${e[2]}`,c(s.src,o=e[3])||h(s,"src",o),h(s,"alt","A logo related to the project"),h(s,"class","svelte-1v4sr24"),h(l,"class","svelte-1v4sr24"),h(n,"id",e[0]),h(n,"class","project-tile svelte-1v4sr24"),h(n,"target","_blank"),h(n,"href",e[1])},m(t,e){u(t,n,e),a(n,s),a(n,r),a(n,l)},p:t,i:t,o:t,d(t){t&&d(n)}}}function N(t,e,n){let{project:s}=e;const o=s.id,r=s.link,l=s.title;s.text,s.tools;const i=s.image;return t.$$set=t=>{"project"in t&&n(4,s=t.project)},[o,r,l,i,s]}class Q extends P{constructor(t){super(),R(this,t,N,G,r,{project:4})}}function F(t,e,n){const s=t.slice();return s[9]=e[n],s}function J(e){let n,s;return n=new Q({props:{project:e[9]}}),{c(){A(n.$$.fragment)},m(t,e){E(n,t,e),s=!0},p:t,i(t){s||(T(n.$$.fragment,t),s=!0)},o(t){M(n.$$.fragment,t),s=!1},d(t){H(n,t)}}}function U(t){let e,n,o,r,l,i=t[0],c=[];for(let e=0;e<i.length;e+=1)c[e]=J(F(t,i,e));const m=t=>M(c[t],1,1,(()=>{c[t]=null}));return{c(){e=p("section"),n=p("div"),n.innerHTML='<h1 class="svelte-4c4eac">PROJECTS</h1>',o=f(),r=p("div");for(let t=0;t<c.length;t+=1)c[t].c();h(n,"id","projects-header"),h(n,"class","svelte-4c4eac"),h(r,"class","projects-content svelte-4c4eac"),h(e,"id","projects-section")},m(t,s){u(t,e,s),a(e,n),a(e,o),a(e,r);for(let t=0;t<c.length;t+=1)c[t].m(r,null);l=!0},p(t,[e]){if(1&e){let n;for(i=t[0],n=0;n<i.length;n+=1){const s=F(t,i,n);c[n]?(c[n].p(s,e),T(c[n],1)):(c[n]=J(s),c[n].c(),T(c[n],1),c[n].m(r,null))}for(C={r:0,c:[],p:C},n=i.length;n<c.length;n+=1)m(n);C.r||s(C.c),C=C.p}},i(t){if(!l){for(let t=0;t<i.length;t+=1)T(c[t]);l=!0}},o(t){c=c.filter(Boolean);for(let t=0;t<c.length;t+=1)M(c[t]);l=!1},d(t){t&&d(e),function(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}(c,t)}}}function I(t){const e=[];e.push({id:"tribute",link:"https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Tribute_page/Greta.html",title:"Tribute Page",text:"A sample tribute page",tools:"HTML and CSS",image:"logos/greta-tribute.png"});e.push({id:"squirrels-rest",link:"https://quargle.github.io/squirrels-rest/",title:"Squirrel's Rest",text:"An example of static pages based on HTML and CSS alone.",tools:"HTML and CSS",image:"logos/squirrel-opaque.png"});e.push({id:"survey-form",link:"https://quargle.github.io/FreeCodeCamp/Responsive_Web_Design/Survey_form/survey_form.html",title:"Survey Form",text:"A simple form written in HTML and CSS",tools:"HTML and CSS",image:"logos/survey-form-opaque.png"});e.push({id:"drumkit",link:"https://quargle.github.io/Games/Drumkit/drumkit.html",title:"Drumkit",text:"A JavaScript Drumkit",tools:"JavaScript, HTML and CSS",image:"logos/drumkit.png"});e.push({id:"etch-a-sketch",link:"https://quargle.github.io/Games/Etch-a-Sketch/sketch.html",title:"Etch-a-Sketch",text:"",tools:"JavaScript, HTML and CSS",image:"logos/sketch.png"});e.push({id:"svelte-counter",link:"https://quargle.github.io/svelte-project/public/",title:"Svelte Counter",text:"A simple counter that can be incremented and decremented",tools:"Svelte",image:"logos/svelte-counter.png"});e.push({id:"random-quotes-svelte",link:"https://quargle.github.io/random-quotes-svelte/",title:"Random Quote Machine (Svelte)",text:"A Random Quote Machine",tools:"Svelte",image:"logos/quote-machine-svelte.png"});return e.push({id:"react-counter",link:"",title:"React Counter",text:"This doesn't actually link to anything yet",tools:"React",image:"https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"}),[e]}class X extends P{constructor(t){super(),R(this,t,I,U,r,{})}}function Y(e){let n;return{c(){n=p("section"),n.innerHTML='<div class="contact-section-header"><h2 class="svelte-1vqlvb7">Contact Me</h2></div> \n    \n    <div id="contact-section-body" class="svelte-1vqlvb7"><a id="profile-link" class="contact-tile svelte-1vqlvb7" href="https://github.com/Quargle" target="_blank">GitHub Profile</a> \n      <a id="cerberus-website" class="contact-tile svelte-1vqlvb7" href="https://cerberusnuclear.com/" target="_blank">Cerberus Nuclear</a> \n      <a id="twitter" class="contact-tile svelte-1vqlvb7" href="https://twitter.com/quargy" target="_blank">Twitter</a></div>',h(n,"id","contact-section"),h(n,"class","svelte-1vqlvb7")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&d(n)}}}class z extends P{constructor(t){super(),R(this,t,null,Y,r,{})}}function K(e){let n,s,o,r,l,i,m,g,v,$,b,y,k;return i=new O({}),g=new W({}),$=new X({}),y=new z({}),{c(){n=p("link"),s=p("script"),r=f(),l=p("main"),A(i.$$.fragment),m=f(),A(g.$$.fragment),v=f(),A($.$$.fragment),b=f(),A(y.$$.fragment),document.title="Pete's Portfolio Site",h(n,"href","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"),h(n,"rel","stylesheet"),h(n,"integrity","sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"),h(n,"crossorigin","anonymous"),c(s.src,o="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js")||h(s,"src","https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"),h(s,"integrity","sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p"),h(s,"crossorigin","anonymous"),h(l,"class","svelte-1ytypgf")},m(t,e){a(document.head,n),a(document.head,s),u(t,r,e),u(t,l,e),E(i,l,null),a(l,m),E(g,l,null),a(l,v),E($,l,null),a(l,b),E(y,l,null),k=!0},p:t,i(t){k||(T(i.$$.fragment,t),T(g.$$.fragment,t),T($.$$.fragment,t),T(y.$$.fragment,t),k=!0)},o(t){M(i.$$.fragment,t),M(g.$$.fragment,t),M($.$$.fragment,t),M(y.$$.fragment,t),k=!1},d(t){d(n),d(s),t&&d(r),t&&d(l),H(i),H(g),H($),H(y)}}}return new class extends P{constructor(t){super(),R(this,t,null,K,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map