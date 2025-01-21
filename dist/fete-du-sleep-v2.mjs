var kc = Object.defineProperty;
var Lc = (n, e, t) => e in n ? kc(n, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : n[e] = t;
var mr = (n, e, t) => Lc(n, typeof e != "symbol" ? e + "" : e, t);
function Dc(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var gr = { exports: {} }, xa;
function zc() {
  if (xa) return gr.exports;
  xa = 1, gr.exports = p, gr.exports.match = s, gr.exports.regexpToFunction = o, gr.exports.parse = t, gr.exports.compile = i, gr.exports.tokensToFunction = a, gr.exports.tokensToRegExp = _;
  var n = "/", e = new RegExp([
    // Match escaped characters that would otherwise appear in future matches.
    // This allows the user to escape special characters that won't transform.
    "(\\\\.)",
    // Match Express-style parameters and un-named parameters with a prefix
    // and optional suffixes. Matches appear as:
    //
    // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
    // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
    "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"
  ].join("|"), "g");
  function t(g, m) {
    for (var v = [], y = 0, w = 0, b = "", S = m && m.delimiter || n, T = m && m.whitelist || void 0, O = !1, E; (E = e.exec(g)) !== null; ) {
      var P = E[0], R = E[1], C = E.index;
      if (b += g.slice(w, C), w = C + P.length, R) {
        b += R[1], O = !0;
        continue;
      }
      var L = "", z = E[2], H = E[3], W = E[4], B = E[5];
      if (!O && b.length) {
        var U = b.length - 1, ne = b[U], x = T ? T.indexOf(ne) > -1 : !0;
        x && (L = ne, b = b.slice(0, U));
      }
      b && (v.push(b), b = "", O = !1);
      var le = B === "+" || B === "*", Ee = B === "?" || B === "*", k = H || W, D = L || S, F = L || (typeof v[v.length - 1] == "string" ? v[v.length - 1] : "");
      v.push({
        name: z || y++,
        prefix: L,
        delimiter: D,
        optional: Ee,
        repeat: le,
        pattern: k ? u(k) : r(D, S, F)
      });
    }
    return (b || w < g.length) && v.push(b + g.substr(w)), v;
  }
  function r(g, m, v) {
    var y = "[^" + l(g === m ? g : g + m) + "]";
    return !v || v.indexOf(g) > -1 || v.indexOf(m) > -1 ? y + "+?" : l(v) + "|(?:(?!" + l(v) + ")" + y + ")+?";
  }
  function i(g, m) {
    return a(t(g, m), m);
  }
  function s(g, m) {
    var v = [], y = p(g, v, m);
    return o(y, v);
  }
  function o(g, m) {
    return function(v, y) {
      var w = g.exec(v);
      if (!w) return !1;
      for (var b = w[0], S = w.index, T = {}, O = y && y.decode || decodeURIComponent, E = 1; E < w.length; E++)
        if (w[E] !== void 0) {
          var P = m[E - 1];
          P.repeat ? T[P.name] = w[E].split(P.delimiter).map(function(R) {
            return O(R, P);
          }) : T[P.name] = O(w[E], P);
        }
      return { path: b, index: S, params: T };
    };
  }
  function a(g, m) {
    for (var v = new Array(g.length), y = 0; y < g.length; y++)
      typeof g[y] == "object" && (v[y] = new RegExp("^(?:" + g[y].pattern + ")$", c(m)));
    return function(w, b) {
      for (var S = "", T = b && b.encode || encodeURIComponent, O = b ? b.validate !== !1 : !0, E = 0; E < g.length; E++) {
        var P = g[E];
        if (typeof P == "string") {
          S += P;
          continue;
        }
        var R = w ? w[P.name] : void 0, C;
        if (Array.isArray(R)) {
          if (!P.repeat)
            throw new TypeError('Expected "' + P.name + '" to not repeat, but got array');
          if (R.length === 0) {
            if (P.optional) continue;
            throw new TypeError('Expected "' + P.name + '" to not be empty');
          }
          for (var L = 0; L < R.length; L++) {
            if (C = T(R[L], P), O && !v[E].test(C))
              throw new TypeError('Expected all "' + P.name + '" to match "' + P.pattern + '"');
            S += (L === 0 ? P.prefix : P.delimiter) + C;
          }
          continue;
        }
        if (typeof R == "string" || typeof R == "number" || typeof R == "boolean") {
          if (C = T(String(R), P), O && !v[E].test(C))
            throw new TypeError('Expected "' + P.name + '" to match "' + P.pattern + '", but got "' + C + '"');
          S += P.prefix + C;
          continue;
        }
        if (!P.optional)
          throw new TypeError('Expected "' + P.name + '" to be ' + (P.repeat ? "an array" : "a string"));
      }
      return S;
    };
  }
  function l(g) {
    return g.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
  }
  function u(g) {
    return g.replace(/([=!:$/()])/g, "\\$1");
  }
  function c(g) {
    return g && g.sensitive ? "" : "i";
  }
  function f(g, m) {
    if (!m) return g;
    var v = g.source.match(/\((?!\?)/g);
    if (v)
      for (var y = 0; y < v.length; y++)
        m.push({
          name: y,
          prefix: null,
          delimiter: null,
          optional: !1,
          repeat: !1,
          pattern: null
        });
    return g;
  }
  function h(g, m, v) {
    for (var y = [], w = 0; w < g.length; w++)
      y.push(p(g[w], m, v).source);
    return new RegExp("(?:" + y.join("|") + ")", c(v));
  }
  function d(g, m, v) {
    return _(t(g, v), m, v);
  }
  function _(g, m, v) {
    v = v || {};
    for (var y = v.strict, w = v.start !== !1, b = v.end !== !1, S = v.delimiter || n, T = [].concat(v.endsWith || []).map(l).concat("$").join("|"), O = w ? "^" : "", E = 0; E < g.length; E++) {
      var P = g[E];
      if (typeof P == "string")
        O += l(P);
      else {
        var R = P.repeat ? "(?:" + P.pattern + ")(?:" + l(P.delimiter) + "(?:" + P.pattern + "))*" : P.pattern;
        m && m.push(P), P.optional ? P.prefix ? O += "(?:" + l(P.prefix) + "(" + R + "))?" : O += "(" + R + ")?" : O += l(P.prefix) + "(" + R + ")";
      }
    }
    if (b)
      y || (O += "(?:" + l(S) + ")?"), O += T === "$" ? "$" : "(?=" + T + ")";
    else {
      var C = g[g.length - 1], L = typeof C == "string" ? C[C.length - 1] === S : C === void 0;
      y || (O += "(?:" + l(S) + "(?=" + T + "))?"), L || (O += "(?=" + l(S) + "|" + T + ")");
    }
    return new RegExp(O, c(v));
  }
  function p(g, m, v) {
    return g instanceof RegExp ? f(g, m) : Array.isArray(g) ? h(
      /** @type {!Array} */
      g,
      m,
      v
    ) : d(
      /** @type {string} */
      g,
      m,
      v
    );
  }
  return gr.exports;
}
zc();
var Dn = {}, zn = {}, Ta;
function Ic() {
  if (Ta) return zn;
  Ta = 1, Object.defineProperty(zn, "__esModule", {
    value: !0
  });
  var n = /* @__PURE__ */ function() {
    function r(i, s) {
      for (var o = 0; o < s.length; o++) {
        var a = s[o];
        a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(i, a.key, a);
      }
    }
    return function(i, s, o) {
      return s && r(i.prototype, s), o && r(i, o), i;
    };
  }();
  function e(r, i) {
    if (!(r instanceof i))
      throw new TypeError("Cannot call a class as a function");
  }
  var t = function() {
    function r() {
      e(this, r), this.isSwupPlugin = !0;
    }
    return n(r, [{
      key: "mount",
      value: function() {
      }
    }, {
      key: "unmount",
      value: function() {
      }
    }, {
      key: "_beforeMount",
      value: function() {
      }
    }, {
      key: "_afterUnmount",
      value: function() {
      }
      // here for any future hidden auto-cleanup
      // this is here so we can tell if plugin was created by extending this class
    }]), r;
  }();
  return zn.default = t, zn;
}
var Ea;
function Fc() {
  if (Ea) return Dn;
  Ea = 1, Object.defineProperty(Dn, "__esModule", {
    value: !0
  });
  var n = Object.assign || function(u) {
    for (var c = 1; c < arguments.length; c++) {
      var f = arguments[c];
      for (var h in f)
        Object.prototype.hasOwnProperty.call(f, h) && (u[h] = f[h]);
    }
    return u;
  }, e = /* @__PURE__ */ function() {
    function u(c, f) {
      for (var h = 0; h < f.length; h++) {
        var d = f[h];
        d.enumerable = d.enumerable || !1, d.configurable = !0, "value" in d && (d.writable = !0), Object.defineProperty(c, d.key, d);
      }
    }
    return function(c, f, h) {
      return f && u(c.prototype, f), h && u(c, h), c;
    };
  }(), t = Ic(), r = i(t);
  function i(u) {
    return u && u.__esModule ? u : { default: u };
  }
  function s(u, c) {
    if (!(u instanceof c))
      throw new TypeError("Cannot call a class as a function");
  }
  function o(u, c) {
    if (!u)
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return c && (typeof c == "object" || typeof c == "function") ? c : u;
  }
  function a(u, c) {
    if (typeof c != "function" && c !== null)
      throw new TypeError("Super expression must either be null or a function, not " + typeof c);
    u.prototype = Object.create(c && c.prototype, { constructor: { value: u, enumerable: !1, writable: !0, configurable: !0 } }), c && (Object.setPrototypeOf ? Object.setPrototypeOf(u, c) : u.__proto__ = c);
  }
  var l = function(u) {
    a(c, u);
    function c(f) {
      s(this, c);
      var h = o(this, (c.__proto__ || Object.getPrototypeOf(c)).call(this));
      h.name = "GaPlugin";
      var d = {
        gaMeasurementId: null
      };
      return h.options = n({}, d, f), h;
    }
    return e(c, [{
      key: "mount",
      value: function() {
        var h = this;
        this.swup.on("contentReplaced", function(d) {
          if (typeof gtag == "function") {
            var _ = document.title, p = window.location.pathname + window.location.search, g = h.options.gaMeasurementId;
            if (!g)
              throw new Error("gaMeasurementId option is required for gtag.");
            window.gtag("config", g, {
              page_title: _,
              page_path: p
            }), h.swup.log("GTAG pageview (url '" + p + "').");
          } else if (typeof window.ga == "function") {
            var m = document.title, v = window.location.pathname + window.location.search;
            window.ga("set", "title", m), window.ga("set", "page", v), window.ga("send", "pageview"), h.swup.log("GA pageview (url '" + v + "').");
          } else
            console.warn("window.gtag and window.ga don't exists.");
        });
      }
    }]), c;
  }(r.default);
  return Dn.default = l, Dn;
}
Fc();
function Ml(n, e, t) {
  return Math.max(n, Math.min(e, t));
}
class Nc {
  advance(e) {
    var a;
    if (!this.isRunning) return;
    let t = !1;
    if (this.lerp) this.value = (r = this.value, i = this.to, s = 60 * this.lerp, o = e, function(l, u, c) {
      return (1 - c) * l + c * u;
    }(r, i, 1 - Math.exp(-s * o))), Math.round(this.value) === this.to && (this.value = this.to, t = !0);
    else {
      this.currentTime += e;
      const l = Ml(0, this.currentTime / this.duration, 1);
      t = l >= 1;
      const u = t ? 1 : this.easing(l);
      this.value = this.from + (this.to - this.from) * u;
    }
    var r, i, s, o;
    (a = this.onUpdate) == null || a.call(this, this.value, t), t && this.stop();
  }
  stop() {
    this.isRunning = !1;
  }
  fromTo(e, t, { lerp: r = 0.1, duration: i = 1, easing: s = (l) => l, onStart: o, onUpdate: a }) {
    this.from = this.value = e, this.to = t, this.lerp = r, this.duration = i, this.easing = s, this.currentTime = 0, this.isRunning = !0, o == null || o(), this.onUpdate = a;
  }
}
class Bc {
  constructor({ wrapper: e, content: t, autoResize: r = !0, debounce: i = 250 } = {}) {
    mr(this, "resize", () => {
      this.onWrapperResize(), this.onContentResize();
    });
    mr(this, "onWrapperResize", () => {
      this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
    });
    mr(this, "onContentResize", () => {
      this.wrapper === window ? (this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth) : (this.scrollHeight = this.wrapper.scrollHeight, this.scrollWidth = this.wrapper.scrollWidth);
    });
    this.wrapper = e, this.content = t, r && (this.debouncedResize = /* @__PURE__ */ function(s, o) {
      let a;
      return function() {
        let l = arguments, u = this;
        clearTimeout(a), a = setTimeout(function() {
          s.apply(u, l);
        }, o);
      };
    }(this.resize, i), this.wrapper === window ? window.addEventListener("resize", this.debouncedResize, !1) : (this.wrapperResizeObserver = new ResizeObserver(this.debouncedResize), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(this.debouncedResize), this.contentResizeObserver.observe(this.content)), this.resize();
  }
  destroy() {
    var e, t;
    (e = this.wrapperResizeObserver) == null || e.disconnect(), (t = this.contentResizeObserver) == null || t.disconnect(), window.removeEventListener("resize", this.debouncedResize, !1);
  }
  get limit() {
    return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
  }
}
class Al {
  constructor() {
    this.events = {};
  }
  emit(e, ...t) {
    let r = this.events[e] || [];
    for (let i = 0, s = r.length; i < s; i++) r[i](...t);
  }
  on(e, t) {
    var r;
    return (r = this.events[e]) != null && r.push(t) || (this.events[e] = [t]), () => {
      var i;
      this.events[e] = (i = this.events[e]) == null ? void 0 : i.filter((s) => t !== s);
    };
  }
  off(e, t) {
    var r;
    this.events[e] = (r = this.events[e]) == null ? void 0 : r.filter((i) => t !== i);
  }
  destroy() {
    this.events = {};
  }
}
const Ca = 100 / 6;
class $c {
  constructor(e, { wheelMultiplier: t = 1, touchMultiplier: r = 1 }) {
    mr(this, "onTouchStart", (e) => {
      const { clientX: t, clientY: r } = e.targetTouches ? e.targetTouches[0] : e;
      this.touchStart.x = t, this.touchStart.y = r, this.lastDelta = { x: 0, y: 0 }, this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: e });
    });
    mr(this, "onTouchMove", (e) => {
      const { clientX: t, clientY: r } = e.targetTouches ? e.targetTouches[0] : e, i = -(t - this.touchStart.x) * this.touchMultiplier, s = -(r - this.touchStart.y) * this.touchMultiplier;
      this.touchStart.x = t, this.touchStart.y = r, this.lastDelta = { x: i, y: s }, this.emitter.emit("scroll", { deltaX: i, deltaY: s, event: e });
    });
    mr(this, "onTouchEnd", (e) => {
      this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: e });
    });
    mr(this, "onWheel", (e) => {
      let { deltaX: t, deltaY: r, deltaMode: i } = e;
      t *= i === 1 ? Ca : i === 2 ? this.windowWidth : 1, r *= i === 1 ? Ca : i === 2 ? this.windowHeight : 1, t *= this.wheelMultiplier, r *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: t, deltaY: r, event: e });
    });
    mr(this, "onWindowResize", () => {
      this.windowWidth = window.innerWidth, this.windowHeight = window.innerHeight;
    });
    this.element = e, this.wheelMultiplier = t, this.touchMultiplier = r, this.touchStart = { x: null, y: null }, this.emitter = new Al(), window.addEventListener("resize", this.onWindowResize, !1), this.onWindowResize(), this.element.addEventListener("wheel", this.onWheel, { passive: !1 }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: !1 }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: !1 }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: !1 });
  }
  on(e, t) {
    return this.emitter.on(e, t);
  }
  destroy() {
    this.emitter.destroy(), window.removeEventListener("resize", this.onWindowResize, !1), this.element.removeEventListener("wheel", this.onWheel, { passive: !1 }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: !1 }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: !1 }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: !1 });
  }
}
class Hc {
  constructor({ wrapper: e = window, content: t = document.documentElement, wheelEventsTarget: r = e, eventsTarget: i = r, smoothWheel: s = !0, syncTouch: o = !1, syncTouchLerp: a = 0.075, touchInertiaMultiplier: l = 35, duration: u, easing: c = (y) => Math.min(1, 1.001 - Math.pow(2, -10 * y)), lerp: f = !u && 0.1, infinite: h = !1, orientation: d = "vertical", gestureOrientation: _ = "vertical", touchMultiplier: p = 1, wheelMultiplier: g = 1, autoResize: m = !0, __experimental__naiveDimensions: v = !1 } = {}) {
    this.__isSmooth = !1, this.__isScrolling = !1, this.__isStopped = !1, this.__isLocked = !1, this.onVirtualScroll = ({ deltaX: y, deltaY: w, event: b }) => {
      if (b.ctrlKey) return;
      const S = b.type.includes("touch"), T = b.type.includes("wheel");
      if (this.options.syncTouch && S && b.type === "touchstart" && !this.isStopped && !this.isLocked) return void this.reset();
      const O = y === 0 && w === 0, E = this.options.gestureOrientation === "vertical" && w === 0 || this.options.gestureOrientation === "horizontal" && y === 0;
      if (O || E) return;
      let P = b.composedPath();
      if (P = P.slice(0, P.indexOf(this.rootElement)), P.find((z) => {
        var H, W, B, U, ne;
        return ((H = z.hasAttribute) === null || H === void 0 ? void 0 : H.call(z, "data-lenis-prevent")) || S && ((W = z.hasAttribute) === null || W === void 0 ? void 0 : W.call(z, "data-lenis-prevent-touch")) || T && ((B = z.hasAttribute) === null || B === void 0 ? void 0 : B.call(z, "data-lenis-prevent-wheel")) || ((U = z.classList) === null || U === void 0 ? void 0 : U.contains("lenis")) && !(!((ne = z.classList) === null || ne === void 0) && ne.contains("lenis-stopped"));
      })) return;
      if (this.isStopped || this.isLocked) return void b.preventDefault();
      if (this.isSmooth = this.options.syncTouch && S || this.options.smoothWheel && T, !this.isSmooth) return this.isScrolling = !1, void this.animate.stop();
      b.preventDefault();
      let R = w;
      this.options.gestureOrientation === "both" ? R = Math.abs(w) > Math.abs(y) ? w : y : this.options.gestureOrientation === "horizontal" && (R = y);
      const C = S && this.options.syncTouch, L = S && b.type === "touchend" && Math.abs(R) > 5;
      L && (R = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + R, Object.assign({ programmatic: !1 }, C ? { lerp: L ? this.options.syncTouchLerp : 1 } : { lerp: this.options.lerp, duration: this.options.duration, easing: this.options.easing }));
    }, this.onNativeScroll = () => {
      if (!this.__preventNextScrollEvent && !this.isScrolling) {
        const y = this.animatedScroll;
        this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - y), this.emit();
      }
    }, window.lenisVersion = "1.0.42", e !== document.documentElement && e !== document.body || (e = window), this.options = { wrapper: e, content: t, wheelEventsTarget: r, eventsTarget: i, smoothWheel: s, syncTouch: o, syncTouchLerp: a, touchInertiaMultiplier: l, duration: u, easing: c, lerp: f, infinite: h, gestureOrientation: _, orientation: d, touchMultiplier: p, wheelMultiplier: g, autoResize: m, __experimental__naiveDimensions: v }, this.animate = new Nc(), this.emitter = new Al(), this.dimensions = new Bc({ wrapper: e, content: t, autoResize: m }), this.toggleClassName("lenis", !0), this.velocity = 0, this.isLocked = !1, this.isStopped = !1, this.isSmooth = o || s, this.isScrolling = !1, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll = new $c(i, { touchMultiplier: p, wheelMultiplier: g }), this.virtualScroll.on("scroll", this.onVirtualScroll);
  }
  destroy() {
    this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onNativeScroll, !1), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClassName("lenis", !1), this.toggleClassName("lenis-smooth", !1), this.toggleClassName("lenis-scrolling", !1), this.toggleClassName("lenis-stopped", !1), this.toggleClassName("lenis-locked", !1);
  }
  on(e, t) {
    return this.emitter.on(e, t);
  }
  off(e, t) {
    return this.emitter.off(e, t);
  }
  setScroll(e) {
    this.isHorizontal ? this.rootElement.scrollLeft = e : this.rootElement.scrollTop = e;
  }
  resize() {
    this.dimensions.resize();
  }
  emit() {
    this.emitter.emit("scroll", this);
  }
  reset() {
    this.isLocked = !1, this.isScrolling = !1, this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.animate.stop();
  }
  start() {
    this.isStopped && (this.isStopped = !1, this.reset());
  }
  stop() {
    this.isStopped || (this.isStopped = !0, this.animate.stop(), this.reset());
  }
  raf(e) {
    const t = e - (this.time || e);
    this.time = e, this.animate.advance(1e-3 * t);
  }
  scrollTo(e, { offset: t = 0, immediate: r = !1, lock: i = !1, duration: s = this.options.duration, easing: o = this.options.easing, lerp: a = !s && this.options.lerp, onComplete: l, force: u = !1, programmatic: c = !0 } = {}) {
    if (!this.isStopped && !this.isLocked || u) {
      if (["top", "left", "start"].includes(e)) e = 0;
      else if (["bottom", "right", "end"].includes(e)) e = this.limit;
      else {
        let f;
        if (typeof e == "string" ? f = document.querySelector(e) : e != null && e.nodeType && (f = e), f) {
          if (this.options.wrapper !== window) {
            const d = this.options.wrapper.getBoundingClientRect();
            t -= this.isHorizontal ? d.left : d.top;
          }
          const h = f.getBoundingClientRect();
          e = (this.isHorizontal ? h.left : h.top) + this.animatedScroll;
        }
      }
      if (typeof e == "number") {
        if (e += t, e = Math.round(e), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : e = Ml(0, e, this.limit), r) return this.animatedScroll = this.targetScroll = e, this.setScroll(this.scroll), this.reset(), void (l == null || l(this));
        if (!c) {
          if (e === this.targetScroll) return;
          this.targetScroll = e;
        }
        this.animate.fromTo(this.animatedScroll, e, { duration: s, easing: o, lerp: a, onStart: () => {
          i && (this.isLocked = !0), this.isScrolling = !0;
        }, onUpdate: (f, h) => {
          this.isScrolling = !0, this.velocity = f - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = f, this.setScroll(this.scroll), c && (this.targetScroll = f), h || this.emit(), h && (this.reset(), this.emit(), l == null || l(this), this.__preventNextScrollEvent = !0, requestAnimationFrame(() => {
            delete this.__preventNextScrollEvent;
          }));
        } });
      }
    }
  }
  get rootElement() {
    return this.options.wrapper === window ? document.documentElement : this.options.wrapper;
  }
  get limit() {
    return this.options.__experimental__naiveDimensions ? this.isHorizontal ? this.rootElement.scrollWidth - this.rootElement.clientWidth : this.rootElement.scrollHeight - this.rootElement.clientHeight : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
  }
  get isHorizontal() {
    return this.options.orientation === "horizontal";
  }
  get actualScroll() {
    return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
  }
  get scroll() {
    return this.options.infinite ? (e = this.animatedScroll, t = this.limit, (e % t + t) % t) : this.animatedScroll;
    var e, t;
  }
  get progress() {
    return this.limit === 0 ? 1 : this.scroll / this.limit;
  }
  get isSmooth() {
    return this.__isSmooth;
  }
  set isSmooth(e) {
    this.__isSmooth !== e && (this.__isSmooth = e, this.toggleClassName("lenis-smooth", e));
  }
  get isScrolling() {
    return this.__isScrolling;
  }
  set isScrolling(e) {
    this.__isScrolling !== e && (this.__isScrolling = e, this.toggleClassName("lenis-scrolling", e));
  }
  get isStopped() {
    return this.__isStopped;
  }
  set isStopped(e) {
    this.__isStopped !== e && (this.__isStopped = e, this.toggleClassName("lenis-stopped", e));
  }
  get isLocked() {
    return this.__isLocked;
  }
  set isLocked(e) {
    this.__isLocked !== e && (this.__isLocked = e, this.toggleClassName("lenis-locked", e));
  }
  get className() {
    let e = "lenis";
    return this.isStopped && (e += " lenis-stopped"), this.isLocked && (e += " lenis-locked"), this.isScrolling && (e += " lenis-scrolling"), this.isSmooth && (e += " lenis-smooth"), e;
  }
  toggleClassName(e, t) {
    this.rootElement.classList.toggle(e, t), this.emitter.emit("className change", this);
  }
}
function _r(n) {
  if (n === void 0)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return n;
}
function Rl(n, e) {
  n.prototype = Object.create(e.prototype), n.prototype.constructor = n, n.__proto__ = e;
}
/*!
 * GSAP 3.12.7
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Rt = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, Li = {
  duration: 0.5,
  overwrite: !1,
  delay: 0
}, Wo, Xe, _e, or = 1e8, it = 1 / or, fo = Math.PI * 2, Vc = fo / 4, Gc = 0, kl = Math.sqrt, qc = Math.cos, Uc = Math.sin, qe = function(e) {
  return typeof e == "string";
}, Te = function(e) {
  return typeof e == "function";
}, Sr = function(e) {
  return typeof e == "number";
}, Yo = function(e) {
  return typeof e > "u";
}, ur = function(e) {
  return typeof e == "object";
}, mt = function(e) {
  return e !== !1;
}, Xo = function() {
  return typeof window < "u";
}, In = function(e) {
  return Te(e) || qe(e);
}, Ll = typeof ArrayBuffer == "function" && ArrayBuffer.isView || function() {
}, nt = Array.isArray, ho = /(?:-?\.?\d|\.)+/gi, Dl = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, Ti = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, Ns = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, zl = /[+-]=-?[.\d]+/, Il = /[^,'"\[\]\s]+/gi, Wc = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, we, er, po, jo, Lt = {}, fs = {}, Fl, Nl = function(e) {
  return (fs = Di(e, Lt)) && wt;
}, Ko = function(e, t) {
  return console.warn("Invalid property", e, "set to", t, "Missing plugin? gsap.registerPlugin()");
}, vn = function(e, t) {
  return !t && console.warn(e);
}, Bl = function(e, t) {
  return e && (Lt[e] = t) && fs && (fs[e] = t) || Lt;
}, yn = function() {
  return 0;
}, Yc = {
  suppressEvents: !0,
  isStart: !0,
  kill: !1
}, Jn = {
  suppressEvents: !0,
  kill: !1
}, Xc = {
  suppressEvents: !0
}, Jo = {}, zr = [], mo = {}, $l, Et = {}, Bs = {}, Pa = 30, Qn = [], Qo = "", Zo = function(e) {
  var t = e[0], r, i;
  if (ur(t) || Te(t) || (e = [e]), !(r = (t._gsap || {}).harness)) {
    for (i = Qn.length; i-- && !Qn[i].targetTest(t); )
      ;
    r = Qn[i];
  }
  for (i = e.length; i--; )
    e[i] && (e[i]._gsap || (e[i]._gsap = new cu(e[i], r))) || e.splice(i, 1);
  return e;
}, ti = function(e) {
  return e._gsap || Zo(Ht(e))[0]._gsap;
}, Hl = function(e, t, r) {
  return (r = e[t]) && Te(r) ? e[t]() : Yo(r) && e.getAttribute && e.getAttribute(t) || r;
}, gt = function(e, t) {
  return (e = e.split(",")).forEach(t) || e;
}, Me = function(e) {
  return Math.round(e * 1e5) / 1e5 || 0;
}, De = function(e) {
  return Math.round(e * 1e7) / 1e7 || 0;
}, Pi = function(e, t) {
  var r = t.charAt(0), i = parseFloat(t.substr(2));
  return e = parseFloat(e), r === "+" ? e + i : r === "-" ? e - i : r === "*" ? e * i : e / i;
}, jc = function(e, t) {
  for (var r = t.length, i = 0; e.indexOf(t[i]) < 0 && ++i < r; )
    ;
  return i < r;
}, ds = function() {
  var e = zr.length, t = zr.slice(0), r, i;
  for (mo = {}, zr.length = 0, r = 0; r < e; r++)
    i = t[r], i && i._lazy && (i.render(i._lazy[0], i._lazy[1], !0)._lazy = 0);
}, Vl = function(e, t, r, i) {
  zr.length && !Xe && ds(), e.render(t, r, Xe && t < 0 && (e._initted || e._startAt)), zr.length && !Xe && ds();
}, Gl = function(e) {
  var t = parseFloat(e);
  return (t || t === 0) && (e + "").match(Il).length < 2 ? t : qe(e) ? e.trim() : e;
}, ql = function(e) {
  return e;
}, Dt = function(e, t) {
  for (var r in t)
    r in e || (e[r] = t[r]);
  return e;
}, Kc = function(e) {
  return function(t, r) {
    for (var i in r)
      i in t || i === "duration" && e || i === "ease" || (t[i] = r[i]);
  };
}, Di = function(e, t) {
  for (var r in t)
    e[r] = t[r];
  return e;
}, Oa = function n(e, t) {
  for (var r in t)
    r !== "__proto__" && r !== "constructor" && r !== "prototype" && (e[r] = ur(t[r]) ? n(e[r] || (e[r] = {}), t[r]) : t[r]);
  return e;
}, hs = function(e, t) {
  var r = {}, i;
  for (i in e)
    i in t || (r[i] = e[i]);
  return r;
}, on = function(e) {
  var t = e.parent || we, r = e.keyframes ? Kc(nt(e.keyframes)) : Dt;
  if (mt(e.inherit))
    for (; t; )
      r(e, t.vars.defaults), t = t.parent || t._dp;
  return e;
}, Jc = function(e, t) {
  for (var r = e.length, i = r === t.length; i && r-- && e[r] === t[r]; )
    ;
  return r < 0;
}, Ul = function(e, t, r, i, s) {
  var o = e[i], a;
  if (s)
    for (a = t[s]; o && o[s] > a; )
      o = o._prev;
  return o ? (t._next = o._next, o._next = t) : (t._next = e[r], e[r] = t), t._next ? t._next._prev = t : e[i] = t, t._prev = o, t.parent = t._dp = e, t;
}, Ps = function(e, t, r, i) {
  r === void 0 && (r = "_first"), i === void 0 && (i = "_last");
  var s = t._prev, o = t._next;
  s ? s._next = o : e[r] === t && (e[r] = o), o ? o._prev = s : e[i] === t && (e[i] = s), t._next = t._prev = t.parent = null;
}, Nr = function(e, t) {
  e.parent && (!t || e.parent.autoRemoveChildren) && e.parent.remove && e.parent.remove(e), e._act = 0;
}, ri = function(e, t) {
  if (e && (!t || t._end > e._dur || t._start < 0))
    for (var r = e; r; )
      r._dirty = 1, r = r.parent;
  return e;
}, Qc = function(e) {
  for (var t = e.parent; t && t.parent; )
    t._dirty = 1, t.totalDuration(), t = t.parent;
  return e;
}, go = function(e, t, r, i) {
  return e._startAt && (Xe ? e._startAt.revert(Jn) : e.vars.immediateRender && !e.vars.autoRevert || e._startAt.render(t, !0, i));
}, Zc = function n(e) {
  return !e || e._ts && n(e.parent);
}, Ma = function(e) {
  return e._repeat ? zi(e._tTime, e = e.duration() + e._rDelay) * e : 0;
}, zi = function(e, t) {
  var r = Math.floor(e = De(e / t));
  return e && r === e ? r - 1 : r;
}, ps = function(e, t) {
  return (e - t._start) * t._ts + (t._ts >= 0 ? 0 : t._dirty ? t.totalDuration() : t._tDur);
}, Os = function(e) {
  return e._end = De(e._start + (e._tDur / Math.abs(e._ts || e._rts || it) || 0));
}, Ms = function(e, t) {
  var r = e._dp;
  return r && r.smoothChildTiming && e._ts && (e._start = De(r._time - (e._ts > 0 ? t / e._ts : ((e._dirty ? e.totalDuration() : e._tDur) - t) / -e._ts)), Os(e), r._dirty || ri(r, e)), e;
}, Wl = function(e, t) {
  var r;
  if ((t._time || !t._dur && t._initted || t._start < e._time && (t._dur || !t.add)) && (r = ps(e.rawTime(), t), (!t._dur || On(0, t.totalDuration(), r) - t._tTime > it) && t.render(r, !0)), ri(e, t)._dp && e._initted && e._time >= e._dur && e._ts) {
    if (e._dur < e.duration())
      for (r = e; r._dp; )
        r.rawTime() >= 0 && r.totalTime(r._tTime), r = r._dp;
    e._zTime = -1e-8;
  }
}, rr = function(e, t, r, i) {
  return t.parent && Nr(t), t._start = De((Sr(r) ? r : r || e !== we ? Ft(e, r, t) : e._time) + t._delay), t._end = De(t._start + (t.totalDuration() / Math.abs(t.timeScale()) || 0)), Ul(e, t, "_first", "_last", e._sort ? "_start" : 0), _o(t) || (e._recent = t), i || Wl(e, t), e._ts < 0 && Ms(e, e._tTime), e;
}, Yl = function(e, t) {
  return (Lt.ScrollTrigger || Ko("scrollTrigger", t)) && Lt.ScrollTrigger.create(t, e);
}, Xl = function(e, t, r, i, s) {
  if (ta(e, t, s), !e._initted)
    return 1;
  if (!r && e._pt && !Xe && (e._dur && e.vars.lazy !== !1 || !e._dur && e.vars.lazy) && $l !== Ot.frame)
    return zr.push(e), e._lazy = [s, i], 1;
}, ef = function n(e) {
  var t = e.parent;
  return t && t._ts && t._initted && !t._lock && (t.rawTime() < 0 || n(t));
}, _o = function(e) {
  var t = e.data;
  return t === "isFromStart" || t === "isStart";
}, tf = function(e, t, r, i) {
  var s = e.ratio, o = t < 0 || !t && (!e._start && ef(e) && !(!e._initted && _o(e)) || (e._ts < 0 || e._dp._ts < 0) && !_o(e)) ? 0 : 1, a = e._rDelay, l = 0, u, c, f;
  if (a && e._repeat && (l = On(0, e._tDur, t), c = zi(l, a), e._yoyo && c & 1 && (o = 1 - o), c !== zi(e._tTime, a) && (s = 1 - o, e.vars.repeatRefresh && e._initted && e.invalidate())), o !== s || Xe || i || e._zTime === it || !t && e._zTime) {
    if (!e._initted && Xl(e, t, i, r, l))
      return;
    for (f = e._zTime, e._zTime = t || (r ? it : 0), r || (r = t && !f), e.ratio = o, e._from && (o = 1 - o), e._time = 0, e._tTime = l, u = e._pt; u; )
      u.r(o, u.d), u = u._next;
    t < 0 && go(e, t, r, !0), e._onUpdate && !r && At(e, "onUpdate"), l && e._repeat && !r && e.parent && At(e, "onRepeat"), (t >= e._tDur || t < 0) && e.ratio === o && (o && Nr(e, 1), !r && !Xe && (At(e, o ? "onComplete" : "onReverseComplete", !0), e._prom && e._prom()));
  } else e._zTime || (e._zTime = t);
}, rf = function(e, t, r) {
  var i;
  if (r > t)
    for (i = e._first; i && i._start <= r; ) {
      if (i.data === "isPause" && i._start > t)
        return i;
      i = i._next;
    }
  else
    for (i = e._last; i && i._start >= r; ) {
      if (i.data === "isPause" && i._start < t)
        return i;
      i = i._prev;
    }
}, Ii = function(e, t, r, i) {
  var s = e._repeat, o = De(t) || 0, a = e._tTime / e._tDur;
  return a && !i && (e._time *= o / e._dur), e._dur = o, e._tDur = s ? s < 0 ? 1e10 : De(o * (s + 1) + e._rDelay * s) : o, a > 0 && !i && Ms(e, e._tTime = e._tDur * a), e.parent && Os(e), r || ri(e.parent, e), e;
}, Aa = function(e) {
  return e instanceof ft ? ri(e) : Ii(e, e._dur);
}, nf = {
  _start: 0,
  endTime: yn,
  totalDuration: yn
}, Ft = function n(e, t, r) {
  var i = e.labels, s = e._recent || nf, o = e.duration() >= or ? s.endTime(!1) : e._dur, a, l, u;
  return qe(t) && (isNaN(t) || t in i) ? (l = t.charAt(0), u = t.substr(-1) === "%", a = t.indexOf("="), l === "<" || l === ">" ? (a >= 0 && (t = t.replace(/=/, "")), (l === "<" ? s._start : s.endTime(s._repeat >= 0)) + (parseFloat(t.substr(1)) || 0) * (u ? (a < 0 ? s : r).totalDuration() / 100 : 1)) : a < 0 ? (t in i || (i[t] = o), i[t]) : (l = parseFloat(t.charAt(a - 1) + t.substr(a + 1)), u && r && (l = l / 100 * (nt(r) ? r[0] : r).totalDuration()), a > 1 ? n(e, t.substr(0, a - 1), r) + l : o + l)) : t == null ? o : +t;
}, an = function(e, t, r) {
  var i = Sr(t[1]), s = (i ? 2 : 1) + (e < 2 ? 0 : 1), o = t[s], a, l;
  if (i && (o.duration = t[1]), o.parent = r, e) {
    for (a = o, l = r; l && !("immediateRender" in a); )
      a = l.vars.defaults || {}, l = mt(l.vars.inherit) && l.parent;
    o.immediateRender = mt(a.immediateRender), e < 2 ? o.runBackwards = 1 : o.startAt = t[s - 1];
  }
  return new Le(t[0], o, t[s + 1]);
}, Hr = function(e, t) {
  return e || e === 0 ? t(e) : t;
}, On = function(e, t, r) {
  return r < e ? e : r > t ? t : r;
}, et = function(e, t) {
  return !qe(e) || !(t = Wc.exec(e)) ? "" : t[1];
}, sf = function(e, t, r) {
  return Hr(r, function(i) {
    return On(e, t, i);
  });
}, vo = [].slice, jl = function(e, t) {
  return e && ur(e) && "length" in e && (!t && !e.length || e.length - 1 in e && ur(e[0])) && !e.nodeType && e !== er;
}, of = function(e, t, r) {
  return r === void 0 && (r = []), e.forEach(function(i) {
    var s;
    return qe(i) && !t || jl(i, 1) ? (s = r).push.apply(s, Ht(i)) : r.push(i);
  }) || r;
}, Ht = function(e, t, r) {
  return _e && !t && _e.selector ? _e.selector(e) : qe(e) && !r && (po || !Fi()) ? vo.call((t || jo).querySelectorAll(e), 0) : nt(e) ? of(e, r) : jl(e) ? vo.call(e, 0) : e ? [e] : [];
}, yo = function(e) {
  return e = Ht(e)[0] || vn("Invalid scope") || {}, function(t) {
    var r = e.current || e.nativeElement || e;
    return Ht(t, r.querySelectorAll ? r : r === e ? vn("Invalid scope") || jo.createElement("div") : e);
  };
}, Kl = function(e) {
  return e.sort(function() {
    return 0.5 - Math.random();
  });
}, Jl = function(e) {
  if (Te(e))
    return e;
  var t = ur(e) ? e : {
    each: e
  }, r = ii(t.ease), i = t.from || 0, s = parseFloat(t.base) || 0, o = {}, a = i > 0 && i < 1, l = isNaN(i) || a, u = t.axis, c = i, f = i;
  return qe(i) ? c = f = {
    center: 0.5,
    edges: 0.5,
    end: 1
  }[i] || 0 : !a && l && (c = i[0], f = i[1]), function(h, d, _) {
    var p = (_ || t).length, g = o[p], m, v, y, w, b, S, T, O, E;
    if (!g) {
      if (E = t.grid === "auto" ? 0 : (t.grid || [1, or])[1], !E) {
        for (T = -1e8; T < (T = _[E++].getBoundingClientRect().left) && E < p; )
          ;
        E < p && E--;
      }
      for (g = o[p] = [], m = l ? Math.min(E, p) * c - 0.5 : i % E, v = E === or ? 0 : l ? p * f / E - 0.5 : i / E | 0, T = 0, O = or, S = 0; S < p; S++)
        y = S % E - m, w = v - (S / E | 0), g[S] = b = u ? Math.abs(u === "y" ? w : y) : kl(y * y + w * w), b > T && (T = b), b < O && (O = b);
      i === "random" && Kl(g), g.max = T - O, g.min = O, g.v = p = (parseFloat(t.amount) || parseFloat(t.each) * (E > p ? p - 1 : u ? u === "y" ? p / E : E : Math.max(E, p / E)) || 0) * (i === "edges" ? -1 : 1), g.b = p < 0 ? s - p : s, g.u = et(t.amount || t.each) || 0, r = r && p < 0 ? au(r) : r;
    }
    return p = (g[h] - g.min) / g.max || 0, De(g.b + (r ? r(p) : p) * g.v) + g.u;
  };
}, wo = function(e) {
  var t = Math.pow(10, ((e + "").split(".")[1] || "").length);
  return function(r) {
    var i = De(Math.round(parseFloat(r) / e) * e * t);
    return (i - i % 1) / t + (Sr(r) ? 0 : et(r));
  };
}, Ql = function(e, t) {
  var r = nt(e), i, s;
  return !r && ur(e) && (i = r = e.radius || or, e.values ? (e = Ht(e.values), (s = !Sr(e[0])) && (i *= i)) : e = wo(e.increment)), Hr(t, r ? Te(e) ? function(o) {
    return s = e(o), Math.abs(s - o) <= i ? s : o;
  } : function(o) {
    for (var a = parseFloat(s ? o.x : o), l = parseFloat(s ? o.y : 0), u = or, c = 0, f = e.length, h, d; f--; )
      s ? (h = e[f].x - a, d = e[f].y - l, h = h * h + d * d) : h = Math.abs(e[f] - a), h < u && (u = h, c = f);
    return c = !i || u <= i ? e[c] : o, s || c === o || Sr(o) ? c : c + et(o);
  } : wo(e));
}, Zl = function(e, t, r, i) {
  return Hr(nt(e) ? !t : r === !0 ? !!(r = 0) : !i, function() {
    return nt(e) ? e[~~(Math.random() * e.length)] : (r = r || 1e-5) && (i = r < 1 ? Math.pow(10, (r + "").length - 2) : 1) && Math.floor(Math.round((e - r / 2 + Math.random() * (t - e + r * 0.99)) / r) * r * i) / i;
  });
}, af = function() {
  for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
    t[r] = arguments[r];
  return function(i) {
    return t.reduce(function(s, o) {
      return o(s);
    }, i);
  };
}, lf = function(e, t) {
  return function(r) {
    return e(parseFloat(r)) + (t || et(r));
  };
}, uf = function(e, t, r) {
  return tu(e, t, 0, 1, r);
}, eu = function(e, t, r) {
  return Hr(r, function(i) {
    return e[~~t(i)];
  });
}, cf = function n(e, t, r) {
  var i = t - e;
  return nt(e) ? eu(e, n(0, e.length), t) : Hr(r, function(s) {
    return (i + (s - e) % i) % i + e;
  });
}, ff = function n(e, t, r) {
  var i = t - e, s = i * 2;
  return nt(e) ? eu(e, n(0, e.length - 1), t) : Hr(r, function(o) {
    return o = (s + (o - e) % s) % s || 0, e + (o > i ? s - o : o);
  });
}, wn = function(e) {
  for (var t = 0, r = "", i, s, o, a; ~(i = e.indexOf("random(", t)); )
    o = e.indexOf(")", i), a = e.charAt(i + 7) === "[", s = e.substr(i + 7, o - i - 7).match(a ? Il : ho), r += e.substr(t, i - t) + Zl(a ? s : +s[0], a ? 0 : +s[1], +s[2] || 1e-5), t = o + 1;
  return r + e.substr(t, e.length - t);
}, tu = function(e, t, r, i, s) {
  var o = t - e, a = i - r;
  return Hr(s, function(l) {
    return r + ((l - e) / o * a || 0);
  });
}, df = function n(e, t, r, i) {
  var s = isNaN(e + t) ? 0 : function(d) {
    return (1 - d) * e + d * t;
  };
  if (!s) {
    var o = qe(e), a = {}, l, u, c, f, h;
    if (r === !0 && (i = 1) && (r = null), o)
      e = {
        p: e
      }, t = {
        p: t
      };
    else if (nt(e) && !nt(t)) {
      for (c = [], f = e.length, h = f - 2, u = 1; u < f; u++)
        c.push(n(e[u - 1], e[u]));
      f--, s = function(_) {
        _ *= f;
        var p = Math.min(h, ~~_);
        return c[p](_ - p);
      }, r = t;
    } else i || (e = Di(nt(e) ? [] : {}, e));
    if (!c) {
      for (l in t)
        ea.call(a, e, l, "get", t[l]);
      s = function(_) {
        return na(_, a) || (o ? e.p : e);
      };
    }
  }
  return Hr(r, s);
}, Ra = function(e, t, r) {
  var i = e.labels, s = or, o, a, l;
  for (o in i)
    a = i[o] - t, a < 0 == !!r && a && s > (a = Math.abs(a)) && (l = o, s = a);
  return l;
}, At = function(e, t, r) {
  var i = e.vars, s = i[t], o = _e, a = e._ctx, l, u, c;
  if (s)
    return l = i[t + "Params"], u = i.callbackScope || e, r && zr.length && ds(), a && (_e = a), c = l ? s.apply(u, l) : s.call(u), _e = o, c;
}, Qi = function(e) {
  return Nr(e), e.scrollTrigger && e.scrollTrigger.kill(!!Xe), e.progress() < 1 && At(e, "onInterrupt"), e;
}, Ei, ru = [], iu = function(e) {
  if (e)
    if (e = !e.name && e.default || e, Xo() || e.headless) {
      var t = e.name, r = Te(e), i = t && !r && e.init ? function() {
        this._props = [];
      } : e, s = {
        init: yn,
        render: na,
        add: ea,
        kill: Of,
        modifier: Pf,
        rawVars: 0
      }, o = {
        targetTest: 0,
        get: 0,
        getSetter: ia,
        aliases: {},
        register: 0
      };
      if (Fi(), e !== i) {
        if (Et[t])
          return;
        Dt(i, Dt(hs(e, s), o)), Di(i.prototype, Di(s, hs(e, o))), Et[i.prop = t] = i, e.targetTest && (Qn.push(i), Jo[t] = 1), t = (t === "css" ? "CSS" : t.charAt(0).toUpperCase() + t.substr(1)) + "Plugin";
      }
      Bl(t, i), e.register && e.register(wt, i, _t);
    } else
      ru.push(e);
}, pe = 255, Zi = {
  aqua: [0, pe, pe],
  lime: [0, pe, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, pe],
  navy: [0, 0, 128],
  white: [pe, pe, pe],
  olive: [128, 128, 0],
  yellow: [pe, pe, 0],
  orange: [pe, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [pe, 0, 0],
  pink: [pe, 192, 203],
  cyan: [0, pe, pe],
  transparent: [pe, pe, pe, 0]
}, $s = function(e, t, r) {
  return e += e < 0 ? 1 : e > 1 ? -1 : 0, (e * 6 < 1 ? t + (r - t) * e * 6 : e < 0.5 ? r : e * 3 < 2 ? t + (r - t) * (2 / 3 - e) * 6 : t) * pe + 0.5 | 0;
}, nu = function(e, t, r) {
  var i = e ? Sr(e) ? [e >> 16, e >> 8 & pe, e & pe] : 0 : Zi.black, s, o, a, l, u, c, f, h, d, _;
  if (!i) {
    if (e.substr(-1) === "," && (e = e.substr(0, e.length - 1)), Zi[e])
      i = Zi[e];
    else if (e.charAt(0) === "#") {
      if (e.length < 6 && (s = e.charAt(1), o = e.charAt(2), a = e.charAt(3), e = "#" + s + s + o + o + a + a + (e.length === 5 ? e.charAt(4) + e.charAt(4) : "")), e.length === 9)
        return i = parseInt(e.substr(1, 6), 16), [i >> 16, i >> 8 & pe, i & pe, parseInt(e.substr(7), 16) / 255];
      e = parseInt(e.substr(1), 16), i = [e >> 16, e >> 8 & pe, e & pe];
    } else if (e.substr(0, 3) === "hsl") {
      if (i = _ = e.match(ho), !t)
        l = +i[0] % 360 / 360, u = +i[1] / 100, c = +i[2] / 100, o = c <= 0.5 ? c * (u + 1) : c + u - c * u, s = c * 2 - o, i.length > 3 && (i[3] *= 1), i[0] = $s(l + 1 / 3, s, o), i[1] = $s(l, s, o), i[2] = $s(l - 1 / 3, s, o);
      else if (~e.indexOf("="))
        return i = e.match(Dl), r && i.length < 4 && (i[3] = 1), i;
    } else
      i = e.match(ho) || Zi.transparent;
    i = i.map(Number);
  }
  return t && !_ && (s = i[0] / pe, o = i[1] / pe, a = i[2] / pe, f = Math.max(s, o, a), h = Math.min(s, o, a), c = (f + h) / 2, f === h ? l = u = 0 : (d = f - h, u = c > 0.5 ? d / (2 - f - h) : d / (f + h), l = f === s ? (o - a) / d + (o < a ? 6 : 0) : f === o ? (a - s) / d + 2 : (s - o) / d + 4, l *= 60), i[0] = ~~(l + 0.5), i[1] = ~~(u * 100 + 0.5), i[2] = ~~(c * 100 + 0.5)), r && i.length < 4 && (i[3] = 1), i;
}, su = function(e) {
  var t = [], r = [], i = -1;
  return e.split(Ir).forEach(function(s) {
    var o = s.match(Ti) || [];
    t.push.apply(t, o), r.push(i += o.length + 1);
  }), t.c = r, t;
}, ka = function(e, t, r) {
  var i = "", s = (e + i).match(Ir), o = t ? "hsla(" : "rgba(", a = 0, l, u, c, f;
  if (!s)
    return e;
  if (s = s.map(function(h) {
    return (h = nu(h, t, 1)) && o + (t ? h[0] + "," + h[1] + "%," + h[2] + "%," + h[3] : h.join(",")) + ")";
  }), r && (c = su(e), l = r.c, l.join(i) !== c.c.join(i)))
    for (u = e.replace(Ir, "1").split(Ti), f = u.length - 1; a < f; a++)
      i += u[a] + (~l.indexOf(a) ? s.shift() || o + "0,0,0,0)" : (c.length ? c : s.length ? s : r).shift());
  if (!u)
    for (u = e.split(Ir), f = u.length - 1; a < f; a++)
      i += u[a] + s[a];
  return i + u[f];
}, Ir = function() {
  var n = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", e;
  for (e in Zi)
    n += "|" + e + "\\b";
  return new RegExp(n + ")", "gi");
}(), hf = /hsl[a]?\(/, ou = function(e) {
  var t = e.join(" "), r;
  if (Ir.lastIndex = 0, Ir.test(t))
    return r = hf.test(t), e[1] = ka(e[1], r), e[0] = ka(e[0], r, su(e[1])), !0;
}, bn, Ot = function() {
  var n = Date.now, e = 500, t = 33, r = n(), i = r, s = 1e3 / 240, o = s, a = [], l, u, c, f, h, d, _ = function p(g) {
    var m = n() - i, v = g === !0, y, w, b, S;
    if ((m > e || m < 0) && (r += m - t), i += m, b = i - r, y = b - o, (y > 0 || v) && (S = ++f.frame, h = b - f.time * 1e3, f.time = b = b / 1e3, o += y + (y >= s ? 4 : s - y), w = 1), v || (l = u(p)), w)
      for (d = 0; d < a.length; d++)
        a[d](b, h, S, g);
  };
  return f = {
    time: 0,
    frame: 0,
    tick: function() {
      _(!0);
    },
    deltaRatio: function(g) {
      return h / (1e3 / (g || 60));
    },
    wake: function() {
      Fl && (!po && Xo() && (er = po = window, jo = er.document || {}, Lt.gsap = wt, (er.gsapVersions || (er.gsapVersions = [])).push(wt.version), Nl(fs || er.GreenSockGlobals || !er.gsap && er || {}), ru.forEach(iu)), c = typeof requestAnimationFrame < "u" && requestAnimationFrame, l && f.sleep(), u = c || function(g) {
        return setTimeout(g, o - f.time * 1e3 + 1 | 0);
      }, bn = 1, _(2));
    },
    sleep: function() {
      (c ? cancelAnimationFrame : clearTimeout)(l), bn = 0, u = yn;
    },
    lagSmoothing: function(g, m) {
      e = g || 1 / 0, t = Math.min(m || 33, e);
    },
    fps: function(g) {
      s = 1e3 / (g || 240), o = f.time * 1e3 + s;
    },
    add: function(g, m, v) {
      var y = m ? function(w, b, S, T) {
        g(w, b, S, T), f.remove(y);
      } : g;
      return f.remove(g), a[v ? "unshift" : "push"](y), Fi(), y;
    },
    remove: function(g, m) {
      ~(m = a.indexOf(g)) && a.splice(m, 1) && d >= m && d--;
    },
    _listeners: a
  }, f;
}(), Fi = function() {
  return !bn && Ot.wake();
}, ae = {}, pf = /^[\d.\-M][\d.\-,\s]/, mf = /["']/g, gf = function(e) {
  for (var t = {}, r = e.substr(1, e.length - 3).split(":"), i = r[0], s = 1, o = r.length, a, l, u; s < o; s++)
    l = r[s], a = s !== o - 1 ? l.lastIndexOf(",") : l.length, u = l.substr(0, a), t[i] = isNaN(u) ? u.replace(mf, "").trim() : +u, i = l.substr(a + 1).trim();
  return t;
}, _f = function(e) {
  var t = e.indexOf("(") + 1, r = e.indexOf(")"), i = e.indexOf("(", t);
  return e.substring(t, ~i && i < r ? e.indexOf(")", r + 1) : r);
}, vf = function(e) {
  var t = (e + "").split("("), r = ae[t[0]];
  return r && t.length > 1 && r.config ? r.config.apply(null, ~e.indexOf("{") ? [gf(t[1])] : _f(e).split(",").map(Gl)) : ae._CE && pf.test(e) ? ae._CE("", e) : r;
}, au = function(e) {
  return function(t) {
    return 1 - e(1 - t);
  };
}, lu = function n(e, t) {
  for (var r = e._first, i; r; )
    r instanceof ft ? n(r, t) : r.vars.yoyoEase && (!r._yoyo || !r._repeat) && r._yoyo !== t && (r.timeline ? n(r.timeline, t) : (i = r._ease, r._ease = r._yEase, r._yEase = i, r._yoyo = t)), r = r._next;
}, ii = function(e, t) {
  return e && (Te(e) ? e : ae[e] || vf(e)) || t;
}, pi = function(e, t, r, i) {
  r === void 0 && (r = function(l) {
    return 1 - t(1 - l);
  }), i === void 0 && (i = function(l) {
    return l < 0.5 ? t(l * 2) / 2 : 1 - t((1 - l) * 2) / 2;
  });
  var s = {
    easeIn: t,
    easeOut: r,
    easeInOut: i
  }, o;
  return gt(e, function(a) {
    ae[a] = Lt[a] = s, ae[o = a.toLowerCase()] = r;
    for (var l in s)
      ae[o + (l === "easeIn" ? ".in" : l === "easeOut" ? ".out" : ".inOut")] = ae[a + "." + l] = s[l];
  }), s;
}, uu = function(e) {
  return function(t) {
    return t < 0.5 ? (1 - e(1 - t * 2)) / 2 : 0.5 + e((t - 0.5) * 2) / 2;
  };
}, Hs = function n(e, t, r) {
  var i = t >= 1 ? t : 1, s = (r || (e ? 0.3 : 0.45)) / (t < 1 ? t : 1), o = s / fo * (Math.asin(1 / i) || 0), a = function(c) {
    return c === 1 ? 1 : i * Math.pow(2, -10 * c) * Uc((c - o) * s) + 1;
  }, l = e === "out" ? a : e === "in" ? function(u) {
    return 1 - a(1 - u);
  } : uu(a);
  return s = fo / s, l.config = function(u, c) {
    return n(e, u, c);
  }, l;
}, Vs = function n(e, t) {
  t === void 0 && (t = 1.70158);
  var r = function(o) {
    return o ? --o * o * ((t + 1) * o + t) + 1 : 0;
  }, i = e === "out" ? r : e === "in" ? function(s) {
    return 1 - r(1 - s);
  } : uu(r);
  return i.config = function(s) {
    return n(e, s);
  }, i;
};
gt("Linear,Quad,Cubic,Quart,Quint,Strong", function(n, e) {
  var t = e < 5 ? e + 1 : e;
  pi(n + ",Power" + (t - 1), e ? function(r) {
    return Math.pow(r, t);
  } : function(r) {
    return r;
  }, function(r) {
    return 1 - Math.pow(1 - r, t);
  }, function(r) {
    return r < 0.5 ? Math.pow(r * 2, t) / 2 : 1 - Math.pow((1 - r) * 2, t) / 2;
  });
});
ae.Linear.easeNone = ae.none = ae.Linear.easeIn;
pi("Elastic", Hs("in"), Hs("out"), Hs());
(function(n, e) {
  var t = 1 / e, r = 2 * t, i = 2.5 * t, s = function(a) {
    return a < t ? n * a * a : a < r ? n * Math.pow(a - 1.5 / e, 2) + 0.75 : a < i ? n * (a -= 2.25 / e) * a + 0.9375 : n * Math.pow(a - 2.625 / e, 2) + 0.984375;
  };
  pi("Bounce", function(o) {
    return 1 - s(1 - o);
  }, s);
})(7.5625, 2.75);
pi("Expo", function(n) {
  return Math.pow(2, 10 * (n - 1)) * n + n * n * n * n * n * n * (1 - n);
});
pi("Circ", function(n) {
  return -(kl(1 - n * n) - 1);
});
pi("Sine", function(n) {
  return n === 1 ? 1 : -qc(n * Vc) + 1;
});
pi("Back", Vs("in"), Vs("out"), Vs());
ae.SteppedEase = ae.steps = Lt.SteppedEase = {
  config: function(e, t) {
    e === void 0 && (e = 1);
    var r = 1 / e, i = e + (t ? 0 : 1), s = t ? 1 : 0, o = 1 - it;
    return function(a) {
      return ((i * On(0, o, a) | 0) + s) * r;
    };
  }
};
Li.ease = ae["quad.out"];
gt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(n) {
  return Qo += n + "," + n + "Params,";
});
var cu = function(e, t) {
  this.id = Gc++, e._gsap = this, this.target = e, this.harness = t, this.get = t ? t.get : Hl, this.set = t ? t.getSetter : ia;
}, Sn = /* @__PURE__ */ function() {
  function n(t) {
    this.vars = t, this._delay = +t.delay || 0, (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) && (this._rDelay = t.repeatDelay || 0, this._yoyo = !!t.yoyo || !!t.yoyoEase), this._ts = 1, Ii(this, +t.duration, 1, 1), this.data = t.data, _e && (this._ctx = _e, _e.data.push(this)), bn || Ot.wake();
  }
  var e = n.prototype;
  return e.delay = function(r) {
    return r || r === 0 ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + r - this._delay), this._delay = r, this) : this._delay;
  }, e.duration = function(r) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? r + (r + this._rDelay) * this._repeat : r) : this.totalDuration() && this._dur;
  }, e.totalDuration = function(r) {
    return arguments.length ? (this._dirty = 0, Ii(this, this._repeat < 0 ? r : (r - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur;
  }, e.totalTime = function(r, i) {
    if (Fi(), !arguments.length)
      return this._tTime;
    var s = this._dp;
    if (s && s.smoothChildTiming && this._ts) {
      for (Ms(this, r), !s._dp || s.parent || Wl(s, this); s && s.parent; )
        s.parent._time !== s._start + (s._ts >= 0 ? s._tTime / s._ts : (s.totalDuration() - s._tTime) / -s._ts) && s.totalTime(s._tTime, !0), s = s.parent;
      !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && r < this._tDur || this._ts < 0 && r > 0 || !this._tDur && !r) && rr(this._dp, this, this._start - this._delay);
    }
    return (this._tTime !== r || !this._dur && !i || this._initted && Math.abs(this._zTime) === it || !r && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = r), Vl(this, r, i)), this;
  }, e.time = function(r, i) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), r + Ma(this)) % (this._dur + this._rDelay) || (r ? this._dur : 0), i) : this._time;
  }, e.totalProgress = function(r, i) {
    return arguments.length ? this.totalTime(this.totalDuration() * r, i) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() >= 0 && this._initted ? 1 : 0;
  }, e.progress = function(r, i) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - r : r) + Ma(this), i) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  }, e.iteration = function(r, i) {
    var s = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (r - 1) * s, i) : this._repeat ? zi(this._tTime, s) + 1 : 1;
  }, e.timeScale = function(r, i) {
    if (!arguments.length)
      return this._rts === -1e-8 ? 0 : this._rts;
    if (this._rts === r)
      return this;
    var s = this.parent && this._ts ? ps(this.parent._time, this) : this._tTime;
    return this._rts = +r || 0, this._ts = this._ps || r === -1e-8 ? 0 : this._rts, this.totalTime(On(-Math.abs(this._delay), this._tDur, s), i !== !1), Os(this), Qc(this);
  }, e.paused = function(r) {
    return arguments.length ? (this._ps !== r && (this._ps = r, r ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Fi(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== it && (this._tTime -= it)))), this) : this._ps;
  }, e.startTime = function(r) {
    if (arguments.length) {
      this._start = r;
      var i = this.parent || this._dp;
      return i && (i._sort || !this.parent) && rr(i, this, r - this._delay), this;
    }
    return this._start;
  }, e.endTime = function(r) {
    return this._start + (mt(r) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  }, e.rawTime = function(r) {
    var i = this.parent || this._dp;
    return i ? r && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? ps(i.rawTime(r), this) : this._tTime : this._tTime;
  }, e.revert = function(r) {
    r === void 0 && (r = Xc);
    var i = Xe;
    return Xe = r, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(r), this.totalTime(-0.01, r.suppressEvents)), this.data !== "nested" && r.kill !== !1 && this.kill(), Xe = i, this;
  }, e.globalTime = function(r) {
    for (var i = this, s = arguments.length ? r : i.rawTime(); i; )
      s = i._start + s / (Math.abs(i._ts) || 1), i = i._dp;
    return !this.parent && this._sat ? this._sat.globalTime(r) : s;
  }, e.repeat = function(r) {
    return arguments.length ? (this._repeat = r === 1 / 0 ? -2 : r, Aa(this)) : this._repeat === -2 ? 1 / 0 : this._repeat;
  }, e.repeatDelay = function(r) {
    if (arguments.length) {
      var i = this._time;
      return this._rDelay = r, Aa(this), i ? this.time(i) : this;
    }
    return this._rDelay;
  }, e.yoyo = function(r) {
    return arguments.length ? (this._yoyo = r, this) : this._yoyo;
  }, e.seek = function(r, i) {
    return this.totalTime(Ft(this, r), mt(i));
  }, e.restart = function(r, i) {
    return this.play().totalTime(r ? -this._delay : 0, mt(i)), this._dur || (this._zTime = -1e-8), this;
  }, e.play = function(r, i) {
    return r != null && this.seek(r, i), this.reversed(!1).paused(!1);
  }, e.reverse = function(r, i) {
    return r != null && this.seek(r || this.totalDuration(), i), this.reversed(!0).paused(!1);
  }, e.pause = function(r, i) {
    return r != null && this.seek(r, i), this.paused(!0);
  }, e.resume = function() {
    return this.paused(!1);
  }, e.reversed = function(r) {
    return arguments.length ? (!!r !== this.reversed() && this.timeScale(-this._rts || (r ? -1e-8 : 0)), this) : this._rts < 0;
  }, e.invalidate = function() {
    return this._initted = this._act = 0, this._zTime = -1e-8, this;
  }, e.isActive = function() {
    var r = this.parent || this._dp, i = this._start, s;
    return !!(!r || this._ts && this._initted && r.isActive() && (s = r.rawTime(!0)) >= i && s < this.endTime(!0) - it);
  }, e.eventCallback = function(r, i, s) {
    var o = this.vars;
    return arguments.length > 1 ? (i ? (o[r] = i, s && (o[r + "Params"] = s), r === "onUpdate" && (this._onUpdate = i)) : delete o[r], this) : o[r];
  }, e.then = function(r) {
    var i = this;
    return new Promise(function(s) {
      var o = Te(r) ? r : ql, a = function() {
        var u = i.then;
        i.then = null, Te(o) && (o = o(i)) && (o.then || o === i) && (i.then = u), s(o), i.then = u;
      };
      i._initted && i.totalProgress() === 1 && i._ts >= 0 || !i._tTime && i._ts < 0 ? a() : i._prom = a;
    });
  }, e.kill = function() {
    Qi(this);
  }, n;
}();
Dt(Sn.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: !1,
  parent: null,
  _initted: !1,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -1e-8,
  _prom: 0,
  _ps: !1,
  _rts: 1
});
var ft = /* @__PURE__ */ function(n) {
  Rl(e, n);
  function e(r, i) {
    var s;
    return r === void 0 && (r = {}), s = n.call(this, r) || this, s.labels = {}, s.smoothChildTiming = !!r.smoothChildTiming, s.autoRemoveChildren = !!r.autoRemoveChildren, s._sort = mt(r.sortChildren), we && rr(r.parent || we, _r(s), i), r.reversed && s.reverse(), r.paused && s.paused(!0), r.scrollTrigger && Yl(_r(s), r.scrollTrigger), s;
  }
  var t = e.prototype;
  return t.to = function(i, s, o) {
    return an(0, arguments, this), this;
  }, t.from = function(i, s, o) {
    return an(1, arguments, this), this;
  }, t.fromTo = function(i, s, o, a) {
    return an(2, arguments, this), this;
  }, t.set = function(i, s, o) {
    return s.duration = 0, s.parent = this, on(s).repeatDelay || (s.repeat = 0), s.immediateRender = !!s.immediateRender, new Le(i, s, Ft(this, o), 1), this;
  }, t.call = function(i, s, o) {
    return rr(this, Le.delayedCall(0, i, s), o);
  }, t.staggerTo = function(i, s, o, a, l, u, c) {
    return o.duration = s, o.stagger = o.stagger || a, o.onComplete = u, o.onCompleteParams = c, o.parent = this, new Le(i, o, Ft(this, l)), this;
  }, t.staggerFrom = function(i, s, o, a, l, u, c) {
    return o.runBackwards = 1, on(o).immediateRender = mt(o.immediateRender), this.staggerTo(i, s, o, a, l, u, c);
  }, t.staggerFromTo = function(i, s, o, a, l, u, c, f) {
    return a.startAt = o, on(a).immediateRender = mt(a.immediateRender), this.staggerTo(i, s, a, l, u, c, f);
  }, t.render = function(i, s, o) {
    var a = this._time, l = this._dirty ? this.totalDuration() : this._tDur, u = this._dur, c = i <= 0 ? 0 : De(i), f = this._zTime < 0 != i < 0 && (this._initted || !u), h, d, _, p, g, m, v, y, w, b, S, T;
    if (this !== we && c > l && i >= 0 && (c = l), c !== this._tTime || o || f) {
      if (a !== this._time && u && (c += this._time - a, i += this._time - a), h = c, w = this._start, y = this._ts, m = !y, f && (u || (a = this._zTime), (i || !s) && (this._zTime = i)), this._repeat) {
        if (S = this._yoyo, g = u + this._rDelay, this._repeat < -1 && i < 0)
          return this.totalTime(g * 100 + i, s, o);
        if (h = De(c % g), c === l ? (p = this._repeat, h = u) : (b = De(c / g), p = ~~b, p && p === b && (h = u, p--), h > u && (h = u)), b = zi(this._tTime, g), !a && this._tTime && b !== p && this._tTime - b * g - this._dur <= 0 && (b = p), S && p & 1 && (h = u - h, T = 1), p !== b && !this._lock) {
          var O = S && b & 1, E = O === (S && p & 1);
          if (p < b && (O = !O), a = O ? 0 : c % u ? u : c, this._lock = 1, this.render(a || (T ? 0 : De(p * g)), s, !u)._lock = 0, this._tTime = c, !s && this.parent && At(this, "onRepeat"), this.vars.repeatRefresh && !T && (this.invalidate()._lock = 1), a && a !== this._time || m !== !this._ts || this.vars.onRepeat && !this.parent && !this._act)
            return this;
          if (u = this._dur, l = this._tDur, E && (this._lock = 2, a = O ? u : -1e-4, this.render(a, !0), this.vars.repeatRefresh && !T && this.invalidate()), this._lock = 0, !this._ts && !m)
            return this;
          lu(this, T);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2 && (v = rf(this, De(a), De(h)), v && (c -= h - (h = v._start))), this._tTime = c, this._time = h, this._act = !y, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = i, a = 0), !a && h && !s && !p && (At(this, "onStart"), this._tTime !== c))
        return this;
      if (h >= a && i >= 0)
        for (d = this._first; d; ) {
          if (_ = d._next, (d._act || h >= d._start) && d._ts && v !== d) {
            if (d.parent !== this)
              return this.render(i, s, o);
            if (d.render(d._ts > 0 ? (h - d._start) * d._ts : (d._dirty ? d.totalDuration() : d._tDur) + (h - d._start) * d._ts, s, o), h !== this._time || !this._ts && !m) {
              v = 0, _ && (c += this._zTime = -1e-8);
              break;
            }
          }
          d = _;
        }
      else {
        d = this._last;
        for (var P = i < 0 ? i : h; d; ) {
          if (_ = d._prev, (d._act || P <= d._end) && d._ts && v !== d) {
            if (d.parent !== this)
              return this.render(i, s, o);
            if (d.render(d._ts > 0 ? (P - d._start) * d._ts : (d._dirty ? d.totalDuration() : d._tDur) + (P - d._start) * d._ts, s, o || Xe && (d._initted || d._startAt)), h !== this._time || !this._ts && !m) {
              v = 0, _ && (c += this._zTime = P ? -1e-8 : it);
              break;
            }
          }
          d = _;
        }
      }
      if (v && !s && (this.pause(), v.render(h >= a ? 0 : -1e-8)._zTime = h >= a ? 1 : -1, this._ts))
        return this._start = w, Os(this), this.render(i, s, o);
      this._onUpdate && !s && At(this, "onUpdate", !0), (c === l && this._tTime >= this.totalDuration() || !c && a) && (w === this._start || Math.abs(y) !== Math.abs(this._ts)) && (this._lock || ((i || !u) && (c === l && this._ts > 0 || !c && this._ts < 0) && Nr(this, 1), !s && !(i < 0 && !a) && (c || a || !l) && (At(this, c === l && i >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(c < l && this.timeScale() > 0) && this._prom())));
    }
    return this;
  }, t.add = function(i, s) {
    var o = this;
    if (Sr(s) || (s = Ft(this, s, i)), !(i instanceof Sn)) {
      if (nt(i))
        return i.forEach(function(a) {
          return o.add(a, s);
        }), this;
      if (qe(i))
        return this.addLabel(i, s);
      if (Te(i))
        i = Le.delayedCall(0, i);
      else
        return this;
    }
    return this !== i ? rr(this, i, s) : this;
  }, t.getChildren = function(i, s, o, a) {
    i === void 0 && (i = !0), s === void 0 && (s = !0), o === void 0 && (o = !0), a === void 0 && (a = -1e8);
    for (var l = [], u = this._first; u; )
      u._start >= a && (u instanceof Le ? s && l.push(u) : (o && l.push(u), i && l.push.apply(l, u.getChildren(!0, s, o)))), u = u._next;
    return l;
  }, t.getById = function(i) {
    for (var s = this.getChildren(1, 1, 1), o = s.length; o--; )
      if (s[o].vars.id === i)
        return s[o];
  }, t.remove = function(i) {
    return qe(i) ? this.removeLabel(i) : Te(i) ? this.killTweensOf(i) : (i.parent === this && Ps(this, i), i === this._recent && (this._recent = this._last), ri(this));
  }, t.totalTime = function(i, s) {
    return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = De(Ot.time - (this._ts > 0 ? i / this._ts : (this.totalDuration() - i) / -this._ts))), n.prototype.totalTime.call(this, i, s), this._forcing = 0, this) : this._tTime;
  }, t.addLabel = function(i, s) {
    return this.labels[i] = Ft(this, s), this;
  }, t.removeLabel = function(i) {
    return delete this.labels[i], this;
  }, t.addPause = function(i, s, o) {
    var a = Le.delayedCall(0, s || yn, o);
    return a.data = "isPause", this._hasPause = 1, rr(this, a, Ft(this, i));
  }, t.removePause = function(i) {
    var s = this._first;
    for (i = Ft(this, i); s; )
      s._start === i && s.data === "isPause" && Nr(s), s = s._next;
  }, t.killTweensOf = function(i, s, o) {
    for (var a = this.getTweensOf(i, o), l = a.length; l--; )
      Mr !== a[l] && a[l].kill(i, s);
    return this;
  }, t.getTweensOf = function(i, s) {
    for (var o = [], a = Ht(i), l = this._first, u = Sr(s), c; l; )
      l instanceof Le ? jc(l._targets, a) && (u ? (!Mr || l._initted && l._ts) && l.globalTime(0) <= s && l.globalTime(l.totalDuration()) > s : !s || l.isActive()) && o.push(l) : (c = l.getTweensOf(a, s)).length && o.push.apply(o, c), l = l._next;
    return o;
  }, t.tweenTo = function(i, s) {
    s = s || {};
    var o = this, a = Ft(o, i), l = s, u = l.startAt, c = l.onStart, f = l.onStartParams, h = l.immediateRender, d, _ = Le.to(o, Dt({
      ease: s.ease || "none",
      lazy: !1,
      immediateRender: !1,
      time: a,
      overwrite: "auto",
      duration: s.duration || Math.abs((a - (u && "time" in u ? u.time : o._time)) / o.timeScale()) || it,
      onStart: function() {
        if (o.pause(), !d) {
          var g = s.duration || Math.abs((a - (u && "time" in u ? u.time : o._time)) / o.timeScale());
          _._dur !== g && Ii(_, g, 0, 1).render(_._time, !0, !0), d = 1;
        }
        c && c.apply(_, f || []);
      }
    }, s));
    return h ? _.render(0) : _;
  }, t.tweenFromTo = function(i, s, o) {
    return this.tweenTo(s, Dt({
      startAt: {
        time: Ft(this, i)
      }
    }, o));
  }, t.recent = function() {
    return this._recent;
  }, t.nextLabel = function(i) {
    return i === void 0 && (i = this._time), Ra(this, Ft(this, i));
  }, t.previousLabel = function(i) {
    return i === void 0 && (i = this._time), Ra(this, Ft(this, i), 1);
  }, t.currentLabel = function(i) {
    return arguments.length ? this.seek(i, !0) : this.previousLabel(this._time + it);
  }, t.shiftChildren = function(i, s, o) {
    o === void 0 && (o = 0);
    for (var a = this._first, l = this.labels, u; a; )
      a._start >= o && (a._start += i, a._end += i), a = a._next;
    if (s)
      for (u in l)
        l[u] >= o && (l[u] += i);
    return ri(this);
  }, t.invalidate = function(i) {
    var s = this._first;
    for (this._lock = 0; s; )
      s.invalidate(i), s = s._next;
    return n.prototype.invalidate.call(this, i);
  }, t.clear = function(i) {
    i === void 0 && (i = !0);
    for (var s = this._first, o; s; )
      o = s._next, this.remove(s), s = o;
    return this._dp && (this._time = this._tTime = this._pTime = 0), i && (this.labels = {}), ri(this);
  }, t.totalDuration = function(i) {
    var s = 0, o = this, a = o._last, l = or, u, c, f;
    if (arguments.length)
      return o.timeScale((o._repeat < 0 ? o.duration() : o.totalDuration()) / (o.reversed() ? -i : i));
    if (o._dirty) {
      for (f = o.parent; a; )
        u = a._prev, a._dirty && a.totalDuration(), c = a._start, c > l && o._sort && a._ts && !o._lock ? (o._lock = 1, rr(o, a, c - a._delay, 1)._lock = 0) : l = c, c < 0 && a._ts && (s -= c, (!f && !o._dp || f && f.smoothChildTiming) && (o._start += c / o._ts, o._time -= c, o._tTime -= c), o.shiftChildren(-c, !1, -1 / 0), l = 0), a._end > s && a._ts && (s = a._end), a = u;
      Ii(o, o === we && o._time > s ? o._time : s, 1, 1), o._dirty = 0;
    }
    return o._tDur;
  }, e.updateRoot = function(i) {
    if (we._ts && (Vl(we, ps(i, we)), $l = Ot.frame), Ot.frame >= Pa) {
      Pa += Rt.autoSleep || 120;
      var s = we._first;
      if ((!s || !s._ts) && Rt.autoSleep && Ot._listeners.length < 2) {
        for (; s && !s._ts; )
          s = s._next;
        s || Ot.sleep();
      }
    }
  }, e;
}(Sn);
Dt(ft.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var yf = function(e, t, r, i, s, o, a) {
  var l = new _t(this._pt, e, t, 0, 1, gu, null, s), u = 0, c = 0, f, h, d, _, p, g, m, v;
  for (l.b = r, l.e = i, r += "", i += "", (m = ~i.indexOf("random(")) && (i = wn(i)), o && (v = [r, i], o(v, e, t), r = v[0], i = v[1]), h = r.match(Ns) || []; f = Ns.exec(i); )
    _ = f[0], p = i.substring(u, f.index), d ? d = (d + 1) % 5 : p.substr(-5) === "rgba(" && (d = 1), _ !== h[c++] && (g = parseFloat(h[c - 1]) || 0, l._pt = {
      _next: l._pt,
      p: p || c === 1 ? p : ",",
      //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
      s: g,
      c: _.charAt(1) === "=" ? Pi(g, _) - g : parseFloat(_) - g,
      m: d && d < 4 ? Math.round : 0
    }, u = Ns.lastIndex);
  return l.c = u < i.length ? i.substring(u, i.length) : "", l.fp = a, (zl.test(i) || m) && (l.e = 0), this._pt = l, l;
}, ea = function(e, t, r, i, s, o, a, l, u, c) {
  Te(i) && (i = i(s || 0, e, o));
  var f = e[t], h = r !== "get" ? r : Te(f) ? u ? e[t.indexOf("set") || !Te(e["get" + t.substr(3)]) ? t : "get" + t.substr(3)](u) : e[t]() : f, d = Te(f) ? u ? Tf : pu : ra, _;
  if (qe(i) && (~i.indexOf("random(") && (i = wn(i)), i.charAt(1) === "=" && (_ = Pi(h, i) + (et(h) || 0), (_ || _ === 0) && (i = _))), !c || h !== i || bo)
    return !isNaN(h * i) && i !== "" ? (_ = new _t(this._pt, e, t, +h || 0, i - (h || 0), typeof f == "boolean" ? Cf : mu, 0, d), u && (_.fp = u), a && _.modifier(a, this, e), this._pt = _) : (!f && !(t in e) && Ko(t, i), yf.call(this, e, t, h, i, d, l || Rt.stringFilter, u));
}, wf = function(e, t, r, i, s) {
  if (Te(e) && (e = ln(e, s, t, r, i)), !ur(e) || e.style && e.nodeType || nt(e) || Ll(e))
    return qe(e) ? ln(e, s, t, r, i) : e;
  var o = {}, a;
  for (a in e)
    o[a] = ln(e[a], s, t, r, i);
  return o;
}, fu = function(e, t, r, i, s, o) {
  var a, l, u, c;
  if (Et[e] && (a = new Et[e]()).init(s, a.rawVars ? t[e] : wf(t[e], i, s, o, r), r, i, o) !== !1 && (r._pt = l = new _t(r._pt, s, e, 0, 1, a.render, a, 0, a.priority), r !== Ei))
    for (u = r._ptLookup[r._targets.indexOf(s)], c = a._props.length; c--; )
      u[a._props[c]] = l;
  return a;
}, Mr, bo, ta = function n(e, t, r) {
  var i = e.vars, s = i.ease, o = i.startAt, a = i.immediateRender, l = i.lazy, u = i.onUpdate, c = i.runBackwards, f = i.yoyoEase, h = i.keyframes, d = i.autoRevert, _ = e._dur, p = e._startAt, g = e._targets, m = e.parent, v = m && m.data === "nested" ? m.vars.targets : g, y = e._overwrite === "auto" && !Wo, w = e.timeline, b, S, T, O, E, P, R, C, L, z, H, W, B;
  if (w && (!h || !s) && (s = "none"), e._ease = ii(s, Li.ease), e._yEase = f ? au(ii(f === !0 ? s : f, Li.ease)) : 0, f && e._yoyo && !e._repeat && (f = e._yEase, e._yEase = e._ease, e._ease = f), e._from = !w && !!i.runBackwards, !w || h && !i.stagger) {
    if (C = g[0] ? ti(g[0]).harness : 0, W = C && i[C.prop], b = hs(i, Jo), p && (p._zTime < 0 && p.progress(1), t < 0 && c && a && !d ? p.render(-1, !0) : p.revert(c && _ ? Jn : Yc), p._lazy = 0), o) {
      if (Nr(e._startAt = Le.set(g, Dt({
        data: "isStart",
        overwrite: !1,
        parent: m,
        immediateRender: !0,
        lazy: !p && mt(l),
        startAt: null,
        delay: 0,
        onUpdate: u && function() {
          return At(e, "onUpdate");
        },
        stagger: 0
      }, o))), e._startAt._dp = 0, e._startAt._sat = e, t < 0 && (Xe || !a && !d) && e._startAt.revert(Jn), a && _ && t <= 0 && r <= 0) {
        t && (e._zTime = t);
        return;
      }
    } else if (c && _ && !p) {
      if (t && (a = !1), T = Dt({
        overwrite: !1,
        data: "isFromStart",
        //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
        lazy: a && !p && mt(l),
        immediateRender: a,
        //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
        stagger: 0,
        parent: m
        //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
      }, b), W && (T[C.prop] = W), Nr(e._startAt = Le.set(g, T)), e._startAt._dp = 0, e._startAt._sat = e, t < 0 && (Xe ? e._startAt.revert(Jn) : e._startAt.render(-1, !0)), e._zTime = t, !a)
        n(e._startAt, it, it);
      else if (!t)
        return;
    }
    for (e._pt = e._ptCache = 0, l = _ && mt(l) || l && !_, S = 0; S < g.length; S++) {
      if (E = g[S], R = E._gsap || Zo(g)[S]._gsap, e._ptLookup[S] = z = {}, mo[R.id] && zr.length && ds(), H = v === g ? S : v.indexOf(E), C && (L = new C()).init(E, W || b, e, H, v) !== !1 && (e._pt = O = new _t(e._pt, E, L.name, 0, 1, L.render, L, 0, L.priority), L._props.forEach(function(U) {
        z[U] = O;
      }), L.priority && (P = 1)), !C || W)
        for (T in b)
          Et[T] && (L = fu(T, b, e, H, E, v)) ? L.priority && (P = 1) : z[T] = O = ea.call(e, E, T, "get", b[T], H, v, 0, i.stringFilter);
      e._op && e._op[S] && e.kill(E, e._op[S]), y && e._pt && (Mr = e, we.killTweensOf(E, z, e.globalTime(t)), B = !e.parent, Mr = 0), e._pt && l && (mo[R.id] = 1);
    }
    P && _u(e), e._onInit && e._onInit(e);
  }
  e._onUpdate = u, e._initted = (!e._op || e._pt) && !B, h && t <= 0 && w.render(or, !0, !0);
}, bf = function(e, t, r, i, s, o, a, l) {
  var u = (e._pt && e._ptCache || (e._ptCache = {}))[t], c, f, h, d;
  if (!u)
    for (u = e._ptCache[t] = [], h = e._ptLookup, d = e._targets.length; d--; ) {
      if (c = h[d][t], c && c.d && c.d._pt)
        for (c = c.d._pt; c && c.p !== t && c.fp !== t; )
          c = c._next;
      if (!c)
        return bo = 1, e.vars[t] = "+=0", ta(e, a), bo = 0, l ? vn(t + " not eligible for reset") : 1;
      u.push(c);
    }
  for (d = u.length; d--; )
    f = u[d], c = f._pt || f, c.s = (i || i === 0) && !s ? i : c.s + (i || 0) + o * c.c, c.c = r - c.s, f.e && (f.e = Me(r) + et(f.e)), f.b && (f.b = c.s + et(f.b));
}, Sf = function(e, t) {
  var r = e[0] ? ti(e[0]).harness : 0, i = r && r.aliases, s, o, a, l;
  if (!i)
    return t;
  s = Di({}, t);
  for (o in i)
    if (o in s)
      for (l = i[o].split(","), a = l.length; a--; )
        s[l[a]] = s[o];
  return s;
}, xf = function(e, t, r, i) {
  var s = t.ease || i || "power1.inOut", o, a;
  if (nt(t))
    a = r[e] || (r[e] = []), t.forEach(function(l, u) {
      return a.push({
        t: u / (t.length - 1) * 100,
        v: l,
        e: s
      });
    });
  else
    for (o in t)
      a = r[o] || (r[o] = []), o === "ease" || a.push({
        t: parseFloat(e),
        v: t[o],
        e: s
      });
}, ln = function(e, t, r, i, s) {
  return Te(e) ? e.call(t, r, i, s) : qe(e) && ~e.indexOf("random(") ? wn(e) : e;
}, du = Qo + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", hu = {};
gt(du + ",id,stagger,delay,duration,paused,scrollTrigger", function(n) {
  return hu[n] = 1;
});
var Le = /* @__PURE__ */ function(n) {
  Rl(e, n);
  function e(r, i, s, o) {
    var a;
    typeof i == "number" && (s.duration = i, i = s, s = null), a = n.call(this, o ? i : on(i)) || this;
    var l = a.vars, u = l.duration, c = l.delay, f = l.immediateRender, h = l.stagger, d = l.overwrite, _ = l.keyframes, p = l.defaults, g = l.scrollTrigger, m = l.yoyoEase, v = i.parent || we, y = (nt(r) || Ll(r) ? Sr(r[0]) : "length" in i) ? [r] : Ht(r), w, b, S, T, O, E, P, R;
    if (a._targets = y.length ? Zo(y) : vn("GSAP target " + r + " not found. https://gsap.com", !Rt.nullTargetWarn) || [], a._ptLookup = [], a._overwrite = d, _ || h || In(u) || In(c)) {
      if (i = a.vars, w = a.timeline = new ft({
        data: "nested",
        defaults: p || {},
        targets: v && v.data === "nested" ? v.vars.targets : y
      }), w.kill(), w.parent = w._dp = _r(a), w._start = 0, h || In(u) || In(c)) {
        if (T = y.length, P = h && Jl(h), ur(h))
          for (O in h)
            ~du.indexOf(O) && (R || (R = {}), R[O] = h[O]);
        for (b = 0; b < T; b++)
          S = hs(i, hu), S.stagger = 0, m && (S.yoyoEase = m), R && Di(S, R), E = y[b], S.duration = +ln(u, _r(a), b, E, y), S.delay = (+ln(c, _r(a), b, E, y) || 0) - a._delay, !h && T === 1 && S.delay && (a._delay = c = S.delay, a._start += c, S.delay = 0), w.to(E, S, P ? P(b, E, y) : 0), w._ease = ae.none;
        w.duration() ? u = c = 0 : a.timeline = 0;
      } else if (_) {
        on(Dt(w.vars.defaults, {
          ease: "none"
        })), w._ease = ii(_.ease || i.ease || "none");
        var C = 0, L, z, H;
        if (nt(_))
          _.forEach(function(W) {
            return w.to(y, W, ">");
          }), w.duration();
        else {
          S = {};
          for (O in _)
            O === "ease" || O === "easeEach" || xf(O, _[O], S, _.easeEach);
          for (O in S)
            for (L = S[O].sort(function(W, B) {
              return W.t - B.t;
            }), C = 0, b = 0; b < L.length; b++)
              z = L[b], H = {
                ease: z.e,
                duration: (z.t - (b ? L[b - 1].t : 0)) / 100 * u
              }, H[O] = z.v, w.to(y, H, C), C += H.duration;
          w.duration() < u && w.to({}, {
            duration: u - w.duration()
          });
        }
      }
      u || a.duration(u = w.duration());
    } else
      a.timeline = 0;
    return d === !0 && !Wo && (Mr = _r(a), we.killTweensOf(y), Mr = 0), rr(v, _r(a), s), i.reversed && a.reverse(), i.paused && a.paused(!0), (f || !u && !_ && a._start === De(v._time) && mt(f) && Zc(_r(a)) && v.data !== "nested") && (a._tTime = -1e-8, a.render(Math.max(0, -c) || 0)), g && Yl(_r(a), g), a;
  }
  var t = e.prototype;
  return t.render = function(i, s, o) {
    var a = this._time, l = this._tDur, u = this._dur, c = i < 0, f = i > l - it && !c ? l : i < it ? 0 : i, h, d, _, p, g, m, v, y, w;
    if (!u)
      tf(this, i, s, o);
    else if (f !== this._tTime || !i || o || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== c || this._lazy) {
      if (h = f, y = this.timeline, this._repeat) {
        if (p = u + this._rDelay, this._repeat < -1 && c)
          return this.totalTime(p * 100 + i, s, o);
        if (h = De(f % p), f === l ? (_ = this._repeat, h = u) : (g = De(f / p), _ = ~~g, _ && _ === g ? (h = u, _--) : h > u && (h = u)), m = this._yoyo && _ & 1, m && (w = this._yEase, h = u - h), g = zi(this._tTime, p), h === a && !o && this._initted && _ === g)
          return this._tTime = f, this;
        _ !== g && (y && this._yEase && lu(y, m), this.vars.repeatRefresh && !m && !this._lock && h !== p && this._initted && (this._lock = o = 1, this.render(De(p * _), !0).invalidate()._lock = 0));
      }
      if (!this._initted) {
        if (Xl(this, c ? i : h, o, s, f))
          return this._tTime = 0, this;
        if (a !== this._time && !(o && this.vars.repeatRefresh && _ !== g))
          return this;
        if (u !== this._dur)
          return this.render(i, s, o);
      }
      if (this._tTime = f, this._time = h, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = v = (w || this._ease)(h / u), this._from && (this.ratio = v = 1 - v), h && !a && !s && !_ && (At(this, "onStart"), this._tTime !== f))
        return this;
      for (d = this._pt; d; )
        d.r(v, d.d), d = d._next;
      y && y.render(i < 0 ? i : y._dur * y._ease(h / this._dur), s, o) || this._startAt && (this._zTime = i), this._onUpdate && !s && (c && go(this, i, s, o), At(this, "onUpdate")), this._repeat && _ !== g && this.vars.onRepeat && !s && this.parent && At(this, "onRepeat"), (f === this._tDur || !f) && this._tTime === f && (c && !this._onUpdate && go(this, i, !0, !0), (i || !u) && (f === this._tDur && this._ts > 0 || !f && this._ts < 0) && Nr(this, 1), !s && !(c && !a) && (f || a || m) && (At(this, f === l ? "onComplete" : "onReverseComplete", !0), this._prom && !(f < l && this.timeScale() > 0) && this._prom()));
    }
    return this;
  }, t.targets = function() {
    return this._targets;
  }, t.invalidate = function(i) {
    return (!i || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(i), n.prototype.invalidate.call(this, i);
  }, t.resetTo = function(i, s, o, a, l) {
    bn || Ot.wake(), this._ts || this.play();
    var u = Math.min(this._dur, (this._dp._time - this._start) * this._ts), c;
    return this._initted || ta(this, u), c = this._ease(u / this._dur), bf(this, i, s, o, a, c, u, l) ? this.resetTo(i, s, o, a, 1) : (Ms(this, 0), this.parent || Ul(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0));
  }, t.kill = function(i, s) {
    if (s === void 0 && (s = "all"), !i && (!s || s === "all"))
      return this._lazy = this._pt = 0, this.parent ? Qi(this) : this.scrollTrigger && this.scrollTrigger.kill(!!Xe), this;
    if (this.timeline) {
      var o = this.timeline.totalDuration();
      return this.timeline.killTweensOf(i, s, Mr && Mr.vars.overwrite !== !0)._first || Qi(this), this.parent && o !== this.timeline.totalDuration() && Ii(this, this._dur * this.timeline._tDur / o, 0, 1), this;
    }
    var a = this._targets, l = i ? Ht(i) : a, u = this._ptLookup, c = this._pt, f, h, d, _, p, g, m;
    if ((!s || s === "all") && Jc(a, l))
      return s === "all" && (this._pt = 0), Qi(this);
    for (f = this._op = this._op || [], s !== "all" && (qe(s) && (p = {}, gt(s, function(v) {
      return p[v] = 1;
    }), s = p), s = Sf(a, s)), m = a.length; m--; )
      if (~l.indexOf(a[m])) {
        h = u[m], s === "all" ? (f[m] = s, _ = h, d = {}) : (d = f[m] = f[m] || {}, _ = s);
        for (p in _)
          g = h && h[p], g && ((!("kill" in g.d) || g.d.kill(p) === !0) && Ps(this, g, "_pt"), delete h[p]), d !== "all" && (d[p] = 1);
      }
    return this._initted && !this._pt && c && Qi(this), this;
  }, e.to = function(i, s) {
    return new e(i, s, arguments[2]);
  }, e.from = function(i, s) {
    return an(1, arguments);
  }, e.delayedCall = function(i, s, o, a) {
    return new e(s, 0, {
      immediateRender: !1,
      lazy: !1,
      overwrite: !1,
      delay: i,
      onComplete: s,
      onReverseComplete: s,
      onCompleteParams: o,
      onReverseCompleteParams: o,
      callbackScope: a
    });
  }, e.fromTo = function(i, s, o) {
    return an(2, arguments);
  }, e.set = function(i, s) {
    return s.duration = 0, s.repeatDelay || (s.repeat = 0), new e(i, s);
  }, e.killTweensOf = function(i, s, o) {
    return we.killTweensOf(i, s, o);
  }, e;
}(Sn);
Dt(Le.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
gt("staggerTo,staggerFrom,staggerFromTo", function(n) {
  Le[n] = function() {
    var e = new ft(), t = vo.call(arguments, 0);
    return t.splice(n === "staggerFromTo" ? 5 : 4, 0, 0), e[n].apply(e, t);
  };
});
var ra = function(e, t, r) {
  return e[t] = r;
}, pu = function(e, t, r) {
  return e[t](r);
}, Tf = function(e, t, r, i) {
  return e[t](i.fp, r);
}, Ef = function(e, t, r) {
  return e.setAttribute(t, r);
}, ia = function(e, t) {
  return Te(e[t]) ? pu : Yo(e[t]) && e.setAttribute ? Ef : ra;
}, mu = function(e, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e6) / 1e6, t);
}, Cf = function(e, t) {
  return t.set(t.t, t.p, !!(t.s + t.c * e), t);
}, gu = function(e, t) {
  var r = t._pt, i = "";
  if (!e && t.b)
    i = t.b;
  else if (e === 1 && t.e)
    i = t.e;
  else {
    for (; r; )
      i = r.p + (r.m ? r.m(r.s + r.c * e) : Math.round((r.s + r.c * e) * 1e4) / 1e4) + i, r = r._next;
    i += t.c;
  }
  t.set(t.t, t.p, i, t);
}, na = function(e, t) {
  for (var r = t._pt; r; )
    r.r(e, r.d), r = r._next;
}, Pf = function(e, t, r, i) {
  for (var s = this._pt, o; s; )
    o = s._next, s.p === i && s.modifier(e, t, r), s = o;
}, Of = function(e) {
  for (var t = this._pt, r, i; t; )
    i = t._next, t.p === e && !t.op || t.op === e ? Ps(this, t, "_pt") : t.dep || (r = 1), t = i;
  return !r;
}, Mf = function(e, t, r, i) {
  i.mSet(e, t, i.m.call(i.tween, r, i.mt), i);
}, _u = function(e) {
  for (var t = e._pt, r, i, s, o; t; ) {
    for (r = t._next, i = s; i && i.pr > t.pr; )
      i = i._next;
    (t._prev = i ? i._prev : o) ? t._prev._next = t : s = t, (t._next = i) ? i._prev = t : o = t, t = r;
  }
  e._pt = s;
}, _t = /* @__PURE__ */ function() {
  function n(t, r, i, s, o, a, l, u, c) {
    this.t = r, this.s = s, this.c = o, this.p = i, this.r = a || mu, this.d = l || this, this.set = u || ra, this.pr = c || 0, this._next = t, t && (t._prev = this);
  }
  var e = n.prototype;
  return e.modifier = function(r, i, s) {
    this.mSet = this.mSet || this.set, this.set = Mf, this.m = r, this.mt = s, this.tween = i;
  }, n;
}();
gt(Qo + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(n) {
  return Jo[n] = 1;
});
Lt.TweenMax = Lt.TweenLite = Le;
Lt.TimelineLite = Lt.TimelineMax = ft;
we = new ft({
  sortChildren: !1,
  defaults: Li,
  autoRemoveChildren: !0,
  id: "root",
  smoothChildTiming: !0
});
Rt.stringFilter = ou;
var ni = [], Zn = {}, Af = [], La = 0, Rf = 0, Gs = function(e) {
  return (Zn[e] || Af).map(function(t) {
    return t();
  });
}, So = function() {
  var e = Date.now(), t = [];
  e - La > 2 && (Gs("matchMediaInit"), ni.forEach(function(r) {
    var i = r.queries, s = r.conditions, o, a, l, u;
    for (a in i)
      o = er.matchMedia(i[a]).matches, o && (l = 1), o !== s[a] && (s[a] = o, u = 1);
    u && (r.revert(), l && t.push(r));
  }), Gs("matchMediaRevert"), t.forEach(function(r) {
    return r.onMatch(r, function(i) {
      return r.add(null, i);
    });
  }), La = e, Gs("matchMedia"));
}, vu = /* @__PURE__ */ function() {
  function n(t, r) {
    this.selector = r && yo(r), this.data = [], this._r = [], this.isReverted = !1, this.id = Rf++, t && this.add(t);
  }
  var e = n.prototype;
  return e.add = function(r, i, s) {
    Te(r) && (s = i, i = r, r = Te);
    var o = this, a = function() {
      var u = _e, c = o.selector, f;
      return u && u !== o && u.data.push(o), s && (o.selector = yo(s)), _e = o, f = i.apply(o, arguments), Te(f) && o._r.push(f), _e = u, o.selector = c, o.isReverted = !1, f;
    };
    return o.last = a, r === Te ? a(o, function(l) {
      return o.add(null, l);
    }) : r ? o[r] = a : a;
  }, e.ignore = function(r) {
    var i = _e;
    _e = null, r(this), _e = i;
  }, e.getTweens = function() {
    var r = [];
    return this.data.forEach(function(i) {
      return i instanceof n ? r.push.apply(r, i.getTweens()) : i instanceof Le && !(i.parent && i.parent.data === "nested") && r.push(i);
    }), r;
  }, e.clear = function() {
    this._r.length = this.data.length = 0;
  }, e.kill = function(r, i) {
    var s = this;
    if (r ? function() {
      for (var a = s.getTweens(), l = s.data.length, u; l--; )
        u = s.data[l], u.data === "isFlip" && (u.revert(), u.getChildren(!0, !0, !1).forEach(function(c) {
          return a.splice(a.indexOf(c), 1);
        }));
      for (a.map(function(c) {
        return {
          g: c._dur || c._delay || c._sat && !c._sat.vars.immediateRender ? c.globalTime(0) : -1 / 0,
          t: c
        };
      }).sort(function(c, f) {
        return f.g - c.g || -1 / 0;
      }).forEach(function(c) {
        return c.t.revert(r);
      }), l = s.data.length; l--; )
        u = s.data[l], u instanceof ft ? u.data !== "nested" && (u.scrollTrigger && u.scrollTrigger.revert(), u.kill()) : !(u instanceof Le) && u.revert && u.revert(r);
      s._r.forEach(function(c) {
        return c(r, s);
      }), s.isReverted = !0;
    }() : this.data.forEach(function(a) {
      return a.kill && a.kill();
    }), this.clear(), i)
      for (var o = ni.length; o--; )
        ni[o].id === this.id && ni.splice(o, 1);
  }, e.revert = function(r) {
    this.kill(r || {});
  }, n;
}(), kf = /* @__PURE__ */ function() {
  function n(t) {
    this.contexts = [], this.scope = t, _e && _e.data.push(this);
  }
  var e = n.prototype;
  return e.add = function(r, i, s) {
    ur(r) || (r = {
      matches: r
    });
    var o = new vu(0, s || this.scope), a = o.conditions = {}, l, u, c;
    _e && !o.selector && (o.selector = _e.selector), this.contexts.push(o), i = o.add("onMatch", i), o.queries = r;
    for (u in r)
      u === "all" ? c = 1 : (l = er.matchMedia(r[u]), l && (ni.indexOf(o) < 0 && ni.push(o), (a[u] = l.matches) && (c = 1), l.addListener ? l.addListener(So) : l.addEventListener("change", So)));
    return c && i(o, function(f) {
      return o.add(null, f);
    }), this;
  }, e.revert = function(r) {
    this.kill(r || {});
  }, e.kill = function(r) {
    this.contexts.forEach(function(i) {
      return i.kill(r, !0);
    });
  }, n;
}(), ms = {
  registerPlugin: function() {
    for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++)
      t[r] = arguments[r];
    t.forEach(function(i) {
      return iu(i);
    });
  },
  timeline: function(e) {
    return new ft(e);
  },
  getTweensOf: function(e, t) {
    return we.getTweensOf(e, t);
  },
  getProperty: function(e, t, r, i) {
    qe(e) && (e = Ht(e)[0]);
    var s = ti(e || {}).get, o = r ? ql : Gl;
    return r === "native" && (r = ""), e && (t ? o((Et[t] && Et[t].get || s)(e, t, r, i)) : function(a, l, u) {
      return o((Et[a] && Et[a].get || s)(e, a, l, u));
    });
  },
  quickSetter: function(e, t, r) {
    if (e = Ht(e), e.length > 1) {
      var i = e.map(function(c) {
        return wt.quickSetter(c, t, r);
      }), s = i.length;
      return function(c) {
        for (var f = s; f--; )
          i[f](c);
      };
    }
    e = e[0] || {};
    var o = Et[t], a = ti(e), l = a.harness && (a.harness.aliases || {})[t] || t, u = o ? function(c) {
      var f = new o();
      Ei._pt = 0, f.init(e, r ? c + r : c, Ei, 0, [e]), f.render(1, f), Ei._pt && na(1, Ei);
    } : a.set(e, l);
    return o ? u : function(c) {
      return u(e, l, r ? c + r : c, a, 1);
    };
  },
  quickTo: function(e, t, r) {
    var i, s = wt.to(e, Dt((i = {}, i[t] = "+=0.1", i.paused = !0, i.stagger = 0, i), r || {})), o = function(l, u, c) {
      return s.resetTo(t, l, u, c);
    };
    return o.tween = s, o;
  },
  isTweening: function(e) {
    return we.getTweensOf(e, !0).length > 0;
  },
  defaults: function(e) {
    return e && e.ease && (e.ease = ii(e.ease, Li.ease)), Oa(Li, e || {});
  },
  config: function(e) {
    return Oa(Rt, e || {});
  },
  registerEffect: function(e) {
    var t = e.name, r = e.effect, i = e.plugins, s = e.defaults, o = e.extendTimeline;
    (i || "").split(",").forEach(function(a) {
      return a && !Et[a] && !Lt[a] && vn(t + " effect requires " + a + " plugin.");
    }), Bs[t] = function(a, l, u) {
      return r(Ht(a), Dt(l || {}, s), u);
    }, o && (ft.prototype[t] = function(a, l, u) {
      return this.add(Bs[t](a, ur(l) ? l : (u = l) && {}, this), u);
    });
  },
  registerEase: function(e, t) {
    ae[e] = ii(t);
  },
  parseEase: function(e, t) {
    return arguments.length ? ii(e, t) : ae;
  },
  getById: function(e) {
    return we.getById(e);
  },
  exportRoot: function(e, t) {
    e === void 0 && (e = {});
    var r = new ft(e), i, s;
    for (r.smoothChildTiming = mt(e.smoothChildTiming), we.remove(r), r._dp = 0, r._time = r._tTime = we._time, i = we._first; i; )
      s = i._next, (t || !(!i._dur && i instanceof Le && i.vars.onComplete === i._targets[0])) && rr(r, i, i._start - i._delay), i = s;
    return rr(we, r, 0), r;
  },
  context: function(e, t) {
    return e ? new vu(e, t) : _e;
  },
  matchMedia: function(e) {
    return new kf(e);
  },
  matchMediaRefresh: function() {
    return ni.forEach(function(e) {
      var t = e.conditions, r, i;
      for (i in t)
        t[i] && (t[i] = !1, r = 1);
      r && e.revert();
    }) || So();
  },
  addEventListener: function(e, t) {
    var r = Zn[e] || (Zn[e] = []);
    ~r.indexOf(t) || r.push(t);
  },
  removeEventListener: function(e, t) {
    var r = Zn[e], i = r && r.indexOf(t);
    i >= 0 && r.splice(i, 1);
  },
  utils: {
    wrap: cf,
    wrapYoyo: ff,
    distribute: Jl,
    random: Zl,
    snap: Ql,
    normalize: uf,
    getUnit: et,
    clamp: sf,
    splitColor: nu,
    toArray: Ht,
    selector: yo,
    mapRange: tu,
    pipe: af,
    unitize: lf,
    interpolate: df,
    shuffle: Kl
  },
  install: Nl,
  effects: Bs,
  ticker: Ot,
  updateRoot: ft.updateRoot,
  plugins: Et,
  globalTimeline: we,
  core: {
    PropTween: _t,
    globals: Bl,
    Tween: Le,
    Timeline: ft,
    Animation: Sn,
    getCache: ti,
    _removeLinkedListItem: Ps,
    reverting: function() {
      return Xe;
    },
    context: function(e) {
      return e && _e && (_e.data.push(e), e._ctx = _e), _e;
    },
    suppressOverwrites: function(e) {
      return Wo = e;
    }
  }
};
gt("to,from,fromTo,delayedCall,set,killTweensOf", function(n) {
  return ms[n] = Le[n];
});
Ot.add(ft.updateRoot);
Ei = ms.to({}, {
  duration: 0
});
var Lf = function(e, t) {
  for (var r = e._pt; r && r.p !== t && r.op !== t && r.fp !== t; )
    r = r._next;
  return r;
}, Df = function(e, t) {
  var r = e._targets, i, s, o;
  for (i in t)
    for (s = r.length; s--; )
      o = e._ptLookup[s][i], o && (o = o.d) && (o._pt && (o = Lf(o, i)), o && o.modifier && o.modifier(t[i], e, r[s], i));
}, qs = function(e, t) {
  return {
    name: e,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function(i, s, o) {
      o._onInit = function(a) {
        var l, u;
        if (qe(s) && (l = {}, gt(s, function(c) {
          return l[c] = 1;
        }), s = l), t) {
          l = {};
          for (u in s)
            l[u] = t(s[u]);
          s = l;
        }
        Df(a, s);
      };
    }
  };
}, wt = ms.registerPlugin({
  name: "attr",
  init: function(e, t, r, i, s) {
    var o, a, l;
    this.tween = r;
    for (o in t)
      l = e.getAttribute(o) || "", a = this.add(e, "setAttribute", (l || 0) + "", t[o], i, s, 0, 0, o), a.op = o, a.b = l, this._props.push(o);
  },
  render: function(e, t) {
    for (var r = t._pt; r; )
      Xe ? r.set(r.t, r.p, r.b, r) : r.r(e, r.d), r = r._next;
  }
}, {
  name: "endArray",
  init: function(e, t) {
    for (var r = t.length; r--; )
      this.add(e, r, e[r] || 0, t[r], 0, 0, 0, 0, 0, 1);
  }
}, qs("roundProps", wo), qs("modifiers"), qs("snap", Ql)) || ms;
Le.version = ft.version = wt.version = "3.12.7";
Fl = 1;
Xo() && Fi();
ae.Power0;
ae.Power1;
ae.Power2;
ae.Power3;
ae.Power4;
ae.Linear;
ae.Quad;
ae.Cubic;
ae.Quart;
ae.Quint;
ae.Strong;
ae.Elastic;
ae.Back;
ae.SteppedEase;
ae.Bounce;
ae.Sine;
ae.Expo;
ae.Circ;
/*!
 * CSSPlugin 3.12.7
 * https://gsap.com
 *
 * Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Da, Ar, Oi, sa, Qr, za, oa, zf = function() {
  return typeof window < "u";
}, xr = {}, jr = 180 / Math.PI, Mi = Math.PI / 180, yi = Math.atan2, Ia = 1e8, aa = /([A-Z])/g, If = /(left|right|width|margin|padding|x)/i, Ff = /[\s,\(]\S/, ir = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, xo = function(e, t) {
  return t.set(t.t, t.p, Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Nf = function(e, t) {
  return t.set(t.t, t.p, e === 1 ? t.e : Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u, t);
}, Bf = function(e, t) {
  return t.set(t.t, t.p, e ? Math.round((t.s + t.c * e) * 1e4) / 1e4 + t.u : t.b, t);
}, $f = function(e, t) {
  var r = t.s + t.c * e;
  t.set(t.t, t.p, ~~(r + (r < 0 ? -0.5 : 0.5)) + t.u, t);
}, yu = function(e, t) {
  return t.set(t.t, t.p, e ? t.e : t.b, t);
}, wu = function(e, t) {
  return t.set(t.t, t.p, e !== 1 ? t.b : t.e, t);
}, Hf = function(e, t, r) {
  return e.style[t] = r;
}, Vf = function(e, t, r) {
  return e.style.setProperty(t, r);
}, Gf = function(e, t, r) {
  return e._gsap[t] = r;
}, qf = function(e, t, r) {
  return e._gsap.scaleX = e._gsap.scaleY = r;
}, Uf = function(e, t, r, i, s) {
  var o = e._gsap;
  o.scaleX = o.scaleY = r, o.renderTransform(s, o);
}, Wf = function(e, t, r, i, s) {
  var o = e._gsap;
  o[t] = r, o.renderTransform(s, o);
}, be = "transform", vt = be + "Origin", Yf = function n(e, t) {
  var r = this, i = this.target, s = i.style, o = i._gsap;
  if (e in xr && s) {
    if (this.tfm = this.tfm || {}, e !== "transform")
      e = ir[e] || e, ~e.indexOf(",") ? e.split(",").forEach(function(a) {
        return r.tfm[a] = vr(i, a);
      }) : this.tfm[e] = o.x ? o[e] : vr(i, e), e === vt && (this.tfm.zOrigin = o.zOrigin);
    else
      return ir.transform.split(",").forEach(function(a) {
        return n.call(r, a, t);
      });
    if (this.props.indexOf(be) >= 0)
      return;
    o.svg && (this.svgo = i.getAttribute("data-svg-origin"), this.props.push(vt, t, "")), e = be;
  }
  (s || t) && this.props.push(e, t, s[e]);
}, bu = function(e) {
  e.translate && (e.removeProperty("translate"), e.removeProperty("scale"), e.removeProperty("rotate"));
}, Xf = function() {
  var e = this.props, t = this.target, r = t.style, i = t._gsap, s, o;
  for (s = 0; s < e.length; s += 3)
    e[s + 1] ? e[s + 1] === 2 ? t[e[s]](e[s + 2]) : t[e[s]] = e[s + 2] : e[s + 2] ? r[e[s]] = e[s + 2] : r.removeProperty(e[s].substr(0, 2) === "--" ? e[s] : e[s].replace(aa, "-$1").toLowerCase());
  if (this.tfm) {
    for (o in this.tfm)
      i[o] = this.tfm[o];
    i.svg && (i.renderTransform(), t.setAttribute("data-svg-origin", this.svgo || "")), s = oa(), (!s || !s.isStart) && !r[be] && (bu(r), i.zOrigin && r[vt] && (r[vt] += " " + i.zOrigin + "px", i.zOrigin = 0, i.renderTransform()), i.uncache = 1);
  }
}, Su = function(e, t) {
  var r = {
    target: e,
    props: [],
    revert: Xf,
    save: Yf
  };
  return e._gsap || wt.core.getCache(e), t && e.style && e.nodeType && t.split(",").forEach(function(i) {
    return r.save(i);
  }), r;
}, xu, To = function(e, t) {
  var r = Ar.createElementNS ? Ar.createElementNS((t || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), e) : Ar.createElement(e);
  return r && r.style ? r : Ar.createElement(e);
}, ar = function n(e, t, r) {
  var i = getComputedStyle(e);
  return i[t] || i.getPropertyValue(t.replace(aa, "-$1").toLowerCase()) || i.getPropertyValue(t) || !r && n(e, Ni(t) || t, 1) || "";
}, Fa = "O,Moz,ms,Ms,Webkit".split(","), Ni = function(e, t, r) {
  var i = t || Qr, s = i.style, o = 5;
  if (e in s && !r)
    return e;
  for (e = e.charAt(0).toUpperCase() + e.substr(1); o-- && !(Fa[o] + e in s); )
    ;
  return o < 0 ? null : (o === 3 ? "ms" : o >= 0 ? Fa[o] : "") + e;
}, Eo = function() {
  zf() && window.document && (Da = window, Ar = Da.document, Oi = Ar.documentElement, Qr = To("div") || {
    style: {}
  }, To("div"), be = Ni(be), vt = be + "Origin", Qr.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", xu = !!Ni("perspective"), oa = wt.core.reverting, sa = 1);
}, Na = function(e) {
  var t = e.ownerSVGElement, r = To("svg", t && t.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), i = e.cloneNode(!0), s;
  i.style.display = "block", r.appendChild(i), Oi.appendChild(r);
  try {
    s = i.getBBox();
  } catch {
  }
  return r.removeChild(i), Oi.removeChild(r), s;
}, Ba = function(e, t) {
  for (var r = t.length; r--; )
    if (e.hasAttribute(t[r]))
      return e.getAttribute(t[r]);
}, Tu = function(e) {
  var t, r;
  try {
    t = e.getBBox();
  } catch {
    t = Na(e), r = 1;
  }
  return t && (t.width || t.height) || r || (t = Na(e)), t && !t.width && !t.x && !t.y ? {
    x: +Ba(e, ["x", "cx", "x1"]) || 0,
    y: +Ba(e, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : t;
}, Eu = function(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && Tu(e));
}, ui = function(e, t) {
  if (t) {
    var r = e.style, i;
    t in xr && t !== vt && (t = be), r.removeProperty ? (i = t.substr(0, 2), (i === "ms" || t.substr(0, 6) === "webkit") && (t = "-" + t), r.removeProperty(i === "--" ? t : t.replace(aa, "-$1").toLowerCase())) : r.removeAttribute(t);
  }
}, Rr = function(e, t, r, i, s, o) {
  var a = new _t(e._pt, t, r, 0, 1, o ? wu : yu);
  return e._pt = a, a.b = i, a.e = s, e._props.push(r), a;
}, $a = {
  deg: 1,
  rad: 1,
  turn: 1
}, jf = {
  grid: 1,
  flex: 1
}, Br = function n(e, t, r, i) {
  var s = parseFloat(r) || 0, o = (r + "").trim().substr((s + "").length) || "px", a = Qr.style, l = If.test(t), u = e.tagName.toLowerCase() === "svg", c = (u ? "client" : "offset") + (l ? "Width" : "Height"), f = 100, h = i === "px", d = i === "%", _, p, g, m;
  if (i === o || !s || $a[i] || $a[o])
    return s;
  if (o !== "px" && !h && (s = n(e, t, r, "px")), m = e.getCTM && Eu(e), (d || o === "%") && (xr[t] || ~t.indexOf("adius")))
    return _ = m ? e.getBBox()[l ? "width" : "height"] : e[c], Me(d ? s / _ * f : s / 100 * _);
  if (a[l ? "width" : "height"] = f + (h ? o : i), p = i !== "rem" && ~t.indexOf("adius") || i === "em" && e.appendChild && !u ? e : e.parentNode, m && (p = (e.ownerSVGElement || {}).parentNode), (!p || p === Ar || !p.appendChild) && (p = Ar.body), g = p._gsap, g && d && g.width && l && g.time === Ot.time && !g.uncache)
    return Me(s / g.width * f);
  if (d && (t === "height" || t === "width")) {
    var v = e.style[t];
    e.style[t] = f + i, _ = e[c], v ? e.style[t] = v : ui(e, t);
  } else
    (d || o === "%") && !jf[ar(p, "display")] && (a.position = ar(e, "position")), p === e && (a.position = "static"), p.appendChild(Qr), _ = Qr[c], p.removeChild(Qr), a.position = "absolute";
  return l && d && (g = ti(p), g.time = Ot.time, g.width = p[c]), Me(h ? _ * s / f : _ && s ? f / _ * s : 0);
}, vr = function(e, t, r, i) {
  var s;
  return sa || Eo(), t in ir && t !== "transform" && (t = ir[t], ~t.indexOf(",") && (t = t.split(",")[0])), xr[t] && t !== "transform" ? (s = Tn(e, i), s = t !== "transformOrigin" ? s[t] : s.svg ? s.origin : _s(ar(e, vt)) + " " + s.zOrigin + "px") : (s = e.style[t], (!s || s === "auto" || i || ~(s + "").indexOf("calc(")) && (s = gs[t] && gs[t](e, t, r) || ar(e, t) || Hl(e, t) || (t === "opacity" ? 1 : 0))), r && !~(s + "").trim().indexOf(" ") ? Br(e, t, s, r) + r : s;
}, Kf = function(e, t, r, i) {
  if (!r || r === "none") {
    var s = Ni(t, e, 1), o = s && ar(e, s, 1);
    o && o !== r ? (t = s, r = o) : t === "borderColor" && (r = ar(e, "borderTopColor"));
  }
  var a = new _t(this._pt, e.style, t, 0, 1, gu), l = 0, u = 0, c, f, h, d, _, p, g, m, v, y, w, b;
  if (a.b = r, a.e = i, r += "", i += "", i === "auto" && (p = e.style[t], e.style[t] = i, i = ar(e, t) || i, p ? e.style[t] = p : ui(e, t)), c = [r, i], ou(c), r = c[0], i = c[1], h = r.match(Ti) || [], b = i.match(Ti) || [], b.length) {
    for (; f = Ti.exec(i); )
      g = f[0], v = i.substring(l, f.index), _ ? _ = (_ + 1) % 5 : (v.substr(-5) === "rgba(" || v.substr(-5) === "hsla(") && (_ = 1), g !== (p = h[u++] || "") && (d = parseFloat(p) || 0, w = p.substr((d + "").length), g.charAt(1) === "=" && (g = Pi(d, g) + w), m = parseFloat(g), y = g.substr((m + "").length), l = Ti.lastIndex - y.length, y || (y = y || Rt.units[t] || w, l === i.length && (i += y, a.e += y)), w !== y && (d = Br(e, t, p, y) || 0), a._pt = {
        _next: a._pt,
        p: v || u === 1 ? v : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: d,
        c: m - d,
        m: _ && _ < 4 || t === "zIndex" ? Math.round : 0
      });
    a.c = l < i.length ? i.substring(l, i.length) : "";
  } else
    a.r = t === "display" && i === "none" ? wu : yu;
  return zl.test(i) && (a.e = 0), this._pt = a, a;
}, Ha = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, Jf = function(e) {
  var t = e.split(" "), r = t[0], i = t[1] || "50%";
  return (r === "top" || r === "bottom" || i === "left" || i === "right") && (e = r, r = i, i = e), t[0] = Ha[r] || r, t[1] = Ha[i] || i, t.join(" ");
}, Qf = function(e, t) {
  if (t.tween && t.tween._time === t.tween._dur) {
    var r = t.t, i = r.style, s = t.u, o = r._gsap, a, l, u;
    if (s === "all" || s === !0)
      i.cssText = "", l = 1;
    else
      for (s = s.split(","), u = s.length; --u > -1; )
        a = s[u], xr[a] && (l = 1, a = a === "transformOrigin" ? vt : be), ui(r, a);
    l && (ui(r, be), o && (o.svg && r.removeAttribute("transform"), i.scale = i.rotate = i.translate = "none", Tn(r, 1), o.uncache = 1, bu(i)));
  }
}, gs = {
  clearProps: function(e, t, r, i, s) {
    if (s.data !== "isFromStart") {
      var o = e._pt = new _t(e._pt, t, r, 0, 0, Qf);
      return o.u = i, o.pr = -10, o.tween = s, e._props.push(r), 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, xn = [1, 0, 0, 1, 0, 0], Cu = {}, Pu = function(e) {
  return e === "matrix(1, 0, 0, 1, 0, 0)" || e === "none" || !e;
}, Va = function(e) {
  var t = ar(e, be);
  return Pu(t) ? xn : t.substr(7).match(Dl).map(Me);
}, la = function(e, t) {
  var r = e._gsap || ti(e), i = e.style, s = Va(e), o, a, l, u;
  return r.svg && e.getAttribute("transform") ? (l = e.transform.baseVal.consolidate().matrix, s = [l.a, l.b, l.c, l.d, l.e, l.f], s.join(",") === "1,0,0,1,0,0" ? xn : s) : (s === xn && !e.offsetParent && e !== Oi && !r.svg && (l = i.display, i.display = "block", o = e.parentNode, (!o || !e.offsetParent && !e.getBoundingClientRect().width) && (u = 1, a = e.nextElementSibling, Oi.appendChild(e)), s = Va(e), l ? i.display = l : ui(e, "display"), u && (a ? o.insertBefore(e, a) : o ? o.appendChild(e) : Oi.removeChild(e))), t && s.length > 6 ? [s[0], s[1], s[4], s[5], s[12], s[13]] : s);
}, Co = function(e, t, r, i, s, o) {
  var a = e._gsap, l = s || la(e, !0), u = a.xOrigin || 0, c = a.yOrigin || 0, f = a.xOffset || 0, h = a.yOffset || 0, d = l[0], _ = l[1], p = l[2], g = l[3], m = l[4], v = l[5], y = t.split(" "), w = parseFloat(y[0]) || 0, b = parseFloat(y[1]) || 0, S, T, O, E;
  r ? l !== xn && (T = d * g - _ * p) && (O = w * (g / T) + b * (-p / T) + (p * v - g * m) / T, E = w * (-_ / T) + b * (d / T) - (d * v - _ * m) / T, w = O, b = E) : (S = Tu(e), w = S.x + (~y[0].indexOf("%") ? w / 100 * S.width : w), b = S.y + (~(y[1] || y[0]).indexOf("%") ? b / 100 * S.height : b)), i || i !== !1 && a.smooth ? (m = w - u, v = b - c, a.xOffset = f + (m * d + v * p) - m, a.yOffset = h + (m * _ + v * g) - v) : a.xOffset = a.yOffset = 0, a.xOrigin = w, a.yOrigin = b, a.smooth = !!i, a.origin = t, a.originIsAbsolute = !!r, e.style[vt] = "0px 0px", o && (Rr(o, a, "xOrigin", u, w), Rr(o, a, "yOrigin", c, b), Rr(o, a, "xOffset", f, a.xOffset), Rr(o, a, "yOffset", h, a.yOffset)), e.setAttribute("data-svg-origin", w + " " + b);
}, Tn = function(e, t) {
  var r = e._gsap || new cu(e);
  if ("x" in r && !t && !r.uncache)
    return r;
  var i = e.style, s = r.scaleX < 0, o = "px", a = "deg", l = getComputedStyle(e), u = ar(e, vt) || "0", c, f, h, d, _, p, g, m, v, y, w, b, S, T, O, E, P, R, C, L, z, H, W, B, U, ne, x, le, Ee, k, D, F;
  return c = f = h = p = g = m = v = y = w = 0, d = _ = 1, r.svg = !!(e.getCTM && Eu(e)), l.translate && ((l.translate !== "none" || l.scale !== "none" || l.rotate !== "none") && (i[be] = (l.translate !== "none" ? "translate3d(" + (l.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (l.rotate !== "none" ? "rotate(" + l.rotate + ") " : "") + (l.scale !== "none" ? "scale(" + l.scale.split(" ").join(",") + ") " : "") + (l[be] !== "none" ? l[be] : "")), i.scale = i.rotate = i.translate = "none"), T = la(e, r.svg), r.svg && (r.uncache ? (U = e.getBBox(), u = r.xOrigin - U.x + "px " + (r.yOrigin - U.y) + "px", B = "") : B = !t && e.getAttribute("data-svg-origin"), Co(e, B || u, !!B || r.originIsAbsolute, r.smooth !== !1, T)), b = r.xOrigin || 0, S = r.yOrigin || 0, T !== xn && (R = T[0], C = T[1], L = T[2], z = T[3], c = H = T[4], f = W = T[5], T.length === 6 ? (d = Math.sqrt(R * R + C * C), _ = Math.sqrt(z * z + L * L), p = R || C ? yi(C, R) * jr : 0, v = L || z ? yi(L, z) * jr + p : 0, v && (_ *= Math.abs(Math.cos(v * Mi))), r.svg && (c -= b - (b * R + S * L), f -= S - (b * C + S * z))) : (F = T[6], k = T[7], x = T[8], le = T[9], Ee = T[10], D = T[11], c = T[12], f = T[13], h = T[14], O = yi(F, Ee), g = O * jr, O && (E = Math.cos(-O), P = Math.sin(-O), B = H * E + x * P, U = W * E + le * P, ne = F * E + Ee * P, x = H * -P + x * E, le = W * -P + le * E, Ee = F * -P + Ee * E, D = k * -P + D * E, H = B, W = U, F = ne), O = yi(-L, Ee), m = O * jr, O && (E = Math.cos(-O), P = Math.sin(-O), B = R * E - x * P, U = C * E - le * P, ne = L * E - Ee * P, D = z * P + D * E, R = B, C = U, L = ne), O = yi(C, R), p = O * jr, O && (E = Math.cos(O), P = Math.sin(O), B = R * E + C * P, U = H * E + W * P, C = C * E - R * P, W = W * E - H * P, R = B, H = U), g && Math.abs(g) + Math.abs(p) > 359.9 && (g = p = 0, m = 180 - m), d = Me(Math.sqrt(R * R + C * C + L * L)), _ = Me(Math.sqrt(W * W + F * F)), O = yi(H, W), v = Math.abs(O) > 2e-4 ? O * jr : 0, w = D ? 1 / (D < 0 ? -D : D) : 0), r.svg && (B = e.getAttribute("transform"), r.forceCSS = e.setAttribute("transform", "") || !Pu(ar(e, be)), B && e.setAttribute("transform", B))), Math.abs(v) > 90 && Math.abs(v) < 270 && (s ? (d *= -1, v += p <= 0 ? 180 : -180, p += p <= 0 ? 180 : -180) : (_ *= -1, v += v <= 0 ? 180 : -180)), t = t || r.uncache, r.x = c - ((r.xPercent = c && (!t && r.xPercent || (Math.round(e.offsetWidth / 2) === Math.round(-c) ? -50 : 0))) ? e.offsetWidth * r.xPercent / 100 : 0) + o, r.y = f - ((r.yPercent = f && (!t && r.yPercent || (Math.round(e.offsetHeight / 2) === Math.round(-f) ? -50 : 0))) ? e.offsetHeight * r.yPercent / 100 : 0) + o, r.z = h + o, r.scaleX = Me(d), r.scaleY = Me(_), r.rotation = Me(p) + a, r.rotationX = Me(g) + a, r.rotationY = Me(m) + a, r.skewX = v + a, r.skewY = y + a, r.transformPerspective = w + o, (r.zOrigin = parseFloat(u.split(" ")[2]) || !t && r.zOrigin || 0) && (i[vt] = _s(u)), r.xOffset = r.yOffset = 0, r.force3D = Rt.force3D, r.renderTransform = r.svg ? ed : xu ? Ou : Zf, r.uncache = 0, r;
}, _s = function(e) {
  return (e = e.split(" "))[0] + " " + e[1];
}, Us = function(e, t, r) {
  var i = et(t);
  return Me(parseFloat(t) + parseFloat(Br(e, "x", r + "px", i))) + i;
}, Zf = function(e, t) {
  t.z = "0px", t.rotationY = t.rotationX = "0deg", t.force3D = 0, Ou(e, t);
}, Yr = "0deg", Yi = "0px", Xr = ") ", Ou = function(e, t) {
  var r = t || this, i = r.xPercent, s = r.yPercent, o = r.x, a = r.y, l = r.z, u = r.rotation, c = r.rotationY, f = r.rotationX, h = r.skewX, d = r.skewY, _ = r.scaleX, p = r.scaleY, g = r.transformPerspective, m = r.force3D, v = r.target, y = r.zOrigin, w = "", b = m === "auto" && e && e !== 1 || m === !0;
  if (y && (f !== Yr || c !== Yr)) {
    var S = parseFloat(c) * Mi, T = Math.sin(S), O = Math.cos(S), E;
    S = parseFloat(f) * Mi, E = Math.cos(S), o = Us(v, o, T * E * -y), a = Us(v, a, -Math.sin(S) * -y), l = Us(v, l, O * E * -y + y);
  }
  g !== Yi && (w += "perspective(" + g + Xr), (i || s) && (w += "translate(" + i + "%, " + s + "%) "), (b || o !== Yi || a !== Yi || l !== Yi) && (w += l !== Yi || b ? "translate3d(" + o + ", " + a + ", " + l + ") " : "translate(" + o + ", " + a + Xr), u !== Yr && (w += "rotate(" + u + Xr), c !== Yr && (w += "rotateY(" + c + Xr), f !== Yr && (w += "rotateX(" + f + Xr), (h !== Yr || d !== Yr) && (w += "skew(" + h + ", " + d + Xr), (_ !== 1 || p !== 1) && (w += "scale(" + _ + ", " + p + Xr), v.style[be] = w || "translate(0, 0)";
}, ed = function(e, t) {
  var r = t || this, i = r.xPercent, s = r.yPercent, o = r.x, a = r.y, l = r.rotation, u = r.skewX, c = r.skewY, f = r.scaleX, h = r.scaleY, d = r.target, _ = r.xOrigin, p = r.yOrigin, g = r.xOffset, m = r.yOffset, v = r.forceCSS, y = parseFloat(o), w = parseFloat(a), b, S, T, O, E;
  l = parseFloat(l), u = parseFloat(u), c = parseFloat(c), c && (c = parseFloat(c), u += c, l += c), l || u ? (l *= Mi, u *= Mi, b = Math.cos(l) * f, S = Math.sin(l) * f, T = Math.sin(l - u) * -h, O = Math.cos(l - u) * h, u && (c *= Mi, E = Math.tan(u - c), E = Math.sqrt(1 + E * E), T *= E, O *= E, c && (E = Math.tan(c), E = Math.sqrt(1 + E * E), b *= E, S *= E)), b = Me(b), S = Me(S), T = Me(T), O = Me(O)) : (b = f, O = h, S = T = 0), (y && !~(o + "").indexOf("px") || w && !~(a + "").indexOf("px")) && (y = Br(d, "x", o, "px"), w = Br(d, "y", a, "px")), (_ || p || g || m) && (y = Me(y + _ - (_ * b + p * T) + g), w = Me(w + p - (_ * S + p * O) + m)), (i || s) && (E = d.getBBox(), y = Me(y + i / 100 * E.width), w = Me(w + s / 100 * E.height)), E = "matrix(" + b + "," + S + "," + T + "," + O + "," + y + "," + w + ")", d.setAttribute("transform", E), v && (d.style[be] = E);
}, td = function(e, t, r, i, s) {
  var o = 360, a = qe(s), l = parseFloat(s) * (a && ~s.indexOf("rad") ? jr : 1), u = l - i, c = i + u + "deg", f, h;
  return a && (f = s.split("_")[1], f === "short" && (u %= o, u !== u % (o / 2) && (u += u < 0 ? o : -360)), f === "cw" && u < 0 ? u = (u + o * Ia) % o - ~~(u / o) * o : f === "ccw" && u > 0 && (u = (u - o * Ia) % o - ~~(u / o) * o)), e._pt = h = new _t(e._pt, t, r, i, u, Nf), h.e = c, h.u = "deg", e._props.push(r), h;
}, Ga = function(e, t) {
  for (var r in t)
    e[r] = t[r];
  return e;
}, rd = function(e, t, r) {
  var i = Ga({}, r._gsap), s = "perspective,force3D,transformOrigin,svgOrigin", o = r.style, a, l, u, c, f, h, d, _;
  i.svg ? (u = r.getAttribute("transform"), r.setAttribute("transform", ""), o[be] = t, a = Tn(r, 1), ui(r, be), r.setAttribute("transform", u)) : (u = getComputedStyle(r)[be], o[be] = t, a = Tn(r, 1), o[be] = u);
  for (l in xr)
    u = i[l], c = a[l], u !== c && s.indexOf(l) < 0 && (d = et(u), _ = et(c), f = d !== _ ? Br(r, l, u, _) : parseFloat(u), h = parseFloat(c), e._pt = new _t(e._pt, a, l, f, h - f, xo), e._pt.u = _ || 0, e._props.push(l));
  Ga(a, i);
};
gt("padding,margin,Width,Radius", function(n, e) {
  var t = "Top", r = "Right", i = "Bottom", s = "Left", o = (e < 3 ? [t, r, i, s] : [t + s, t + r, i + r, i + s]).map(function(a) {
    return e < 2 ? n + a : "border" + a + n;
  });
  gs[e > 1 ? "border" + n : n] = function(a, l, u, c, f) {
    var h, d;
    if (arguments.length < 4)
      return h = o.map(function(_) {
        return vr(a, _, u);
      }), d = h.join(" "), d.split(h[0]).length === 5 ? h[0] : d;
    h = (c + "").split(" "), d = {}, o.forEach(function(_, p) {
      return d[_] = h[p] = h[p] || h[(p - 1) / 2 | 0];
    }), a.init(l, d, f);
  };
});
var Mu = {
  name: "css",
  register: Eo,
  targetTest: function(e) {
    return e.style && e.nodeType;
  },
  init: function(e, t, r, i, s) {
    var o = this._props, a = e.style, l = r.vars.startAt, u, c, f, h, d, _, p, g, m, v, y, w, b, S, T, O;
    sa || Eo(), this.styles = this.styles || Su(e), O = this.styles.props, this.tween = r;
    for (p in t)
      if (p !== "autoRound" && (c = t[p], !(Et[p] && fu(p, t, r, i, e, s)))) {
        if (d = typeof c, _ = gs[p], d === "function" && (c = c.call(r, i, e, s), d = typeof c), d === "string" && ~c.indexOf("random(") && (c = wn(c)), _)
          _(this, e, p, c, r) && (T = 1);
        else if (p.substr(0, 2) === "--")
          u = (getComputedStyle(e).getPropertyValue(p) + "").trim(), c += "", Ir.lastIndex = 0, Ir.test(u) || (g = et(u), m = et(c)), m ? g !== m && (u = Br(e, p, u, m) + m) : g && (c += g), this.add(a, "setProperty", u, c, i, s, 0, 0, p), o.push(p), O.push(p, 0, a[p]);
        else if (d !== "undefined") {
          if (l && p in l ? (u = typeof l[p] == "function" ? l[p].call(r, i, e, s) : l[p], qe(u) && ~u.indexOf("random(") && (u = wn(u)), et(u + "") || u === "auto" || (u += Rt.units[p] || et(vr(e, p)) || ""), (u + "").charAt(1) === "=" && (u = vr(e, p))) : u = vr(e, p), h = parseFloat(u), v = d === "string" && c.charAt(1) === "=" && c.substr(0, 2), v && (c = c.substr(2)), f = parseFloat(c), p in ir && (p === "autoAlpha" && (h === 1 && vr(e, "visibility") === "hidden" && f && (h = 0), O.push("visibility", 0, a.visibility), Rr(this, a, "visibility", h ? "inherit" : "hidden", f ? "inherit" : "hidden", !f)), p !== "scale" && p !== "transform" && (p = ir[p], ~p.indexOf(",") && (p = p.split(",")[0]))), y = p in xr, y) {
            if (this.styles.save(p), w || (b = e._gsap, b.renderTransform && !t.parseTransform || Tn(e, t.parseTransform), S = t.smoothOrigin !== !1 && b.smooth, w = this._pt = new _t(this._pt, a, be, 0, 1, b.renderTransform, b, 0, -1), w.dep = 1), p === "scale")
              this._pt = new _t(this._pt, b, "scaleY", b.scaleY, (v ? Pi(b.scaleY, v + f) : f) - b.scaleY || 0, xo), this._pt.u = 0, o.push("scaleY", p), p += "X";
            else if (p === "transformOrigin") {
              O.push(vt, 0, a[vt]), c = Jf(c), b.svg ? Co(e, c, 0, S, 0, this) : (m = parseFloat(c.split(" ")[2]) || 0, m !== b.zOrigin && Rr(this, b, "zOrigin", b.zOrigin, m), Rr(this, a, p, _s(u), _s(c)));
              continue;
            } else if (p === "svgOrigin") {
              Co(e, c, 1, S, 0, this);
              continue;
            } else if (p in Cu) {
              td(this, b, p, h, v ? Pi(h, v + c) : c);
              continue;
            } else if (p === "smoothOrigin") {
              Rr(this, b, "smooth", b.smooth, c);
              continue;
            } else if (p === "force3D") {
              b[p] = c;
              continue;
            } else if (p === "transform") {
              rd(this, c, e);
              continue;
            }
          } else p in a || (p = Ni(p) || p);
          if (y || (f || f === 0) && (h || h === 0) && !Ff.test(c) && p in a)
            g = (u + "").substr((h + "").length), f || (f = 0), m = et(c) || (p in Rt.units ? Rt.units[p] : g), g !== m && (h = Br(e, p, u, m)), this._pt = new _t(this._pt, y ? b : a, p, h, (v ? Pi(h, v + f) : f) - h, !y && (m === "px" || p === "zIndex") && t.autoRound !== !1 ? $f : xo), this._pt.u = m || 0, g !== m && m !== "%" && (this._pt.b = u, this._pt.r = Bf);
          else if (p in a)
            Kf.call(this, e, p, u, v ? v + c : c);
          else if (p in e)
            this.add(e, p, u || e[p], v ? v + c : c, i, s);
          else if (p !== "parseTransform") {
            Ko(p, c);
            continue;
          }
          y || (p in a ? O.push(p, 0, a[p]) : typeof e[p] == "function" ? O.push(p, 2, e[p]()) : O.push(p, 1, u || e[p])), o.push(p);
        }
      }
    T && _u(this);
  },
  render: function(e, t) {
    if (t.tween._time || !oa())
      for (var r = t._pt; r; )
        r.r(e, r.d), r = r._next;
    else
      t.styles.revert();
  },
  get: vr,
  aliases: ir,
  getSetter: function(e, t, r) {
    var i = ir[t];
    return i && i.indexOf(",") < 0 && (t = i), t in xr && t !== vt && (e._gsap.x || vr(e, "x")) ? r && za === r ? t === "scale" ? qf : Gf : (za = r || {}) && (t === "scale" ? Uf : Wf) : e.style && !Yo(e.style[t]) ? Hf : ~t.indexOf("-") ? Vf : ia(e, t);
  },
  core: {
    _removeProperty: ui,
    _getMatrix: la
  }
};
wt.utils.checkPrefix = Ni;
wt.core.getStyleSaver = Su;
(function(n, e, t, r) {
  var i = gt(n + "," + e + "," + t, function(s) {
    xr[s] = 1;
  });
  gt(e, function(s) {
    Rt.units[s] = "deg", Cu[s] = 1;
  }), ir[i[13]] = n + "," + e, gt(r, function(s) {
    var o = s.split(":");
    ir[o[1]] = i[o[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
gt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(n) {
  Rt.units[n] = "px";
});
wt.registerPlugin(Mu);
var ht = wt.registerPlugin(Mu) || wt;
ht.core.Tween;
function id(n, e) {
  for (var t = 0; t < e.length; t++) {
    var r = e[t];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(n, r.key, r);
  }
}
function nd(n, e, t) {
  return id(n.prototype, e), n;
}
/*!
 * Observer 3.12.7
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var Ye, es, Mt, kr, Lr, Ai, Au, Kr, un, Ru, wr, Xt, ku, Lu = function() {
  return Ye || typeof window < "u" && (Ye = window.gsap) && Ye.registerPlugin && Ye;
}, Du = 1, Ci = [], re = [], lr = [], cn = Date.now, Po = function(e, t) {
  return t;
}, sd = function() {
  var e = un.core, t = e.bridge || {}, r = e._scrollers, i = e._proxies;
  r.push.apply(r, re), i.push.apply(i, lr), re = r, lr = i, Po = function(o, a) {
    return t[o](a);
  };
}, Fr = function(e, t) {
  return ~lr.indexOf(e) && lr[lr.indexOf(e) + 1][t];
}, fn = function(e) {
  return !!~Ru.indexOf(e);
}, at = function(e, t, r, i, s) {
  return e.addEventListener(t, r, {
    passive: i !== !1,
    capture: !!s
  });
}, ot = function(e, t, r, i) {
  return e.removeEventListener(t, r, !!i);
}, Fn = "scrollLeft", Nn = "scrollTop", Oo = function() {
  return wr && wr.isPressed || re.cache++;
}, vs = function(e, t) {
  var r = function i(s) {
    if (s || s === 0) {
      Du && (Mt.history.scrollRestoration = "manual");
      var o = wr && wr.isPressed;
      s = i.v = Math.round(s) || (wr && wr.iOS ? 1 : 0), e(s), i.cacheID = re.cache, o && Po("ss", s);
    } else (t || re.cache !== i.cacheID || Po("ref")) && (i.cacheID = re.cache, i.v = e());
    return i.v + i.offset;
  };
  return r.offset = 0, e && r;
}, dt = {
  s: Fn,
  p: "left",
  p2: "Left",
  os: "right",
  os2: "Right",
  d: "width",
  d2: "Width",
  a: "x",
  sc: vs(function(n) {
    return arguments.length ? Mt.scrollTo(n, Ne.sc()) : Mt.pageXOffset || kr[Fn] || Lr[Fn] || Ai[Fn] || 0;
  })
}, Ne = {
  s: Nn,
  p: "top",
  p2: "Top",
  os: "bottom",
  os2: "Bottom",
  d: "height",
  d2: "Height",
  a: "y",
  op: dt,
  sc: vs(function(n) {
    return arguments.length ? Mt.scrollTo(dt.sc(), n) : Mt.pageYOffset || kr[Nn] || Lr[Nn] || Ai[Nn] || 0;
  })
}, pt = function(e, t) {
  return (t && t._ctx && t._ctx.selector || Ye.utils.toArray)(e)[0] || (typeof e == "string" && Ye.config().nullTargetWarn !== !1 ? console.warn("Element not found:", e) : null);
}, $r = function(e, t) {
  var r = t.s, i = t.sc;
  fn(e) && (e = kr.scrollingElement || Lr);
  var s = re.indexOf(e), o = i === Ne.sc ? 1 : 2;
  !~s && (s = re.push(e) - 1), re[s + o] || at(e, "scroll", Oo);
  var a = re[s + o], l = a || (re[s + o] = vs(Fr(e, r), !0) || (fn(e) ? i : vs(function(u) {
    return arguments.length ? e[r] = u : e[r];
  })));
  return l.target = e, a || (l.smooth = Ye.getProperty(e, "scrollBehavior") === "smooth"), l;
}, Mo = function(e, t, r) {
  var i = e, s = e, o = cn(), a = o, l = t || 50, u = Math.max(500, l * 3), c = function(_, p) {
    var g = cn();
    p || g - o > l ? (s = i, i = _, a = o, o = g) : r ? i += _ : i = s + (_ - s) / (g - a) * (o - a);
  }, f = function() {
    s = i = r ? 0 : i, a = o = 0;
  }, h = function(_) {
    var p = a, g = s, m = cn();
    return (_ || _ === 0) && _ !== i && c(_), o === a || m - a > u ? 0 : (i + (r ? g : -g)) / ((r ? m : o) - p) * 1e3;
  };
  return {
    update: c,
    reset: f,
    getVelocity: h
  };
}, Xi = function(e, t) {
  return t && !e._gsapAllow && e.preventDefault(), e.changedTouches ? e.changedTouches[0] : e;
}, qa = function(e) {
  var t = Math.max.apply(Math, e), r = Math.min.apply(Math, e);
  return Math.abs(t) >= Math.abs(r) ? t : r;
}, zu = function() {
  un = Ye.core.globals().ScrollTrigger, un && un.core && sd();
}, Iu = function(e) {
  return Ye = e || Lu(), !es && Ye && typeof document < "u" && document.body && (Mt = window, kr = document, Lr = kr.documentElement, Ai = kr.body, Ru = [Mt, kr, Lr, Ai], Ye.utils.clamp, ku = Ye.core.context || function() {
  }, Kr = "onpointerenter" in Ai ? "pointer" : "mouse", Au = Ae.isTouch = Mt.matchMedia && Mt.matchMedia("(hover: none), (pointer: coarse)").matches ? 1 : "ontouchstart" in Mt || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0 ? 2 : 0, Xt = Ae.eventTypes = ("ontouchstart" in Lr ? "touchstart,touchmove,touchcancel,touchend" : "onpointerdown" in Lr ? "pointerdown,pointermove,pointercancel,pointerup" : "mousedown,mousemove,mouseup,mouseup").split(","), setTimeout(function() {
    return Du = 0;
  }, 500), zu(), es = 1), es;
};
dt.op = Ne;
re.cache = 0;
var Ae = /* @__PURE__ */ function() {
  function n(t) {
    this.init(t);
  }
  var e = n.prototype;
  return e.init = function(r) {
    es || Iu(Ye) || console.warn("Please gsap.registerPlugin(Observer)"), un || zu();
    var i = r.tolerance, s = r.dragMinimum, o = r.type, a = r.target, l = r.lineHeight, u = r.debounce, c = r.preventDefault, f = r.onStop, h = r.onStopDelay, d = r.ignore, _ = r.wheelSpeed, p = r.event, g = r.onDragStart, m = r.onDragEnd, v = r.onDrag, y = r.onPress, w = r.onRelease, b = r.onRight, S = r.onLeft, T = r.onUp, O = r.onDown, E = r.onChangeX, P = r.onChangeY, R = r.onChange, C = r.onToggleX, L = r.onToggleY, z = r.onHover, H = r.onHoverEnd, W = r.onMove, B = r.ignoreCheck, U = r.isNormalizer, ne = r.onGestureStart, x = r.onGestureEnd, le = r.onWheel, Ee = r.onEnable, k = r.onDisable, D = r.onClick, F = r.scrollSpeed, G = r.capture, $ = r.allowClicks, J = r.lockAxis, ee = r.onLockAxis;
    this.target = a = pt(a) || Lr, this.vars = r, d && (d = Ye.utils.toArray(d)), i = i || 1e-9, s = s || 0, _ = _ || 1, F = F || 1, o = o || "wheel,touch,pointer", u = u !== !1, l || (l = parseFloat(Mt.getComputedStyle(Ai).lineHeight) || 22);
    var de, ue, Se, Q, ve, Be, st, M = this, bt = 0, cr = 0, Tr = r.passive || !c && r.passive !== !1, Ce = $r(a, dt), fr = $r(a, Ne), Er = Ce(), Vr = fr(), $e = ~o.indexOf("touch") && !~o.indexOf("pointer") && Xt[0] === "pointerdown", Cr = fn(a), Pe = a.ownerDocument || kr, Gt = [0, 0, 0], It = [0, 0, 0], dr = 0, Vi = function() {
      return dr = cn();
    }, Re = function(q, ce) {
      return (M.event = q) && d && ~d.indexOf(q.target) || ce && $e && q.pointerType !== "touch" || B && B(q, ce);
    }, Rn = function() {
      M._vx.reset(), M._vy.reset(), ue.pause(), f && f(M);
    }, hr = function() {
      var q = M.deltaX = qa(Gt), ce = M.deltaY = qa(It), I = Math.abs(q) >= i, Y = Math.abs(ce) >= i;
      R && (I || Y) && R(M, q, ce, Gt, It), I && (b && M.deltaX > 0 && b(M), S && M.deltaX < 0 && S(M), E && E(M), C && M.deltaX < 0 != bt < 0 && C(M), bt = M.deltaX, Gt[0] = Gt[1] = Gt[2] = 0), Y && (O && M.deltaY > 0 && O(M), T && M.deltaY < 0 && T(M), P && P(M), L && M.deltaY < 0 != cr < 0 && L(M), cr = M.deltaY, It[0] = It[1] = It[2] = 0), (Q || Se) && (W && W(M), Se && (g && Se === 1 && g(M), v && v(M), Se = 0), Q = !1), Be && !(Be = !1) && ee && ee(M), ve && (le(M), ve = !1), de = 0;
    }, gi = function(q, ce, I) {
      Gt[I] += q, It[I] += ce, M._vx.update(q), M._vy.update(ce), u ? de || (de = requestAnimationFrame(hr)) : hr();
    }, _i = function(q, ce) {
      J && !st && (M.axis = st = Math.abs(q) > Math.abs(ce) ? "x" : "y", Be = !0), st !== "y" && (Gt[2] += q, M._vx.update(q, !0)), st !== "x" && (It[2] += ce, M._vy.update(ce, !0)), u ? de || (de = requestAnimationFrame(hr)) : hr();
    }, Pr = function(q) {
      if (!Re(q, 1)) {
        q = Xi(q, c);
        var ce = q.clientX, I = q.clientY, Y = ce - M.x, V = I - M.y, X = M.isDragging;
        M.x = ce, M.y = I, (X || (Y || V) && (Math.abs(M.startX - ce) >= s || Math.abs(M.startY - I) >= s)) && (Se = X ? 2 : 1, X || (M.isDragging = !0), _i(Y, V));
      }
    }, Gr = M.onPress = function(j) {
      Re(j, 1) || j && j.button || (M.axis = st = null, ue.pause(), M.isPressed = !0, j = Xi(j), bt = cr = 0, M.startX = M.x = j.clientX, M.startY = M.y = j.clientY, M._vx.reset(), M._vy.reset(), at(U ? a : Pe, Xt[1], Pr, Tr, !0), M.deltaX = M.deltaY = 0, y && y(M));
    }, se = M.onRelease = function(j) {
      if (!Re(j, 1)) {
        ot(U ? a : Pe, Xt[1], Pr, !0);
        var q = !isNaN(M.y - M.startY), ce = M.isDragging, I = ce && (Math.abs(M.x - M.startX) > 3 || Math.abs(M.y - M.startY) > 3), Y = Xi(j);
        !I && q && (M._vx.reset(), M._vy.reset(), c && $ && Ye.delayedCall(0.08, function() {
          if (cn() - dr > 300 && !j.defaultPrevented) {
            if (j.target.click)
              j.target.click();
            else if (Pe.createEvent) {
              var V = Pe.createEvent("MouseEvents");
              V.initMouseEvent("click", !0, !0, Mt, 1, Y.screenX, Y.screenY, Y.clientX, Y.clientY, !1, !1, !1, !1, 0, null), j.target.dispatchEvent(V);
            }
          }
        })), M.isDragging = M.isGesturing = M.isPressed = !1, f && ce && !U && ue.restart(!0), Se && hr(), m && ce && m(M), w && w(M, I);
      }
    }, qr = function(q) {
      return q.touches && q.touches.length > 1 && (M.isGesturing = !0) && ne(q, M.isDragging);
    }, qt = function() {
      return (M.isGesturing = !1) || x(M);
    }, Ut = function(q) {
      if (!Re(q)) {
        var ce = Ce(), I = fr();
        gi((ce - Er) * F, (I - Vr) * F, 1), Er = ce, Vr = I, f && ue.restart(!0);
      }
    }, Wt = function(q) {
      if (!Re(q)) {
        q = Xi(q, c), le && (ve = !0);
        var ce = (q.deltaMode === 1 ? l : q.deltaMode === 2 ? Mt.innerHeight : 1) * _;
        gi(q.deltaX * ce, q.deltaY * ce, 0), f && !U && ue.restart(!0);
      }
    }, Ur = function(q) {
      if (!Re(q)) {
        var ce = q.clientX, I = q.clientY, Y = ce - M.x, V = I - M.y;
        M.x = ce, M.y = I, Q = !0, f && ue.restart(!0), (Y || V) && _i(Y, V);
      }
    }, vi = function(q) {
      M.event = q, z(M);
    }, pr = function(q) {
      M.event = q, H(M);
    }, Gi = function(q) {
      return Re(q) || Xi(q, c) && D(M);
    };
    ue = M._dc = Ye.delayedCall(h || 0.25, Rn).pause(), M.deltaX = M.deltaY = 0, M._vx = Mo(0, 50, !0), M._vy = Mo(0, 50, !0), M.scrollX = Ce, M.scrollY = fr, M.isDragging = M.isGesturing = M.isPressed = !1, ku(this), M.enable = function(j) {
      return M.isEnabled || (at(Cr ? Pe : a, "scroll", Oo), o.indexOf("scroll") >= 0 && at(Cr ? Pe : a, "scroll", Ut, Tr, G), o.indexOf("wheel") >= 0 && at(a, "wheel", Wt, Tr, G), (o.indexOf("touch") >= 0 && Au || o.indexOf("pointer") >= 0) && (at(a, Xt[0], Gr, Tr, G), at(Pe, Xt[2], se), at(Pe, Xt[3], se), $ && at(a, "click", Vi, !0, !0), D && at(a, "click", Gi), ne && at(Pe, "gesturestart", qr), x && at(Pe, "gestureend", qt), z && at(a, Kr + "enter", vi), H && at(a, Kr + "leave", pr), W && at(a, Kr + "move", Ur)), M.isEnabled = !0, M.isDragging = M.isGesturing = M.isPressed = Q = Se = !1, M._vx.reset(), M._vy.reset(), Er = Ce(), Vr = fr(), j && j.type && Gr(j), Ee && Ee(M)), M;
    }, M.disable = function() {
      M.isEnabled && (Ci.filter(function(j) {
        return j !== M && fn(j.target);
      }).length || ot(Cr ? Pe : a, "scroll", Oo), M.isPressed && (M._vx.reset(), M._vy.reset(), ot(U ? a : Pe, Xt[1], Pr, !0)), ot(Cr ? Pe : a, "scroll", Ut, G), ot(a, "wheel", Wt, G), ot(a, Xt[0], Gr, G), ot(Pe, Xt[2], se), ot(Pe, Xt[3], se), ot(a, "click", Vi, !0), ot(a, "click", Gi), ot(Pe, "gesturestart", qr), ot(Pe, "gestureend", qt), ot(a, Kr + "enter", vi), ot(a, Kr + "leave", pr), ot(a, Kr + "move", Ur), M.isEnabled = M.isPressed = M.isDragging = !1, k && k(M));
    }, M.kill = M.revert = function() {
      M.disable();
      var j = Ci.indexOf(M);
      j >= 0 && Ci.splice(j, 1), wr === M && (wr = 0);
    }, Ci.push(M), U && fn(a) && (wr = M), M.enable(p);
  }, nd(n, [{
    key: "velocityX",
    get: function() {
      return this._vx.getVelocity();
    }
  }, {
    key: "velocityY",
    get: function() {
      return this._vy.getVelocity();
    }
  }]), n;
}();
Ae.version = "3.12.7";
Ae.create = function(n) {
  return new Ae(n);
};
Ae.register = Iu;
Ae.getAll = function() {
  return Ci.slice();
};
Ae.getById = function(n) {
  return Ci.filter(function(e) {
    return e.vars.id === n;
  })[0];
};
Lu() && Ye.registerPlugin(Ae);
/*!
 * ScrollTrigger 3.12.7
 * https://gsap.com
 *
 * @license Copyright 2008-2025, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var N, Si, te, me, Pt, fe, ua, ys, En, dn, en, Bn, Qe, As, Ao, ut, Ua, Wa, xi, Fu, Ws, Nu, lt, Ro, Bu, $u, Or, ko, ca, Ri, fa, ws, Lo, Ys, $n = 1, Ze = Date.now, Xs = Ze(), Vt = 0, tn = 0, Ya = function(e, t, r) {
  var i = Tt(e) && (e.substr(0, 6) === "clamp(" || e.indexOf("max") > -1);
  return r["_" + t + "Clamp"] = i, i ? e.substr(6, e.length - 7) : e;
}, Xa = function(e, t) {
  return t && (!Tt(e) || e.substr(0, 6) !== "clamp(") ? "clamp(" + e + ")" : e;
}, od = function n() {
  return tn && requestAnimationFrame(n);
}, ja = function() {
  return As = 1;
}, Ka = function() {
  return As = 0;
}, tr = function(e) {
  return e;
}, rn = function(e) {
  return Math.round(e * 1e5) / 1e5 || 0;
}, Hu = function() {
  return typeof window < "u";
}, Vu = function() {
  return N || Hu() && (N = window.gsap) && N.registerPlugin && N;
}, ci = function(e) {
  return !!~ua.indexOf(e);
}, Gu = function(e) {
  return (e === "Height" ? fa : te["inner" + e]) || Pt["client" + e] || fe["client" + e];
}, qu = function(e) {
  return Fr(e, "getBoundingClientRect") || (ci(e) ? function() {
    return ss.width = te.innerWidth, ss.height = fa, ss;
  } : function() {
    return yr(e);
  });
}, ad = function(e, t, r) {
  var i = r.d, s = r.d2, o = r.a;
  return (o = Fr(e, "getBoundingClientRect")) ? function() {
    return o()[i];
  } : function() {
    return (t ? Gu(s) : e["client" + s]) || 0;
  };
}, ld = function(e, t) {
  return !t || ~lr.indexOf(e) ? qu(e) : function() {
    return ss;
  };
}, nr = function(e, t) {
  var r = t.s, i = t.d2, s = t.d, o = t.a;
  return Math.max(0, (r = "scroll" + i) && (o = Fr(e, r)) ? o() - qu(e)()[s] : ci(e) ? (Pt[r] || fe[r]) - Gu(i) : e[r] - e["offset" + i]);
}, Hn = function(e, t) {
  for (var r = 0; r < xi.length; r += 3)
    (!t || ~t.indexOf(xi[r + 1])) && e(xi[r], xi[r + 1], xi[r + 2]);
}, Tt = function(e) {
  return typeof e == "string";
}, tt = function(e) {
  return typeof e == "function";
}, nn = function(e) {
  return typeof e == "number";
}, Jr = function(e) {
  return typeof e == "object";
}, ji = function(e, t, r) {
  return e && e.progress(t ? 0 : 1) && r && e.pause();
}, js = function(e, t) {
  if (e.enabled) {
    var r = e._ctx ? e._ctx.add(function() {
      return t(e);
    }) : t(e);
    r && r.totalTime && (e.callbackAnimation = r);
  }
}, wi = Math.abs, Uu = "left", Wu = "top", da = "right", ha = "bottom", si = "width", oi = "height", hn = "Right", pn = "Left", mn = "Top", gn = "Bottom", ke = "padding", Bt = "margin", Bi = "Width", pa = "Height", Fe = "px", $t = function(e) {
  return te.getComputedStyle(e);
}, ud = function(e) {
  var t = $t(e).position;
  e.style.position = t === "absolute" || t === "fixed" ? t : "relative";
}, Ja = function(e, t) {
  for (var r in t)
    r in e || (e[r] = t[r]);
  return e;
}, yr = function(e, t) {
  var r = t && $t(e)[Ao] !== "matrix(1, 0, 0, 1, 0, 0)" && N.to(e, {
    x: 0,
    y: 0,
    xPercent: 0,
    yPercent: 0,
    rotation: 0,
    rotationX: 0,
    rotationY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0
  }).progress(1), i = e.getBoundingClientRect();
  return r && r.progress(0).kill(), i;
}, bs = function(e, t) {
  var r = t.d2;
  return e["offset" + r] || e["client" + r] || 0;
}, Yu = function(e) {
  var t = [], r = e.labels, i = e.duration(), s;
  for (s in r)
    t.push(r[s] / i);
  return t;
}, cd = function(e) {
  return function(t) {
    return N.utils.snap(Yu(e), t);
  };
}, ma = function(e) {
  var t = N.utils.snap(e), r = Array.isArray(e) && e.slice(0).sort(function(i, s) {
    return i - s;
  });
  return r ? function(i, s, o) {
    o === void 0 && (o = 1e-3);
    var a;
    if (!s)
      return t(i);
    if (s > 0) {
      for (i -= o, a = 0; a < r.length; a++)
        if (r[a] >= i)
          return r[a];
      return r[a - 1];
    } else
      for (a = r.length, i += o; a--; )
        if (r[a] <= i)
          return r[a];
    return r[0];
  } : function(i, s, o) {
    o === void 0 && (o = 1e-3);
    var a = t(i);
    return !s || Math.abs(a - i) < o || a - i < 0 == s < 0 ? a : t(s < 0 ? i - e : i + e);
  };
}, fd = function(e) {
  return function(t, r) {
    return ma(Yu(e))(t, r.direction);
  };
}, Vn = function(e, t, r, i) {
  return r.split(",").forEach(function(s) {
    return e(t, s, i);
  });
}, Ge = function(e, t, r, i, s) {
  return e.addEventListener(t, r, {
    passive: !i,
    capture: !!s
  });
}, Ve = function(e, t, r, i) {
  return e.removeEventListener(t, r, !!i);
}, Gn = function(e, t, r) {
  r = r && r.wheelHandler, r && (e(t, "wheel", r), e(t, "touchmove", r));
}, Qa = {
  startColor: "green",
  endColor: "red",
  indent: 0,
  fontSize: "16px",
  fontWeight: "normal"
}, qn = {
  toggleActions: "play",
  anticipatePin: 0
}, Ss = {
  top: 0,
  left: 0,
  center: 0.5,
  bottom: 1,
  right: 1
}, ts = function(e, t) {
  if (Tt(e)) {
    var r = e.indexOf("="), i = ~r ? +(e.charAt(r - 1) + 1) * parseFloat(e.substr(r + 1)) : 0;
    ~r && (e.indexOf("%") > r && (i *= t / 100), e = e.substr(0, r - 1)), e = i + (e in Ss ? Ss[e] * t : ~e.indexOf("%") ? parseFloat(e) * t / 100 : parseFloat(e) || 0);
  }
  return e;
}, Un = function(e, t, r, i, s, o, a, l) {
  var u = s.startColor, c = s.endColor, f = s.fontSize, h = s.indent, d = s.fontWeight, _ = me.createElement("div"), p = ci(r) || Fr(r, "pinType") === "fixed", g = e.indexOf("scroller") !== -1, m = p ? fe : r, v = e.indexOf("start") !== -1, y = v ? u : c, w = "border-color:" + y + ";font-size:" + f + ";color:" + y + ";font-weight:" + d + ";pointer-events:none;white-space:nowrap;font-family:sans-serif,Arial;z-index:1000;padding:4px 8px;border-width:0;border-style:solid;";
  return w += "position:" + ((g || l) && p ? "fixed;" : "absolute;"), (g || l || !p) && (w += (i === Ne ? da : ha) + ":" + (o + parseFloat(h)) + "px;"), a && (w += "box-sizing:border-box;text-align:left;width:" + a.offsetWidth + "px;"), _._isStart = v, _.setAttribute("class", "gsap-marker-" + e + (t ? " marker-" + t : "")), _.style.cssText = w, _.innerText = t || t === 0 ? e + "-" + t : e, m.children[0] ? m.insertBefore(_, m.children[0]) : m.appendChild(_), _._offset = _["offset" + i.op.d2], rs(_, 0, i, v), _;
}, rs = function(e, t, r, i) {
  var s = {
    display: "block"
  }, o = r[i ? "os2" : "p2"], a = r[i ? "p2" : "os2"];
  e._isFlipped = i, s[r.a + "Percent"] = i ? -100 : 0, s[r.a] = i ? "1px" : 0, s["border" + o + Bi] = 1, s["border" + a + Bi] = 0, s[r.p] = t + "px", N.set(e, s);
}, Z = [], Do = {}, Cn, Za = function() {
  return Ze() - Vt > 34 && (Cn || (Cn = requestAnimationFrame(br)));
}, bi = function() {
  (!lt || !lt.isPressed || lt.startX > fe.clientWidth) && (re.cache++, lt ? Cn || (Cn = requestAnimationFrame(br)) : br(), Vt || di("scrollStart"), Vt = Ze());
}, Ks = function() {
  $u = te.innerWidth, Bu = te.innerHeight;
}, sn = function(e) {
  re.cache++, (e === !0 || !Qe && !Nu && !me.fullscreenElement && !me.webkitFullscreenElement && (!Ro || $u !== te.innerWidth || Math.abs(te.innerHeight - Bu) > te.innerHeight * 0.25)) && ys.restart(!0);
}, fi = {}, dd = [], Xu = function n() {
  return Ve(ie, "scrollEnd", n) || Zr(!0);
}, di = function(e) {
  return fi[e] && fi[e].map(function(t) {
    return t();
  }) || dd;
}, xt = [], ju = function(e) {
  for (var t = 0; t < xt.length; t += 5)
    (!e || xt[t + 4] && xt[t + 4].query === e) && (xt[t].style.cssText = xt[t + 1], xt[t].getBBox && xt[t].setAttribute("transform", xt[t + 2] || ""), xt[t + 3].uncache = 1);
}, ga = function(e, t) {
  var r;
  for (ut = 0; ut < Z.length; ut++)
    r = Z[ut], r && (!t || r._ctx === t) && (e ? r.kill(1) : r.revert(!0, !0));
  ws = !0, t && ju(t), t || di("revert");
}, Ku = function(e, t) {
  re.cache++, (t || !ct) && re.forEach(function(r) {
    return tt(r) && r.cacheID++ && (r.rec = 0);
  }), Tt(e) && (te.history.scrollRestoration = ca = e);
}, ct, ai = 0, el, hd = function() {
  if (el !== ai) {
    var e = el = ai;
    requestAnimationFrame(function() {
      return e === ai && Zr(!0);
    });
  }
}, Ju = function() {
  fe.appendChild(Ri), fa = !lt && Ri.offsetHeight || te.innerHeight, fe.removeChild(Ri);
}, tl = function(e) {
  return En(".gsap-marker-start, .gsap-marker-end, .gsap-marker-scroller-start, .gsap-marker-scroller-end").forEach(function(t) {
    return t.style.display = e ? "none" : "block";
  });
}, Zr = function(e, t) {
  if (Pt = me.documentElement, fe = me.body, ua = [te, me, Pt, fe], Vt && !e && !ws) {
    Ge(ie, "scrollEnd", Xu);
    return;
  }
  Ju(), ct = ie.isRefreshing = !0, re.forEach(function(i) {
    return tt(i) && ++i.cacheID && (i.rec = i());
  });
  var r = di("refreshInit");
  Fu && ie.sort(), t || ga(), re.forEach(function(i) {
    tt(i) && (i.smooth && (i.target.style.scrollBehavior = "auto"), i(0));
  }), Z.slice(0).forEach(function(i) {
    return i.refresh();
  }), ws = !1, Z.forEach(function(i) {
    if (i._subPinOffset && i.pin) {
      var s = i.vars.horizontal ? "offsetWidth" : "offsetHeight", o = i.pin[s];
      i.revert(!0, 1), i.adjustPinSpacing(i.pin[s] - o), i.refresh();
    }
  }), Lo = 1, tl(!0), Z.forEach(function(i) {
    var s = nr(i.scroller, i._dir), o = i.vars.end === "max" || i._endClamp && i.end > s, a = i._startClamp && i.start >= s;
    (o || a) && i.setPositions(a ? s - 1 : i.start, o ? Math.max(a ? s : i.start + 1, s) : i.end, !0);
  }), tl(!1), Lo = 0, r.forEach(function(i) {
    return i && i.render && i.render(-1);
  }), re.forEach(function(i) {
    tt(i) && (i.smooth && requestAnimationFrame(function() {
      return i.target.style.scrollBehavior = "smooth";
    }), i.rec && i(i.rec));
  }), Ku(ca, 1), ys.pause(), ai++, ct = 2, br(2), Z.forEach(function(i) {
    return tt(i.vars.onRefresh) && i.vars.onRefresh(i);
  }), ct = ie.isRefreshing = !1, di("refresh");
}, zo = 0, is = 1, _n, br = function(e) {
  if (e === 2 || !ct && !ws) {
    ie.isUpdating = !0, _n && _n.update(0);
    var t = Z.length, r = Ze(), i = r - Xs >= 50, s = t && Z[0].scroll();
    if (is = zo > s ? -1 : 1, ct || (zo = s), i && (Vt && !As && r - Vt > 200 && (Vt = 0, di("scrollEnd")), en = Xs, Xs = r), is < 0) {
      for (ut = t; ut-- > 0; )
        Z[ut] && Z[ut].update(0, i);
      is = 1;
    } else
      for (ut = 0; ut < t; ut++)
        Z[ut] && Z[ut].update(0, i);
    ie.isUpdating = !1;
  }
  Cn = 0;
}, Io = [Uu, Wu, ha, da, Bt + gn, Bt + hn, Bt + mn, Bt + pn, "display", "flexShrink", "float", "zIndex", "gridColumnStart", "gridColumnEnd", "gridRowStart", "gridRowEnd", "gridArea", "justifySelf", "alignSelf", "placeSelf", "order"], ns = Io.concat([si, oi, "boxSizing", "max" + Bi, "max" + pa, "position", Bt, ke, ke + mn, ke + hn, ke + gn, ke + pn]), pd = function(e, t, r) {
  ki(r);
  var i = e._gsap;
  if (i.spacerIsNative)
    ki(i.spacerState);
  else if (e._gsap.swappedIn) {
    var s = t.parentNode;
    s && (s.insertBefore(e, t), s.removeChild(t));
  }
  e._gsap.swappedIn = !1;
}, Js = function(e, t, r, i) {
  if (!e._gsap.swappedIn) {
    for (var s = Io.length, o = t.style, a = e.style, l; s--; )
      l = Io[s], o[l] = r[l];
    o.position = r.position === "absolute" ? "absolute" : "relative", r.display === "inline" && (o.display = "inline-block"), a[ha] = a[da] = "auto", o.flexBasis = r.flexBasis || "auto", o.overflow = "visible", o.boxSizing = "border-box", o[si] = bs(e, dt) + Fe, o[oi] = bs(e, Ne) + Fe, o[ke] = a[Bt] = a[Wu] = a[Uu] = "0", ki(i), a[si] = a["max" + Bi] = r[si], a[oi] = a["max" + pa] = r[oi], a[ke] = r[ke], e.parentNode !== t && (e.parentNode.insertBefore(t, e), t.appendChild(e)), e._gsap.swappedIn = !0;
  }
}, md = /([A-Z])/g, ki = function(e) {
  if (e) {
    var t = e.t.style, r = e.length, i = 0, s, o;
    for ((e.t._gsap || N.core.getCache(e.t)).uncache = 1; i < r; i += 2)
      o = e[i + 1], s = e[i], o ? t[s] = o : t[s] && t.removeProperty(s.replace(md, "-$1").toLowerCase());
  }
}, Wn = function(e) {
  for (var t = ns.length, r = e.style, i = [], s = 0; s < t; s++)
    i.push(ns[s], r[ns[s]]);
  return i.t = e, i;
}, gd = function(e, t, r) {
  for (var i = [], s = e.length, o = r ? 8 : 0, a; o < s; o += 2)
    a = e[o], i.push(a, a in t ? t[a] : e[o + 1]);
  return i.t = e.t, i;
}, ss = {
  left: 0,
  top: 0
}, rl = function(e, t, r, i, s, o, a, l, u, c, f, h, d, _) {
  tt(e) && (e = e(l)), Tt(e) && e.substr(0, 3) === "max" && (e = h + (e.charAt(4) === "=" ? ts("0" + e.substr(3), r) : 0));
  var p = d ? d.time() : 0, g, m, v;
  if (d && d.seek(0), isNaN(e) || (e = +e), nn(e))
    d && (e = N.utils.mapRange(d.scrollTrigger.start, d.scrollTrigger.end, 0, h, e)), a && rs(a, r, i, !0);
  else {
    tt(t) && (t = t(l));
    var y = (e || "0").split(" "), w, b, S, T;
    v = pt(t, l) || fe, w = yr(v) || {}, (!w || !w.left && !w.top) && $t(v).display === "none" && (T = v.style.display, v.style.display = "block", w = yr(v), T ? v.style.display = T : v.style.removeProperty("display")), b = ts(y[0], w[i.d]), S = ts(y[1] || "0", r), e = w[i.p] - u[i.p] - c + b + s - S, a && rs(a, S, i, r - S < 20 || a._isStart && S > 20), r -= r - S;
  }
  if (_ && (l[_] = e || -1e-3, e < 0 && (e = 0)), o) {
    var O = e + r, E = o._isStart;
    g = "scroll" + i.d2, rs(o, O, i, E && O > 20 || !E && (f ? Math.max(fe[g], Pt[g]) : o.parentNode[g]) <= O + 1), f && (u = yr(a), f && (o.style[i.op.p] = u[i.op.p] - i.op.m - o._offset + Fe));
  }
  return d && v && (g = yr(v), d.seek(h), m = yr(v), d._caScrollDist = g[i.p] - m[i.p], e = e / d._caScrollDist * h), d && d.seek(p), d ? e : Math.round(e);
}, _d = /(webkit|moz|length|cssText|inset)/i, il = function(e, t, r, i) {
  if (e.parentNode !== t) {
    var s = e.style, o, a;
    if (t === fe) {
      e._stOrig = s.cssText, a = $t(e);
      for (o in a)
        !+o && !_d.test(o) && a[o] && typeof s[o] == "string" && o !== "0" && (s[o] = a[o]);
      s.top = r, s.left = i;
    } else
      s.cssText = e._stOrig;
    N.core.getCache(e).uncache = 1, t.appendChild(e);
  }
}, Qu = function(e, t, r) {
  var i = t, s = i;
  return function(o) {
    var a = Math.round(e());
    return a !== i && a !== s && Math.abs(a - i) > 3 && Math.abs(a - s) > 3 && (o = a, r && r()), s = i, i = Math.round(o), i;
  };
}, Yn = function(e, t, r) {
  var i = {};
  i[t.p] = "+=" + r, N.set(e, i);
}, nl = function(e, t) {
  var r = $r(e, t), i = "_scroll" + t.p2, s = function o(a, l, u, c, f) {
    var h = o.tween, d = l.onComplete, _ = {};
    u = u || r();
    var p = Qu(r, u, function() {
      h.kill(), o.tween = 0;
    });
    return f = c && f || 0, c = c || a - u, h && h.kill(), l[i] = a, l.inherit = !1, l.modifiers = _, _[i] = function() {
      return p(u + c * h.ratio + f * h.ratio * h.ratio);
    }, l.onUpdate = function() {
      re.cache++, o.tween && br();
    }, l.onComplete = function() {
      o.tween = 0, d && d.call(h);
    }, h = o.tween = N.to(e, l), h;
  };
  return e[i] = r, r.wheelHandler = function() {
    return s.tween && s.tween.kill() && (s.tween = 0);
  }, Ge(e, "wheel", r.wheelHandler), ie.isTouch && Ge(e, "touchmove", r.wheelHandler), s;
}, ie = /* @__PURE__ */ function() {
  function n(t, r) {
    Si || n.register(N) || console.warn("Please gsap.registerPlugin(ScrollTrigger)"), ko(this), this.init(t, r);
  }
  var e = n.prototype;
  return e.init = function(r, i) {
    if (this.progress = this.start = 0, this.vars && this.kill(!0, !0), !tn) {
      this.update = this.refresh = this.kill = tr;
      return;
    }
    r = Ja(Tt(r) || nn(r) || r.nodeType ? {
      trigger: r
    } : r, qn);
    var s = r, o = s.onUpdate, a = s.toggleClass, l = s.id, u = s.onToggle, c = s.onRefresh, f = s.scrub, h = s.trigger, d = s.pin, _ = s.pinSpacing, p = s.invalidateOnRefresh, g = s.anticipatePin, m = s.onScrubComplete, v = s.onSnapComplete, y = s.once, w = s.snap, b = s.pinReparent, S = s.pinSpacer, T = s.containerAnimation, O = s.fastScrollEnd, E = s.preventOverlaps, P = r.horizontal || r.containerAnimation && r.horizontal !== !1 ? dt : Ne, R = !f && f !== 0, C = pt(r.scroller || te), L = N.core.getCache(C), z = ci(C), H = ("pinType" in r ? r.pinType : Fr(C, "pinType") || z && "fixed") === "fixed", W = [r.onEnter, r.onLeave, r.onEnterBack, r.onLeaveBack], B = R && r.toggleActions.split(" "), U = "markers" in r ? r.markers : qn.markers, ne = z ? 0 : parseFloat($t(C)["border" + P.p2 + Bi]) || 0, x = this, le = r.onRefreshInit && function() {
      return r.onRefreshInit(x);
    }, Ee = ad(C, z, P), k = ld(C, z), D = 0, F = 0, G = 0, $ = $r(C, P), J, ee, de, ue, Se, Q, ve, Be, st, M, bt, cr, Tr, Ce, fr, Er, Vr, $e, Cr, Pe, Gt, It, dr, Vi, Re, Rn, hr, gi, _i, Pr, Gr, se, qr, qt, Ut, Wt, Ur, vi, pr;
    if (x._startClamp = x._endClamp = !1, x._dir = P, g *= 45, x.scroller = C, x.scroll = T ? T.time.bind(T) : $, ue = $(), x.vars = r, i = i || r.animation, "refreshPriority" in r && (Fu = 1, r.refreshPriority === -9999 && (_n = x)), L.tweenScroll = L.tweenScroll || {
      top: nl(C, Ne),
      left: nl(C, dt)
    }, x.tweenTo = J = L.tweenScroll[P.p], x.scrubDuration = function(I) {
      qr = nn(I) && I, qr ? se ? se.duration(I) : se = N.to(i, {
        ease: "expo",
        totalProgress: "+=0",
        inherit: !1,
        duration: qr,
        paused: !0,
        onComplete: function() {
          return m && m(x);
        }
      }) : (se && se.progress(1).kill(), se = 0);
    }, i && (i.vars.lazy = !1, i._initted && !x.isReverted || i.vars.immediateRender !== !1 && r.immediateRender !== !1 && i.duration() && i.render(0, !0, !0), x.animation = i.pause(), i.scrollTrigger = x, x.scrubDuration(f), Pr = 0, l || (l = i.vars.id)), w && ((!Jr(w) || w.push) && (w = {
      snapTo: w
    }), "scrollBehavior" in fe.style && N.set(z ? [fe, Pt] : C, {
      scrollBehavior: "auto"
    }), re.forEach(function(I) {
      return tt(I) && I.target === (z ? me.scrollingElement || Pt : C) && (I.smooth = !1);
    }), de = tt(w.snapTo) ? w.snapTo : w.snapTo === "labels" ? cd(i) : w.snapTo === "labelsDirectional" ? fd(i) : w.directional !== !1 ? function(I, Y) {
      return ma(w.snapTo)(I, Ze() - F < 500 ? 0 : Y.direction);
    } : N.utils.snap(w.snapTo), qt = w.duration || {
      min: 0.1,
      max: 2
    }, qt = Jr(qt) ? dn(qt.min, qt.max) : dn(qt, qt), Ut = N.delayedCall(w.delay || qr / 2 || 0.1, function() {
      var I = $(), Y = Ze() - F < 500, V = J.tween;
      if ((Y || Math.abs(x.getVelocity()) < 10) && !V && !As && D !== I) {
        var X = (I - Q) / Ce, He = i && !R ? i.totalProgress() : X, oe = Y ? 0 : (He - Gr) / (Ze() - en) * 1e3 || 0, Oe = N.utils.clamp(-X, 1 - X, wi(oe / 2) * oe / 0.185), je = X + (w.inertia === !1 ? 0 : Oe), xe, ge, he = w, Yt = he.onStart, ye = he.onInterrupt, St = he.onComplete;
        if (xe = de(je, x), nn(xe) || (xe = je), ge = Math.max(0, Math.round(Q + xe * Ce)), I <= ve && I >= Q && ge !== I) {
          if (V && !V._initted && V.data <= wi(ge - I))
            return;
          w.inertia === !1 && (Oe = xe - X), J(ge, {
            duration: qt(wi(Math.max(wi(je - He), wi(xe - He)) * 0.185 / oe / 0.05 || 0)),
            ease: w.ease || "power3",
            data: wi(ge - I),
            // record the distance so that if another snap tween occurs (conflict) we can prioritize the closest snap.
            onInterrupt: function() {
              return Ut.restart(!0) && ye && ye(x);
            },
            onComplete: function() {
              x.update(), D = $(), i && !R && (se ? se.resetTo("totalProgress", xe, i._tTime / i._tDur) : i.progress(xe)), Pr = Gr = i && !R ? i.totalProgress() : x.progress, v && v(x), St && St(x);
            }
          }, I, Oe * Ce, ge - I - Oe * Ce), Yt && Yt(x, J.tween);
        }
      } else x.isActive && D !== I && Ut.restart(!0);
    }).pause()), l && (Do[l] = x), h = x.trigger = pt(h || d !== !0 && d), pr = h && h._gsap && h._gsap.stRevert, pr && (pr = pr(x)), d = d === !0 ? h : pt(d), Tt(a) && (a = {
      targets: h,
      className: a
    }), d && (_ === !1 || _ === Bt || (_ = !_ && d.parentNode && d.parentNode.style && $t(d.parentNode).display === "flex" ? !1 : ke), x.pin = d, ee = N.core.getCache(d), ee.spacer ? fr = ee.pinState : (S && (S = pt(S), S && !S.nodeType && (S = S.current || S.nativeElement), ee.spacerIsNative = !!S, S && (ee.spacerState = Wn(S))), ee.spacer = $e = S || me.createElement("div"), $e.classList.add("pin-spacer"), l && $e.classList.add("pin-spacer-" + l), ee.pinState = fr = Wn(d)), r.force3D !== !1 && N.set(d, {
      force3D: !0
    }), x.spacer = $e = ee.spacer, _i = $t(d), Vi = _i[_ + P.os2], Pe = N.getProperty(d), Gt = N.quickSetter(d, P.a, Fe), Js(d, $e, _i), Vr = Wn(d)), U) {
      cr = Jr(U) ? Ja(U, Qa) : Qa, M = Un("scroller-start", l, C, P, cr, 0), bt = Un("scroller-end", l, C, P, cr, 0, M), Cr = M["offset" + P.op.d2];
      var Gi = pt(Fr(C, "content") || C);
      Be = this.markerStart = Un("start", l, Gi, P, cr, Cr, 0, T), st = this.markerEnd = Un("end", l, Gi, P, cr, Cr, 0, T), T && (vi = N.quickSetter([Be, st], P.a, Fe)), !H && !(lr.length && Fr(C, "fixedMarkers") === !0) && (ud(z ? fe : C), N.set([M, bt], {
        force3D: !0
      }), Rn = N.quickSetter(M, P.a, Fe), gi = N.quickSetter(bt, P.a, Fe));
    }
    if (T) {
      var j = T.vars.onUpdate, q = T.vars.onUpdateParams;
      T.eventCallback("onUpdate", function() {
        x.update(0, 0, 1), j && j.apply(T, q || []);
      });
    }
    if (x.previous = function() {
      return Z[Z.indexOf(x) - 1];
    }, x.next = function() {
      return Z[Z.indexOf(x) + 1];
    }, x.revert = function(I, Y) {
      if (!Y)
        return x.kill(!0);
      var V = I !== !1 || !x.enabled, X = Qe;
      V !== x.isReverted && (V && (Wt = Math.max($(), x.scroll.rec || 0), G = x.progress, Ur = i && i.progress()), Be && [Be, st, M, bt].forEach(function(He) {
        return He.style.display = V ? "none" : "block";
      }), V && (Qe = x, x.update(V)), d && (!b || !x.isActive) && (V ? pd(d, $e, fr) : Js(d, $e, $t(d), Re)), V || x.update(V), Qe = X, x.isReverted = V);
    }, x.refresh = function(I, Y, V, X) {
      if (!((Qe || !x.enabled) && !Y)) {
        if (d && I && Vt) {
          Ge(n, "scrollEnd", Xu);
          return;
        }
        !ct && le && le(x), Qe = x, J.tween && !V && (J.tween.kill(), J.tween = 0), se && se.pause(), p && i && i.revert({
          kill: !1
        }).invalidate(), x.isReverted || x.revert(!0, !0), x._subPinOffset = !1;
        var He = Ee(), oe = k(), Oe = T ? T.duration() : nr(C, P), je = Ce <= 0.01, xe = 0, ge = X || 0, he = Jr(V) ? V.end : r.end, Yt = r.endTrigger || h, ye = Jr(V) ? V.start : r.start || (r.start === 0 || !h ? 0 : d ? "0 0" : "0 100%"), St = x.pinnedContainer = r.pinnedContainer && pt(r.pinnedContainer, x), Kt = h && Math.max(0, Z.indexOf(x)) || 0, Ue = Kt, We, Ke, Wr, kn, Je, Ie, Jt, Fs, Sa, qi, Qt, Ui, Ln;
        for (U && Jr(V) && (Ui = N.getProperty(M, P.p), Ln = N.getProperty(bt, P.p)); Ue-- > 0; )
          Ie = Z[Ue], Ie.end || Ie.refresh(0, 1) || (Qe = x), Jt = Ie.pin, Jt && (Jt === h || Jt === d || Jt === St) && !Ie.isReverted && (qi || (qi = []), qi.unshift(Ie), Ie.revert(!0, !0)), Ie !== Z[Ue] && (Kt--, Ue--);
        for (tt(ye) && (ye = ye(x)), ye = Ya(ye, "start", x), Q = rl(ye, h, He, P, $(), Be, M, x, oe, ne, H, Oe, T, x._startClamp && "_startClamp") || (d ? -1e-3 : 0), tt(he) && (he = he(x)), Tt(he) && !he.indexOf("+=") && (~he.indexOf(" ") ? he = (Tt(ye) ? ye.split(" ")[0] : "") + he : (xe = ts(he.substr(2), He), he = Tt(ye) ? ye : (T ? N.utils.mapRange(0, T.duration(), T.scrollTrigger.start, T.scrollTrigger.end, Q) : Q) + xe, Yt = h)), he = Ya(he, "end", x), ve = Math.max(Q, rl(he || (Yt ? "100% 0" : Oe), Yt, He, P, $() + xe, st, bt, x, oe, ne, H, Oe, T, x._endClamp && "_endClamp")) || -1e-3, xe = 0, Ue = Kt; Ue--; )
          Ie = Z[Ue], Jt = Ie.pin, Jt && Ie.start - Ie._pinPush <= Q && !T && Ie.end > 0 && (We = Ie.end - (x._startClamp ? Math.max(0, Ie.start) : Ie.start), (Jt === h && Ie.start - Ie._pinPush < Q || Jt === St) && isNaN(ye) && (xe += We * (1 - Ie.progress)), Jt === d && (ge += We));
        if (Q += xe, ve += xe, x._startClamp && (x._startClamp += xe), x._endClamp && !ct && (x._endClamp = ve || -1e-3, ve = Math.min(ve, nr(C, P))), Ce = ve - Q || (Q -= 0.01) && 1e-3, je && (G = N.utils.clamp(0, 1, N.utils.normalize(Q, ve, Wt))), x._pinPush = ge, Be && xe && (We = {}, We[P.a] = "+=" + xe, St && (We[P.p] = "-=" + $()), N.set([Be, st], We)), d && !(Lo && x.end >= nr(C, P)))
          We = $t(d), kn = P === Ne, Wr = $(), It = parseFloat(Pe(P.a)) + ge, !Oe && ve > 1 && (Qt = (z ? me.scrollingElement || Pt : C).style, Qt = {
            style: Qt,
            value: Qt["overflow" + P.a.toUpperCase()]
          }, z && $t(fe)["overflow" + P.a.toUpperCase()] !== "scroll" && (Qt.style["overflow" + P.a.toUpperCase()] = "scroll")), Js(d, $e, We), Vr = Wn(d), Ke = yr(d, !0), Fs = H && $r(C, kn ? dt : Ne)(), _ ? (Re = [_ + P.os2, Ce + ge + Fe], Re.t = $e, Ue = _ === ke ? bs(d, P) + Ce + ge : 0, Ue && (Re.push(P.d, Ue + Fe), $e.style.flexBasis !== "auto" && ($e.style.flexBasis = Ue + Fe)), ki(Re), St && Z.forEach(function(Wi) {
            Wi.pin === St && Wi.vars.pinSpacing !== !1 && (Wi._subPinOffset = !0);
          }), H && $(Wt)) : (Ue = bs(d, P), Ue && $e.style.flexBasis !== "auto" && ($e.style.flexBasis = Ue + Fe)), H && (Je = {
            top: Ke.top + (kn ? Wr - Q : Fs) + Fe,
            left: Ke.left + (kn ? Fs : Wr - Q) + Fe,
            boxSizing: "border-box",
            position: "fixed"
          }, Je[si] = Je["max" + Bi] = Math.ceil(Ke.width) + Fe, Je[oi] = Je["max" + pa] = Math.ceil(Ke.height) + Fe, Je[Bt] = Je[Bt + mn] = Je[Bt + hn] = Je[Bt + gn] = Je[Bt + pn] = "0", Je[ke] = We[ke], Je[ke + mn] = We[ke + mn], Je[ke + hn] = We[ke + hn], Je[ke + gn] = We[ke + gn], Je[ke + pn] = We[ke + pn], Er = gd(fr, Je, b), ct && $(0)), i ? (Sa = i._initted, Ws(1), i.render(i.duration(), !0, !0), dr = Pe(P.a) - It + Ce + ge, hr = Math.abs(Ce - dr) > 1, H && hr && Er.splice(Er.length - 2, 2), i.render(0, !0, !0), Sa || i.invalidate(!0), i.parent || i.totalTime(i.totalTime()), Ws(0)) : dr = Ce, Qt && (Qt.value ? Qt.style["overflow" + P.a.toUpperCase()] = Qt.value : Qt.style.removeProperty("overflow-" + P.a));
        else if (h && $() && !T)
          for (Ke = h.parentNode; Ke && Ke !== fe; )
            Ke._pinOffset && (Q -= Ke._pinOffset, ve -= Ke._pinOffset), Ke = Ke.parentNode;
        qi && qi.forEach(function(Wi) {
          return Wi.revert(!1, !0);
        }), x.start = Q, x.end = ve, ue = Se = ct ? Wt : $(), !T && !ct && (ue < Wt && $(Wt), x.scroll.rec = 0), x.revert(!1, !0), F = Ze(), Ut && (D = -1, Ut.restart(!0)), Qe = 0, i && R && (i._initted || Ur) && i.progress() !== Ur && i.progress(Ur || 0, !0).render(i.time(), !0, !0), (je || G !== x.progress || T || p || i && !i._initted) && (i && !R && i.totalProgress(T && Q < -1e-3 && !G ? N.utils.normalize(Q, ve, 0) : G, !0), x.progress = je || (ue - Q) / Ce === G ? 0 : G), d && _ && ($e._pinOffset = Math.round(x.progress * dr)), se && se.invalidate(), isNaN(Ui) || (Ui -= N.getProperty(M, P.p), Ln -= N.getProperty(bt, P.p), Yn(M, P, Ui), Yn(Be, P, Ui - (X || 0)), Yn(bt, P, Ln), Yn(st, P, Ln - (X || 0))), je && !ct && x.update(), c && !ct && !Tr && (Tr = !0, c(x), Tr = !1);
      }
    }, x.getVelocity = function() {
      return ($() - Se) / (Ze() - en) * 1e3 || 0;
    }, x.endAnimation = function() {
      ji(x.callbackAnimation), i && (se ? se.progress(1) : i.paused() ? R || ji(i, x.direction < 0, 1) : ji(i, i.reversed()));
    }, x.labelToScroll = function(I) {
      return i && i.labels && (Q || x.refresh() || Q) + i.labels[I] / i.duration() * Ce || 0;
    }, x.getTrailing = function(I) {
      var Y = Z.indexOf(x), V = x.direction > 0 ? Z.slice(0, Y).reverse() : Z.slice(Y + 1);
      return (Tt(I) ? V.filter(function(X) {
        return X.vars.preventOverlaps === I;
      }) : V).filter(function(X) {
        return x.direction > 0 ? X.end <= Q : X.start >= ve;
      });
    }, x.update = function(I, Y, V) {
      if (!(T && !V && !I)) {
        var X = ct === !0 ? Wt : x.scroll(), He = I ? 0 : (X - Q) / Ce, oe = He < 0 ? 0 : He > 1 ? 1 : He || 0, Oe = x.progress, je, xe, ge, he, Yt, ye, St, Kt;
        if (Y && (Se = ue, ue = T ? $() : X, w && (Gr = Pr, Pr = i && !R ? i.totalProgress() : oe)), g && d && !Qe && !$n && Vt && (!oe && Q < X + (X - Se) / (Ze() - en) * g ? oe = 1e-4 : oe === 1 && ve > X + (X - Se) / (Ze() - en) * g && (oe = 0.9999)), oe !== Oe && x.enabled) {
          if (je = x.isActive = !!oe && oe < 1, xe = !!Oe && Oe < 1, ye = je !== xe, Yt = ye || !!oe != !!Oe, x.direction = oe > Oe ? 1 : -1, x.progress = oe, Yt && !Qe && (ge = oe && !Oe ? 0 : oe === 1 ? 1 : Oe === 1 ? 2 : 3, R && (he = !ye && B[ge + 1] !== "none" && B[ge + 1] || B[ge], Kt = i && (he === "complete" || he === "reset" || he in i))), E && (ye || Kt) && (Kt || f || !i) && (tt(E) ? E(x) : x.getTrailing(E).forEach(function(Wr) {
            return Wr.endAnimation();
          })), R || (se && !Qe && !$n ? (se._dp._time - se._start !== se._time && se.render(se._dp._time - se._start), se.resetTo ? se.resetTo("totalProgress", oe, i._tTime / i._tDur) : (se.vars.totalProgress = oe, se.invalidate().restart())) : i && i.totalProgress(oe, !!(Qe && (F || I)))), d) {
            if (I && _ && ($e.style[_ + P.os2] = Vi), !H)
              Gt(rn(It + dr * oe));
            else if (Yt) {
              if (St = !I && oe > Oe && ve + 1 > X && X + 1 >= nr(C, P), b)
                if (!I && (je || St)) {
                  var Ue = yr(d, !0), We = X - Q;
                  il(d, fe, Ue.top + (P === Ne ? We : 0) + Fe, Ue.left + (P === Ne ? 0 : We) + Fe);
                } else
                  il(d, $e);
              ki(je || St ? Er : Vr), hr && oe < 1 && je || Gt(It + (oe === 1 && !St ? dr : 0));
            }
          }
          w && !J.tween && !Qe && !$n && Ut.restart(!0), a && (ye || y && oe && (oe < 1 || !Ys)) && En(a.targets).forEach(function(Wr) {
            return Wr.classList[je || y ? "add" : "remove"](a.className);
          }), o && !R && !I && o(x), Yt && !Qe ? (R && (Kt && (he === "complete" ? i.pause().totalProgress(1) : he === "reset" ? i.restart(!0).pause() : he === "restart" ? i.restart(!0) : i[he]()), o && o(x)), (ye || !Ys) && (u && ye && js(x, u), W[ge] && js(x, W[ge]), y && (oe === 1 ? x.kill(!1, 1) : W[ge] = 0), ye || (ge = oe === 1 ? 1 : 3, W[ge] && js(x, W[ge]))), O && !je && Math.abs(x.getVelocity()) > (nn(O) ? O : 2500) && (ji(x.callbackAnimation), se ? se.progress(1) : ji(i, he === "reverse" ? 1 : !oe, 1))) : R && o && !Qe && o(x);
        }
        if (gi) {
          var Ke = T ? X / T.duration() * (T._caScrollDist || 0) : X;
          Rn(Ke + (M._isFlipped ? 1 : 0)), gi(Ke);
        }
        vi && vi(-X / T.duration() * (T._caScrollDist || 0));
      }
    }, x.enable = function(I, Y) {
      x.enabled || (x.enabled = !0, Ge(C, "resize", sn), z || Ge(C, "scroll", bi), le && Ge(n, "refreshInit", le), I !== !1 && (x.progress = G = 0, ue = Se = D = $()), Y !== !1 && x.refresh());
    }, x.getTween = function(I) {
      return I && J ? J.tween : se;
    }, x.setPositions = function(I, Y, V, X) {
      if (T) {
        var He = T.scrollTrigger, oe = T.duration(), Oe = He.end - He.start;
        I = He.start + Oe * I / oe, Y = He.start + Oe * Y / oe;
      }
      x.refresh(!1, !1, {
        start: Xa(I, V && !!x._startClamp),
        end: Xa(Y, V && !!x._endClamp)
      }, X), x.update();
    }, x.adjustPinSpacing = function(I) {
      if (Re && I) {
        var Y = Re.indexOf(P.d) + 1;
        Re[Y] = parseFloat(Re[Y]) + I + Fe, Re[1] = parseFloat(Re[1]) + I + Fe, ki(Re);
      }
    }, x.disable = function(I, Y) {
      if (x.enabled && (I !== !1 && x.revert(!0, !0), x.enabled = x.isActive = !1, Y || se && se.pause(), Wt = 0, ee && (ee.uncache = 1), le && Ve(n, "refreshInit", le), Ut && (Ut.pause(), J.tween && J.tween.kill() && (J.tween = 0)), !z)) {
        for (var V = Z.length; V--; )
          if (Z[V].scroller === C && Z[V] !== x)
            return;
        Ve(C, "resize", sn), z || Ve(C, "scroll", bi);
      }
    }, x.kill = function(I, Y) {
      x.disable(I, Y), se && !Y && se.kill(), l && delete Do[l];
      var V = Z.indexOf(x);
      V >= 0 && Z.splice(V, 1), V === ut && is > 0 && ut--, V = 0, Z.forEach(function(X) {
        return X.scroller === x.scroller && (V = 1);
      }), V || ct || (x.scroll.rec = 0), i && (i.scrollTrigger = null, I && i.revert({
        kill: !1
      }), Y || i.kill()), Be && [Be, st, M, bt].forEach(function(X) {
        return X.parentNode && X.parentNode.removeChild(X);
      }), _n === x && (_n = 0), d && (ee && (ee.uncache = 1), V = 0, Z.forEach(function(X) {
        return X.pin === d && V++;
      }), V || (ee.spacer = 0)), r.onKill && r.onKill(x);
    }, Z.push(x), x.enable(!1, !1), pr && pr(x), i && i.add && !Ce) {
      var ce = x.update;
      x.update = function() {
        x.update = ce, re.cache++, Q || ve || x.refresh();
      }, N.delayedCall(0.01, x.update), Ce = 0.01, Q = ve = 0;
    } else
      x.refresh();
    d && hd();
  }, n.register = function(r) {
    return Si || (N = r || Vu(), Hu() && window.document && n.enable(), Si = tn), Si;
  }, n.defaults = function(r) {
    if (r)
      for (var i in r)
        qn[i] = r[i];
    return qn;
  }, n.disable = function(r, i) {
    tn = 0, Z.forEach(function(o) {
      return o[i ? "kill" : "disable"](r);
    }), Ve(te, "wheel", bi), Ve(me, "scroll", bi), clearInterval(Bn), Ve(me, "touchcancel", tr), Ve(fe, "touchstart", tr), Vn(Ve, me, "pointerdown,touchstart,mousedown", ja), Vn(Ve, me, "pointerup,touchend,mouseup", Ka), ys.kill(), Hn(Ve);
    for (var s = 0; s < re.length; s += 3)
      Gn(Ve, re[s], re[s + 1]), Gn(Ve, re[s], re[s + 2]);
  }, n.enable = function() {
    if (te = window, me = document, Pt = me.documentElement, fe = me.body, N && (En = N.utils.toArray, dn = N.utils.clamp, ko = N.core.context || tr, Ws = N.core.suppressOverwrites || tr, ca = te.history.scrollRestoration || "auto", zo = te.pageYOffset || 0, N.core.globals("ScrollTrigger", n), fe)) {
      tn = 1, Ri = document.createElement("div"), Ri.style.height = "100vh", Ri.style.position = "absolute", Ju(), od(), Ae.register(N), n.isTouch = Ae.isTouch, Or = Ae.isTouch && /(iPad|iPhone|iPod|Mac)/g.test(navigator.userAgent), Ro = Ae.isTouch === 1, Ge(te, "wheel", bi), ua = [te, me, Pt, fe], N.matchMedia ? (n.matchMedia = function(u) {
        var c = N.matchMedia(), f;
        for (f in u)
          c.add(f, u[f]);
        return c;
      }, N.addEventListener("matchMediaInit", function() {
        return ga();
      }), N.addEventListener("matchMediaRevert", function() {
        return ju();
      }), N.addEventListener("matchMedia", function() {
        Zr(0, 1), di("matchMedia");
      }), N.matchMedia().add("(orientation: portrait)", function() {
        return Ks(), Ks;
      })) : console.warn("Requires GSAP 3.11.0 or later"), Ks(), Ge(me, "scroll", bi);
      var r = fe.hasAttribute("style"), i = fe.style, s = i.borderTopStyle, o = N.core.Animation.prototype, a, l;
      for (o.revert || Object.defineProperty(o, "revert", {
        value: function() {
          return this.time(-0.01, !0);
        }
      }), i.borderTopStyle = "solid", a = yr(fe), Ne.m = Math.round(a.top + Ne.sc()) || 0, dt.m = Math.round(a.left + dt.sc()) || 0, s ? i.borderTopStyle = s : i.removeProperty("border-top-style"), r || (fe.setAttribute("style", ""), fe.removeAttribute("style")), Bn = setInterval(Za, 250), N.delayedCall(0.5, function() {
        return $n = 0;
      }), Ge(me, "touchcancel", tr), Ge(fe, "touchstart", tr), Vn(Ge, me, "pointerdown,touchstart,mousedown", ja), Vn(Ge, me, "pointerup,touchend,mouseup", Ka), Ao = N.utils.checkPrefix("transform"), ns.push(Ao), Si = Ze(), ys = N.delayedCall(0.2, Zr).pause(), xi = [me, "visibilitychange", function() {
        var u = te.innerWidth, c = te.innerHeight;
        me.hidden ? (Ua = u, Wa = c) : (Ua !== u || Wa !== c) && sn();
      }, me, "DOMContentLoaded", Zr, te, "load", Zr, te, "resize", sn], Hn(Ge), Z.forEach(function(u) {
        return u.enable(0, 1);
      }), l = 0; l < re.length; l += 3)
        Gn(Ve, re[l], re[l + 1]), Gn(Ve, re[l], re[l + 2]);
    }
  }, n.config = function(r) {
    "limitCallbacks" in r && (Ys = !!r.limitCallbacks);
    var i = r.syncInterval;
    i && clearInterval(Bn) || (Bn = i) && setInterval(Za, i), "ignoreMobileResize" in r && (Ro = n.isTouch === 1 && r.ignoreMobileResize), "autoRefreshEvents" in r && (Hn(Ve) || Hn(Ge, r.autoRefreshEvents || "none"), Nu = (r.autoRefreshEvents + "").indexOf("resize") === -1);
  }, n.scrollerProxy = function(r, i) {
    var s = pt(r), o = re.indexOf(s), a = ci(s);
    ~o && re.splice(o, a ? 6 : 2), i && (a ? lr.unshift(te, i, fe, i, Pt, i) : lr.unshift(s, i));
  }, n.clearMatchMedia = function(r) {
    Z.forEach(function(i) {
      return i._ctx && i._ctx.query === r && i._ctx.kill(!0, !0);
    });
  }, n.isInViewport = function(r, i, s) {
    var o = (Tt(r) ? pt(r) : r).getBoundingClientRect(), a = o[s ? si : oi] * i || 0;
    return s ? o.right - a > 0 && o.left + a < te.innerWidth : o.bottom - a > 0 && o.top + a < te.innerHeight;
  }, n.positionInViewport = function(r, i, s) {
    Tt(r) && (r = pt(r));
    var o = r.getBoundingClientRect(), a = o[s ? si : oi], l = i == null ? a / 2 : i in Ss ? Ss[i] * a : ~i.indexOf("%") ? parseFloat(i) * a / 100 : parseFloat(i) || 0;
    return s ? (o.left + l) / te.innerWidth : (o.top + l) / te.innerHeight;
  }, n.killAll = function(r) {
    if (Z.slice(0).forEach(function(s) {
      return s.vars.id !== "ScrollSmoother" && s.kill();
    }), r !== !0) {
      var i = fi.killAll || [];
      fi = {}, i.forEach(function(s) {
        return s();
      });
    }
  }, n;
}();
ie.version = "3.12.7";
ie.saveStyles = function(n) {
  return n ? En(n).forEach(function(e) {
    if (e && e.style) {
      var t = xt.indexOf(e);
      t >= 0 && xt.splice(t, 5), xt.push(e, e.style.cssText, e.getBBox && e.getAttribute("transform"), N.core.getCache(e), ko());
    }
  }) : xt;
};
ie.revert = function(n, e) {
  return ga(!n, e);
};
ie.create = function(n, e) {
  return new ie(n, e);
};
ie.refresh = function(n) {
  return n ? sn(!0) : (Si || ie.register()) && Zr(!0);
};
ie.update = function(n) {
  return ++re.cache && br(n === !0 ? 2 : 0);
};
ie.clearScrollMemory = Ku;
ie.maxScroll = function(n, e) {
  return nr(n, e ? dt : Ne);
};
ie.getScrollFunc = function(n, e) {
  return $r(pt(n), e ? dt : Ne);
};
ie.getById = function(n) {
  return Do[n];
};
ie.getAll = function() {
  return Z.filter(function(n) {
    return n.vars.id !== "ScrollSmoother";
  });
};
ie.isScrolling = function() {
  return !!Vt;
};
ie.snapDirectional = ma;
ie.addEventListener = function(n, e) {
  var t = fi[n] || (fi[n] = []);
  ~t.indexOf(e) || t.push(e);
};
ie.removeEventListener = function(n, e) {
  var t = fi[n], r = t && t.indexOf(e);
  r >= 0 && t.splice(r, 1);
};
ie.batch = function(n, e) {
  var t = [], r = {}, i = e.interval || 0.016, s = e.batchMax || 1e9, o = function(u, c) {
    var f = [], h = [], d = N.delayedCall(i, function() {
      c(f, h), f = [], h = [];
    }).pause();
    return function(_) {
      f.length || d.restart(!0), f.push(_.trigger), h.push(_), s <= f.length && d.progress(1);
    };
  }, a;
  for (a in e)
    r[a] = a.substr(0, 2) === "on" && tt(e[a]) && a !== "onRefreshInit" ? o(a, e[a]) : e[a];
  return tt(s) && (s = s(), Ge(ie, "refresh", function() {
    return s = e.batchMax();
  })), En(n).forEach(function(l) {
    var u = {};
    for (a in r)
      u[a] = r[a];
    u.trigger = l, t.push(ie.create(u));
  }), t;
};
var sl = function(e, t, r, i) {
  return t > i ? e(i) : t < 0 && e(0), r > i ? (i - t) / (r - t) : r < 0 ? t / (t - r) : 1;
}, Qs = function n(e, t) {
  t === !0 ? e.style.removeProperty("touch-action") : e.style.touchAction = t === !0 ? "auto" : t ? "pan-" + t + (Ae.isTouch ? " pinch-zoom" : "") : "none", e === Pt && n(fe, t);
}, Xn = {
  auto: 1,
  scroll: 1
}, vd = function(e) {
  var t = e.event, r = e.target, i = e.axis, s = (t.changedTouches ? t.changedTouches[0] : t).target, o = s._gsap || N.core.getCache(s), a = Ze(), l;
  if (!o._isScrollT || a - o._isScrollT > 2e3) {
    for (; s && s !== fe && (s.scrollHeight <= s.clientHeight && s.scrollWidth <= s.clientWidth || !(Xn[(l = $t(s)).overflowY] || Xn[l.overflowX])); )
      s = s.parentNode;
    o._isScroll = s && s !== r && !ci(s) && (Xn[(l = $t(s)).overflowY] || Xn[l.overflowX]), o._isScrollT = a;
  }
  (o._isScroll || i === "x") && (t.stopPropagation(), t._gsapAllow = !0);
}, Zu = function(e, t, r, i) {
  return Ae.create({
    target: e,
    capture: !0,
    debounce: !1,
    lockAxis: !0,
    type: t,
    onWheel: i = i && vd,
    onPress: i,
    onDrag: i,
    onScroll: i,
    onEnable: function() {
      return r && Ge(me, Ae.eventTypes[0], al, !1, !0);
    },
    onDisable: function() {
      return Ve(me, Ae.eventTypes[0], al, !0);
    }
  });
}, yd = /(input|label|select|textarea)/i, ol, al = function(e) {
  var t = yd.test(e.target.tagName);
  (t || ol) && (e._gsapAllow = !0, ol = t);
}, wd = function(e) {
  Jr(e) || (e = {}), e.preventDefault = e.isNormalizer = e.allowClicks = !0, e.type || (e.type = "wheel,touch"), e.debounce = !!e.debounce, e.id = e.id || "normalizer";
  var t = e, r = t.normalizeScrollX, i = t.momentum, s = t.allowNestedScroll, o = t.onRelease, a, l, u = pt(e.target) || Pt, c = N.core.globals().ScrollSmoother, f = c && c.get(), h = Or && (e.content && pt(e.content) || f && e.content !== !1 && !f.smooth() && f.content()), d = $r(u, Ne), _ = $r(u, dt), p = 1, g = (Ae.isTouch && te.visualViewport ? te.visualViewport.scale * te.visualViewport.width : te.outerWidth) / te.innerWidth, m = 0, v = tt(i) ? function() {
    return i(a);
  } : function() {
    return i || 2.8;
  }, y, w, b = Zu(u, e.type, !0, s), S = function() {
    return w = !1;
  }, T = tr, O = tr, E = function() {
    l = nr(u, Ne), O = dn(Or ? 1 : 0, l), r && (T = dn(0, nr(u, dt))), y = ai;
  }, P = function() {
    h._gsap.y = rn(parseFloat(h._gsap.y) + d.offset) + "px", h.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + parseFloat(h._gsap.y) + ", 0, 1)", d.offset = d.cacheID = 0;
  }, R = function() {
    if (w) {
      requestAnimationFrame(S);
      var U = rn(a.deltaY / 2), ne = O(d.v - U);
      if (h && ne !== d.v + d.offset) {
        d.offset = ne - d.v;
        var x = rn((parseFloat(h && h._gsap.y) || 0) - d.offset);
        h.style.transform = "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, " + x + ", 0, 1)", h._gsap.y = x + "px", d.cacheID = re.cache, br();
      }
      return !0;
    }
    d.offset && P(), w = !0;
  }, C, L, z, H, W = function() {
    E(), C.isActive() && C.vars.scrollY > l && (d() > l ? C.progress(1) && d(l) : C.resetTo("scrollY", l));
  };
  return h && N.set(h, {
    y: "+=0"
  }), e.ignoreCheck = function(B) {
    return Or && B.type === "touchmove" && R() || p > 1.05 && B.type !== "touchstart" || a.isGesturing || B.touches && B.touches.length > 1;
  }, e.onPress = function() {
    w = !1;
    var B = p;
    p = rn((te.visualViewport && te.visualViewport.scale || 1) / g), C.pause(), B !== p && Qs(u, p > 1.01 ? !0 : r ? !1 : "x"), L = _(), z = d(), E(), y = ai;
  }, e.onRelease = e.onGestureStart = function(B, U) {
    if (d.offset && P(), !U)
      H.restart(!0);
    else {
      re.cache++;
      var ne = v(), x, le;
      r && (x = _(), le = x + ne * 0.05 * -B.velocityX / 0.227, ne *= sl(_, x, le, nr(u, dt)), C.vars.scrollX = T(le)), x = d(), le = x + ne * 0.05 * -B.velocityY / 0.227, ne *= sl(d, x, le, nr(u, Ne)), C.vars.scrollY = O(le), C.invalidate().duration(ne).play(0.01), (Or && C.vars.scrollY >= l || x >= l - 1) && N.to({}, {
        onUpdate: W,
        duration: ne
      });
    }
    o && o(B);
  }, e.onWheel = function() {
    C._ts && C.pause(), Ze() - m > 1e3 && (y = 0, m = Ze());
  }, e.onChange = function(B, U, ne, x, le) {
    if (ai !== y && E(), U && r && _(T(x[2] === U ? L + (B.startX - B.x) : _() + U - x[1])), ne) {
      d.offset && P();
      var Ee = le[2] === ne, k = Ee ? z + B.startY - B.y : d() + ne - le[1], D = O(k);
      Ee && k !== D && (z += D - k), d(D);
    }
    (ne || U) && br();
  }, e.onEnable = function() {
    Qs(u, r ? !1 : "x"), ie.addEventListener("refresh", W), Ge(te, "resize", W), d.smooth && (d.target.style.scrollBehavior = "auto", d.smooth = _.smooth = !1), b.enable();
  }, e.onDisable = function() {
    Qs(u, !0), Ve(te, "resize", W), ie.removeEventListener("refresh", W), b.kill();
  }, e.lockAxis = e.lockAxis !== !1, a = new Ae(e), a.iOS = Or, Or && !d() && d(1), Or && N.ticker.add(tr), H = a._dc, C = N.to(a, {
    ease: "power4",
    paused: !0,
    inherit: !1,
    scrollX: r ? "+=0.1" : "+=0",
    scrollY: "+=0.1",
    modifiers: {
      scrollY: Qu(d, d(), function() {
        return C.pause();
      })
    },
    onUpdate: br,
    onComplete: H.vars.onComplete
  }), a;
};
ie.sort = function(n) {
  if (tt(n))
    return Z.sort(n);
  var e = te.pageYOffset || 0;
  return ie.getAll().forEach(function(t) {
    return t._sortY = t.trigger ? e + t.trigger.getBoundingClientRect().top : t.start + te.innerHeight;
  }), Z.sort(n || function(t, r) {
    return (t.vars.refreshPriority || 0) * -1e6 + (t.vars.containerAnimation ? 1e6 : t._sortY) - ((r.vars.containerAnimation ? 1e6 : r._sortY) + (r.vars.refreshPriority || 0) * -1e6);
  });
};
ie.observe = function(n) {
  return new Ae(n);
};
ie.normalizeScroll = function(n) {
  if (typeof n > "u")
    return lt;
  if (n === !0 && lt)
    return lt.enable();
  if (n === !1) {
    lt && lt.kill(), lt = n;
    return;
  }
  var e = n instanceof Ae ? n : wd(n);
  return lt && lt.target === e.target && lt.kill(), ci(e.target) && (lt = e), e;
};
ie.core = {
  // smaller file size way to leverage in ScrollSmoother and Observer
  _getVelocityProp: Mo,
  _inputObserver: Zu,
  _scrollers: re,
  _proxies: lr,
  bridge: {
    // when normalizeScroll sets the scroll position (ss = setScroll)
    ss: function() {
      Vt || di("scrollStart"), Vt = Ze();
    },
    // a way to get the _refreshing value in Observer
    ref: function() {
      return Qe;
    }
  }
};
Vu() && N.registerPlugin(ie);
const Zs = document.querySelector(".intro .path"), ec = document.querySelector("#main-container"), bd = document.querySelector(".intro-icon");
function Sd(n) {
  const e = "M 0 0 V 100 Q 50 100 100 100 V 0 z", t = "M 0 0 V 75 Q 50 100 100 75 V 0 z", r = "M 0 0 V 0 Q 50 0 100 0 V 0 z";
  ht.set(Zs, { attr: { d: e } }), ht.set(ec, { opacity: 0 });
  const i = ht.timeline();
  i.to(Zs, {
    attr: { d: t },
    ease: "power2.in",
    duration: 0.5
  }), i.to(Zs, {
    attr: { d: r },
    ease: "power2.out",
    duration: 0.5
  }), i.to(
    bd,
    {
      opacity: 0,
      yPercent: -250,
      duration: 0.65,
      ease: "power2.in"
    },
    "-=1"
  ), i.to(
    ".intro-overlay",
    {
      opacity: 0,
      duration: 0.35,
      ease: "power1.in"
    },
    "-=0.35"
  ), setTimeout(() => {
    xd(n);
  }, 950);
}
const xd = (n) => {
  n(), ht.to(ec, {
    opacity: 1,
    duration: 0.5,
    ease: "power1.inOut"
  });
};
class Td {
  constructor() {
    this.links = document.querySelectorAll("a"), this.links.forEach((e) => {
      e.hostname === window.location.hostname && e.addEventListener("click", (t) => {
        t.preventDefault(), this.transitionOut(t);
      });
    });
  }
  transitionOut(e) {
    let t = document.querySelector(".transition .path");
    const r = "M 0 100 V 50 Q 50 15 100 50 V 100 z", i = "M 0 100 V 0 Q 50 0 100 0 V 100 z", s = ht.timeline({
      onComplete: o
    });
    s.to(t, {
      attr: { d: r },
      ease: "power2.in",
      duration: 0.6
    }), s.to(t, {
      attr: { d: i },
      ease: "power2.out",
      duration: 0.4
    }), s.fromTo(
      ".transition-overlay",
      { opacity: 0 },
      { opacity: 0.35, duration: 0.6, ease: "power1.in" },
      "-=1"
    ), s.play(0);
    function o() {
      let a = null, l = e.target;
      for (; l; ) {
        if (l.href) {
          a = l.href;
          break;
        }
        l = l.parentElement;
      }
      window.location.href = a;
    }
  }
}
class Ed {
  constructor(e) {
    this.body = document.querySelector("body"), this.menu = document.querySelector(".site-header .menu"), this.burger = this.menu.querySelector(".burger-button"), this.mainMenu = this.menu.querySelector("#primary-navigation"), this.btnsSubmenu = this.menu.querySelectorAll(".btn-submenu"), this.overlay = document.querySelector(".overlay-menu"), this.lenis = e, this.burger.addEventListener("click", () => this.toggleMenu(this.lenis)), this.btnsSubmenu.forEach(
      (t) => t.addEventListener("click", () => this.toggleSubmenu(t))
    ), this.overlay.addEventListener("mouseenter", () => {
      this.closeSubmenu(this.btnsSubmenu, this.overlay);
    });
  }
  toggleMenu() {
    const e = this.burger.getAttribute("aria-expanded") === "true";
    this.burger.setAttribute("aria-expanded", !e), this.mainMenu.setAttribute("aria-expanded", !e), this.menu.classList.toggle("open"), e ? this.lenis.start() : this.lenis.stop();
  }
  toggleSubmenu(e) {
    const t = e.getAttribute("aria-expanded") === "true";
    e.setAttribute("aria-expanded", !t), e.nextElementSibling.setAttribute("aria-expanded", !t), e.nextElementSibling.style.maxHeight = t ? "0px" : e.nextElementSibling.scrollHeight + "px", this.overlay.classList.toggle("active"), t ? this.lenis.start() : this.lenis.stop();
  }
  closeSubmenu(e, t) {
    e.forEach((r) => {
      r.setAttribute("aria-expanded", !1), r.nextElementSibling.setAttribute("aria-expanded", !1), r.nextElementSibling.style.maxHeight = "0px";
    }), t.classList.remove("active"), this.lenis.start();
  }
  destroy() {
    this.burger.removeEventListener("click", () => this.toggleMenu(lenis)), this.btnsSubmenu.forEach(
      (e) => e.removeEventListener("click", () => this.toggleSubmenu(e))
    ), this.overlay.removeEventListener("mouseenter", () => {
      this.closeSubmenu(this.btnsSubmenu, this.overlay);
    });
  }
}
class Cd {
  constructor(e) {
    this.buttons = document.querySelectorAll(e), this.buttons.forEach((t) => {
      this.addOverShape(t), t.addEventListener("mouseenter", () => this.overEffect(t, !0)), t.addEventListener(
        "mouseleave",
        () => this.overEffect(t, !1)
      );
    });
  }
  addOverShape(e) {
    e.innerHTML += `<svg class="btn-primary__shape" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path vector-effect="non-scaling-stroke" d="M 0 100 V 100 Q 50 100 100 100 V 100 z" />
        </svg>`;
  }
  overEffect(e, t) {
    const r = e.querySelector("path"), i = ht.timeline();
    t ? (i.to(r, {
      attr: { d: "M 0 100 V 90 Q 50 0 100 90 V 100 z" },
      ease: "power1.in",
      duration: 0.13
    }), i.to(r, {
      attr: { d: "M 0 100 V 0 Q 50 0 100 0 V 100 z" },
      ease: "power1.out",
      duration: 0.18
    })) : (i.to(r, {
      attr: { d: "M 0 100 V 90 Q 50 0 100 90 V 100 z" },
      ease: "power1.in",
      duration: 0.18
    }), i.to(r, {
      attr: { d: "M 0 100 V 100 Q 50 100 100 100 V 100 z" },
      ease: "power1.out",
      duration: 0.13
    }));
  }
  destroy() {
    this.buttons.forEach((e) => {
      e.removeEventListener(
        "mouseenter",
        () => this.overEffect(e, !0)
      ), e.removeEventListener(
        "mouseleave",
        () => this.overEffect(e, !1)
      );
    });
  }
}
function ll(n) {
  return n !== null && typeof n == "object" && "constructor" in n && n.constructor === Object;
}
function _a(n = {}, e = {}) {
  Object.keys(e).forEach((t) => {
    typeof n[t] > "u" ? n[t] = e[t] : ll(e[t]) && ll(n[t]) && Object.keys(e[t]).length > 0 && _a(n[t], e[t]);
  });
}
const tc = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function mi() {
  const n = typeof document < "u" ? document : {};
  return _a(n, tc), n;
}
const Pd = {
  document: tc,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(n) {
    return typeof setTimeout > "u" ? (n(), null) : setTimeout(n, 0);
  },
  cancelAnimationFrame(n) {
    typeof setTimeout > "u" || clearTimeout(n);
  }
};
function zt() {
  const n = typeof window < "u" ? window : {};
  return _a(n, Pd), n;
}
function Od(n) {
  const e = n;
  Object.keys(e).forEach((t) => {
    try {
      e[t] = null;
    } catch {
    }
    try {
      delete e[t];
    } catch {
    }
  });
}
function Fo(n, e = 0) {
  return setTimeout(n, e);
}
function xs() {
  return Date.now();
}
function Md(n) {
  const e = zt();
  let t;
  return e.getComputedStyle && (t = e.getComputedStyle(n, null)), !t && n.currentStyle && (t = n.currentStyle), t || (t = n.style), t;
}
function Ad(n, e = "x") {
  const t = zt();
  let r, i, s;
  const o = Md(n);
  return t.WebKitCSSMatrix ? (i = o.transform || o.webkitTransform, i.split(",").length > 6 && (i = i.split(", ").map((a) => a.replace(",", ".")).join(", ")), s = new t.WebKitCSSMatrix(i === "none" ? "" : i)) : (s = o.MozTransform || o.OTransform || o.MsTransform || o.msTransform || o.transform || o.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), r = s.toString().split(",")), e === "x" && (t.WebKitCSSMatrix ? i = s.m41 : r.length === 16 ? i = parseFloat(r[12]) : i = parseFloat(r[4])), e === "y" && (t.WebKitCSSMatrix ? i = s.m42 : r.length === 16 ? i = parseFloat(r[13]) : i = parseFloat(r[5])), i || 0;
}
function jn(n) {
  return typeof n == "object" && n !== null && n.constructor && Object.prototype.toString.call(n).slice(8, -1) === "Object";
}
function Rd(n) {
  return typeof window < "u" && typeof window.HTMLElement < "u" ? n instanceof HTMLElement : n && (n.nodeType === 1 || n.nodeType === 11);
}
function Ct(...n) {
  const e = Object(n[0]), t = ["__proto__", "constructor", "prototype"];
  for (let r = 1; r < n.length; r += 1) {
    const i = n[r];
    if (i != null && !Rd(i)) {
      const s = Object.keys(Object(i)).filter((o) => t.indexOf(o) < 0);
      for (let o = 0, a = s.length; o < a; o += 1) {
        const l = s[o], u = Object.getOwnPropertyDescriptor(i, l);
        u !== void 0 && u.enumerable && (jn(e[l]) && jn(i[l]) ? i[l].__swiper__ ? e[l] = i[l] : Ct(e[l], i[l]) : !jn(e[l]) && jn(i[l]) ? (e[l] = {}, i[l].__swiper__ ? e[l] = i[l] : Ct(e[l], i[l])) : e[l] = i[l]);
      }
    }
  }
  return e;
}
function Kn(n, e, t) {
  n.style.setProperty(e, t);
}
function rc({
  swiper: n,
  targetPosition: e,
  side: t
}) {
  const r = zt(), i = -n.translate;
  let s = null, o;
  const a = n.params.speed;
  n.wrapperEl.style.scrollSnapType = "none", r.cancelAnimationFrame(n.cssModeFrameID);
  const l = e > i ? "next" : "prev", u = (f, h) => l === "next" && f >= h || l === "prev" && f <= h, c = () => {
    o = (/* @__PURE__ */ new Date()).getTime(), s === null && (s = o);
    const f = Math.max(Math.min((o - s) / a, 1), 0), h = 0.5 - Math.cos(f * Math.PI) / 2;
    let d = i + h * (e - i);
    if (u(d, e) && (d = e), n.wrapperEl.scrollTo({
      [t]: d
    }), u(d, e)) {
      n.wrapperEl.style.overflow = "hidden", n.wrapperEl.style.scrollSnapType = "", setTimeout(() => {
        n.wrapperEl.style.overflow = "", n.wrapperEl.scrollTo({
          [t]: d
        });
      }), r.cancelAnimationFrame(n.cssModeFrameID);
      return;
    }
    n.cssModeFrameID = r.requestAnimationFrame(c);
  };
  c();
}
function sr(n, e = "") {
  return [...n.children].filter((t) => t.matches(e));
}
function ic(n, e = []) {
  const t = document.createElement(n);
  return t.classList.add(...Array.isArray(e) ? e : [e]), t;
}
function kd(n, e) {
  const t = [];
  for (; n.previousElementSibling; ) {
    const r = n.previousElementSibling;
    e ? r.matches(e) && t.push(r) : t.push(r), n = r;
  }
  return t;
}
function Ld(n, e) {
  const t = [];
  for (; n.nextElementSibling; ) {
    const r = n.nextElementSibling;
    e ? r.matches(e) && t.push(r) : t.push(r), n = r;
  }
  return t;
}
function Dr(n, e) {
  return zt().getComputedStyle(n, null).getPropertyValue(e);
}
function Ts(n) {
  let e = n, t;
  if (e) {
    for (t = 0; (e = e.previousSibling) !== null; )
      e.nodeType === 1 && (t += 1);
    return t;
  }
}
function nc(n, e) {
  const t = [];
  let r = n.parentElement;
  for (; r; )
    e ? r.matches(e) && t.push(r) : t.push(r), r = r.parentElement;
  return t;
}
function No(n, e, t) {
  const r = zt();
  return n[e === "width" ? "offsetWidth" : "offsetHeight"] + parseFloat(r.getComputedStyle(n, null).getPropertyValue(e === "width" ? "margin-right" : "margin-top")) + parseFloat(r.getComputedStyle(n, null).getPropertyValue(e === "width" ? "margin-left" : "margin-bottom"));
}
let eo;
function Dd() {
  const n = zt(), e = mi();
  return {
    smoothScroll: e.documentElement && e.documentElement.style && "scrollBehavior" in e.documentElement.style,
    touch: !!("ontouchstart" in n || n.DocumentTouch && e instanceof n.DocumentTouch)
  };
}
function sc() {
  return eo || (eo = Dd()), eo;
}
let to;
function zd({
  userAgent: n
} = {}) {
  const e = sc(), t = zt(), r = t.navigator.platform, i = n || t.navigator.userAgent, s = {
    ios: !1,
    android: !1
  }, o = t.screen.width, a = t.screen.height, l = i.match(/(Android);?[\s\/]+([\d.]+)?/);
  let u = i.match(/(iPad).*OS\s([\d_]+)/);
  const c = i.match(/(iPod)(.*OS\s([\d_]+))?/), f = !u && i.match(/(iPhone\sOS|iOS)\s([\d_]+)/), h = r === "Win32";
  let d = r === "MacIntel";
  const _ = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  return !u && d && e.touch && _.indexOf(`${o}x${a}`) >= 0 && (u = i.match(/(Version)\/([\d.]+)/), u || (u = [0, 1, "13_0_0"]), d = !1), l && !h && (s.os = "android", s.android = !0), (u || f || c) && (s.os = "ios", s.ios = !0), s;
}
function Id(n = {}) {
  return to || (to = zd(n)), to;
}
let ro;
function Fd() {
  const n = zt();
  let e = !1;
  function t() {
    const r = n.navigator.userAgent.toLowerCase();
    return r.indexOf("safari") >= 0 && r.indexOf("chrome") < 0 && r.indexOf("android") < 0;
  }
  if (t()) {
    const r = String(n.navigator.userAgent);
    if (r.includes("Version/")) {
      const [i, s] = r.split("Version/")[1].split(" ")[0].split(".").map((o) => Number(o));
      e = i < 16 || i === 16 && s < 2;
    }
  }
  return {
    isSafari: e || t(),
    needPerspectiveFix: e,
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(n.navigator.userAgent)
  };
}
function Nd() {
  return ro || (ro = Fd()), ro;
}
function Bd({
  swiper: n,
  on: e,
  emit: t
}) {
  const r = zt();
  let i = null, s = null;
  const o = () => {
    !n || n.destroyed || !n.initialized || (t("beforeResize"), t("resize"));
  }, a = () => {
    !n || n.destroyed || !n.initialized || (i = new ResizeObserver((c) => {
      s = r.requestAnimationFrame(() => {
        const {
          width: f,
          height: h
        } = n;
        let d = f, _ = h;
        c.forEach(({
          contentBoxSize: p,
          contentRect: g,
          target: m
        }) => {
          m && m !== n.el || (d = g ? g.width : (p[0] || p).inlineSize, _ = g ? g.height : (p[0] || p).blockSize);
        }), (d !== f || _ !== h) && o();
      });
    }), i.observe(n.el));
  }, l = () => {
    s && r.cancelAnimationFrame(s), i && i.unobserve && n.el && (i.unobserve(n.el), i = null);
  }, u = () => {
    !n || n.destroyed || !n.initialized || t("orientationchange");
  };
  e("init", () => {
    if (n.params.resizeObserver && typeof r.ResizeObserver < "u") {
      a();
      return;
    }
    r.addEventListener("resize", o), r.addEventListener("orientationchange", u);
  }), e("destroy", () => {
    l(), r.removeEventListener("resize", o), r.removeEventListener("orientationchange", u);
  });
}
function $d({
  swiper: n,
  extendParams: e,
  on: t,
  emit: r
}) {
  const i = [], s = zt(), o = (u, c = {}) => {
    const f = s.MutationObserver || s.WebkitMutationObserver, h = new f((d) => {
      if (n.__preventObserver__) return;
      if (d.length === 1) {
        r("observerUpdate", d[0]);
        return;
      }
      const _ = function() {
        r("observerUpdate", d[0]);
      };
      s.requestAnimationFrame ? s.requestAnimationFrame(_) : s.setTimeout(_, 0);
    });
    h.observe(u, {
      attributes: typeof c.attributes > "u" ? !0 : c.attributes,
      childList: typeof c.childList > "u" ? !0 : c.childList,
      characterData: typeof c.characterData > "u" ? !0 : c.characterData
    }), i.push(h);
  }, a = () => {
    if (n.params.observer) {
      if (n.params.observeParents) {
        const u = nc(n.el);
        for (let c = 0; c < u.length; c += 1)
          o(u[c]);
      }
      o(n.el, {
        childList: n.params.observeSlideChildren
      }), o(n.wrapperEl, {
        attributes: !1
      });
    }
  }, l = () => {
    i.forEach((u) => {
      u.disconnect();
    }), i.splice(0, i.length);
  };
  e({
    observer: !1,
    observeParents: !1,
    observeSlideChildren: !1
  }), t("init", a), t("destroy", l);
}
const Hd = {
  on(n, e, t) {
    const r = this;
    if (!r.eventsListeners || r.destroyed || typeof e != "function") return r;
    const i = t ? "unshift" : "push";
    return n.split(" ").forEach((s) => {
      r.eventsListeners[s] || (r.eventsListeners[s] = []), r.eventsListeners[s][i](e);
    }), r;
  },
  once(n, e, t) {
    const r = this;
    if (!r.eventsListeners || r.destroyed || typeof e != "function") return r;
    function i(...s) {
      r.off(n, i), i.__emitterProxy && delete i.__emitterProxy, e.apply(r, s);
    }
    return i.__emitterProxy = e, r.on(n, i, t);
  },
  onAny(n, e) {
    const t = this;
    if (!t.eventsListeners || t.destroyed || typeof n != "function") return t;
    const r = e ? "unshift" : "push";
    return t.eventsAnyListeners.indexOf(n) < 0 && t.eventsAnyListeners[r](n), t;
  },
  offAny(n) {
    const e = this;
    if (!e.eventsListeners || e.destroyed || !e.eventsAnyListeners) return e;
    const t = e.eventsAnyListeners.indexOf(n);
    return t >= 0 && e.eventsAnyListeners.splice(t, 1), e;
  },
  off(n, e) {
    const t = this;
    return !t.eventsListeners || t.destroyed || !t.eventsListeners || n.split(" ").forEach((r) => {
      typeof e > "u" ? t.eventsListeners[r] = [] : t.eventsListeners[r] && t.eventsListeners[r].forEach((i, s) => {
        (i === e || i.__emitterProxy && i.__emitterProxy === e) && t.eventsListeners[r].splice(s, 1);
      });
    }), t;
  },
  emit(...n) {
    const e = this;
    if (!e.eventsListeners || e.destroyed || !e.eventsListeners) return e;
    let t, r, i;
    return typeof n[0] == "string" || Array.isArray(n[0]) ? (t = n[0], r = n.slice(1, n.length), i = e) : (t = n[0].events, r = n[0].data, i = n[0].context || e), r.unshift(i), (Array.isArray(t) ? t : t.split(" ")).forEach((o) => {
      e.eventsAnyListeners && e.eventsAnyListeners.length && e.eventsAnyListeners.forEach((a) => {
        a.apply(i, [o, ...r]);
      }), e.eventsListeners && e.eventsListeners[o] && e.eventsListeners[o].forEach((a) => {
        a.apply(i, r);
      });
    }), e;
  }
};
function Vd() {
  const n = this;
  let e, t;
  const r = n.el;
  typeof n.params.width < "u" && n.params.width !== null ? e = n.params.width : e = r.clientWidth, typeof n.params.height < "u" && n.params.height !== null ? t = n.params.height : t = r.clientHeight, !(e === 0 && n.isHorizontal() || t === 0 && n.isVertical()) && (e = e - parseInt(Dr(r, "padding-left") || 0, 10) - parseInt(Dr(r, "padding-right") || 0, 10), t = t - parseInt(Dr(r, "padding-top") || 0, 10) - parseInt(Dr(r, "padding-bottom") || 0, 10), Number.isNaN(e) && (e = 0), Number.isNaN(t) && (t = 0), Object.assign(n, {
    width: e,
    height: t,
    size: n.isHorizontal() ? e : t
  }));
}
function Gd() {
  const n = this;
  function e(R) {
    return n.isHorizontal() ? R : {
      width: "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      marginRight: "marginBottom"
    }[R];
  }
  function t(R, C) {
    return parseFloat(R.getPropertyValue(e(C)) || 0);
  }
  const r = n.params, {
    wrapperEl: i,
    slidesEl: s,
    size: o,
    rtlTranslate: a,
    wrongRTL: l
  } = n, u = n.virtual && r.virtual.enabled, c = u ? n.virtual.slides.length : n.slides.length, f = sr(s, `.${n.params.slideClass}, swiper-slide`), h = u ? n.virtual.slides.length : f.length;
  let d = [];
  const _ = [], p = [];
  let g = r.slidesOffsetBefore;
  typeof g == "function" && (g = r.slidesOffsetBefore.call(n));
  let m = r.slidesOffsetAfter;
  typeof m == "function" && (m = r.slidesOffsetAfter.call(n));
  const v = n.snapGrid.length, y = n.slidesGrid.length;
  let w = r.spaceBetween, b = -g, S = 0, T = 0;
  if (typeof o > "u")
    return;
  typeof w == "string" && w.indexOf("%") >= 0 ? w = parseFloat(w.replace("%", "")) / 100 * o : typeof w == "string" && (w = parseFloat(w)), n.virtualSize = -w, f.forEach((R) => {
    a ? R.style.marginLeft = "" : R.style.marginRight = "", R.style.marginBottom = "", R.style.marginTop = "";
  }), r.centeredSlides && r.cssMode && (Kn(i, "--swiper-centered-offset-before", ""), Kn(i, "--swiper-centered-offset-after", ""));
  const O = r.grid && r.grid.rows > 1 && n.grid;
  O && n.grid.initSlides(h);
  let E;
  const P = r.slidesPerView === "auto" && r.breakpoints && Object.keys(r.breakpoints).filter((R) => typeof r.breakpoints[R].slidesPerView < "u").length > 0;
  for (let R = 0; R < h; R += 1) {
    E = 0;
    let C;
    if (f[R] && (C = f[R]), O && n.grid.updateSlide(R, C, h, e), !(f[R] && Dr(C, "display") === "none")) {
      if (r.slidesPerView === "auto") {
        P && (f[R].style[e("width")] = "");
        const L = getComputedStyle(C), z = C.style.transform, H = C.style.webkitTransform;
        if (z && (C.style.transform = "none"), H && (C.style.webkitTransform = "none"), r.roundLengths)
          E = n.isHorizontal() ? No(C, "width") : No(C, "height");
        else {
          const W = t(L, "width"), B = t(L, "padding-left"), U = t(L, "padding-right"), ne = t(L, "margin-left"), x = t(L, "margin-right"), le = L.getPropertyValue("box-sizing");
          if (le && le === "border-box")
            E = W + ne + x;
          else {
            const {
              clientWidth: Ee,
              offsetWidth: k
            } = C;
            E = W + B + U + ne + x + (k - Ee);
          }
        }
        z && (C.style.transform = z), H && (C.style.webkitTransform = H), r.roundLengths && (E = Math.floor(E));
      } else
        E = (o - (r.slidesPerView - 1) * w) / r.slidesPerView, r.roundLengths && (E = Math.floor(E)), f[R] && (f[R].style[e("width")] = `${E}px`);
      f[R] && (f[R].swiperSlideSize = E), p.push(E), r.centeredSlides ? (b = b + E / 2 + S / 2 + w, S === 0 && R !== 0 && (b = b - o / 2 - w), R === 0 && (b = b - o / 2 - w), Math.abs(b) < 1 / 1e3 && (b = 0), r.roundLengths && (b = Math.floor(b)), T % r.slidesPerGroup === 0 && d.push(b), _.push(b)) : (r.roundLengths && (b = Math.floor(b)), (T - Math.min(n.params.slidesPerGroupSkip, T)) % n.params.slidesPerGroup === 0 && d.push(b), _.push(b), b = b + E + w), n.virtualSize += E + w, S = E, T += 1;
    }
  }
  if (n.virtualSize = Math.max(n.virtualSize, o) + m, a && l && (r.effect === "slide" || r.effect === "coverflow") && (i.style.width = `${n.virtualSize + w}px`), r.setWrapperSize && (i.style[e("width")] = `${n.virtualSize + w}px`), O && n.grid.updateWrapperSize(E, d, e), !r.centeredSlides) {
    const R = [];
    for (let C = 0; C < d.length; C += 1) {
      let L = d[C];
      r.roundLengths && (L = Math.floor(L)), d[C] <= n.virtualSize - o && R.push(L);
    }
    d = R, Math.floor(n.virtualSize - o) - Math.floor(d[d.length - 1]) > 1 && d.push(n.virtualSize - o);
  }
  if (u && r.loop) {
    const R = p[0] + w;
    if (r.slidesPerGroup > 1) {
      const C = Math.ceil((n.virtual.slidesBefore + n.virtual.slidesAfter) / r.slidesPerGroup), L = R * r.slidesPerGroup;
      for (let z = 0; z < C; z += 1)
        d.push(d[d.length - 1] + L);
    }
    for (let C = 0; C < n.virtual.slidesBefore + n.virtual.slidesAfter; C += 1)
      r.slidesPerGroup === 1 && d.push(d[d.length - 1] + R), _.push(_[_.length - 1] + R), n.virtualSize += R;
  }
  if (d.length === 0 && (d = [0]), w !== 0) {
    const R = n.isHorizontal() && a ? "marginLeft" : e("marginRight");
    f.filter((C, L) => !r.cssMode || r.loop ? !0 : L !== f.length - 1).forEach((C) => {
      C.style[R] = `${w}px`;
    });
  }
  if (r.centeredSlides && r.centeredSlidesBounds) {
    let R = 0;
    p.forEach((L) => {
      R += L + (w || 0);
    }), R -= w;
    const C = R - o;
    d = d.map((L) => L <= 0 ? -g : L > C ? C + m : L);
  }
  if (r.centerInsufficientSlides) {
    let R = 0;
    if (p.forEach((C) => {
      R += C + (w || 0);
    }), R -= w, R < o) {
      const C = (o - R) / 2;
      d.forEach((L, z) => {
        d[z] = L - C;
      }), _.forEach((L, z) => {
        _[z] = L + C;
      });
    }
  }
  if (Object.assign(n, {
    slides: f,
    snapGrid: d,
    slidesGrid: _,
    slidesSizesGrid: p
  }), r.centeredSlides && r.cssMode && !r.centeredSlidesBounds) {
    Kn(i, "--swiper-centered-offset-before", `${-d[0]}px`), Kn(i, "--swiper-centered-offset-after", `${n.size / 2 - p[p.length - 1] / 2}px`);
    const R = -n.snapGrid[0], C = -n.slidesGrid[0];
    n.snapGrid = n.snapGrid.map((L) => L + R), n.slidesGrid = n.slidesGrid.map((L) => L + C);
  }
  if (h !== c && n.emit("slidesLengthChange"), d.length !== v && (n.params.watchOverflow && n.checkOverflow(), n.emit("snapGridLengthChange")), _.length !== y && n.emit("slidesGridLengthChange"), r.watchSlidesProgress && n.updateSlidesOffset(), !u && !r.cssMode && (r.effect === "slide" || r.effect === "fade")) {
    const R = `${r.containerModifierClass}backface-hidden`, C = n.el.classList.contains(R);
    h <= r.maxBackfaceHiddenSlides ? C || n.el.classList.add(R) : C && n.el.classList.remove(R);
  }
}
function qd(n) {
  const e = this, t = [], r = e.virtual && e.params.virtual.enabled;
  let i = 0, s;
  typeof n == "number" ? e.setTransition(n) : n === !0 && e.setTransition(e.params.speed);
  const o = (a) => r ? e.slides[e.getSlideIndexByData(a)] : e.slides[a];
  if (e.params.slidesPerView !== "auto" && e.params.slidesPerView > 1)
    if (e.params.centeredSlides)
      (e.visibleSlides || []).forEach((a) => {
        t.push(a);
      });
    else
      for (s = 0; s < Math.ceil(e.params.slidesPerView); s += 1) {
        const a = e.activeIndex + s;
        if (a > e.slides.length && !r) break;
        t.push(o(a));
      }
  else
    t.push(o(e.activeIndex));
  for (s = 0; s < t.length; s += 1)
    if (typeof t[s] < "u") {
      const a = t[s].offsetHeight;
      i = a > i ? a : i;
    }
  (i || i === 0) && (e.wrapperEl.style.height = `${i}px`);
}
function Ud() {
  const n = this, e = n.slides, t = n.isElement ? n.isHorizontal() ? n.wrapperEl.offsetLeft : n.wrapperEl.offsetTop : 0;
  for (let r = 0; r < e.length; r += 1)
    e[r].swiperSlideOffset = (n.isHorizontal() ? e[r].offsetLeft : e[r].offsetTop) - t - n.cssOverflowAdjustment();
}
function Wd(n = this && this.translate || 0) {
  const e = this, t = e.params, {
    slides: r,
    rtlTranslate: i,
    snapGrid: s
  } = e;
  if (r.length === 0) return;
  typeof r[0].swiperSlideOffset > "u" && e.updateSlidesOffset();
  let o = -n;
  i && (o = n), r.forEach((l) => {
    l.classList.remove(t.slideVisibleClass);
  }), e.visibleSlidesIndexes = [], e.visibleSlides = [];
  let a = t.spaceBetween;
  typeof a == "string" && a.indexOf("%") >= 0 ? a = parseFloat(a.replace("%", "")) / 100 * e.size : typeof a == "string" && (a = parseFloat(a));
  for (let l = 0; l < r.length; l += 1) {
    const u = r[l];
    let c = u.swiperSlideOffset;
    t.cssMode && t.centeredSlides && (c -= r[0].swiperSlideOffset);
    const f = (o + (t.centeredSlides ? e.minTranslate() : 0) - c) / (u.swiperSlideSize + a), h = (o - s[0] + (t.centeredSlides ? e.minTranslate() : 0) - c) / (u.swiperSlideSize + a), d = -(o - c), _ = d + e.slidesSizesGrid[l];
    (d >= 0 && d < e.size - 1 || _ > 1 && _ <= e.size || d <= 0 && _ >= e.size) && (e.visibleSlides.push(u), e.visibleSlidesIndexes.push(l), r[l].classList.add(t.slideVisibleClass)), u.progress = i ? -f : f, u.originalProgress = i ? -h : h;
  }
}
function Yd(n) {
  const e = this;
  if (typeof n > "u") {
    const c = e.rtlTranslate ? -1 : 1;
    n = e && e.translate && e.translate * c || 0;
  }
  const t = e.params, r = e.maxTranslate() - e.minTranslate();
  let {
    progress: i,
    isBeginning: s,
    isEnd: o,
    progressLoop: a
  } = e;
  const l = s, u = o;
  if (r === 0)
    i = 0, s = !0, o = !0;
  else {
    i = (n - e.minTranslate()) / r;
    const c = Math.abs(n - e.minTranslate()) < 1, f = Math.abs(n - e.maxTranslate()) < 1;
    s = c || i <= 0, o = f || i >= 1, c && (i = 0), f && (i = 1);
  }
  if (t.loop) {
    const c = e.getSlideIndexByData(0), f = e.getSlideIndexByData(e.slides.length - 1), h = e.slidesGrid[c], d = e.slidesGrid[f], _ = e.slidesGrid[e.slidesGrid.length - 1], p = Math.abs(n);
    p >= h ? a = (p - h) / _ : a = (p + _ - d) / _, a > 1 && (a -= 1);
  }
  Object.assign(e, {
    progress: i,
    progressLoop: a,
    isBeginning: s,
    isEnd: o
  }), (t.watchSlidesProgress || t.centeredSlides && t.autoHeight) && e.updateSlidesProgress(n), s && !l && e.emit("reachBeginning toEdge"), o && !u && e.emit("reachEnd toEdge"), (l && !s || u && !o) && e.emit("fromEdge"), e.emit("progress", i);
}
function Xd() {
  const n = this, {
    slides: e,
    params: t,
    slidesEl: r,
    activeIndex: i
  } = n, s = n.virtual && t.virtual.enabled, o = (l) => sr(r, `.${t.slideClass}${l}, swiper-slide${l}`)[0];
  e.forEach((l) => {
    l.classList.remove(t.slideActiveClass, t.slideNextClass, t.slidePrevClass);
  });
  let a;
  if (s)
    if (t.loop) {
      let l = i - n.virtual.slidesBefore;
      l < 0 && (l = n.virtual.slides.length + l), l >= n.virtual.slides.length && (l -= n.virtual.slides.length), a = o(`[data-swiper-slide-index="${l}"]`);
    } else
      a = o(`[data-swiper-slide-index="${i}"]`);
  else
    a = e[i];
  if (a) {
    a.classList.add(t.slideActiveClass);
    let l = Ld(a, `.${t.slideClass}, swiper-slide`)[0];
    t.loop && !l && (l = e[0]), l && l.classList.add(t.slideNextClass);
    let u = kd(a, `.${t.slideClass}, swiper-slide`)[0];
    t.loop && !u === 0 && (u = e[e.length - 1]), u && u.classList.add(t.slidePrevClass);
  }
  n.emitSlidesClasses();
}
const os = (n, e) => {
  if (!n || n.destroyed || !n.params) return;
  const t = () => n.isElement ? "swiper-slide" : `.${n.params.slideClass}`, r = e.closest(t());
  if (r) {
    const i = r.querySelector(`.${n.params.lazyPreloaderClass}`);
    i && i.remove();
  }
}, io = (n, e) => {
  if (!n.slides[e]) return;
  const t = n.slides[e].querySelector('[loading="lazy"]');
  t && t.removeAttribute("loading");
}, Bo = (n) => {
  if (!n || n.destroyed || !n.params) return;
  let e = n.params.lazyPreloadPrevNext;
  const t = n.slides.length;
  if (!t || !e || e < 0) return;
  e = Math.min(e, t);
  const r = n.params.slidesPerView === "auto" ? n.slidesPerViewDynamic() : Math.ceil(n.params.slidesPerView), i = n.activeIndex;
  if (n.params.grid && n.params.grid.rows > 1) {
    const o = i, a = [o - e];
    a.push(...Array.from({
      length: e
    }).map((l, u) => o + r + u)), n.slides.forEach((l, u) => {
      a.includes(l.column) && io(n, u);
    });
    return;
  }
  const s = i + r - 1;
  if (n.params.rewind || n.params.loop)
    for (let o = i - e; o <= s + e; o += 1) {
      const a = (o % t + t) % t;
      (a < i || a > s) && io(n, a);
    }
  else
    for (let o = Math.max(i - e, 0); o <= Math.min(s + e, t - 1); o += 1)
      o !== i && (o > s || o < i) && io(n, o);
};
function jd(n) {
  const {
    slidesGrid: e,
    params: t
  } = n, r = n.rtlTranslate ? n.translate : -n.translate;
  let i;
  for (let s = 0; s < e.length; s += 1)
    typeof e[s + 1] < "u" ? r >= e[s] && r < e[s + 1] - (e[s + 1] - e[s]) / 2 ? i = s : r >= e[s] && r < e[s + 1] && (i = s + 1) : r >= e[s] && (i = s);
  return t.normalizeSlideIndex && (i < 0 || typeof i > "u") && (i = 0), i;
}
function Kd(n) {
  const e = this, t = e.rtlTranslate ? e.translate : -e.translate, {
    snapGrid: r,
    params: i,
    activeIndex: s,
    realIndex: o,
    snapIndex: a
  } = e;
  let l = n, u;
  const c = (h) => {
    let d = h - e.virtual.slidesBefore;
    return d < 0 && (d = e.virtual.slides.length + d), d >= e.virtual.slides.length && (d -= e.virtual.slides.length), d;
  };
  if (typeof l > "u" && (l = jd(e)), r.indexOf(t) >= 0)
    u = r.indexOf(t);
  else {
    const h = Math.min(i.slidesPerGroupSkip, l);
    u = h + Math.floor((l - h) / i.slidesPerGroup);
  }
  if (u >= r.length && (u = r.length - 1), l === s) {
    u !== a && (e.snapIndex = u, e.emit("snapIndexChange")), e.params.loop && e.virtual && e.params.virtual.enabled && (e.realIndex = c(l));
    return;
  }
  let f;
  e.virtual && i.virtual.enabled && i.loop ? f = c(l) : e.slides[l] ? f = parseInt(e.slides[l].getAttribute("data-swiper-slide-index") || l, 10) : f = l, Object.assign(e, {
    previousSnapIndex: a,
    snapIndex: u,
    previousRealIndex: o,
    realIndex: f,
    previousIndex: s,
    activeIndex: l
  }), e.initialized && Bo(e), e.emit("activeIndexChange"), e.emit("snapIndexChange"), o !== f && e.emit("realIndexChange"), (e.initialized || e.params.runCallbacksOnInit) && e.emit("slideChange");
}
function Jd(n) {
  const e = this, t = e.params, r = n.closest(`.${t.slideClass}, swiper-slide`);
  let i = !1, s;
  if (r) {
    for (let o = 0; o < e.slides.length; o += 1)
      if (e.slides[o] === r) {
        i = !0, s = o;
        break;
      }
  }
  if (r && i)
    e.clickedSlide = r, e.virtual && e.params.virtual.enabled ? e.clickedIndex = parseInt(r.getAttribute("data-swiper-slide-index"), 10) : e.clickedIndex = s;
  else {
    e.clickedSlide = void 0, e.clickedIndex = void 0;
    return;
  }
  t.slideToClickedSlide && e.clickedIndex !== void 0 && e.clickedIndex !== e.activeIndex && e.slideToClickedSlide();
}
const Qd = {
  updateSize: Vd,
  updateSlides: Gd,
  updateAutoHeight: qd,
  updateSlidesOffset: Ud,
  updateSlidesProgress: Wd,
  updateProgress: Yd,
  updateSlidesClasses: Xd,
  updateActiveIndex: Kd,
  updateClickedSlide: Jd
};
function Zd(n = this.isHorizontal() ? "x" : "y") {
  const e = this, {
    params: t,
    rtlTranslate: r,
    translate: i,
    wrapperEl: s
  } = e;
  if (t.virtualTranslate)
    return r ? -i : i;
  if (t.cssMode)
    return i;
  let o = Ad(s, n);
  return o += e.cssOverflowAdjustment(), r && (o = -o), o || 0;
}
function eh(n, e) {
  const t = this, {
    rtlTranslate: r,
    params: i,
    wrapperEl: s,
    progress: o
  } = t;
  let a = 0, l = 0;
  const u = 0;
  t.isHorizontal() ? a = r ? -n : n : l = n, i.roundLengths && (a = Math.floor(a), l = Math.floor(l)), t.previousTranslate = t.translate, t.translate = t.isHorizontal() ? a : l, i.cssMode ? s[t.isHorizontal() ? "scrollLeft" : "scrollTop"] = t.isHorizontal() ? -a : -l : i.virtualTranslate || (t.isHorizontal() ? a -= t.cssOverflowAdjustment() : l -= t.cssOverflowAdjustment(), s.style.transform = `translate3d(${a}px, ${l}px, ${u}px)`);
  let c;
  const f = t.maxTranslate() - t.minTranslate();
  f === 0 ? c = 0 : c = (n - t.minTranslate()) / f, c !== o && t.updateProgress(n), t.emit("setTranslate", t.translate, e);
}
function th() {
  return -this.snapGrid[0];
}
function rh() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function ih(n = 0, e = this.params.speed, t = !0, r = !0, i) {
  const s = this, {
    params: o,
    wrapperEl: a
  } = s;
  if (s.animating && o.preventInteractionOnTransition)
    return !1;
  const l = s.minTranslate(), u = s.maxTranslate();
  let c;
  if (r && n > l ? c = l : r && n < u ? c = u : c = n, s.updateProgress(c), o.cssMode) {
    const f = s.isHorizontal();
    if (e === 0)
      a[f ? "scrollLeft" : "scrollTop"] = -c;
    else {
      if (!s.support.smoothScroll)
        return rc({
          swiper: s,
          targetPosition: -c,
          side: f ? "left" : "top"
        }), !0;
      a.scrollTo({
        [f ? "left" : "top"]: -c,
        behavior: "smooth"
      });
    }
    return !0;
  }
  return e === 0 ? (s.setTransition(0), s.setTranslate(c), t && (s.emit("beforeTransitionStart", e, i), s.emit("transitionEnd"))) : (s.setTransition(e), s.setTranslate(c), t && (s.emit("beforeTransitionStart", e, i), s.emit("transitionStart")), s.animating || (s.animating = !0, s.onTranslateToWrapperTransitionEnd || (s.onTranslateToWrapperTransitionEnd = function(h) {
    !s || s.destroyed || h.target === this && (s.wrapperEl.removeEventListener("transitionend", s.onTranslateToWrapperTransitionEnd), s.onTranslateToWrapperTransitionEnd = null, delete s.onTranslateToWrapperTransitionEnd, t && s.emit("transitionEnd"));
  }), s.wrapperEl.addEventListener("transitionend", s.onTranslateToWrapperTransitionEnd))), !0;
}
const nh = {
  getTranslate: Zd,
  setTranslate: eh,
  minTranslate: th,
  maxTranslate: rh,
  translateTo: ih
};
function sh(n, e) {
  const t = this;
  t.params.cssMode || (t.wrapperEl.style.transitionDuration = `${n}ms`), t.emit("setTransition", n, e);
}
function oc({
  swiper: n,
  runCallbacks: e,
  direction: t,
  step: r
}) {
  const {
    activeIndex: i,
    previousIndex: s
  } = n;
  let o = t;
  if (o || (i > s ? o = "next" : i < s ? o = "prev" : o = "reset"), n.emit(`transition${r}`), e && i !== s) {
    if (o === "reset") {
      n.emit(`slideResetTransition${r}`);
      return;
    }
    n.emit(`slideChangeTransition${r}`), o === "next" ? n.emit(`slideNextTransition${r}`) : n.emit(`slidePrevTransition${r}`);
  }
}
function oh(n = !0, e) {
  const t = this, {
    params: r
  } = t;
  r.cssMode || (r.autoHeight && t.updateAutoHeight(), oc({
    swiper: t,
    runCallbacks: n,
    direction: e,
    step: "Start"
  }));
}
function ah(n = !0, e) {
  const t = this, {
    params: r
  } = t;
  t.animating = !1, !r.cssMode && (t.setTransition(0), oc({
    swiper: t,
    runCallbacks: n,
    direction: e,
    step: "End"
  }));
}
const lh = {
  setTransition: sh,
  transitionStart: oh,
  transitionEnd: ah
};
function uh(n = 0, e = this.params.speed, t = !0, r, i) {
  typeof n == "string" && (n = parseInt(n, 10));
  const s = this;
  let o = n;
  o < 0 && (o = 0);
  const {
    params: a,
    snapGrid: l,
    slidesGrid: u,
    previousIndex: c,
    activeIndex: f,
    rtlTranslate: h,
    wrapperEl: d,
    enabled: _
  } = s;
  if (s.animating && a.preventInteractionOnTransition || !_ && !r && !i)
    return !1;
  const p = Math.min(s.params.slidesPerGroupSkip, o);
  let g = p + Math.floor((o - p) / s.params.slidesPerGroup);
  g >= l.length && (g = l.length - 1);
  const m = -l[g];
  if (a.normalizeSlideIndex)
    for (let y = 0; y < u.length; y += 1) {
      const w = -Math.floor(m * 100), b = Math.floor(u[y] * 100), S = Math.floor(u[y + 1] * 100);
      typeof u[y + 1] < "u" ? w >= b && w < S - (S - b) / 2 ? o = y : w >= b && w < S && (o = y + 1) : w >= b && (o = y);
    }
  if (s.initialized && o !== f && (!s.allowSlideNext && (h ? m > s.translate && m > s.minTranslate() : m < s.translate && m < s.minTranslate()) || !s.allowSlidePrev && m > s.translate && m > s.maxTranslate() && (f || 0) !== o))
    return !1;
  o !== (c || 0) && t && s.emit("beforeSlideChangeStart"), s.updateProgress(m);
  let v;
  if (o > f ? v = "next" : o < f ? v = "prev" : v = "reset", h && -m === s.translate || !h && m === s.translate)
    return s.updateActiveIndex(o), a.autoHeight && s.updateAutoHeight(), s.updateSlidesClasses(), a.effect !== "slide" && s.setTranslate(m), v !== "reset" && (s.transitionStart(t, v), s.transitionEnd(t, v)), !1;
  if (a.cssMode) {
    const y = s.isHorizontal(), w = h ? m : -m;
    if (e === 0) {
      const b = s.virtual && s.params.virtual.enabled;
      b && (s.wrapperEl.style.scrollSnapType = "none", s._immediateVirtual = !0), b && !s._cssModeVirtualInitialSet && s.params.initialSlide > 0 ? (s._cssModeVirtualInitialSet = !0, requestAnimationFrame(() => {
        d[y ? "scrollLeft" : "scrollTop"] = w;
      })) : d[y ? "scrollLeft" : "scrollTop"] = w, b && requestAnimationFrame(() => {
        s.wrapperEl.style.scrollSnapType = "", s._immediateVirtual = !1;
      });
    } else {
      if (!s.support.smoothScroll)
        return rc({
          swiper: s,
          targetPosition: w,
          side: y ? "left" : "top"
        }), !0;
      d.scrollTo({
        [y ? "left" : "top"]: w,
        behavior: "smooth"
      });
    }
    return !0;
  }
  return s.setTransition(e), s.setTranslate(m), s.updateActiveIndex(o), s.updateSlidesClasses(), s.emit("beforeTransitionStart", e, r), s.transitionStart(t, v), e === 0 ? s.transitionEnd(t, v) : s.animating || (s.animating = !0, s.onSlideToWrapperTransitionEnd || (s.onSlideToWrapperTransitionEnd = function(w) {
    !s || s.destroyed || w.target === this && (s.wrapperEl.removeEventListener("transitionend", s.onSlideToWrapperTransitionEnd), s.onSlideToWrapperTransitionEnd = null, delete s.onSlideToWrapperTransitionEnd, s.transitionEnd(t, v));
  }), s.wrapperEl.addEventListener("transitionend", s.onSlideToWrapperTransitionEnd)), !0;
}
function ch(n = 0, e = this.params.speed, t = !0, r) {
  typeof n == "string" && (n = parseInt(n, 10));
  const i = this;
  let s = n;
  return i.params.loop && (i.virtual && i.params.virtual.enabled ? s = s + i.virtual.slidesBefore : s = i.getSlideIndexByData(s)), i.slideTo(s, e, t, r);
}
function fh(n = this.params.speed, e = !0, t) {
  const r = this, {
    enabled: i,
    params: s,
    animating: o
  } = r;
  if (!i) return r;
  let a = s.slidesPerGroup;
  s.slidesPerView === "auto" && s.slidesPerGroup === 1 && s.slidesPerGroupAuto && (a = Math.max(r.slidesPerViewDynamic("current", !0), 1));
  const l = r.activeIndex < s.slidesPerGroupSkip ? 1 : a, u = r.virtual && s.virtual.enabled;
  if (s.loop) {
    if (o && !u && s.loopPreventsSliding) return !1;
    r.loopFix({
      direction: "next"
    }), r._clientLeft = r.wrapperEl.clientLeft;
  }
  return s.rewind && r.isEnd ? r.slideTo(0, n, e, t) : r.slideTo(r.activeIndex + l, n, e, t);
}
function dh(n = this.params.speed, e = !0, t) {
  const r = this, {
    params: i,
    snapGrid: s,
    slidesGrid: o,
    rtlTranslate: a,
    enabled: l,
    animating: u
  } = r;
  if (!l) return r;
  const c = r.virtual && i.virtual.enabled;
  if (i.loop) {
    if (u && !c && i.loopPreventsSliding) return !1;
    r.loopFix({
      direction: "prev"
    }), r._clientLeft = r.wrapperEl.clientLeft;
  }
  const f = a ? r.translate : -r.translate;
  function h(m) {
    return m < 0 ? -Math.floor(Math.abs(m)) : Math.floor(m);
  }
  const d = h(f), _ = s.map((m) => h(m));
  let p = s[_.indexOf(d) - 1];
  if (typeof p > "u" && i.cssMode) {
    let m;
    s.forEach((v, y) => {
      d >= v && (m = y);
    }), typeof m < "u" && (p = s[m > 0 ? m - 1 : m]);
  }
  let g = 0;
  if (typeof p < "u" && (g = o.indexOf(p), g < 0 && (g = r.activeIndex - 1), i.slidesPerView === "auto" && i.slidesPerGroup === 1 && i.slidesPerGroupAuto && (g = g - r.slidesPerViewDynamic("previous", !0) + 1, g = Math.max(g, 0))), i.rewind && r.isBeginning) {
    const m = r.params.virtual && r.params.virtual.enabled && r.virtual ? r.virtual.slides.length - 1 : r.slides.length - 1;
    return r.slideTo(m, n, e, t);
  }
  return r.slideTo(g, n, e, t);
}
function hh(n = this.params.speed, e = !0, t) {
  const r = this;
  return r.slideTo(r.activeIndex, n, e, t);
}
function ph(n = this.params.speed, e = !0, t, r = 0.5) {
  const i = this;
  let s = i.activeIndex;
  const o = Math.min(i.params.slidesPerGroupSkip, s), a = o + Math.floor((s - o) / i.params.slidesPerGroup), l = i.rtlTranslate ? i.translate : -i.translate;
  if (l >= i.snapGrid[a]) {
    const u = i.snapGrid[a], c = i.snapGrid[a + 1];
    l - u > (c - u) * r && (s += i.params.slidesPerGroup);
  } else {
    const u = i.snapGrid[a - 1], c = i.snapGrid[a];
    l - u <= (c - u) * r && (s -= i.params.slidesPerGroup);
  }
  return s = Math.max(s, 0), s = Math.min(s, i.slidesGrid.length - 1), i.slideTo(s, n, e, t);
}
function mh() {
  const n = this, {
    params: e,
    slidesEl: t
  } = n, r = e.slidesPerView === "auto" ? n.slidesPerViewDynamic() : e.slidesPerView;
  let i = n.clickedIndex, s;
  const o = n.isElement ? "swiper-slide" : `.${e.slideClass}`;
  if (e.loop) {
    if (n.animating) return;
    s = parseInt(n.clickedSlide.getAttribute("data-swiper-slide-index"), 10), e.centeredSlides ? i < n.loopedSlides - r / 2 || i > n.slides.length - n.loopedSlides + r / 2 ? (n.loopFix(), i = n.getSlideIndex(sr(t, `${o}[data-swiper-slide-index="${s}"]`)[0]), Fo(() => {
      n.slideTo(i);
    })) : n.slideTo(i) : i > n.slides.length - r ? (n.loopFix(), i = n.getSlideIndex(sr(t, `${o}[data-swiper-slide-index="${s}"]`)[0]), Fo(() => {
      n.slideTo(i);
    })) : n.slideTo(i);
  } else
    n.slideTo(i);
}
const gh = {
  slideTo: uh,
  slideToLoop: ch,
  slideNext: fh,
  slidePrev: dh,
  slideReset: hh,
  slideToClosest: ph,
  slideToClickedSlide: mh
};
function _h(n) {
  const e = this, {
    params: t,
    slidesEl: r
  } = e;
  if (!t.loop || e.virtual && e.params.virtual.enabled) return;
  sr(r, `.${t.slideClass}, swiper-slide`).forEach((s, o) => {
    s.setAttribute("data-swiper-slide-index", o);
  }), e.loopFix({
    slideRealIndex: n,
    direction: t.centeredSlides ? void 0 : "next"
  });
}
function vh({
  slideRealIndex: n,
  slideTo: e = !0,
  direction: t,
  setTranslate: r,
  activeSlideIndex: i,
  byController: s,
  byMousewheel: o
} = {}) {
  const a = this;
  if (!a.params.loop) return;
  a.emit("beforeLoopFix");
  const {
    slides: l,
    allowSlidePrev: u,
    allowSlideNext: c,
    slidesEl: f,
    params: h
  } = a;
  if (a.allowSlidePrev = !0, a.allowSlideNext = !0, a.virtual && h.virtual.enabled) {
    e && (!h.centeredSlides && a.snapIndex === 0 ? a.slideTo(a.virtual.slides.length, 0, !1, !0) : h.centeredSlides && a.snapIndex < h.slidesPerView ? a.slideTo(a.virtual.slides.length + a.snapIndex, 0, !1, !0) : a.snapIndex === a.snapGrid.length - 1 && a.slideTo(a.virtual.slidesBefore, 0, !1, !0)), a.allowSlidePrev = u, a.allowSlideNext = c, a.emit("loopFix");
    return;
  }
  const d = h.slidesPerView === "auto" ? a.slidesPerViewDynamic() : Math.ceil(parseFloat(h.slidesPerView, 10));
  let _ = h.loopedSlides || d;
  _ % h.slidesPerGroup !== 0 && (_ += h.slidesPerGroup - _ % h.slidesPerGroup), a.loopedSlides = _;
  const p = [], g = [];
  let m = a.activeIndex;
  typeof i > "u" ? i = a.getSlideIndex(a.slides.filter((S) => S.classList.contains(h.slideActiveClass))[0]) : m = i;
  const v = t === "next" || !t, y = t === "prev" || !t;
  let w = 0, b = 0;
  if (i < _) {
    w = Math.max(_ - i, h.slidesPerGroup);
    for (let S = 0; S < _ - i; S += 1) {
      const T = S - Math.floor(S / l.length) * l.length;
      p.push(l.length - T - 1);
    }
  } else if (i > a.slides.length - _ * 2) {
    b = Math.max(i - (a.slides.length - _ * 2), h.slidesPerGroup);
    for (let S = 0; S < b; S += 1) {
      const T = S - Math.floor(S / l.length) * l.length;
      g.push(T);
    }
  }
  if (y && p.forEach((S) => {
    a.slides[S].swiperLoopMoveDOM = !0, f.prepend(a.slides[S]), a.slides[S].swiperLoopMoveDOM = !1;
  }), v && g.forEach((S) => {
    a.slides[S].swiperLoopMoveDOM = !0, f.append(a.slides[S]), a.slides[S].swiperLoopMoveDOM = !1;
  }), a.recalcSlides(), h.slidesPerView === "auto" && a.updateSlides(), h.watchSlidesProgress && a.updateSlidesOffset(), e) {
    if (p.length > 0 && y)
      if (typeof n > "u") {
        const S = a.slidesGrid[m], O = a.slidesGrid[m + w] - S;
        o ? a.setTranslate(a.translate - O) : (a.slideTo(m + w, 0, !1, !0), r && (a.touches[a.isHorizontal() ? "startX" : "startY"] += O));
      } else
        r && a.slideToLoop(n, 0, !1, !0);
    else if (g.length > 0 && v)
      if (typeof n > "u") {
        const S = a.slidesGrid[m], O = a.slidesGrid[m - b] - S;
        o ? a.setTranslate(a.translate - O) : (a.slideTo(m - b, 0, !1, !0), r && (a.touches[a.isHorizontal() ? "startX" : "startY"] += O));
      } else
        a.slideToLoop(n, 0, !1, !0);
  }
  if (a.allowSlidePrev = u, a.allowSlideNext = c, a.controller && a.controller.control && !s) {
    const S = {
      slideRealIndex: n,
      slideTo: !1,
      direction: t,
      setTranslate: r,
      activeSlideIndex: i,
      byController: !0
    };
    Array.isArray(a.controller.control) ? a.controller.control.forEach((T) => {
      !T.destroyed && T.params.loop && T.loopFix(S);
    }) : a.controller.control instanceof a.constructor && a.controller.control.params.loop && a.controller.control.loopFix(S);
  }
  a.emit("loopFix");
}
function yh() {
  const n = this, {
    params: e,
    slidesEl: t
  } = n;
  if (!e.loop || n.virtual && n.params.virtual.enabled) return;
  n.recalcSlides();
  const r = [];
  n.slides.forEach((i) => {
    const s = typeof i.swiperSlideIndex > "u" ? i.getAttribute("data-swiper-slide-index") * 1 : i.swiperSlideIndex;
    r[s] = i;
  }), n.slides.forEach((i) => {
    i.removeAttribute("data-swiper-slide-index");
  }), r.forEach((i) => {
    t.append(i);
  }), n.recalcSlides(), n.slideTo(n.realIndex, 0);
}
const wh = {
  loopCreate: _h,
  loopFix: vh,
  loopDestroy: yh
};
function bh(n) {
  const e = this;
  if (!e.params.simulateTouch || e.params.watchOverflow && e.isLocked || e.params.cssMode) return;
  const t = e.params.touchEventsTarget === "container" ? e.el : e.wrapperEl;
  e.isElement && (e.__preventObserver__ = !0), t.style.cursor = "move", t.style.cursor = n ? "grabbing" : "grab", e.isElement && requestAnimationFrame(() => {
    e.__preventObserver__ = !1;
  });
}
function Sh() {
  const n = this;
  n.params.watchOverflow && n.isLocked || n.params.cssMode || (n.isElement && (n.__preventObserver__ = !0), n[n.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "", n.isElement && requestAnimationFrame(() => {
    n.__preventObserver__ = !1;
  }));
}
const xh = {
  setGrabCursor: bh,
  unsetGrabCursor: Sh
};
function Th(n, e = this) {
  function t(r) {
    if (!r || r === mi() || r === zt()) return null;
    r.assignedSlot && (r = r.assignedSlot);
    const i = r.closest(n);
    return !i && !r.getRootNode ? null : i || t(r.getRootNode().host);
  }
  return t(e);
}
function Eh(n) {
  const e = this, t = mi(), r = zt(), i = e.touchEventsData;
  i.evCache.push(n);
  const {
    params: s,
    touches: o,
    enabled: a
  } = e;
  if (!a || !s.simulateTouch && n.pointerType === "mouse" || e.animating && s.preventInteractionOnTransition)
    return;
  !e.animating && s.cssMode && s.loop && e.loopFix();
  let l = n;
  l.originalEvent && (l = l.originalEvent);
  let u = l.target;
  if (s.touchEventsTarget === "wrapper" && !e.wrapperEl.contains(u) || "which" in l && l.which === 3 || "button" in l && l.button > 0 || i.isTouched && i.isMoved) return;
  const c = !!s.noSwipingClass && s.noSwipingClass !== "", f = n.composedPath ? n.composedPath() : n.path;
  c && l.target && l.target.shadowRoot && f && (u = f[0]);
  const h = s.noSwipingSelector ? s.noSwipingSelector : `.${s.noSwipingClass}`, d = !!(l.target && l.target.shadowRoot);
  if (s.noSwiping && (d ? Th(h, u) : u.closest(h))) {
    e.allowClick = !0;
    return;
  }
  if (s.swipeHandler && !u.closest(s.swipeHandler))
    return;
  o.currentX = l.pageX, o.currentY = l.pageY;
  const _ = o.currentX, p = o.currentY, g = s.edgeSwipeDetection || s.iOSEdgeSwipeDetection, m = s.edgeSwipeThreshold || s.iOSEdgeSwipeThreshold;
  if (g && (_ <= m || _ >= r.innerWidth - m))
    if (g === "prevent")
      n.preventDefault();
    else
      return;
  Object.assign(i, {
    isTouched: !0,
    isMoved: !1,
    allowTouchCallbacks: !0,
    isScrolling: void 0,
    startMoving: void 0
  }), o.startX = _, o.startY = p, i.touchStartTime = xs(), e.allowClick = !0, e.updateSize(), e.swipeDirection = void 0, s.threshold > 0 && (i.allowThresholdMove = !1);
  let v = !0;
  u.matches(i.focusableElements) && (v = !1, u.nodeName === "SELECT" && (i.isTouched = !1)), t.activeElement && t.activeElement.matches(i.focusableElements) && t.activeElement !== u && t.activeElement.blur();
  const y = v && e.allowTouchMove && s.touchStartPreventDefault;
  (s.touchStartForcePreventDefault || y) && !u.isContentEditable && l.preventDefault(), s.freeMode && s.freeMode.enabled && e.freeMode && e.animating && !s.cssMode && e.freeMode.onTouchStart(), e.emit("touchStart", l);
}
function Ch(n) {
  const e = mi(), t = this, r = t.touchEventsData, {
    params: i,
    touches: s,
    rtlTranslate: o,
    enabled: a
  } = t;
  if (!a || !i.simulateTouch && n.pointerType === "mouse") return;
  let l = n;
  if (l.originalEvent && (l = l.originalEvent), !r.isTouched) {
    r.startMoving && r.isScrolling && t.emit("touchMoveOpposite", l);
    return;
  }
  const u = r.evCache.findIndex((S) => S.pointerId === l.pointerId);
  u >= 0 && (r.evCache[u] = l);
  const c = r.evCache.length > 1 ? r.evCache[0] : l, f = c.pageX, h = c.pageY;
  if (l.preventedByNestedSwiper) {
    s.startX = f, s.startY = h;
    return;
  }
  if (!t.allowTouchMove) {
    l.target.matches(r.focusableElements) || (t.allowClick = !1), r.isTouched && (Object.assign(s, {
      startX: f,
      startY: h,
      prevX: t.touches.currentX,
      prevY: t.touches.currentY,
      currentX: f,
      currentY: h
    }), r.touchStartTime = xs());
    return;
  }
  if (i.touchReleaseOnEdges && !i.loop) {
    if (t.isVertical()) {
      if (h < s.startY && t.translate <= t.maxTranslate() || h > s.startY && t.translate >= t.minTranslate()) {
        r.isTouched = !1, r.isMoved = !1;
        return;
      }
    } else if (f < s.startX && t.translate <= t.maxTranslate() || f > s.startX && t.translate >= t.minTranslate())
      return;
  }
  if (e.activeElement && l.target === e.activeElement && l.target.matches(r.focusableElements)) {
    r.isMoved = !0, t.allowClick = !1;
    return;
  }
  if (r.allowTouchCallbacks && t.emit("touchMove", l), l.targetTouches && l.targetTouches.length > 1) return;
  s.currentX = f, s.currentY = h;
  const d = s.currentX - s.startX, _ = s.currentY - s.startY;
  if (t.params.threshold && Math.sqrt(d ** 2 + _ ** 2) < t.params.threshold) return;
  if (typeof r.isScrolling > "u") {
    let S;
    t.isHorizontal() && s.currentY === s.startY || t.isVertical() && s.currentX === s.startX ? r.isScrolling = !1 : d * d + _ * _ >= 25 && (S = Math.atan2(Math.abs(_), Math.abs(d)) * 180 / Math.PI, r.isScrolling = t.isHorizontal() ? S > i.touchAngle : 90 - S > i.touchAngle);
  }
  if (r.isScrolling && t.emit("touchMoveOpposite", l), typeof r.startMoving > "u" && (s.currentX !== s.startX || s.currentY !== s.startY) && (r.startMoving = !0), r.isScrolling || t.zoom && t.params.zoom && t.params.zoom.enabled && r.evCache.length > 1) {
    r.isTouched = !1;
    return;
  }
  if (!r.startMoving)
    return;
  t.allowClick = !1, !i.cssMode && l.cancelable && l.preventDefault(), i.touchMoveStopPropagation && !i.nested && l.stopPropagation();
  let p = t.isHorizontal() ? d : _, g = t.isHorizontal() ? s.currentX - s.previousX : s.currentY - s.previousY;
  i.oneWayMovement && (p = Math.abs(p) * (o ? 1 : -1), g = Math.abs(g) * (o ? 1 : -1)), s.diff = p, p *= i.touchRatio, o && (p = -p, g = -g);
  const m = t.touchesDirection;
  t.swipeDirection = p > 0 ? "prev" : "next", t.touchesDirection = g > 0 ? "prev" : "next";
  const v = t.params.loop && !i.cssMode;
  if (!r.isMoved) {
    if (v && t.loopFix({
      direction: t.swipeDirection
    }), r.startTranslate = t.getTranslate(), t.setTransition(0), t.animating) {
      const S = new window.CustomEvent("transitionend", {
        bubbles: !0,
        cancelable: !0
      });
      t.wrapperEl.dispatchEvent(S);
    }
    r.allowMomentumBounce = !1, i.grabCursor && (t.allowSlideNext === !0 || t.allowSlidePrev === !0) && t.setGrabCursor(!0), t.emit("sliderFirstMove", l);
  }
  let y;
  r.isMoved && m !== t.touchesDirection && v && Math.abs(p) >= 1 && (t.loopFix({
    direction: t.swipeDirection,
    setTranslate: !0
  }), y = !0), t.emit("sliderMove", l), r.isMoved = !0, r.currentTranslate = p + r.startTranslate;
  let w = !0, b = i.resistanceRatio;
  if (i.touchReleaseOnEdges && (b = 0), p > 0 ? (v && !y && r.currentTranslate > (i.centeredSlides ? t.minTranslate() - t.size / 2 : t.minTranslate()) && t.loopFix({
    direction: "prev",
    setTranslate: !0,
    activeSlideIndex: 0
  }), r.currentTranslate > t.minTranslate() && (w = !1, i.resistance && (r.currentTranslate = t.minTranslate() - 1 + (-t.minTranslate() + r.startTranslate + p) ** b))) : p < 0 && (v && !y && r.currentTranslate < (i.centeredSlides ? t.maxTranslate() + t.size / 2 : t.maxTranslate()) && t.loopFix({
    direction: "next",
    setTranslate: !0,
    activeSlideIndex: t.slides.length - (i.slidesPerView === "auto" ? t.slidesPerViewDynamic() : Math.ceil(parseFloat(i.slidesPerView, 10)))
  }), r.currentTranslate < t.maxTranslate() && (w = !1, i.resistance && (r.currentTranslate = t.maxTranslate() + 1 - (t.maxTranslate() - r.startTranslate - p) ** b))), w && (l.preventedByNestedSwiper = !0), !t.allowSlideNext && t.swipeDirection === "next" && r.currentTranslate < r.startTranslate && (r.currentTranslate = r.startTranslate), !t.allowSlidePrev && t.swipeDirection === "prev" && r.currentTranslate > r.startTranslate && (r.currentTranslate = r.startTranslate), !t.allowSlidePrev && !t.allowSlideNext && (r.currentTranslate = r.startTranslate), i.threshold > 0)
    if (Math.abs(p) > i.threshold || r.allowThresholdMove) {
      if (!r.allowThresholdMove) {
        r.allowThresholdMove = !0, s.startX = s.currentX, s.startY = s.currentY, r.currentTranslate = r.startTranslate, s.diff = t.isHorizontal() ? s.currentX - s.startX : s.currentY - s.startY;
        return;
      }
    } else {
      r.currentTranslate = r.startTranslate;
      return;
    }
  !i.followFinger || i.cssMode || ((i.freeMode && i.freeMode.enabled && t.freeMode || i.watchSlidesProgress) && (t.updateActiveIndex(), t.updateSlidesClasses()), i.freeMode && i.freeMode.enabled && t.freeMode && t.freeMode.onTouchMove(), t.updateProgress(r.currentTranslate), t.setTranslate(r.currentTranslate));
}
function Ph(n) {
  const e = this, t = e.touchEventsData, r = t.evCache.findIndex((y) => y.pointerId === n.pointerId);
  if (r >= 0 && t.evCache.splice(r, 1), ["pointercancel", "pointerout", "pointerleave"].includes(n.type) && !(n.type === "pointercancel" && (e.browser.isSafari || e.browser.isWebView)))
    return;
  const {
    params: i,
    touches: s,
    rtlTranslate: o,
    slidesGrid: a,
    enabled: l
  } = e;
  if (!l || !i.simulateTouch && n.pointerType === "mouse") return;
  let u = n;
  if (u.originalEvent && (u = u.originalEvent), t.allowTouchCallbacks && e.emit("touchEnd", u), t.allowTouchCallbacks = !1, !t.isTouched) {
    t.isMoved && i.grabCursor && e.setGrabCursor(!1), t.isMoved = !1, t.startMoving = !1;
    return;
  }
  i.grabCursor && t.isMoved && t.isTouched && (e.allowSlideNext === !0 || e.allowSlidePrev === !0) && e.setGrabCursor(!1);
  const c = xs(), f = c - t.touchStartTime;
  if (e.allowClick) {
    const y = u.path || u.composedPath && u.composedPath();
    e.updateClickedSlide(y && y[0] || u.target), e.emit("tap click", u), f < 300 && c - t.lastClickTime < 300 && e.emit("doubleTap doubleClick", u);
  }
  if (t.lastClickTime = xs(), Fo(() => {
    e.destroyed || (e.allowClick = !0);
  }), !t.isTouched || !t.isMoved || !e.swipeDirection || s.diff === 0 || t.currentTranslate === t.startTranslate) {
    t.isTouched = !1, t.isMoved = !1, t.startMoving = !1;
    return;
  }
  t.isTouched = !1, t.isMoved = !1, t.startMoving = !1;
  let h;
  if (i.followFinger ? h = o ? e.translate : -e.translate : h = -t.currentTranslate, i.cssMode)
    return;
  if (i.freeMode && i.freeMode.enabled) {
    e.freeMode.onTouchEnd({
      currentPos: h
    });
    return;
  }
  let d = 0, _ = e.slidesSizesGrid[0];
  for (let y = 0; y < a.length; y += y < i.slidesPerGroupSkip ? 1 : i.slidesPerGroup) {
    const w = y < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
    typeof a[y + w] < "u" ? h >= a[y] && h < a[y + w] && (d = y, _ = a[y + w] - a[y]) : h >= a[y] && (d = y, _ = a[a.length - 1] - a[a.length - 2]);
  }
  let p = null, g = null;
  i.rewind && (e.isBeginning ? g = i.virtual && i.virtual.enabled && e.virtual ? e.virtual.slides.length - 1 : e.slides.length - 1 : e.isEnd && (p = 0));
  const m = (h - a[d]) / _, v = d < i.slidesPerGroupSkip - 1 ? 1 : i.slidesPerGroup;
  if (f > i.longSwipesMs) {
    if (!i.longSwipes) {
      e.slideTo(e.activeIndex);
      return;
    }
    e.swipeDirection === "next" && (m >= i.longSwipesRatio ? e.slideTo(i.rewind && e.isEnd ? p : d + v) : e.slideTo(d)), e.swipeDirection === "prev" && (m > 1 - i.longSwipesRatio ? e.slideTo(d + v) : g !== null && m < 0 && Math.abs(m) > i.longSwipesRatio ? e.slideTo(g) : e.slideTo(d));
  } else {
    if (!i.shortSwipes) {
      e.slideTo(e.activeIndex);
      return;
    }
    e.navigation && (u.target === e.navigation.nextEl || u.target === e.navigation.prevEl) ? u.target === e.navigation.nextEl ? e.slideTo(d + v) : e.slideTo(d) : (e.swipeDirection === "next" && e.slideTo(p !== null ? p : d + v), e.swipeDirection === "prev" && e.slideTo(g !== null ? g : d));
  }
}
function ul() {
  const n = this, {
    params: e,
    el: t
  } = n;
  if (t && t.offsetWidth === 0) return;
  e.breakpoints && n.setBreakpoint();
  const {
    allowSlideNext: r,
    allowSlidePrev: i,
    snapGrid: s
  } = n, o = n.virtual && n.params.virtual.enabled;
  n.allowSlideNext = !0, n.allowSlidePrev = !0, n.updateSize(), n.updateSlides(), n.updateSlidesClasses();
  const a = o && e.loop;
  (e.slidesPerView === "auto" || e.slidesPerView > 1) && n.isEnd && !n.isBeginning && !n.params.centeredSlides && !a ? n.slideTo(n.slides.length - 1, 0, !1, !0) : n.params.loop && !o ? n.slideToLoop(n.realIndex, 0, !1, !0) : n.slideTo(n.activeIndex, 0, !1, !0), n.autoplay && n.autoplay.running && n.autoplay.paused && (clearTimeout(n.autoplay.resizeTimeout), n.autoplay.resizeTimeout = setTimeout(() => {
    n.autoplay && n.autoplay.running && n.autoplay.paused && n.autoplay.resume();
  }, 500)), n.allowSlidePrev = i, n.allowSlideNext = r, n.params.watchOverflow && s !== n.snapGrid && n.checkOverflow();
}
function Oh(n) {
  const e = this;
  e.enabled && (e.allowClick || (e.params.preventClicks && n.preventDefault(), e.params.preventClicksPropagation && e.animating && (n.stopPropagation(), n.stopImmediatePropagation())));
}
function Mh() {
  const n = this, {
    wrapperEl: e,
    rtlTranslate: t,
    enabled: r
  } = n;
  if (!r) return;
  n.previousTranslate = n.translate, n.isHorizontal() ? n.translate = -e.scrollLeft : n.translate = -e.scrollTop, n.translate === 0 && (n.translate = 0), n.updateActiveIndex(), n.updateSlidesClasses();
  let i;
  const s = n.maxTranslate() - n.minTranslate();
  s === 0 ? i = 0 : i = (n.translate - n.minTranslate()) / s, i !== n.progress && n.updateProgress(t ? -n.translate : n.translate), n.emit("setTranslate", n.translate, !1);
}
function Ah(n) {
  const e = this;
  os(e, n.target), !(e.params.cssMode || e.params.slidesPerView !== "auto" && !e.params.autoHeight) && e.update();
}
let cl = !1;
function Rh() {
}
const ac = (n, e) => {
  const t = mi(), {
    params: r,
    el: i,
    wrapperEl: s,
    device: o
  } = n, a = !!r.nested, l = e === "on" ? "addEventListener" : "removeEventListener", u = e;
  i[l]("pointerdown", n.onTouchStart, {
    passive: !1
  }), t[l]("pointermove", n.onTouchMove, {
    passive: !1,
    capture: a
  }), t[l]("pointerup", n.onTouchEnd, {
    passive: !0
  }), t[l]("pointercancel", n.onTouchEnd, {
    passive: !0
  }), t[l]("pointerout", n.onTouchEnd, {
    passive: !0
  }), t[l]("pointerleave", n.onTouchEnd, {
    passive: !0
  }), (r.preventClicks || r.preventClicksPropagation) && i[l]("click", n.onClick, !0), r.cssMode && s[l]("scroll", n.onScroll), r.updateOnWindowResize ? n[u](o.ios || o.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", ul, !0) : n[u]("observerUpdate", ul, !0), i[l]("load", n.onLoad, {
    capture: !0
  });
};
function kh() {
  const n = this, e = mi(), {
    params: t
  } = n;
  n.onTouchStart = Eh.bind(n), n.onTouchMove = Ch.bind(n), n.onTouchEnd = Ph.bind(n), t.cssMode && (n.onScroll = Mh.bind(n)), n.onClick = Oh.bind(n), n.onLoad = Ah.bind(n), cl || (e.addEventListener("touchstart", Rh), cl = !0), ac(n, "on");
}
function Lh() {
  ac(this, "off");
}
const Dh = {
  attachEvents: kh,
  detachEvents: Lh
}, fl = (n, e) => n.grid && e.grid && e.grid.rows > 1;
function zh() {
  const n = this, {
    realIndex: e,
    initialized: t,
    params: r,
    el: i
  } = n, s = r.breakpoints;
  if (!s || s && Object.keys(s).length === 0) return;
  const o = n.getBreakpoint(s, n.params.breakpointsBase, n.el);
  if (!o || n.currentBreakpoint === o) return;
  const l = (o in s ? s[o] : void 0) || n.originalParams, u = fl(n, r), c = fl(n, l), f = r.enabled;
  u && !c ? (i.classList.remove(`${r.containerModifierClass}grid`, `${r.containerModifierClass}grid-column`), n.emitContainerClasses()) : !u && c && (i.classList.add(`${r.containerModifierClass}grid`), (l.grid.fill && l.grid.fill === "column" || !l.grid.fill && r.grid.fill === "column") && i.classList.add(`${r.containerModifierClass}grid-column`), n.emitContainerClasses()), ["navigation", "pagination", "scrollbar"].forEach((p) => {
    if (typeof l[p] > "u") return;
    const g = r[p] && r[p].enabled, m = l[p] && l[p].enabled;
    g && !m && n[p].disable(), !g && m && n[p].enable();
  });
  const h = l.direction && l.direction !== r.direction, d = r.loop && (l.slidesPerView !== r.slidesPerView || h);
  h && t && n.changeDirection(), Ct(n.params, l);
  const _ = n.params.enabled;
  Object.assign(n, {
    allowTouchMove: n.params.allowTouchMove,
    allowSlideNext: n.params.allowSlideNext,
    allowSlidePrev: n.params.allowSlidePrev
  }), f && !_ ? n.disable() : !f && _ && n.enable(), n.currentBreakpoint = o, n.emit("_beforeBreakpoint", l), d && t && (n.loopDestroy(), n.loopCreate(e), n.updateSlides()), n.emit("breakpoint", l);
}
function Ih(n, e = "window", t) {
  if (!n || e === "container" && !t) return;
  let r = !1;
  const i = zt(), s = e === "window" ? i.innerHeight : t.clientHeight, o = Object.keys(n).map((a) => {
    if (typeof a == "string" && a.indexOf("@") === 0) {
      const l = parseFloat(a.substr(1));
      return {
        value: s * l,
        point: a
      };
    }
    return {
      value: a,
      point: a
    };
  });
  o.sort((a, l) => parseInt(a.value, 10) - parseInt(l.value, 10));
  for (let a = 0; a < o.length; a += 1) {
    const {
      point: l,
      value: u
    } = o[a];
    e === "window" ? i.matchMedia(`(min-width: ${u}px)`).matches && (r = l) : u <= t.clientWidth && (r = l);
  }
  return r || "max";
}
const Fh = {
  setBreakpoint: zh,
  getBreakpoint: Ih
};
function Nh(n, e) {
  const t = [];
  return n.forEach((r) => {
    typeof r == "object" ? Object.keys(r).forEach((i) => {
      r[i] && t.push(e + i);
    }) : typeof r == "string" && t.push(e + r);
  }), t;
}
function Bh() {
  const n = this, {
    classNames: e,
    params: t,
    rtl: r,
    el: i,
    device: s
  } = n, o = Nh(["initialized", t.direction, {
    "free-mode": n.params.freeMode && t.freeMode.enabled
  }, {
    autoheight: t.autoHeight
  }, {
    rtl: r
  }, {
    grid: t.grid && t.grid.rows > 1
  }, {
    "grid-column": t.grid && t.grid.rows > 1 && t.grid.fill === "column"
  }, {
    android: s.android
  }, {
    ios: s.ios
  }, {
    "css-mode": t.cssMode
  }, {
    centered: t.cssMode && t.centeredSlides
  }, {
    "watch-progress": t.watchSlidesProgress
  }], t.containerModifierClass);
  e.push(...o), i.classList.add(...e), n.emitContainerClasses();
}
function $h() {
  const n = this, {
    el: e,
    classNames: t
  } = n;
  e.classList.remove(...t), n.emitContainerClasses();
}
const Hh = {
  addClasses: Bh,
  removeClasses: $h
};
function Vh() {
  const n = this, {
    isLocked: e,
    params: t
  } = n, {
    slidesOffsetBefore: r
  } = t;
  if (r) {
    const i = n.slides.length - 1, s = n.slidesGrid[i] + n.slidesSizesGrid[i] + r * 2;
    n.isLocked = n.size > s;
  } else
    n.isLocked = n.snapGrid.length === 1;
  t.allowSlideNext === !0 && (n.allowSlideNext = !n.isLocked), t.allowSlidePrev === !0 && (n.allowSlidePrev = !n.isLocked), e && e !== n.isLocked && (n.isEnd = !1), e !== n.isLocked && n.emit(n.isLocked ? "lock" : "unlock");
}
const Gh = {
  checkOverflow: Vh
}, dl = {
  init: !0,
  direction: "horizontal",
  oneWayMovement: !1,
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: !1,
  updateOnWindowResize: !0,
  resizeObserver: !0,
  nested: !1,
  createElements: !1,
  enabled: !0,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: !1,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: !1,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: !1,
  // Set wrapper width
  setWrapperSize: !1,
  // Virtual Translate
  virtualTranslate: !1,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: !1,
  centeredSlides: !1,
  centeredSlidesBounds: !1,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: !0,
  centerInsufficientSlides: !1,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: !0,
  // Round length
  roundLengths: !1,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: !0,
  shortSwipes: !0,
  longSwipes: !0,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: !0,
  allowTouchMove: !0,
  threshold: 5,
  touchMoveStopPropagation: !1,
  touchStartPreventDefault: !0,
  touchStartForcePreventDefault: !1,
  touchReleaseOnEdges: !1,
  // Unique Navigation Elements
  uniqueNavElements: !0,
  // Resistance
  resistance: !0,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: !1,
  // Cursor
  grabCursor: !1,
  // Clicks
  preventClicks: !0,
  preventClicksPropagation: !0,
  slideToClickedSlide: !1,
  // loop
  loop: !1,
  loopedSlides: null,
  loopPreventsSliding: !0,
  // rewind
  rewind: !1,
  // Swiping/no swiping
  allowSlidePrev: !0,
  allowSlideNext: !0,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: !0,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: !0,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: !0,
  // Internals
  _emitClasses: !1
};
function qh(n, e) {
  return function(r = {}) {
    const i = Object.keys(r)[0], s = r[i];
    if (typeof s != "object" || s === null) {
      Ct(e, r);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(i) >= 0 && n[i] === !0 && (n[i] = {
      auto: !0
    }), !(i in n && "enabled" in s)) {
      Ct(e, r);
      return;
    }
    n[i] === !0 && (n[i] = {
      enabled: !0
    }), typeof n[i] == "object" && !("enabled" in n[i]) && (n[i].enabled = !0), n[i] || (n[i] = {
      enabled: !1
    }), Ct(e, r);
  };
}
const no = {
  eventsEmitter: Hd,
  update: Qd,
  translate: nh,
  transition: lh,
  slide: gh,
  loop: wh,
  grabCursor: xh,
  events: Dh,
  breakpoints: Fh,
  checkOverflow: Gh,
  classes: Hh
}, so = {};
class Nt {
  constructor(...e) {
    let t, r;
    e.length === 1 && e[0].constructor && Object.prototype.toString.call(e[0]).slice(8, -1) === "Object" ? r = e[0] : [t, r] = e, r || (r = {}), r = Ct({}, r), t && !r.el && (r.el = t);
    const i = mi();
    if (r.el && typeof r.el == "string" && i.querySelectorAll(r.el).length > 1) {
      const l = [];
      return i.querySelectorAll(r.el).forEach((u) => {
        const c = Ct({}, r, {
          el: u
        });
        l.push(new Nt(c));
      }), l;
    }
    const s = this;
    s.__swiper__ = !0, s.support = sc(), s.device = Id({
      userAgent: r.userAgent
    }), s.browser = Nd(), s.eventsListeners = {}, s.eventsAnyListeners = [], s.modules = [...s.__modules__], r.modules && Array.isArray(r.modules) && s.modules.push(...r.modules);
    const o = {};
    s.modules.forEach((l) => {
      l({
        params: r,
        swiper: s,
        extendParams: qh(r, o),
        on: s.on.bind(s),
        once: s.once.bind(s),
        off: s.off.bind(s),
        emit: s.emit.bind(s)
      });
    });
    const a = Ct({}, dl, o);
    return s.params = Ct({}, a, so, r), s.originalParams = Ct({}, s.params), s.passedParams = Ct({}, r), s.params && s.params.on && Object.keys(s.params.on).forEach((l) => {
      s.on(l, s.params.on[l]);
    }), s.params && s.params.onAny && s.onAny(s.params.onAny), Object.assign(s, {
      enabled: s.params.enabled,
      el: t,
      // Classes
      classNames: [],
      // Slides
      slides: [],
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return s.params.direction === "horizontal";
      },
      isVertical() {
        return s.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: !0,
      isEnd: !1,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: !1,
      cssOverflowAdjustment() {
        return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
      },
      // Locks
      allowSlideNext: s.params.allowSlideNext,
      allowSlidePrev: s.params.allowSlidePrev,
      // Touch Events
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: s.params.focusableElements,
        // Last click time
        lastClickTime: 0,
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        startMoving: void 0,
        evCache: []
      },
      // Clicks
      allowClick: !0,
      // Touches
      allowTouchMove: s.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    }), s.emit("_swiper"), s.params.init && s.init(), s;
  }
  getSlideIndex(e) {
    const {
      slidesEl: t,
      params: r
    } = this, i = sr(t, `.${r.slideClass}, swiper-slide`), s = Ts(i[0]);
    return Ts(e) - s;
  }
  getSlideIndexByData(e) {
    return this.getSlideIndex(this.slides.filter((t) => t.getAttribute("data-swiper-slide-index") * 1 === e)[0]);
  }
  recalcSlides() {
    const e = this, {
      slidesEl: t,
      params: r
    } = e;
    e.slides = sr(t, `.${r.slideClass}, swiper-slide`);
  }
  enable() {
    const e = this;
    e.enabled || (e.enabled = !0, e.params.grabCursor && e.setGrabCursor(), e.emit("enable"));
  }
  disable() {
    const e = this;
    e.enabled && (e.enabled = !1, e.params.grabCursor && e.unsetGrabCursor(), e.emit("disable"));
  }
  setProgress(e, t) {
    const r = this;
    e = Math.min(Math.max(e, 0), 1);
    const i = r.minTranslate(), o = (r.maxTranslate() - i) * e + i;
    r.translateTo(o, typeof t > "u" ? 0 : t), r.updateActiveIndex(), r.updateSlidesClasses();
  }
  emitContainerClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const t = e.el.className.split(" ").filter((r) => r.indexOf("swiper") === 0 || r.indexOf(e.params.containerModifierClass) === 0);
    e.emit("_containerClasses", t.join(" "));
  }
  getSlideClasses(e) {
    const t = this;
    return t.destroyed ? "" : e.className.split(" ").filter((r) => r.indexOf("swiper-slide") === 0 || r.indexOf(t.params.slideClass) === 0).join(" ");
  }
  emitSlidesClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const t = [];
    e.slides.forEach((r) => {
      const i = e.getSlideClasses(r);
      t.push({
        slideEl: r,
        classNames: i
      }), e.emit("_slideClass", r, i);
    }), e.emit("_slideClasses", t);
  }
  slidesPerViewDynamic(e = "current", t = !1) {
    const r = this, {
      params: i,
      slides: s,
      slidesGrid: o,
      slidesSizesGrid: a,
      size: l,
      activeIndex: u
    } = r;
    let c = 1;
    if (i.centeredSlides) {
      let f = s[u] ? s[u].swiperSlideSize : 0, h;
      for (let d = u + 1; d < s.length; d += 1)
        s[d] && !h && (f += s[d].swiperSlideSize, c += 1, f > l && (h = !0));
      for (let d = u - 1; d >= 0; d -= 1)
        s[d] && !h && (f += s[d].swiperSlideSize, c += 1, f > l && (h = !0));
    } else if (e === "current")
      for (let f = u + 1; f < s.length; f += 1)
        (t ? o[f] + a[f] - o[u] < l : o[f] - o[u] < l) && (c += 1);
    else
      for (let f = u - 1; f >= 0; f -= 1)
        o[u] - o[f] < l && (c += 1);
    return c;
  }
  update() {
    const e = this;
    if (!e || e.destroyed) return;
    const {
      snapGrid: t,
      params: r
    } = e;
    r.breakpoints && e.setBreakpoint(), [...e.el.querySelectorAll('[loading="lazy"]')].forEach((o) => {
      o.complete && os(e, o);
    }), e.updateSize(), e.updateSlides(), e.updateProgress(), e.updateSlidesClasses();
    function i() {
      const o = e.rtlTranslate ? e.translate * -1 : e.translate, a = Math.min(Math.max(o, e.maxTranslate()), e.minTranslate());
      e.setTranslate(a), e.updateActiveIndex(), e.updateSlidesClasses();
    }
    let s;
    if (r.freeMode && r.freeMode.enabled && !r.cssMode)
      i(), r.autoHeight && e.updateAutoHeight();
    else {
      if ((r.slidesPerView === "auto" || r.slidesPerView > 1) && e.isEnd && !r.centeredSlides) {
        const o = e.virtual && r.virtual.enabled ? e.virtual.slides : e.slides;
        s = e.slideTo(o.length - 1, 0, !1, !0);
      } else
        s = e.slideTo(e.activeIndex, 0, !1, !0);
      s || i();
    }
    r.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
  }
  changeDirection(e, t = !0) {
    const r = this, i = r.params.direction;
    return e || (e = i === "horizontal" ? "vertical" : "horizontal"), e === i || e !== "horizontal" && e !== "vertical" || (r.el.classList.remove(`${r.params.containerModifierClass}${i}`), r.el.classList.add(`${r.params.containerModifierClass}${e}`), r.emitContainerClasses(), r.params.direction = e, r.slides.forEach((s) => {
      e === "vertical" ? s.style.width = "" : s.style.height = "";
    }), r.emit("changeDirection"), t && r.update()), r;
  }
  changeLanguageDirection(e) {
    const t = this;
    t.rtl && e === "rtl" || !t.rtl && e === "ltr" || (t.rtl = e === "rtl", t.rtlTranslate = t.params.direction === "horizontal" && t.rtl, t.rtl ? (t.el.classList.add(`${t.params.containerModifierClass}rtl`), t.el.dir = "rtl") : (t.el.classList.remove(`${t.params.containerModifierClass}rtl`), t.el.dir = "ltr"), t.update());
  }
  mount(e) {
    const t = this;
    if (t.mounted) return !0;
    let r = e || t.params.el;
    if (typeof r == "string" && (r = document.querySelector(r)), !r)
      return !1;
    r.swiper = t, r.shadowEl && (t.isElement = !0);
    const i = () => `.${(t.params.wrapperClass || "").trim().split(" ").join(".")}`;
    let o = r && r.shadowRoot && r.shadowRoot.querySelector ? r.shadowRoot.querySelector(i()) : sr(r, i())[0];
    return !o && t.params.createElements && (o = ic("div", t.params.wrapperClass), r.append(o), sr(r, `.${t.params.slideClass}`).forEach((a) => {
      o.append(a);
    })), Object.assign(t, {
      el: r,
      wrapperEl: o,
      slidesEl: t.isElement ? r : o,
      mounted: !0,
      // RTL
      rtl: r.dir.toLowerCase() === "rtl" || Dr(r, "direction") === "rtl",
      rtlTranslate: t.params.direction === "horizontal" && (r.dir.toLowerCase() === "rtl" || Dr(r, "direction") === "rtl"),
      wrongRTL: Dr(o, "display") === "-webkit-box"
    }), !0;
  }
  init(e) {
    const t = this;
    return t.initialized || t.mount(e) === !1 || (t.emit("beforeInit"), t.params.breakpoints && t.setBreakpoint(), t.addClasses(), t.updateSize(), t.updateSlides(), t.params.watchOverflow && t.checkOverflow(), t.params.grabCursor && t.enabled && t.setGrabCursor(), t.params.loop && t.virtual && t.params.virtual.enabled ? t.slideTo(t.params.initialSlide + t.virtual.slidesBefore, 0, t.params.runCallbacksOnInit, !1, !0) : t.slideTo(t.params.initialSlide, 0, t.params.runCallbacksOnInit, !1, !0), t.params.loop && t.loopCreate(), t.attachEvents(), [...t.el.querySelectorAll('[loading="lazy"]')].forEach((i) => {
      i.complete ? os(t, i) : i.addEventListener("load", (s) => {
        os(t, s.target);
      });
    }), Bo(t), t.initialized = !0, Bo(t), t.emit("init"), t.emit("afterInit")), t;
  }
  destroy(e = !0, t = !0) {
    const r = this, {
      params: i,
      el: s,
      wrapperEl: o,
      slides: a
    } = r;
    return typeof r.params > "u" || r.destroyed || (r.emit("beforeDestroy"), r.initialized = !1, r.detachEvents(), i.loop && r.loopDestroy(), t && (r.removeClasses(), s.removeAttribute("style"), o.removeAttribute("style"), a && a.length && a.forEach((l) => {
      l.classList.remove(i.slideVisibleClass, i.slideActiveClass, i.slideNextClass, i.slidePrevClass), l.removeAttribute("style"), l.removeAttribute("data-swiper-slide-index");
    })), r.emit("destroy"), Object.keys(r.eventsListeners).forEach((l) => {
      r.off(l);
    }), e !== !1 && (r.el.swiper = null, Od(r)), r.destroyed = !0), null;
  }
  static extendDefaults(e) {
    Ct(so, e);
  }
  static get extendedDefaults() {
    return so;
  }
  static get defaults() {
    return dl;
  }
  static installModule(e) {
    Nt.prototype.__modules__ || (Nt.prototype.__modules__ = []);
    const t = Nt.prototype.__modules__;
    typeof e == "function" && t.indexOf(e) < 0 && t.push(e);
  }
  static use(e) {
    return Array.isArray(e) ? (e.forEach((t) => Nt.installModule(t)), Nt) : (Nt.installModule(e), Nt);
  }
}
Object.keys(no).forEach((n) => {
  Object.keys(no[n]).forEach((e) => {
    Nt.prototype[e] = no[n][e];
  });
});
Nt.use([Bd, $d]);
function Uh(n, e, t, r) {
  return n.params.createElements && Object.keys(r).forEach((i) => {
    if (!t[i] && t.auto === !0) {
      let s = sr(n.el, `.${r[i]}`)[0];
      s || (s = ic("div", r[i]), s.className = r[i], n.el.append(s)), t[i] = s, e[i] = s;
    }
  }), t;
}
function Ki(n = "") {
  return `.${n.trim().replace(/([\.:!+\/])/g, "\\$1").replace(/ /g, ".")}`;
}
function Wh({
  swiper: n,
  extendParams: e,
  on: t,
  emit: r
}) {
  const i = "swiper-pagination";
  e({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: !1,
      hideOnClick: !1,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: !1,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: !1,
      dynamicMainBullets: 1,
      formatFractionCurrent: (m) => m,
      formatFractionTotal: (m) => m,
      bulletClass: `${i}-bullet`,
      bulletActiveClass: `${i}-bullet-active`,
      modifierClass: `${i}-`,
      currentClass: `${i}-current`,
      totalClass: `${i}-total`,
      hiddenClass: `${i}-hidden`,
      progressbarFillClass: `${i}-progressbar-fill`,
      progressbarOppositeClass: `${i}-progressbar-opposite`,
      clickableClass: `${i}-clickable`,
      lockClass: `${i}-lock`,
      horizontalClass: `${i}-horizontal`,
      verticalClass: `${i}-vertical`,
      paginationDisabledClass: `${i}-disabled`
    }
  }), n.pagination = {
    el: null,
    bullets: []
  };
  let s, o = 0;
  const a = (m) => (Array.isArray(m) || (m = [m].filter((v) => !!v)), m);
  function l() {
    return !n.params.pagination.el || !n.pagination.el || Array.isArray(n.pagination.el) && n.pagination.el.length === 0;
  }
  function u(m, v) {
    const {
      bulletActiveClass: y
    } = n.params.pagination;
    m && (m = m[`${v === "prev" ? "previous" : "next"}ElementSibling`], m && (m.classList.add(`${y}-${v}`), m = m[`${v === "prev" ? "previous" : "next"}ElementSibling`], m && m.classList.add(`${y}-${v}-${v}`)));
  }
  function c(m) {
    const v = m.target.closest(Ki(n.params.pagination.bulletClass));
    if (!v)
      return;
    m.preventDefault();
    const y = Ts(v) * n.params.slidesPerGroup;
    if (n.params.loop) {
      if (n.realIndex === y) return;
      const w = n.getSlideIndexByData(y), b = n.getSlideIndexByData(n.realIndex);
      w > n.slides.length - n.loopedSlides && n.loopFix({
        direction: w > b ? "next" : "prev",
        activeSlideIndex: w,
        slideTo: !1
      }), n.slideToLoop(y);
    } else
      n.slideTo(y);
  }
  function f() {
    const m = n.rtl, v = n.params.pagination;
    if (l()) return;
    let y = n.pagination.el;
    y = a(y);
    let w, b;
    const S = n.virtual && n.params.virtual.enabled ? n.virtual.slides.length : n.slides.length, T = n.params.loop ? Math.ceil(S / n.params.slidesPerGroup) : n.snapGrid.length;
    if (n.params.loop ? (b = n.previousRealIndex || 0, w = n.params.slidesPerGroup > 1 ? Math.floor(n.realIndex / n.params.slidesPerGroup) : n.realIndex) : typeof n.snapIndex < "u" ? (w = n.snapIndex, b = n.previousSnapIndex) : (b = n.previousIndex || 0, w = n.activeIndex || 0), v.type === "bullets" && n.pagination.bullets && n.pagination.bullets.length > 0) {
      const O = n.pagination.bullets;
      let E, P, R;
      if (v.dynamicBullets && (s = No(O[0], n.isHorizontal() ? "width" : "height"), y.forEach((C) => {
        C.style[n.isHorizontal() ? "width" : "height"] = `${s * (v.dynamicMainBullets + 4)}px`;
      }), v.dynamicMainBullets > 1 && b !== void 0 && (o += w - (b || 0), o > v.dynamicMainBullets - 1 ? o = v.dynamicMainBullets - 1 : o < 0 && (o = 0)), E = Math.max(w - o, 0), P = E + (Math.min(O.length, v.dynamicMainBullets) - 1), R = (P + E) / 2), O.forEach((C) => {
        const L = [...["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((z) => `${v.bulletActiveClass}${z}`)].map((z) => typeof z == "string" && z.includes(" ") ? z.split(" ") : z).flat();
        C.classList.remove(...L);
      }), y.length > 1)
        O.forEach((C) => {
          const L = Ts(C);
          L === w ? C.classList.add(...v.bulletActiveClass.split(" ")) : n.isElement && C.setAttribute("part", "bullet"), v.dynamicBullets && (L >= E && L <= P && C.classList.add(...`${v.bulletActiveClass}-main`.split(" ")), L === E && u(C, "prev"), L === P && u(C, "next"));
        });
      else {
        const C = O[w];
        if (C && C.classList.add(...v.bulletActiveClass.split(" ")), n.isElement && O.forEach((L, z) => {
          L.setAttribute("part", z === w ? "bullet-active" : "bullet");
        }), v.dynamicBullets) {
          const L = O[E], z = O[P];
          for (let H = E; H <= P; H += 1)
            O[H] && O[H].classList.add(...`${v.bulletActiveClass}-main`.split(" "));
          u(L, "prev"), u(z, "next");
        }
      }
      if (v.dynamicBullets) {
        const C = Math.min(O.length, v.dynamicMainBullets + 4), L = (s * C - s) / 2 - R * s, z = m ? "right" : "left";
        O.forEach((H) => {
          H.style[n.isHorizontal() ? z : "top"] = `${L}px`;
        });
      }
    }
    y.forEach((O, E) => {
      if (v.type === "fraction" && (O.querySelectorAll(Ki(v.currentClass)).forEach((P) => {
        P.textContent = v.formatFractionCurrent(w + 1);
      }), O.querySelectorAll(Ki(v.totalClass)).forEach((P) => {
        P.textContent = v.formatFractionTotal(T);
      })), v.type === "progressbar") {
        let P;
        v.progressbarOpposite ? P = n.isHorizontal() ? "vertical" : "horizontal" : P = n.isHorizontal() ? "horizontal" : "vertical";
        const R = (w + 1) / T;
        let C = 1, L = 1;
        P === "horizontal" ? C = R : L = R, O.querySelectorAll(Ki(v.progressbarFillClass)).forEach((z) => {
          z.style.transform = `translate3d(0,0,0) scaleX(${C}) scaleY(${L})`, z.style.transitionDuration = `${n.params.speed}ms`;
        });
      }
      v.type === "custom" && v.renderCustom ? (O.innerHTML = v.renderCustom(n, w + 1, T), E === 0 && r("paginationRender", O)) : (E === 0 && r("paginationRender", O), r("paginationUpdate", O)), n.params.watchOverflow && n.enabled && O.classList[n.isLocked ? "add" : "remove"](v.lockClass);
    });
  }
  function h() {
    const m = n.params.pagination;
    if (l()) return;
    const v = n.virtual && n.params.virtual.enabled ? n.virtual.slides.length : n.slides.length;
    let y = n.pagination.el;
    y = a(y);
    let w = "";
    if (m.type === "bullets") {
      let b = n.params.loop ? Math.ceil(v / n.params.slidesPerGroup) : n.snapGrid.length;
      n.params.freeMode && n.params.freeMode.enabled && b > v && (b = v);
      for (let S = 0; S < b; S += 1)
        m.renderBullet ? w += m.renderBullet.call(n, S, m.bulletClass) : w += `<${m.bulletElement} ${n.isElement ? 'part="bullet"' : ""} class="${m.bulletClass}"></${m.bulletElement}>`;
    }
    m.type === "fraction" && (m.renderFraction ? w = m.renderFraction.call(n, m.currentClass, m.totalClass) : w = `<span class="${m.currentClass}"></span> / <span class="${m.totalClass}"></span>`), m.type === "progressbar" && (m.renderProgressbar ? w = m.renderProgressbar.call(n, m.progressbarFillClass) : w = `<span class="${m.progressbarFillClass}"></span>`), n.pagination.bullets = [], y.forEach((b) => {
      m.type !== "custom" && (b.innerHTML = w || ""), m.type === "bullets" && n.pagination.bullets.push(...b.querySelectorAll(Ki(m.bulletClass)));
    }), m.type !== "custom" && r("paginationRender", y[0]);
  }
  function d() {
    n.params.pagination = Uh(n, n.originalParams.pagination, n.params.pagination, {
      el: "swiper-pagination"
    });
    const m = n.params.pagination;
    if (!m.el) return;
    let v;
    typeof m.el == "string" && n.isElement && (v = n.el.shadowRoot.querySelector(m.el)), !v && typeof m.el == "string" && (v = [...document.querySelectorAll(m.el)]), v || (v = m.el), !(!v || v.length === 0) && (n.params.uniqueNavElements && typeof m.el == "string" && Array.isArray(v) && v.length > 1 && (v = [...n.el.querySelectorAll(m.el)], v.length > 1 && (v = v.filter((y) => nc(y, ".swiper")[0] === n.el)[0])), Array.isArray(v) && v.length === 1 && (v = v[0]), Object.assign(n.pagination, {
      el: v
    }), v = a(v), v.forEach((y) => {
      m.type === "bullets" && m.clickable && y.classList.add(m.clickableClass), y.classList.add(m.modifierClass + m.type), y.classList.add(n.isHorizontal() ? m.horizontalClass : m.verticalClass), m.type === "bullets" && m.dynamicBullets && (y.classList.add(`${m.modifierClass}${m.type}-dynamic`), o = 0, m.dynamicMainBullets < 1 && (m.dynamicMainBullets = 1)), m.type === "progressbar" && m.progressbarOpposite && y.classList.add(m.progressbarOppositeClass), m.clickable && y.addEventListener("click", c), n.enabled || y.classList.add(m.lockClass);
    }));
  }
  function _() {
    const m = n.params.pagination;
    if (l()) return;
    let v = n.pagination.el;
    v && (v = a(v), v.forEach((y) => {
      y.classList.remove(m.hiddenClass), y.classList.remove(m.modifierClass + m.type), y.classList.remove(n.isHorizontal() ? m.horizontalClass : m.verticalClass), m.clickable && y.removeEventListener("click", c);
    })), n.pagination.bullets && n.pagination.bullets.forEach((y) => y.classList.remove(...m.bulletActiveClass.split(" ")));
  }
  t("changeDirection", () => {
    if (!n.pagination || !n.pagination.el) return;
    const m = n.params.pagination;
    let {
      el: v
    } = n.pagination;
    v = a(v), v.forEach((y) => {
      y.classList.remove(m.horizontalClass, m.verticalClass), y.classList.add(n.isHorizontal() ? m.horizontalClass : m.verticalClass);
    });
  }), t("init", () => {
    n.params.pagination.enabled === !1 ? g() : (d(), h(), f());
  }), t("activeIndexChange", () => {
    typeof n.snapIndex > "u" && f();
  }), t("snapIndexChange", () => {
    f();
  }), t("snapGridLengthChange", () => {
    h(), f();
  }), t("destroy", () => {
    _();
  }), t("enable disable", () => {
    let {
      el: m
    } = n.pagination;
    m && (m = a(m), m.forEach((v) => v.classList[n.enabled ? "remove" : "add"](n.params.pagination.lockClass)));
  }), t("lock unlock", () => {
    f();
  }), t("click", (m, v) => {
    const y = v.target;
    let {
      el: w
    } = n.pagination;
    if (Array.isArray(w) || (w = [w].filter((b) => !!b)), n.params.pagination.el && n.params.pagination.hideOnClick && w && w.length > 0 && !y.classList.contains(n.params.pagination.bulletClass)) {
      if (n.navigation && (n.navigation.nextEl && y === n.navigation.nextEl || n.navigation.prevEl && y === n.navigation.prevEl)) return;
      const b = w[0].classList.contains(n.params.pagination.hiddenClass);
      r(b === !0 ? "paginationShow" : "paginationHide"), w.forEach((S) => S.classList.toggle(n.params.pagination.hiddenClass));
    }
  });
  const p = () => {
    n.el.classList.remove(n.params.pagination.paginationDisabledClass);
    let {
      el: m
    } = n.pagination;
    m && (m = a(m), m.forEach((v) => v.classList.remove(n.params.pagination.paginationDisabledClass))), d(), h(), f();
  }, g = () => {
    n.el.classList.add(n.params.pagination.paginationDisabledClass);
    let {
      el: m
    } = n.pagination;
    m && (m = a(m), m.forEach((v) => v.classList.add(n.params.pagination.paginationDisabledClass))), _();
  };
  Object.assign(n.pagination, {
    enable: p,
    disable: g,
    render: h,
    update: f,
    init: d,
    destroy: _
  });
}
class Yh {
  constructor(e) {
    this.sliders = document.querySelectorAll(e), this.sliders.forEach((t) => {
      this.initSlider(t);
    });
  }
  initSlider(e) {
    new Nt(e, {
      loop: !0,
      modules: [Wh],
      grabCursor: !0,
      speed: 600,
      pagination: {
        el: e.querySelector(".swiper-pagination"),
        clickable: !0
      }
    });
  }
  destroy() {
    this.sliders.forEach((e) => {
      e.swiper.destroy();
    });
  }
}
ht.registerPlugin(ie);
class Xh {
  constructor(e) {
    this.elements = document.querySelectorAll(e), this.elements.forEach((t) => {
      window.innerWidth >= 1024 && this.parallax(t);
    });
  }
  parallax(e) {
    const t = parseFloat(e.dataset.speed);
    e.tagName === "IMG" && ht.set(e, { scale: 1.15 }), ht.fromTo(
      e,
      {
        y: `-${t * (window.innerHeight / 100)}`
      },
      {
        y: `${t * (window.innerHeight / 100)}`,
        ease: "linear",
        scrollTrigger: {
          trigger: e,
          scrub: !0,
          start: "top bottom",
          end: "bottom top"
        }
      }
    );
  }
}
var as = { exports: {} }, jh = as.exports, hl;
function Kh() {
  return hl || (hl = 1, function(n, e) {
    (function(t, r) {
      n.exports = r();
    })(jh, function() {
      var t = document, r = t.createTextNode.bind(t);
      function i(k, D, F) {
        k.style.setProperty(D, F);
      }
      function s(k, D) {
        return k.appendChild(D);
      }
      function o(k, D, F, G) {
        var $ = t.createElement("span");
        return D && ($.className = D), F && (!G && $.setAttribute("data-" + D, F), $.textContent = F), k && s(k, $) || $;
      }
      function a(k, D) {
        return k.getAttribute("data-" + D);
      }
      function l(k, D) {
        return !k || k.length == 0 ? (
          // null or empty string returns empty array
          []
        ) : k.nodeName ? (
          // a single element is wrapped in an array
          [k]
        ) : (
          // selector and NodeList are converted to Element[]
          [].slice.call(k[0].nodeName ? k : (D || t).querySelectorAll(k))
        );
      }
      function u(k) {
        for (var D = []; k--; )
          D[k] = [];
        return D;
      }
      function c(k, D) {
        k && k.some(D);
      }
      function f(k) {
        return function(D) {
          return k[D];
        };
      }
      function h(k, D, F) {
        var G = "--" + D, $ = G + "-index";
        c(F, function(J, ee) {
          Array.isArray(J) ? c(J, function(de) {
            i(de, $, ee);
          }) : i(J, $, ee);
        }), i(k, G + "-total", F.length);
      }
      var d = {};
      function _(k, D, F) {
        var G = F.indexOf(k);
        if (G == -1) {
          F.unshift(k);
          var $ = d[k];
          if (!$)
            throw new Error("plugin not loaded: " + k);
          c($.depends, function(ee) {
            _(ee, k, F);
          });
        } else {
          var J = F.indexOf(D);
          F.splice(G, 1), F.splice(J, 0, k);
        }
        return F;
      }
      function p(k, D, F, G) {
        return {
          by: k,
          depends: D,
          key: F,
          split: G
        };
      }
      function g(k) {
        return _(k, 0, []).map(f(d));
      }
      function m(k) {
        d[k.by] = k;
      }
      function v(k, D, F, G, $) {
        k.normalize();
        var J = [], ee = document.createDocumentFragment();
        G && J.push(k.previousSibling);
        var de = [];
        return l(k.childNodes).some(function(ue) {
          if (ue.tagName && !ue.hasChildNodes()) {
            de.push(ue);
            return;
          }
          if (ue.childNodes && ue.childNodes.length) {
            de.push(ue), J.push.apply(J, v(ue, D, F, G, $));
            return;
          }
          var Se = ue.wholeText || "", Q = Se.trim();
          if (Q.length) {
            Se[0] === " " && de.push(r(" "));
            var ve = F === "" && typeof Intl.Segmenter == "function";
            c(ve ? Array.from(new Intl.Segmenter().segment(Q)).map(function(Be) {
              return Be.segment;
            }) : Q.split(F), function(Be, st) {
              st && $ && de.push(o(ee, "whitespace", " ", $));
              var M = o(ee, D, Be);
              J.push(M), de.push(M);
            }), Se[Se.length - 1] === " " && de.push(r(" "));
          }
        }), c(de, function(ue) {
          s(ee, ue);
        }), k.innerHTML = "", s(k, ee), J;
      }
      var y = 0;
      function w(k, D) {
        for (var F in D)
          k[F] = D[F];
        return k;
      }
      var b = "words", S = p(
        /* by= */
        b,
        /* depends= */
        y,
        /* key= */
        "word",
        /* split= */
        function(k) {
          return v(k, "word", /\s+/, 0, 1);
        }
      ), T = "chars", O = p(
        /* by= */
        T,
        /* depends= */
        [b],
        /* key= */
        "char",
        /* split= */
        function(k, D, F) {
          var G = [];
          return c(F[b], function($, J) {
            G.push.apply(G, v($, "char", "", D.whitespace && J));
          }), G;
        }
      );
      function E(k) {
        k = k || {};
        var D = k.key;
        return l(k.target || "[data-splitting]").map(function(F) {
          var G = F["🍌"];
          if (!k.force && G)
            return G;
          G = F["🍌"] = { el: F };
          var $ = k.by || a(F, "splitting");
          (!$ || $ == "true") && ($ = T);
          var J = g($), ee = w({}, k);
          return c(J, function(de) {
            if (de.split) {
              var ue = de.by, Se = (D ? "-" + D : "") + de.key, Q = de.split(F, ee, G);
              Se && h(F, Se, Q), G[ue] = Q, F.classList.add(ue);
            }
          }), F.classList.add("splitting"), G;
        });
      }
      function P(k) {
        k = k || {};
        var D = k.target = o();
        return D.innerHTML = k.content, E(k), D.outerHTML;
      }
      E.html = P, E.add = m;
      function R(k, D, F) {
        var G = l(D.matching || k.children, k), $ = {};
        return c(G, function(J) {
          var ee = Math.round(J[F]);
          ($[ee] || ($[ee] = [])).push(J);
        }), Object.keys($).map(Number).sort(C).map(f($));
      }
      function C(k, D) {
        return k - D;
      }
      var L = p(
        /* by= */
        "lines",
        /* depends= */
        [b],
        /* key= */
        "line",
        /* split= */
        function(k, D, F) {
          return R(k, { matching: F[b] }, "offsetTop");
        }
      ), z = p(
        /* by= */
        "items",
        /* depends= */
        y,
        /* key= */
        "item",
        /* split= */
        function(k, D) {
          return l(D.matching || k.children, k);
        }
      ), H = p(
        /* by= */
        "rows",
        /* depends= */
        y,
        /* key= */
        "row",
        /* split= */
        function(k, D) {
          return R(k, D, "offsetTop");
        }
      ), W = p(
        /* by= */
        "cols",
        /* depends= */
        y,
        /* key= */
        "col",
        /* split= */
        function(k, D) {
          return R(k, D, "offsetLeft");
        }
      ), B = p(
        /* by= */
        "grid",
        /* depends= */
        ["rows", "cols"]
      ), U = "layout", ne = p(
        /* by= */
        U,
        /* depends= */
        y,
        /* key= */
        y,
        /* split= */
        function(k, D) {
          var F = D.rows = +(D.rows || a(k, "rows") || 1), G = D.columns = +(D.columns || a(k, "columns") || 1);
          if (D.image = D.image || a(k, "image") || k.currentSrc || k.src, D.image) {
            var $ = l("img", k)[0];
            D.image = $ && ($.currentSrc || $.src);
          }
          D.image && i(k, "background-image", "url(" + D.image + ")");
          for (var J = F * G, ee = [], de = o(y, "cell-grid"); J--; ) {
            var ue = o(de, "cell");
            o(ue, "cell-inner"), ee.push(ue);
          }
          return s(k, de), ee;
        }
      ), x = p(
        /* by= */
        "cellRows",
        /* depends= */
        [U],
        /* key= */
        "row",
        /* split= */
        function(k, D, F) {
          var G = D.rows, $ = u(G);
          return c(F[U], function(J, ee, de) {
            $[Math.floor(ee / (de.length / G))].push(J);
          }), $;
        }
      ), le = p(
        /* by= */
        "cellColumns",
        /* depends= */
        [U],
        /* key= */
        "col",
        /* split= */
        function(k, D, F) {
          var G = D.columns, $ = u(G);
          return c(F[U], function(J, ee) {
            $[ee % G].push(J);
          }), $;
        }
      ), Ee = p(
        /* by= */
        "cells",
        /* depends= */
        ["cellRows", "cellColumns"],
        /* key= */
        "cell",
        /* split= */
        function(k, D, F) {
          return F[U];
        }
      );
      return m(S), m(O), m(L), m(z), m(H), m(W), m(B), m(ne), m(x), m(le), m(Ee), E;
    });
  }(as)), as.exports;
}
var Jh = Kh();
const Qh = /* @__PURE__ */ Dc(Jh);
ht.registerPlugin(ie);
class Zh {
  constructor(e) {
    this.elements = document.querySelectorAll(e), this.elements.forEach((t) => {
      t.hasAttribute("translate") ? this.translate(t) : this.fadeLines(t);
    });
  }
  fadeLines(e) {
    this.splitLines(e).forEach((t, r) => {
      ht.set(t, {
        opacity: 0
      }), ht.to(t, {
        opacity: 1,
        duration: 0.4,
        delay: r * 0.05,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: e,
          start: "top 90%"
        }
      });
    });
  }
  translate(e) {
    this.splitLines(e).forEach((t, r) => {
      const i = [];
      t.forEach((s) => {
        const o = document.createElement("span");
        o.classList.add("inner"), o.innerHTML = s.innerHTML, s.innerHTML = "", s.appendChild(o), i.push(o);
      }), ht.set(i, {
        yPercent: 100
      }), ht.to(i, {
        yPercent: 0,
        duration: 0.75,
        delay: r * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: e,
          start: "top 90%"
        }
      });
    });
  }
  splitLines(e) {
    Qh({ target: e, by: "lines" });
    const t = e.querySelectorAll("span"), r = [];
    return t.forEach((i) => {
      const s = i.style.getPropertyValue("--line-index");
      r[s] || (r[s] = []), r[s].push(i);
    }), r;
  }
}
function lc(n, e) {
  return function() {
    return n.apply(e, arguments);
  };
}
const { toString: ep } = Object.prototype, { getPrototypeOf: va } = Object, Rs = /* @__PURE__ */ ((n) => (e) => {
  const t = ep.call(e);
  return n[t] || (n[t] = t.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null)), jt = (n) => (n = n.toLowerCase(), (e) => Rs(e) === n), ks = (n) => (e) => typeof e === n, { isArray: $i } = Array, Pn = ks("undefined");
function tp(n) {
  return n !== null && !Pn(n) && n.constructor !== null && !Pn(n.constructor) && kt(n.constructor.isBuffer) && n.constructor.isBuffer(n);
}
const uc = jt("ArrayBuffer");
function rp(n) {
  let e;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? e = ArrayBuffer.isView(n) : e = n && n.buffer && uc(n.buffer), e;
}
const ip = ks("string"), kt = ks("function"), cc = ks("number"), Ls = (n) => n !== null && typeof n == "object", np = (n) => n === !0 || n === !1, ls = (n) => {
  if (Rs(n) !== "object")
    return !1;
  const e = va(n);
  return (e === null || e === Object.prototype || Object.getPrototypeOf(e) === null) && !(Symbol.toStringTag in n) && !(Symbol.iterator in n);
}, sp = jt("Date"), op = jt("File"), ap = jt("Blob"), lp = jt("FileList"), up = (n) => Ls(n) && kt(n.pipe), cp = (n) => {
  let e;
  return n && (typeof FormData == "function" && n instanceof FormData || kt(n.append) && ((e = Rs(n)) === "formdata" || // detect form-data instance
  e === "object" && kt(n.toString) && n.toString() === "[object FormData]"));
}, fp = jt("URLSearchParams"), [dp, hp, pp, mp] = ["ReadableStream", "Request", "Response", "Headers"].map(jt), gp = (n) => n.trim ? n.trim() : n.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function Mn(n, e, { allOwnKeys: t = !1 } = {}) {
  if (n === null || typeof n > "u")
    return;
  let r, i;
  if (typeof n != "object" && (n = [n]), $i(n))
    for (r = 0, i = n.length; r < i; r++)
      e.call(null, n[r], r, n);
  else {
    const s = t ? Object.getOwnPropertyNames(n) : Object.keys(n), o = s.length;
    let a;
    for (r = 0; r < o; r++)
      a = s[r], e.call(null, n[a], a, n);
  }
}
function fc(n, e) {
  e = e.toLowerCase();
  const t = Object.keys(n);
  let r = t.length, i;
  for (; r-- > 0; )
    if (i = t[r], e === i.toLowerCase())
      return i;
  return null;
}
const ei = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global, dc = (n) => !Pn(n) && n !== ei;
function $o() {
  const { caseless: n } = dc(this) && this || {}, e = {}, t = (r, i) => {
    const s = n && fc(e, i) || i;
    ls(e[s]) && ls(r) ? e[s] = $o(e[s], r) : ls(r) ? e[s] = $o({}, r) : $i(r) ? e[s] = r.slice() : e[s] = r;
  };
  for (let r = 0, i = arguments.length; r < i; r++)
    arguments[r] && Mn(arguments[r], t);
  return e;
}
const _p = (n, e, t, { allOwnKeys: r } = {}) => (Mn(e, (i, s) => {
  t && kt(i) ? n[s] = lc(i, t) : n[s] = i;
}, { allOwnKeys: r }), n), vp = (n) => (n.charCodeAt(0) === 65279 && (n = n.slice(1)), n), yp = (n, e, t, r) => {
  n.prototype = Object.create(e.prototype, r), n.prototype.constructor = n, Object.defineProperty(n, "super", {
    value: e.prototype
  }), t && Object.assign(n.prototype, t);
}, wp = (n, e, t, r) => {
  let i, s, o;
  const a = {};
  if (e = e || {}, n == null) return e;
  do {
    for (i = Object.getOwnPropertyNames(n), s = i.length; s-- > 0; )
      o = i[s], (!r || r(o, n, e)) && !a[o] && (e[o] = n[o], a[o] = !0);
    n = t !== !1 && va(n);
  } while (n && (!t || t(n, e)) && n !== Object.prototype);
  return e;
}, bp = (n, e, t) => {
  n = String(n), (t === void 0 || t > n.length) && (t = n.length), t -= e.length;
  const r = n.indexOf(e, t);
  return r !== -1 && r === t;
}, Sp = (n) => {
  if (!n) return null;
  if ($i(n)) return n;
  let e = n.length;
  if (!cc(e)) return null;
  const t = new Array(e);
  for (; e-- > 0; )
    t[e] = n[e];
  return t;
}, xp = /* @__PURE__ */ ((n) => (e) => n && e instanceof n)(typeof Uint8Array < "u" && va(Uint8Array)), Tp = (n, e) => {
  const r = (n && n[Symbol.iterator]).call(n);
  let i;
  for (; (i = r.next()) && !i.done; ) {
    const s = i.value;
    e.call(n, s[0], s[1]);
  }
}, Ep = (n, e) => {
  let t;
  const r = [];
  for (; (t = n.exec(e)) !== null; )
    r.push(t);
  return r;
}, Cp = jt("HTMLFormElement"), Pp = (n) => n.toLowerCase().replace(
  /[-_\s]([a-z\d])(\w*)/g,
  function(t, r, i) {
    return r.toUpperCase() + i;
  }
), pl = (({ hasOwnProperty: n }) => (e, t) => n.call(e, t))(Object.prototype), Op = jt("RegExp"), hc = (n, e) => {
  const t = Object.getOwnPropertyDescriptors(n), r = {};
  Mn(t, (i, s) => {
    let o;
    (o = e(i, s, n)) !== !1 && (r[s] = o || i);
  }), Object.defineProperties(n, r);
}, Mp = (n) => {
  hc(n, (e, t) => {
    if (kt(n) && ["arguments", "caller", "callee"].indexOf(t) !== -1)
      return !1;
    const r = n[t];
    if (kt(r)) {
      if (e.enumerable = !1, "writable" in e) {
        e.writable = !1;
        return;
      }
      e.set || (e.set = () => {
        throw Error("Can not rewrite read-only method '" + t + "'");
      });
    }
  });
}, Ap = (n, e) => {
  const t = {}, r = (i) => {
    i.forEach((s) => {
      t[s] = !0;
    });
  };
  return $i(n) ? r(n) : r(String(n).split(e)), t;
}, Rp = () => {
}, kp = (n, e) => n != null && Number.isFinite(n = +n) ? n : e, oo = "abcdefghijklmnopqrstuvwxyz", ml = "0123456789", pc = {
  DIGIT: ml,
  ALPHA: oo,
  ALPHA_DIGIT: oo + oo.toUpperCase() + ml
}, Lp = (n = 16, e = pc.ALPHA_DIGIT) => {
  let t = "";
  const { length: r } = e;
  for (; n--; )
    t += e[Math.random() * r | 0];
  return t;
};
function Dp(n) {
  return !!(n && kt(n.append) && n[Symbol.toStringTag] === "FormData" && n[Symbol.iterator]);
}
const zp = (n) => {
  const e = new Array(10), t = (r, i) => {
    if (Ls(r)) {
      if (e.indexOf(r) >= 0)
        return;
      if (!("toJSON" in r)) {
        e[i] = r;
        const s = $i(r) ? [] : {};
        return Mn(r, (o, a) => {
          const l = t(o, i + 1);
          !Pn(l) && (s[a] = l);
        }), e[i] = void 0, s;
      }
    }
    return r;
  };
  return t(n, 0);
}, Ip = jt("AsyncFunction"), Fp = (n) => n && (Ls(n) || kt(n)) && kt(n.then) && kt(n.catch), mc = ((n, e) => n ? setImmediate : e ? ((t, r) => (ei.addEventListener("message", ({ source: i, data: s }) => {
  i === ei && s === t && r.length && r.shift()();
}, !1), (i) => {
  r.push(i), ei.postMessage(t, "*");
}))(`axios@${Math.random()}`, []) : (t) => setTimeout(t))(
  typeof setImmediate == "function",
  kt(ei.postMessage)
), Np = typeof queueMicrotask < "u" ? queueMicrotask.bind(ei) : typeof process < "u" && process.nextTick || mc, A = {
  isArray: $i,
  isArrayBuffer: uc,
  isBuffer: tp,
  isFormData: cp,
  isArrayBufferView: rp,
  isString: ip,
  isNumber: cc,
  isBoolean: np,
  isObject: Ls,
  isPlainObject: ls,
  isReadableStream: dp,
  isRequest: hp,
  isResponse: pp,
  isHeaders: mp,
  isUndefined: Pn,
  isDate: sp,
  isFile: op,
  isBlob: ap,
  isRegExp: Op,
  isFunction: kt,
  isStream: up,
  isURLSearchParams: fp,
  isTypedArray: xp,
  isFileList: lp,
  forEach: Mn,
  merge: $o,
  extend: _p,
  trim: gp,
  stripBOM: vp,
  inherits: yp,
  toFlatObject: wp,
  kindOf: Rs,
  kindOfTest: jt,
  endsWith: bp,
  toArray: Sp,
  forEachEntry: Tp,
  matchAll: Ep,
  isHTMLForm: Cp,
  hasOwnProperty: pl,
  hasOwnProp: pl,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors: hc,
  freezeMethods: Mp,
  toObjectSet: Ap,
  toCamelCase: Pp,
  noop: Rp,
  toFiniteNumber: kp,
  findKey: fc,
  global: ei,
  isContextDefined: dc,
  ALPHABET: pc,
  generateString: Lp,
  isSpecCompliantForm: Dp,
  toJSONObject: zp,
  isAsyncFn: Ip,
  isThenable: Fp,
  setImmediate: mc,
  asap: Np
};
function K(n, e, t, r, i) {
  Error.call(this), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack, this.message = n, this.name = "AxiosError", e && (this.code = e), t && (this.config = t), r && (this.request = r), i && (this.response = i, this.status = i.status ? i.status : null);
}
A.inherits(K, Error, {
  toJSON: function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: A.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const gc = K.prototype, _c = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((n) => {
  _c[n] = { value: n };
});
Object.defineProperties(K, _c);
Object.defineProperty(gc, "isAxiosError", { value: !0 });
K.from = (n, e, t, r, i, s) => {
  const o = Object.create(gc);
  return A.toFlatObject(n, o, function(l) {
    return l !== Error.prototype;
  }, (a) => a !== "isAxiosError"), K.call(o, n.message, e, t, r, i), o.cause = n, o.name = n.name, s && Object.assign(o, s), o;
};
const Bp = null;
function Ho(n) {
  return A.isPlainObject(n) || A.isArray(n);
}
function vc(n) {
  return A.endsWith(n, "[]") ? n.slice(0, -2) : n;
}
function gl(n, e, t) {
  return n ? n.concat(e).map(function(i, s) {
    return i = vc(i), !t && s ? "[" + i + "]" : i;
  }).join(t ? "." : "") : e;
}
function $p(n) {
  return A.isArray(n) && !n.some(Ho);
}
const Hp = A.toFlatObject(A, {}, null, function(e) {
  return /^is[A-Z]/.test(e);
});
function Ds(n, e, t) {
  if (!A.isObject(n))
    throw new TypeError("target must be an object");
  e = e || new FormData(), t = A.toFlatObject(t, {
    metaTokens: !0,
    dots: !1,
    indexes: !1
  }, !1, function(p, g) {
    return !A.isUndefined(g[p]);
  });
  const r = t.metaTokens, i = t.visitor || c, s = t.dots, o = t.indexes, l = (t.Blob || typeof Blob < "u" && Blob) && A.isSpecCompliantForm(e);
  if (!A.isFunction(i))
    throw new TypeError("visitor must be a function");
  function u(_) {
    if (_ === null) return "";
    if (A.isDate(_))
      return _.toISOString();
    if (!l && A.isBlob(_))
      throw new K("Blob is not supported. Use a Buffer instead.");
    return A.isArrayBuffer(_) || A.isTypedArray(_) ? l && typeof Blob == "function" ? new Blob([_]) : Buffer.from(_) : _;
  }
  function c(_, p, g) {
    let m = _;
    if (_ && !g && typeof _ == "object") {
      if (A.endsWith(p, "{}"))
        p = r ? p : p.slice(0, -2), _ = JSON.stringify(_);
      else if (A.isArray(_) && $p(_) || (A.isFileList(_) || A.endsWith(p, "[]")) && (m = A.toArray(_)))
        return p = vc(p), m.forEach(function(y, w) {
          !(A.isUndefined(y) || y === null) && e.append(
            // eslint-disable-next-line no-nested-ternary
            o === !0 ? gl([p], w, s) : o === null ? p : p + "[]",
            u(y)
          );
        }), !1;
    }
    return Ho(_) ? !0 : (e.append(gl(g, p, s), u(_)), !1);
  }
  const f = [], h = Object.assign(Hp, {
    defaultVisitor: c,
    convertValue: u,
    isVisitable: Ho
  });
  function d(_, p) {
    if (!A.isUndefined(_)) {
      if (f.indexOf(_) !== -1)
        throw Error("Circular reference detected in " + p.join("."));
      f.push(_), A.forEach(_, function(m, v) {
        (!(A.isUndefined(m) || m === null) && i.call(
          e,
          m,
          A.isString(v) ? v.trim() : v,
          p,
          h
        )) === !0 && d(m, p ? p.concat(v) : [v]);
      }), f.pop();
    }
  }
  if (!A.isObject(n))
    throw new TypeError("data must be an object");
  return d(n), e;
}
function _l(n) {
  const e = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(n).replace(/[!'()~]|%20|%00/g, function(r) {
    return e[r];
  });
}
function ya(n, e) {
  this._pairs = [], n && Ds(n, this, e);
}
const yc = ya.prototype;
yc.append = function(e, t) {
  this._pairs.push([e, t]);
};
yc.toString = function(e) {
  const t = e ? function(r) {
    return e.call(this, r, _l);
  } : _l;
  return this._pairs.map(function(i) {
    return t(i[0]) + "=" + t(i[1]);
  }, "").join("&");
};
function Vp(n) {
  return encodeURIComponent(n).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function wc(n, e, t) {
  if (!e)
    return n;
  const r = t && t.encode || Vp;
  A.isFunction(t) && (t = {
    serialize: t
  });
  const i = t && t.serialize;
  let s;
  if (i ? s = i(e, t) : s = A.isURLSearchParams(e) ? e.toString() : new ya(e, t).toString(r), s) {
    const o = n.indexOf("#");
    o !== -1 && (n = n.slice(0, o)), n += (n.indexOf("?") === -1 ? "?" : "&") + s;
  }
  return n;
}
class vl {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(e, t, r) {
    return this.handlers.push({
      fulfilled: e,
      rejected: t,
      synchronous: r ? r.synchronous : !1,
      runWhen: r ? r.runWhen : null
    }), this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(e) {
    this.handlers[e] && (this.handlers[e] = null);
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    this.handlers && (this.handlers = []);
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(e) {
    A.forEach(this.handlers, function(r) {
      r !== null && e(r);
    });
  }
}
const bc = {
  silentJSONParsing: !0,
  forcedJSONParsing: !0,
  clarifyTimeoutError: !1
}, Gp = typeof URLSearchParams < "u" ? URLSearchParams : ya, qp = typeof FormData < "u" ? FormData : null, Up = typeof Blob < "u" ? Blob : null, Wp = {
  isBrowser: !0,
  classes: {
    URLSearchParams: Gp,
    FormData: qp,
    Blob: Up
  },
  protocols: ["http", "https", "file", "blob", "url", "data"]
}, wa = typeof window < "u" && typeof document < "u", Vo = typeof navigator == "object" && navigator || void 0, Yp = wa && (!Vo || ["ReactNative", "NativeScript", "NS"].indexOf(Vo.product) < 0), Xp = typeof WorkerGlobalScope < "u" && // eslint-disable-next-line no-undef
self instanceof WorkerGlobalScope && typeof self.importScripts == "function", jp = wa && window.location.href || "http://localhost", Kp = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  hasBrowserEnv: wa,
  hasStandardBrowserEnv: Yp,
  hasStandardBrowserWebWorkerEnv: Xp,
  navigator: Vo,
  origin: jp
}, Symbol.toStringTag, { value: "Module" })), rt = {
  ...Kp,
  ...Wp
};
function Jp(n, e) {
  return Ds(n, new rt.classes.URLSearchParams(), Object.assign({
    visitor: function(t, r, i, s) {
      return rt.isNode && A.isBuffer(t) ? (this.append(r, t.toString("base64")), !1) : s.defaultVisitor.apply(this, arguments);
    }
  }, e));
}
function Qp(n) {
  return A.matchAll(/\w+|\[(\w*)]/g, n).map((e) => e[0] === "[]" ? "" : e[1] || e[0]);
}
function Zp(n) {
  const e = {}, t = Object.keys(n);
  let r;
  const i = t.length;
  let s;
  for (r = 0; r < i; r++)
    s = t[r], e[s] = n[s];
  return e;
}
function Sc(n) {
  function e(t, r, i, s) {
    let o = t[s++];
    if (o === "__proto__") return !0;
    const a = Number.isFinite(+o), l = s >= t.length;
    return o = !o && A.isArray(i) ? i.length : o, l ? (A.hasOwnProp(i, o) ? i[o] = [i[o], r] : i[o] = r, !a) : ((!i[o] || !A.isObject(i[o])) && (i[o] = []), e(t, r, i[o], s) && A.isArray(i[o]) && (i[o] = Zp(i[o])), !a);
  }
  if (A.isFormData(n) && A.isFunction(n.entries)) {
    const t = {};
    return A.forEachEntry(n, (r, i) => {
      e(Qp(r), i, t, 0);
    }), t;
  }
  return null;
}
function em(n, e, t) {
  if (A.isString(n))
    try {
      return (e || JSON.parse)(n), A.trim(n);
    } catch (r) {
      if (r.name !== "SyntaxError")
        throw r;
    }
  return (0, JSON.stringify)(n);
}
const An = {
  transitional: bc,
  adapter: ["xhr", "http", "fetch"],
  transformRequest: [function(e, t) {
    const r = t.getContentType() || "", i = r.indexOf("application/json") > -1, s = A.isObject(e);
    if (s && A.isHTMLForm(e) && (e = new FormData(e)), A.isFormData(e))
      return i ? JSON.stringify(Sc(e)) : e;
    if (A.isArrayBuffer(e) || A.isBuffer(e) || A.isStream(e) || A.isFile(e) || A.isBlob(e) || A.isReadableStream(e))
      return e;
    if (A.isArrayBufferView(e))
      return e.buffer;
    if (A.isURLSearchParams(e))
      return t.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), e.toString();
    let a;
    if (s) {
      if (r.indexOf("application/x-www-form-urlencoded") > -1)
        return Jp(e, this.formSerializer).toString();
      if ((a = A.isFileList(e)) || r.indexOf("multipart/form-data") > -1) {
        const l = this.env && this.env.FormData;
        return Ds(
          a ? { "files[]": e } : e,
          l && new l(),
          this.formSerializer
        );
      }
    }
    return s || i ? (t.setContentType("application/json", !1), em(e)) : e;
  }],
  transformResponse: [function(e) {
    const t = this.transitional || An.transitional, r = t && t.forcedJSONParsing, i = this.responseType === "json";
    if (A.isResponse(e) || A.isReadableStream(e))
      return e;
    if (e && A.isString(e) && (r && !this.responseType || i)) {
      const o = !(t && t.silentJSONParsing) && i;
      try {
        return JSON.parse(e);
      } catch (a) {
        if (o)
          throw a.name === "SyntaxError" ? K.from(a, K.ERR_BAD_RESPONSE, this, null, this.response) : a;
      }
    }
    return e;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: rt.classes.FormData,
    Blob: rt.classes.Blob
  },
  validateStatus: function(e) {
    return e >= 200 && e < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
A.forEach(["delete", "get", "head", "post", "put", "patch"], (n) => {
  An.headers[n] = {};
});
const tm = A.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]), rm = (n) => {
  const e = {};
  let t, r, i;
  return n && n.split(`
`).forEach(function(o) {
    i = o.indexOf(":"), t = o.substring(0, i).trim().toLowerCase(), r = o.substring(i + 1).trim(), !(!t || e[t] && tm[t]) && (t === "set-cookie" ? e[t] ? e[t].push(r) : e[t] = [r] : e[t] = e[t] ? e[t] + ", " + r : r);
  }), e;
}, yl = Symbol("internals");
function Ji(n) {
  return n && String(n).trim().toLowerCase();
}
function us(n) {
  return n === !1 || n == null ? n : A.isArray(n) ? n.map(us) : String(n);
}
function im(n) {
  const e = /* @__PURE__ */ Object.create(null), t = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; r = t.exec(n); )
    e[r[1]] = r[2];
  return e;
}
const nm = (n) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(n.trim());
function ao(n, e, t, r, i) {
  if (A.isFunction(r))
    return r.call(this, e, t);
  if (i && (e = t), !!A.isString(e)) {
    if (A.isString(r))
      return e.indexOf(r) !== -1;
    if (A.isRegExp(r))
      return r.test(e);
  }
}
function sm(n) {
  return n.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (e, t, r) => t.toUpperCase() + r);
}
function om(n, e) {
  const t = A.toCamelCase(" " + e);
  ["get", "set", "has"].forEach((r) => {
    Object.defineProperty(n, r + t, {
      value: function(i, s, o) {
        return this[r].call(this, e, i, s, o);
      },
      configurable: !0
    });
  });
}
class yt {
  constructor(e) {
    e && this.set(e);
  }
  set(e, t, r) {
    const i = this;
    function s(a, l, u) {
      const c = Ji(l);
      if (!c)
        throw new Error("header name must be a non-empty string");
      const f = A.findKey(i, c);
      (!f || i[f] === void 0 || u === !0 || u === void 0 && i[f] !== !1) && (i[f || l] = us(a));
    }
    const o = (a, l) => A.forEach(a, (u, c) => s(u, c, l));
    if (A.isPlainObject(e) || e instanceof this.constructor)
      o(e, t);
    else if (A.isString(e) && (e = e.trim()) && !nm(e))
      o(rm(e), t);
    else if (A.isHeaders(e))
      for (const [a, l] of e.entries())
        s(l, a, r);
    else
      e != null && s(t, e, r);
    return this;
  }
  get(e, t) {
    if (e = Ji(e), e) {
      const r = A.findKey(this, e);
      if (r) {
        const i = this[r];
        if (!t)
          return i;
        if (t === !0)
          return im(i);
        if (A.isFunction(t))
          return t.call(this, i, r);
        if (A.isRegExp(t))
          return t.exec(i);
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(e, t) {
    if (e = Ji(e), e) {
      const r = A.findKey(this, e);
      return !!(r && this[r] !== void 0 && (!t || ao(this, this[r], r, t)));
    }
    return !1;
  }
  delete(e, t) {
    const r = this;
    let i = !1;
    function s(o) {
      if (o = Ji(o), o) {
        const a = A.findKey(r, o);
        a && (!t || ao(r, r[a], a, t)) && (delete r[a], i = !0);
      }
    }
    return A.isArray(e) ? e.forEach(s) : s(e), i;
  }
  clear(e) {
    const t = Object.keys(this);
    let r = t.length, i = !1;
    for (; r--; ) {
      const s = t[r];
      (!e || ao(this, this[s], s, e, !0)) && (delete this[s], i = !0);
    }
    return i;
  }
  normalize(e) {
    const t = this, r = {};
    return A.forEach(this, (i, s) => {
      const o = A.findKey(r, s);
      if (o) {
        t[o] = us(i), delete t[s];
        return;
      }
      const a = e ? sm(s) : String(s).trim();
      a !== s && delete t[s], t[a] = us(i), r[a] = !0;
    }), this;
  }
  concat(...e) {
    return this.constructor.concat(this, ...e);
  }
  toJSON(e) {
    const t = /* @__PURE__ */ Object.create(null);
    return A.forEach(this, (r, i) => {
      r != null && r !== !1 && (t[i] = e && A.isArray(r) ? r.join(", ") : r);
    }), t;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([e, t]) => e + ": " + t).join(`
`);
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(e) {
    return e instanceof this ? e : new this(e);
  }
  static concat(e, ...t) {
    const r = new this(e);
    return t.forEach((i) => r.set(i)), r;
  }
  static accessor(e) {
    const r = (this[yl] = this[yl] = {
      accessors: {}
    }).accessors, i = this.prototype;
    function s(o) {
      const a = Ji(o);
      r[a] || (om(i, o), r[a] = !0);
    }
    return A.isArray(e) ? e.forEach(s) : s(e), this;
  }
}
yt.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
A.reduceDescriptors(yt.prototype, ({ value: n }, e) => {
  let t = e[0].toUpperCase() + e.slice(1);
  return {
    get: () => n,
    set(r) {
      this[t] = r;
    }
  };
});
A.freezeMethods(yt);
function lo(n, e) {
  const t = this || An, r = e || t, i = yt.from(r.headers);
  let s = r.data;
  return A.forEach(n, function(a) {
    s = a.call(t, s, i.normalize(), e ? e.status : void 0);
  }), i.normalize(), s;
}
function xc(n) {
  return !!(n && n.__CANCEL__);
}
function Hi(n, e, t) {
  K.call(this, n ?? "canceled", K.ERR_CANCELED, e, t), this.name = "CanceledError";
}
A.inherits(Hi, K, {
  __CANCEL__: !0
});
function Tc(n, e, t) {
  const r = t.config.validateStatus;
  !t.status || !r || r(t.status) ? n(t) : e(new K(
    "Request failed with status code " + t.status,
    [K.ERR_BAD_REQUEST, K.ERR_BAD_RESPONSE][Math.floor(t.status / 100) - 4],
    t.config,
    t.request,
    t
  ));
}
function am(n) {
  const e = /^([-+\w]{1,25})(:?\/\/|:)/.exec(n);
  return e && e[1] || "";
}
function lm(n, e) {
  n = n || 10;
  const t = new Array(n), r = new Array(n);
  let i = 0, s = 0, o;
  return e = e !== void 0 ? e : 1e3, function(l) {
    const u = Date.now(), c = r[s];
    o || (o = u), t[i] = l, r[i] = u;
    let f = s, h = 0;
    for (; f !== i; )
      h += t[f++], f = f % n;
    if (i = (i + 1) % n, i === s && (s = (s + 1) % n), u - o < e)
      return;
    const d = c && u - c;
    return d ? Math.round(h * 1e3 / d) : void 0;
  };
}
function um(n, e) {
  let t = 0, r = 1e3 / e, i, s;
  const o = (u, c = Date.now()) => {
    t = c, i = null, s && (clearTimeout(s), s = null), n.apply(null, u);
  };
  return [(...u) => {
    const c = Date.now(), f = c - t;
    f >= r ? o(u, c) : (i = u, s || (s = setTimeout(() => {
      s = null, o(i);
    }, r - f)));
  }, () => i && o(i)];
}
const Es = (n, e, t = 3) => {
  let r = 0;
  const i = lm(50, 250);
  return um((s) => {
    const o = s.loaded, a = s.lengthComputable ? s.total : void 0, l = o - r, u = i(l), c = o <= a;
    r = o;
    const f = {
      loaded: o,
      total: a,
      progress: a ? o / a : void 0,
      bytes: l,
      rate: u || void 0,
      estimated: u && a && c ? (a - o) / u : void 0,
      event: s,
      lengthComputable: a != null,
      [e ? "download" : "upload"]: !0
    };
    n(f);
  }, t);
}, wl = (n, e) => {
  const t = n != null;
  return [(r) => e[0]({
    lengthComputable: t,
    total: n,
    loaded: r
  }), e[1]];
}, bl = (n) => (...e) => A.asap(() => n(...e)), cm = rt.hasStandardBrowserEnv ? /* @__PURE__ */ ((n, e) => (t) => (t = new URL(t, rt.origin), n.protocol === t.protocol && n.host === t.host && (e || n.port === t.port)))(
  new URL(rt.origin),
  rt.navigator && /(msie|trident)/i.test(rt.navigator.userAgent)
) : () => !0, fm = rt.hasStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  {
    write(n, e, t, r, i, s) {
      const o = [n + "=" + encodeURIComponent(e)];
      A.isNumber(t) && o.push("expires=" + new Date(t).toGMTString()), A.isString(r) && o.push("path=" + r), A.isString(i) && o.push("domain=" + i), s === !0 && o.push("secure"), document.cookie = o.join("; ");
    },
    read(n) {
      const e = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
      return e ? decodeURIComponent(e[3]) : null;
    },
    remove(n) {
      this.write(n, "", Date.now() - 864e5);
    }
  }
) : (
  // Non-standard browser env (web workers, react-native) lack needed support.
  {
    write() {
    },
    read() {
      return null;
    },
    remove() {
    }
  }
);
function dm(n) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(n);
}
function hm(n, e) {
  return e ? n.replace(/\/?\/$/, "") + "/" + e.replace(/^\/+/, "") : n;
}
function Ec(n, e) {
  return n && !dm(e) ? hm(n, e) : e;
}
const Sl = (n) => n instanceof yt ? { ...n } : n;
function hi(n, e) {
  e = e || {};
  const t = {};
  function r(u, c, f, h) {
    return A.isPlainObject(u) && A.isPlainObject(c) ? A.merge.call({ caseless: h }, u, c) : A.isPlainObject(c) ? A.merge({}, c) : A.isArray(c) ? c.slice() : c;
  }
  function i(u, c, f, h) {
    if (A.isUndefined(c)) {
      if (!A.isUndefined(u))
        return r(void 0, u, f, h);
    } else return r(u, c, f, h);
  }
  function s(u, c) {
    if (!A.isUndefined(c))
      return r(void 0, c);
  }
  function o(u, c) {
    if (A.isUndefined(c)) {
      if (!A.isUndefined(u))
        return r(void 0, u);
    } else return r(void 0, c);
  }
  function a(u, c, f) {
    if (f in e)
      return r(u, c);
    if (f in n)
      return r(void 0, u);
  }
  const l = {
    url: s,
    method: s,
    data: s,
    baseURL: o,
    transformRequest: o,
    transformResponse: o,
    paramsSerializer: o,
    timeout: o,
    timeoutMessage: o,
    withCredentials: o,
    withXSRFToken: o,
    adapter: o,
    responseType: o,
    xsrfCookieName: o,
    xsrfHeaderName: o,
    onUploadProgress: o,
    onDownloadProgress: o,
    decompress: o,
    maxContentLength: o,
    maxBodyLength: o,
    beforeRedirect: o,
    transport: o,
    httpAgent: o,
    httpsAgent: o,
    cancelToken: o,
    socketPath: o,
    responseEncoding: o,
    validateStatus: a,
    headers: (u, c, f) => i(Sl(u), Sl(c), f, !0)
  };
  return A.forEach(Object.keys(Object.assign({}, n, e)), function(c) {
    const f = l[c] || i, h = f(n[c], e[c], c);
    A.isUndefined(h) && f !== a || (t[c] = h);
  }), t;
}
const Cc = (n) => {
  const e = hi({}, n);
  let { data: t, withXSRFToken: r, xsrfHeaderName: i, xsrfCookieName: s, headers: o, auth: a } = e;
  e.headers = o = yt.from(o), e.url = wc(Ec(e.baseURL, e.url), n.params, n.paramsSerializer), a && o.set(
    "Authorization",
    "Basic " + btoa((a.username || "") + ":" + (a.password ? unescape(encodeURIComponent(a.password)) : ""))
  );
  let l;
  if (A.isFormData(t)) {
    if (rt.hasStandardBrowserEnv || rt.hasStandardBrowserWebWorkerEnv)
      o.setContentType(void 0);
    else if ((l = o.getContentType()) !== !1) {
      const [u, ...c] = l ? l.split(";").map((f) => f.trim()).filter(Boolean) : [];
      o.setContentType([u || "multipart/form-data", ...c].join("; "));
    }
  }
  if (rt.hasStandardBrowserEnv && (r && A.isFunction(r) && (r = r(e)), r || r !== !1 && cm(e.url))) {
    const u = i && s && fm.read(s);
    u && o.set(i, u);
  }
  return e;
}, pm = typeof XMLHttpRequest < "u", mm = pm && function(n) {
  return new Promise(function(t, r) {
    const i = Cc(n);
    let s = i.data;
    const o = yt.from(i.headers).normalize();
    let { responseType: a, onUploadProgress: l, onDownloadProgress: u } = i, c, f, h, d, _;
    function p() {
      d && d(), _ && _(), i.cancelToken && i.cancelToken.unsubscribe(c), i.signal && i.signal.removeEventListener("abort", c);
    }
    let g = new XMLHttpRequest();
    g.open(i.method.toUpperCase(), i.url, !0), g.timeout = i.timeout;
    function m() {
      if (!g)
        return;
      const y = yt.from(
        "getAllResponseHeaders" in g && g.getAllResponseHeaders()
      ), b = {
        data: !a || a === "text" || a === "json" ? g.responseText : g.response,
        status: g.status,
        statusText: g.statusText,
        headers: y,
        config: n,
        request: g
      };
      Tc(function(T) {
        t(T), p();
      }, function(T) {
        r(T), p();
      }, b), g = null;
    }
    "onloadend" in g ? g.onloadend = m : g.onreadystatechange = function() {
      !g || g.readyState !== 4 || g.status === 0 && !(g.responseURL && g.responseURL.indexOf("file:") === 0) || setTimeout(m);
    }, g.onabort = function() {
      g && (r(new K("Request aborted", K.ECONNABORTED, n, g)), g = null);
    }, g.onerror = function() {
      r(new K("Network Error", K.ERR_NETWORK, n, g)), g = null;
    }, g.ontimeout = function() {
      let w = i.timeout ? "timeout of " + i.timeout + "ms exceeded" : "timeout exceeded";
      const b = i.transitional || bc;
      i.timeoutErrorMessage && (w = i.timeoutErrorMessage), r(new K(
        w,
        b.clarifyTimeoutError ? K.ETIMEDOUT : K.ECONNABORTED,
        n,
        g
      )), g = null;
    }, s === void 0 && o.setContentType(null), "setRequestHeader" in g && A.forEach(o.toJSON(), function(w, b) {
      g.setRequestHeader(b, w);
    }), A.isUndefined(i.withCredentials) || (g.withCredentials = !!i.withCredentials), a && a !== "json" && (g.responseType = i.responseType), u && ([h, _] = Es(u, !0), g.addEventListener("progress", h)), l && g.upload && ([f, d] = Es(l), g.upload.addEventListener("progress", f), g.upload.addEventListener("loadend", d)), (i.cancelToken || i.signal) && (c = (y) => {
      g && (r(!y || y.type ? new Hi(null, n, g) : y), g.abort(), g = null);
    }, i.cancelToken && i.cancelToken.subscribe(c), i.signal && (i.signal.aborted ? c() : i.signal.addEventListener("abort", c)));
    const v = am(i.url);
    if (v && rt.protocols.indexOf(v) === -1) {
      r(new K("Unsupported protocol " + v + ":", K.ERR_BAD_REQUEST, n));
      return;
    }
    g.send(s || null);
  });
}, gm = (n, e) => {
  const { length: t } = n = n ? n.filter(Boolean) : [];
  if (e || t) {
    let r = new AbortController(), i;
    const s = function(u) {
      if (!i) {
        i = !0, a();
        const c = u instanceof Error ? u : this.reason;
        r.abort(c instanceof K ? c : new Hi(c instanceof Error ? c.message : c));
      }
    };
    let o = e && setTimeout(() => {
      o = null, s(new K(`timeout ${e} of ms exceeded`, K.ETIMEDOUT));
    }, e);
    const a = () => {
      n && (o && clearTimeout(o), o = null, n.forEach((u) => {
        u.unsubscribe ? u.unsubscribe(s) : u.removeEventListener("abort", s);
      }), n = null);
    };
    n.forEach((u) => u.addEventListener("abort", s));
    const { signal: l } = r;
    return l.unsubscribe = () => A.asap(a), l;
  }
}, _m = function* (n, e) {
  let t = n.byteLength;
  if (t < e) {
    yield n;
    return;
  }
  let r = 0, i;
  for (; r < t; )
    i = r + e, yield n.slice(r, i), r = i;
}, vm = async function* (n, e) {
  for await (const t of ym(n))
    yield* _m(t, e);
}, ym = async function* (n) {
  if (n[Symbol.asyncIterator]) {
    yield* n;
    return;
  }
  const e = n.getReader();
  try {
    for (; ; ) {
      const { done: t, value: r } = await e.read();
      if (t)
        break;
      yield r;
    }
  } finally {
    await e.cancel();
  }
}, xl = (n, e, t, r) => {
  const i = vm(n, e);
  let s = 0, o, a = (l) => {
    o || (o = !0, r && r(l));
  };
  return new ReadableStream({
    async pull(l) {
      try {
        const { done: u, value: c } = await i.next();
        if (u) {
          a(), l.close();
          return;
        }
        let f = c.byteLength;
        if (t) {
          let h = s += f;
          t(h);
        }
        l.enqueue(new Uint8Array(c));
      } catch (u) {
        throw a(u), u;
      }
    },
    cancel(l) {
      return a(l), i.return();
    }
  }, {
    highWaterMark: 2
  });
}, zs = typeof fetch == "function" && typeof Request == "function" && typeof Response == "function", Pc = zs && typeof ReadableStream == "function", wm = zs && (typeof TextEncoder == "function" ? /* @__PURE__ */ ((n) => (e) => n.encode(e))(new TextEncoder()) : async (n) => new Uint8Array(await new Response(n).arrayBuffer())), Oc = (n, ...e) => {
  try {
    return !!n(...e);
  } catch {
    return !1;
  }
}, bm = Pc && Oc(() => {
  let n = !1;
  const e = new Request(rt.origin, {
    body: new ReadableStream(),
    method: "POST",
    get duplex() {
      return n = !0, "half";
    }
  }).headers.has("Content-Type");
  return n && !e;
}), Tl = 64 * 1024, Go = Pc && Oc(() => A.isReadableStream(new Response("").body)), Cs = {
  stream: Go && ((n) => n.body)
};
zs && ((n) => {
  ["text", "arrayBuffer", "blob", "formData", "stream"].forEach((e) => {
    !Cs[e] && (Cs[e] = A.isFunction(n[e]) ? (t) => t[e]() : (t, r) => {
      throw new K(`Response type '${e}' is not supported`, K.ERR_NOT_SUPPORT, r);
    });
  });
})(new Response());
const Sm = async (n) => {
  if (n == null)
    return 0;
  if (A.isBlob(n))
    return n.size;
  if (A.isSpecCompliantForm(n))
    return (await new Request(rt.origin, {
      method: "POST",
      body: n
    }).arrayBuffer()).byteLength;
  if (A.isArrayBufferView(n) || A.isArrayBuffer(n))
    return n.byteLength;
  if (A.isURLSearchParams(n) && (n = n + ""), A.isString(n))
    return (await wm(n)).byteLength;
}, xm = async (n, e) => {
  const t = A.toFiniteNumber(n.getContentLength());
  return t ?? Sm(e);
}, Tm = zs && (async (n) => {
  let {
    url: e,
    method: t,
    data: r,
    signal: i,
    cancelToken: s,
    timeout: o,
    onDownloadProgress: a,
    onUploadProgress: l,
    responseType: u,
    headers: c,
    withCredentials: f = "same-origin",
    fetchOptions: h
  } = Cc(n);
  u = u ? (u + "").toLowerCase() : "text";
  let d = gm([i, s && s.toAbortSignal()], o), _;
  const p = d && d.unsubscribe && (() => {
    d.unsubscribe();
  });
  let g;
  try {
    if (l && bm && t !== "get" && t !== "head" && (g = await xm(c, r)) !== 0) {
      let b = new Request(e, {
        method: "POST",
        body: r,
        duplex: "half"
      }), S;
      if (A.isFormData(r) && (S = b.headers.get("content-type")) && c.setContentType(S), b.body) {
        const [T, O] = wl(
          g,
          Es(bl(l))
        );
        r = xl(b.body, Tl, T, O);
      }
    }
    A.isString(f) || (f = f ? "include" : "omit");
    const m = "credentials" in Request.prototype;
    _ = new Request(e, {
      ...h,
      signal: d,
      method: t.toUpperCase(),
      headers: c.normalize().toJSON(),
      body: r,
      duplex: "half",
      credentials: m ? f : void 0
    });
    let v = await fetch(_);
    const y = Go && (u === "stream" || u === "response");
    if (Go && (a || y && p)) {
      const b = {};
      ["status", "statusText", "headers"].forEach((E) => {
        b[E] = v[E];
      });
      const S = A.toFiniteNumber(v.headers.get("content-length")), [T, O] = a && wl(
        S,
        Es(bl(a), !0)
      ) || [];
      v = new Response(
        xl(v.body, Tl, T, () => {
          O && O(), p && p();
        }),
        b
      );
    }
    u = u || "text";
    let w = await Cs[A.findKey(Cs, u) || "text"](v, n);
    return !y && p && p(), await new Promise((b, S) => {
      Tc(b, S, {
        data: w,
        headers: yt.from(v.headers),
        status: v.status,
        statusText: v.statusText,
        config: n,
        request: _
      });
    });
  } catch (m) {
    throw p && p(), m && m.name === "TypeError" && /fetch/i.test(m.message) ? Object.assign(
      new K("Network Error", K.ERR_NETWORK, n, _),
      {
        cause: m.cause || m
      }
    ) : K.from(m, m && m.code, n, _);
  }
}), qo = {
  http: Bp,
  xhr: mm,
  fetch: Tm
};
A.forEach(qo, (n, e) => {
  if (n) {
    try {
      Object.defineProperty(n, "name", { value: e });
    } catch {
    }
    Object.defineProperty(n, "adapterName", { value: e });
  }
});
const El = (n) => `- ${n}`, Em = (n) => A.isFunction(n) || n === null || n === !1, Mc = {
  getAdapter: (n) => {
    n = A.isArray(n) ? n : [n];
    const { length: e } = n;
    let t, r;
    const i = {};
    for (let s = 0; s < e; s++) {
      t = n[s];
      let o;
      if (r = t, !Em(t) && (r = qo[(o = String(t)).toLowerCase()], r === void 0))
        throw new K(`Unknown adapter '${o}'`);
      if (r)
        break;
      i[o || "#" + s] = r;
    }
    if (!r) {
      const s = Object.entries(i).map(
        ([a, l]) => `adapter ${a} ` + (l === !1 ? "is not supported by the environment" : "is not available in the build")
      );
      let o = e ? s.length > 1 ? `since :
` + s.map(El).join(`
`) : " " + El(s[0]) : "as no adapter specified";
      throw new K(
        "There is no suitable adapter to dispatch the request " + o,
        "ERR_NOT_SUPPORT"
      );
    }
    return r;
  },
  adapters: qo
};
function uo(n) {
  if (n.cancelToken && n.cancelToken.throwIfRequested(), n.signal && n.signal.aborted)
    throw new Hi(null, n);
}
function Cl(n) {
  return uo(n), n.headers = yt.from(n.headers), n.data = lo.call(
    n,
    n.transformRequest
  ), ["post", "put", "patch"].indexOf(n.method) !== -1 && n.headers.setContentType("application/x-www-form-urlencoded", !1), Mc.getAdapter(n.adapter || An.adapter)(n).then(function(r) {
    return uo(n), r.data = lo.call(
      n,
      n.transformResponse,
      r
    ), r.headers = yt.from(r.headers), r;
  }, function(r) {
    return xc(r) || (uo(n), r && r.response && (r.response.data = lo.call(
      n,
      n.transformResponse,
      r.response
    ), r.response.headers = yt.from(r.response.headers))), Promise.reject(r);
  });
}
const Ac = "1.7.9", Is = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((n, e) => {
  Is[n] = function(r) {
    return typeof r === n || "a" + (e < 1 ? "n " : " ") + n;
  };
});
const Pl = {};
Is.transitional = function(e, t, r) {
  function i(s, o) {
    return "[Axios v" + Ac + "] Transitional option '" + s + "'" + o + (r ? ". " + r : "");
  }
  return (s, o, a) => {
    if (e === !1)
      throw new K(
        i(o, " has been removed" + (t ? " in " + t : "")),
        K.ERR_DEPRECATED
      );
    return t && !Pl[o] && (Pl[o] = !0, console.warn(
      i(
        o,
        " has been deprecated since v" + t + " and will be removed in the near future"
      )
    )), e ? e(s, o, a) : !0;
  };
};
Is.spelling = function(e) {
  return (t, r) => (console.warn(`${r} is likely a misspelling of ${e}`), !0);
};
function Cm(n, e, t) {
  if (typeof n != "object")
    throw new K("options must be an object", K.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(n);
  let i = r.length;
  for (; i-- > 0; ) {
    const s = r[i], o = e[s];
    if (o) {
      const a = n[s], l = a === void 0 || o(a, s, n);
      if (l !== !0)
        throw new K("option " + s + " must be " + l, K.ERR_BAD_OPTION_VALUE);
      continue;
    }
    if (t !== !0)
      throw new K("Unknown option " + s, K.ERR_BAD_OPTION);
  }
}
const cs = {
  assertOptions: Cm,
  validators: Is
}, Zt = cs.validators;
class li {
  constructor(e) {
    this.defaults = e, this.interceptors = {
      request: new vl(),
      response: new vl()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(e, t) {
    try {
      return await this._request(e, t);
    } catch (r) {
      if (r instanceof Error) {
        let i = {};
        Error.captureStackTrace ? Error.captureStackTrace(i) : i = new Error();
        const s = i.stack ? i.stack.replace(/^.+\n/, "") : "";
        try {
          r.stack ? s && !String(r.stack).endsWith(s.replace(/^.+\n.+\n/, "")) && (r.stack += `
` + s) : r.stack = s;
        } catch {
        }
      }
      throw r;
    }
  }
  _request(e, t) {
    typeof e == "string" ? (t = t || {}, t.url = e) : t = e || {}, t = hi(this.defaults, t);
    const { transitional: r, paramsSerializer: i, headers: s } = t;
    r !== void 0 && cs.assertOptions(r, {
      silentJSONParsing: Zt.transitional(Zt.boolean),
      forcedJSONParsing: Zt.transitional(Zt.boolean),
      clarifyTimeoutError: Zt.transitional(Zt.boolean)
    }, !1), i != null && (A.isFunction(i) ? t.paramsSerializer = {
      serialize: i
    } : cs.assertOptions(i, {
      encode: Zt.function,
      serialize: Zt.function
    }, !0)), cs.assertOptions(t, {
      baseUrl: Zt.spelling("baseURL"),
      withXsrfToken: Zt.spelling("withXSRFToken")
    }, !0), t.method = (t.method || this.defaults.method || "get").toLowerCase();
    let o = s && A.merge(
      s.common,
      s[t.method]
    );
    s && A.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (_) => {
        delete s[_];
      }
    ), t.headers = yt.concat(o, s);
    const a = [];
    let l = !0;
    this.interceptors.request.forEach(function(p) {
      typeof p.runWhen == "function" && p.runWhen(t) === !1 || (l = l && p.synchronous, a.unshift(p.fulfilled, p.rejected));
    });
    const u = [];
    this.interceptors.response.forEach(function(p) {
      u.push(p.fulfilled, p.rejected);
    });
    let c, f = 0, h;
    if (!l) {
      const _ = [Cl.bind(this), void 0];
      for (_.unshift.apply(_, a), _.push.apply(_, u), h = _.length, c = Promise.resolve(t); f < h; )
        c = c.then(_[f++], _[f++]);
      return c;
    }
    h = a.length;
    let d = t;
    for (f = 0; f < h; ) {
      const _ = a[f++], p = a[f++];
      try {
        d = _(d);
      } catch (g) {
        p.call(this, g);
        break;
      }
    }
    try {
      c = Cl.call(this, d);
    } catch (_) {
      return Promise.reject(_);
    }
    for (f = 0, h = u.length; f < h; )
      c = c.then(u[f++], u[f++]);
    return c;
  }
  getUri(e) {
    e = hi(this.defaults, e);
    const t = Ec(e.baseURL, e.url);
    return wc(t, e.params, e.paramsSerializer);
  }
}
A.forEach(["delete", "get", "head", "options"], function(e) {
  li.prototype[e] = function(t, r) {
    return this.request(hi(r || {}, {
      method: e,
      url: t,
      data: (r || {}).data
    }));
  };
});
A.forEach(["post", "put", "patch"], function(e) {
  function t(r) {
    return function(s, o, a) {
      return this.request(hi(a || {}, {
        method: e,
        headers: r ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url: s,
        data: o
      }));
    };
  }
  li.prototype[e] = t(), li.prototype[e + "Form"] = t(!0);
});
class ba {
  constructor(e) {
    if (typeof e != "function")
      throw new TypeError("executor must be a function.");
    let t;
    this.promise = new Promise(function(s) {
      t = s;
    });
    const r = this;
    this.promise.then((i) => {
      if (!r._listeners) return;
      let s = r._listeners.length;
      for (; s-- > 0; )
        r._listeners[s](i);
      r._listeners = null;
    }), this.promise.then = (i) => {
      let s;
      const o = new Promise((a) => {
        r.subscribe(a), s = a;
      }).then(i);
      return o.cancel = function() {
        r.unsubscribe(s);
      }, o;
    }, e(function(s, o, a) {
      r.reason || (r.reason = new Hi(s, o, a), t(r.reason));
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason)
      throw this.reason;
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(e) {
    if (this.reason) {
      e(this.reason);
      return;
    }
    this._listeners ? this._listeners.push(e) : this._listeners = [e];
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(e) {
    if (!this._listeners)
      return;
    const t = this._listeners.indexOf(e);
    t !== -1 && this._listeners.splice(t, 1);
  }
  toAbortSignal() {
    const e = new AbortController(), t = (r) => {
      e.abort(r);
    };
    return this.subscribe(t), e.signal.unsubscribe = () => this.unsubscribe(t), e.signal;
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let e;
    return {
      token: new ba(function(i) {
        e = i;
      }),
      cancel: e
    };
  }
}
function Pm(n) {
  return function(t) {
    return n.apply(null, t);
  };
}
function Om(n) {
  return A.isObject(n) && n.isAxiosError === !0;
}
const Uo = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(Uo).forEach(([n, e]) => {
  Uo[e] = n;
});
function Rc(n) {
  const e = new li(n), t = lc(li.prototype.request, e);
  return A.extend(t, li.prototype, e, { allOwnKeys: !0 }), A.extend(t, e, null, { allOwnKeys: !0 }), t.create = function(i) {
    return Rc(hi(n, i));
  }, t;
}
const ze = Rc(An);
ze.Axios = li;
ze.CanceledError = Hi;
ze.CancelToken = ba;
ze.isCancel = xc;
ze.VERSION = Ac;
ze.toFormData = Ds;
ze.AxiosError = K;
ze.Cancel = ze.CanceledError;
ze.all = function(e) {
  return Promise.all(e);
};
ze.spread = Pm;
ze.isAxiosError = Om;
ze.mergeConfig = hi;
ze.AxiosHeaders = yt;
ze.formToJSON = (n) => Sc(A.isHTMLForm(n) ? new FormData(n) : n);
ze.getAdapter = Mc.getAdapter;
ze.HttpStatusCode = Uo;
ze.default = ze;
const Mm = () => {
  const n = document.querySelector("#contact-form");
  n && n.addEventListener("submit", (i) => {
    i.preventDefault(), e();
    const s = new FormData(n);
    ze.post(
      "/wp-admin/admin-ajax.php?action=get_contact_form",
      s
    ).then((o) => {
      t(o.data);
    }).catch((o) => {
      console.error(o);
    });
  });
  const e = () => {
    if (n.querySelector(".loading-message")) {
      const i = n.querySelector(".loading-message");
      i.textContent = "Envoi en cours...", i.classList.remove("error");
    } else {
      const i = document.createElement("p");
      i.classList.add("loading-message"), i.textContent = "Envoi en cours...", n.appendChild(i);
    }
  }, t = (i) => {
    if (i.success === !1) {
      if (i.data === "bot") {
        n.remove();
        return;
      }
      r(i.data);
      return;
    }
    n.reset();
    const s = n.querySelector(".loading-message");
    s.textContent = i, s.classList.add("success"), s.classList.remove("error"), n.querySelector(
      'button[type="submit"]'
    ).remove();
  }, r = (i) => {
    const s = n.querySelector(".loading-message");
    s.textContent = i, s.classList.add("error");
  };
};
let co;
const Ol = () => {
  Sd(Am);
}, Am = () => {
  window.scrollTo(0, 0), co = new Hc({ duration: 1.2 }), new Ed(co), new Cd(".btn-primary"), new Yh(".slider"), new Xh(".parallax"), new Zh(".text-reveal"), new Td();
  function n(e) {
    co.raf(e), requestAnimationFrame(n);
  }
  requestAnimationFrame(n), document.querySelector("#main-container .page-contact") && Mm();
};
document.readyState === "complete" ? Ol() : document.addEventListener("DOMContentLoaded", () => {
  Ol();
});
