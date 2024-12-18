// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"6fQGg":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "40af12ebbf1e63c0";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    if (HMR_USE_SSE) ws = new EventSource("/__parcel_hmr");
    else try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    if (ws instanceof WebSocket) {
        ws.onerror = function(e) {
            if (e.message) console.error(e.message);
        };
        ws.onclose = function() {
            console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
        };
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"CnCET":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
var _appJs = require("./app.js");
var _appJsDefault = parcelHelpers.interopDefault(_appJs);
const DEFAULT_WS_URL = "https://localhost:2345";
window.addEventListener("DOMContentLoaded", async ()=>{
    (0, _appJsDefault.default)(getWsUrl());
});
function getWsUrl() {
    const url = new URL(document.location.href);
    return url?.searchParams?.get("ws-url") ?? DEFAULT_WS_URL;
}

},{"./app.js":"6wtUX","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"6wtUX":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "default", ()=>makeApp);
var _libraryWsJs = require("./library-ws.js");
var _utilsJs = require("./utils.js");
function makeApp(wsUrl) {
    return new App(wsUrl);
}
class App {
    wsUrl;
    ws;
    result;
    errors;
    constructor(wsUrl){
        this.wsUrl = wsUrl;
        this.ws = (0, _libraryWsJs.makeLibraryWs)(wsUrl);
        this.result = document.querySelector("#result");
        this.errors = document.querySelector("#errors");
        //TODO: add search handler
        const searchWidget = document.querySelector("#search");
        if (searchWidget) searchWidget.addEventListener("blur", async ()=>{
            const query = searchWidget.value.trim();
            if (query) {
                const searchUrl = (0, _utilsJs.makeQueryUrl)(`${this.wsUrl}/api/books`, {
                    search: query
                });
                console.log(`Search URL: ${searchUrl}`);
                await this.searchBooks(searchUrl);
            }
        });
    }
    clearErrors() {
        this.errors.innerHTML = "";
    }
    async searchBooks(url) {
        this.clearErrors();
        this.result.innerHTML = "";
        try {
            const result = await this.ws.findBooksByUrl(url);
            if (result.isOk) {
                const books = result.val.result;
                if (books.length === 0) {
                    this.result.textContent = "No books found.";
                    return;
                }
                // Create scroll controls if `prev` or `next` links exist
                const scrollSectionLeft = this.createScrollSection(result.val.links);
                const scrollSectionRight = this.createScrollSection(result.val.links);
                const resultSection = (0, _utilsJs.makeElement)("ul", {
                    id: "search-results"
                });
                for (const book of books){
                    const li = (0, _utilsJs.makeElement)("li", {}, (0, _utilsJs.makeElement)("span", {
                        class: "content"
                    }, book.result.title), (0, _utilsJs.makeElement)("a", {
                        class: "details"
                    }, "details..."));
                    // Attach click handler to 'details...' link
                    li.querySelector(".details")?.addEventListener("click", (e)=>{
                        e.preventDefault();
                        this.showBookDetails(result.val.links.self.href);
                    });
                    resultSection.append(li);
                }
                this.result.append(scrollSectionLeft, resultSection, scrollSectionRight);
            } else displayErrors(result.errors);
        } catch (err) {
            console.error("Unexpected error:", err);
            this.errors.append((0, _utilsJs.makeElement)("li", {
                class: "error"
            }, `Error: ${err}`));
        }
    }
    createScrollSection(links) {
        const scrollDiv = (0, _utilsJs.makeElement)("div", {
            class: "scroll"
        });
        if (links.prev) {
            const prevLink = (0, _utilsJs.makeElement)("a", links.prev, "<<");
            prevLink.addEventListener("click", (e)=>{
                e.preventDefault();
                this.loadPage(links.prev.href);
            });
            scrollDiv.append(prevLink);
        }
        if (links.next) {
            const nextLink = (0, _utilsJs.makeElement)("a", links.next, ">>");
            nextLink.addEventListener("click", (e)=>{
                e.preventDefault();
                this.loadPage(links.next.href);
            });
            scrollDiv.append(nextLink);
        }
        return scrollDiv;
    }
    async loadPage(url) {
        this.clearErrors();
        try {
            const result = await this.ws.findBooksByUrl(url);
            if (result.isOk) {
                this.result.innerHTML = "";
                this.searchBooks(result.val.links.self.href); // Reload the current page
            } else displayErrors(result.errors);
        } catch (err) {
            console.error("Unexpected error:", err);
            this.errors.append((0, _utilsJs.makeElement)("li", {
                class: "error"
            }, `Error: ${err}`));
        }
    }
    async showBookDetails(url) {
        this.clearErrors();
        try {
            const result = await this.ws.getBookByUrl(url);
            if (result.isOk) {
                const book = result.val.result;
                const details = (0, _utilsJs.makeElement)("dl", {
                    class: "book-details"
                }, (0, _utilsJs.makeElement)("dt", {}, "ISBN"), (0, _utilsJs.makeElement)("dd", {}, book.isbn), (0, _utilsJs.makeElement)("dt", {}, "Title"), (0, _utilsJs.makeElement)("dd", {}, book.title), (0, _utilsJs.makeElement)("dt", {}, "Authors"), (0, _utilsJs.makeElement)("dd", {}, book.authors.join("; ")), (0, _utilsJs.makeElement)("dt", {}, "Number of Pages"), (0, _utilsJs.makeElement)("dd", {}, book.pages.toString()), (0, _utilsJs.makeElement)("dt", {}, "Publisher"), (0, _utilsJs.makeElement)("dd", {}, book.publisher), (0, _utilsJs.makeElement)("dt", {}, "Number of Copies"), (0, _utilsJs.makeElement)("dd", {}, book.nCopies.toString()), (0, _utilsJs.makeElement)("dt", {}, "Borrowers"), (0, _utilsJs.makeElement)("dd", {
                    id: "borrowers"
                }));
                this.result.innerHTML = "";
                this.result.append(details);
                this.addCheckoutForm(book.isbn);
            } else displayErrors(result.errors);
        } catch (err) {
            console.error("Unexpected error:", err);
            this.errors.append((0, _utilsJs.makeElement)("li", {
                class: "error"
            }, `Error: ${err}`));
        }
    }
    addCheckoutForm(isbn) {
        this.clearErrors();
        const form = (0, _utilsJs.makeElement)("form", {
            class: "grid-form"
        }, (0, _utilsJs.makeElement)("label", {
            for: "patronId"
        }, "Patron ID"), (0, _utilsJs.makeElement)("span", {}, (0, _utilsJs.makeElement)("input", {
            id: "patronId",
            type: "text"
        }), (0, _utilsJs.makeElement)("span", {
            class: "error",
            id: "patronId-error"
        })), (0, _utilsJs.makeElement)("button", {
            type: "submit"
        }, "Checkout Book"));
        form.addEventListener("submit", async (event)=>{
            event.preventDefault();
            const patronIdInput = form.querySelector("#patronId");
            const patronId = patronIdInput?.value.trim();
            if (!patronId) {
                displayErrors([
                    {
                        message: "Patron ID is required.",
                        options: {
                            code: "REQUIRED_FIELD",
                            widget: "patronId"
                        }
                    }
                ]);
                return;
            }
            const lend = {
                isbn,
                patronId
            };
            const result = await this.ws.checkoutBook(lend);
            if (result.isOk) {
                console.log(`Book with ISBN ${isbn} successfully checked out to Patron ${patronId}`);
                await this.updateBorrowers(isbn); // Refresh the borrowers list
            } else displayErrors(result.errors);
        });
        this.result.append(form);
    }
    async updateBorrowers(isbn) {
        this.clearErrors();
        const borrowersSection = document.querySelector("#borrowers");
        if (!borrowersSection) return;
        const result = await this.ws.getLends(isbn);
        if (result.isOk) {
            const lends = result.val;
            if (lends.length === 0) {
                borrowersSection.innerHTML = "None";
                return;
            }
            const list = (0, _utilsJs.makeElement)("ul");
            for (const lend of lends){
                const listItem = (0, _utilsJs.makeElement)("li", {}, (0, _utilsJs.makeElement)("span", {
                    class: "content"
                }, lend.patronId), (0, _utilsJs.makeElement)("button", {
                    class: "return-book"
                }, "Return Book"));
                const returnButton = listItem.querySelector("return-book");
                if (returnButton) returnButton.addEventListener("click", async ()=>{
                    try {
                        await this.ws.returnBook(lend); // Call the returnBook function
                        alert(`Book with ISBN ${isbn} returned successfully by patron ${lend.patronId}`);
                        await this.updateBorrowers(isbn); // Refresh the borrowers list
                    } catch (err) {
                        console.error("Error returning book:", err);
                        this.errors.append((0, _utilsJs.makeElement)("li", {
                            class: "error"
                        }, `Error: ${err}`));
                    }
                });
                list.append(listItem);
            }
            borrowersSection.innerHTML = "";
            borrowersSection.append(list);
        } else displayErrors(result.errors);
    }
} //class App
/** Display errors. If an error has a widget or path widgetId such
 *  that an element having ID `${widgetId}-error` exists,
 *  then the error message is added to that element; otherwise the
 *  error message is added to the element having to the element having
 *  ID `errors` wrapped within an `<li>`.
 */ function displayErrors(errors) {
    for (const err of errors){
        const id = err.options.widget ?? err.options.path;
        const widget = id && document.querySelector(`#${id}-error`);
        if (widget) widget.append(err.message);
        else {
            const li = (0, _utilsJs.makeElement)("li", {
                class: "error"
            }, err.message);
            document.querySelector(`#errors`).append(li);
        }
    }
} //TODO: add functions as needed

},{"./library-ws.js":"hrmJa","./utils.js":"3cCYB","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"hrmJa":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "makeLibraryWs", ()=>makeLibraryWs);
parcelHelpers.export(exports, "LibraryWs", ()=>LibraryWs);
var _cs544JsUtils = require("cs544-js-utils");
var _utilsJs = require("./utils.js");
function makeLibraryWs(url) {
    return new LibraryWs(url);
}
class LibraryWs {
    //base url for these web services
    url;
    constructor(url){
        this.url = url;
    }
    /** given an absolute books url bookUrl ending with /books/api,
     *  return a SuccessEnvelope for the book identified by bookUrl.
     */ async getBookByUrl(bookUrl) {
        return getEnvelope(bookUrl);
    }
    /** given an absolute url findUrl ending with /books with query
     *  parameters search and optional query parameters count and index,
     *  return a PagedEnvelope containing a list of matching books.
     */ async findBooksByUrl(findUrl) {
        return getEnvelope(findUrl);
    }
    /** check out book specified by lend */ //make a PUT request to /lendings
    async checkoutBook(lend) {
        try {
            const response = await fetch(`${this.url}/lendings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lend)
            });
            const envelope = await response.json();
            if (envelope.isOk) return (0, _cs544JsUtils.Errors).VOID_RESULT;
            else return new (0, _cs544JsUtils.Errors).ErrResult(envelope.errors);
        } catch (err) {
            console.error("Error during checkoutBook:", err);
            return (0, _cs544JsUtils.Errors).errResult(`PUT /lendings: error ${err}`);
        }
    }
    /** return book specified by lend */ //make a DELETE request to /lendings
    async returnBook(lend) {
        try {
            const response = await fetch(`${this.url}/lendings`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(lend)
            });
            const envelope = await response.json();
            if (envelope.isOk) return (0, _cs544JsUtils.Errors).VOID_RESULT;
            else return (0, _cs544JsUtils.Errors).errResult(envelope.errors);
        } catch (err) {
            console.error("Error during returnBook:", err);
            return (0, _cs544JsUtils.Errors).errResult(`DELETE /lendings: error ${err}`);
        }
    }
    /** return Lend[] of all lendings for isbn. */ //make a GET request to /lendings with query-params set
    //to { findBy: 'isbn', isbn }.
    async getLends(isbn) {
        try {
            const queryParams = {
                findBy: "isbn",
                isbn
            };
            const url = (0, _utilsJs.makeQueryUrl)(`${this.url}/lendings`, queryParams);
            const response = await fetch(url.toString());
            const envelope = await response.json();
            if (envelope.isOk) return (0, _cs544JsUtils.Errors).okResult(envelope.result);
            else return (0, _cs544JsUtils.Errors).errResult(envelope.errors);
        } catch (err) {
            console.error("Error during getLends:", err);
            return (0, _cs544JsUtils.Errors).errResult(`GET /lendings: error ${err}`);
        }
    }
}
/** Return either a SuccessEnvelope<T> or PagedEnvelope<T> wrapped
 *  within a Errors.Result.  Note that the caller needs to instantiate
 *  both type parameters appropriately.
 */ async function getEnvelope(url) {
    const result = await fetchJson(url);
    if (result.isOk === true) {
        const response = result.val;
        if (response.isOk === true) return (0, _cs544JsUtils.Errors).okResult(response);
        else return new (0, _cs544JsUtils.Errors).ErrResult(response.errors);
    } else return result;
}
const DEFAULT_FETCH = {
    method: "GET"
};
/** send a request to url, converting any exceptions to an
 *  error result.
 */ async function fetchJson(url, options = DEFAULT_FETCH) {
    //<https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts#L26104>
    try {
        const response = await fetch(url, options);
        return (0, _cs544JsUtils.Errors).okResult(await response.json());
    } catch (err) {
        console.error(err);
        return (0, _cs544JsUtils.Errors).errResult(`${options.method} ${url}: error ${err}`);
    }
} //TODO: add other functions as needed

},{"cs544-js-utils":"8WQYV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3","./utils.js":"3cCYB"}],"8WQYV":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "Errors", ()=>_errorsJs);
var _errorsJs = require("./lib/errors.js");

},{"./lib/errors.js":"aGjnO","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"aGjnO":[function(require,module,exports) {
// Immutable API
/** throw exception with msg and args; use when impossible conditions occur */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "panic", ()=>panic);
parcelHelpers.export(exports, "Err", ()=>Err);
/** A Result is either a success result identified by isOk=true,
 *  or an error result identified by isOk=false.  A success
 *  result has the success value in its 'val' property; an
 *  error result will have one or more 'Err' objects in its
 *  'errors' property.
 */ parcelHelpers.export(exports, "OkResult", ()=>OkResult);
parcelHelpers.export(exports, "ErrResult", ()=>ErrResult);
/** factory function for a success result */ parcelHelpers.export(exports, "okResult", ()=>okResult);
parcelHelpers.export(exports, "VOID_RESULT", ()=>VOID_RESULT);
/** factory function for an error result initialized to contain
 *  a single error as per arg0, args.
 *    errResult(msg: string, code?: string, widget?: string)
 *    errResult(msg: string, options: ErrOptions)
 *    errResult(err: Err)
 *    errResult(err: ErrResult, options: ErrOptions)
 *    errResult(errObj: object, options: ErrOptions)
 */ parcelHelpers.export(exports, "errResult", ()=>errResult);
/** Convenience error building function.  Possible arguments:
 *     error(msg: string, code?: string, widget?: string)
 *     error(msg: string, options: ErrOptions)
 *     error(err: Err)
 *     error(err: Error, options?: ErrOptions)
 *     error(errObj: object, options?: ErrOptions)
 */ parcelHelpers.export(exports, "error", ()=>error) /*
//demo program

function safeDiv(num: number, denom: number) : Result<number> {
  if (denom === 0) return errResult('zero denominator');
  return okResult(num/denom);
}

function demo(result: Result<number>) : Result<string> {
  if (!result.isOk) return result as Result<string>;
  const v = result.val + 1;
  return result.chain((val: number) => okResult('x'.repeat(v*val)))
               .chain((str: string) => okResult(str + 'aaa'));
}

console.log(safeDiv(1, 0));
console.log(safeDiv(1, 2));
console.log(demo(errResult('some error', 'ERR_CODE')));
console.log(demo(okResult(2)));
*/ ;
function panic(msg, ...args) {
    throw new Error(msg + args.map((a)=>JSON.stringify(a)).join(", "));
}
const DEFAULT_ERR_CODE = "UNKNOWN";
class Err {
    message;
    options;
    constructor(message, options){
        this.message = message;
        this.options = options;
    }
}
class OkResult {
    isOk = true;
    val;
    constructor(v){
        this.val = v;
    }
    /** return result of applying fn on val */ chain(fn) {
        return fn(this.val);
    }
}
class ErrResult {
    isOk = false;
    errors;
    constructor(errors = []){
        this.errors = errors;
    }
    /** Possible arguments
     *   addError(ErrResult errResult)
     *   addError(msg: string, code?: string, widget?: string)
     *   addError(msg: string, options: ErrOptions)
     *   addError(err: Err)
     *   addError(err: Error, options?: ErrOptions)
     *   addError(errObj: object, options?: ErrOptions)
     */ addError(arg0, ...args) {
        const errors = arg0 instanceof ErrResult ? arg0.errors : [
            error(arg0, ...args)
        ];
        return new ErrResult(this.errors.concat(errors));
    }
    /** ignore fn, simply returning this error result */ chain(_fn) {
        return this;
    }
}
function okResult(v) {
    return new OkResult(v);
}
const VOID_RESULT = okResult(undefined);
function errResult(arg0, ...args) {
    return new ErrResult().addError(arg0, ...args);
}
function error(arg0, ...args) {
    let options = {
        code: DEFAULT_ERR_CODE
    };
    if (typeof arg0 === "string") {
        const msg = arg0;
        if (args.length === 0) return new Err(msg, {
            code: DEFAULT_ERR_CODE
        });
        else if (args.length === 1 && typeof args[0] === "object") return new Err(msg, {
            code: DEFAULT_ERR_CODE,
            ...args[0]
        });
        else if (args.length === 1 && typeof args[0] === "string") return new Err(msg, {
            code: args[0]
        });
        else if (args.length === 2 && typeof args[0] === "string" && typeof args[1] === "string") return new Err(msg, {
            code: args[0],
            widget: args[1]
        });
        else panic(`bad error args`, [
            arg0,
            ...args
        ]);
    } else if (arg0 instanceof Err) return arg0;
    else if (arg0 instanceof Error) return new Err(arg0.message, args.length > 0 ? args[0] : {
        code: DEFAULT_ERR_CODE
    });
    else if (typeof arg0 === "object") return new Err(arg0.toString(), args.length > 0 ? args[0] : {
        code: DEFAULT_ERR_CODE
    });
    else panic(`bad error args`, [
        arg0,
        ...args
    ]);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gkKU3":[function(require,module,exports) {
exports.interopDefault = function(a) {
    return a && a.__esModule ? a : {
        default: a
    };
};
exports.defineInteropFlag = function(a) {
    Object.defineProperty(a, "__esModule", {
        value: true
    });
};
exports.exportAll = function(source, dest) {
    Object.keys(source).forEach(function(key) {
        if (key === "default" || key === "__esModule" || Object.prototype.hasOwnProperty.call(dest, key)) return;
        Object.defineProperty(dest, key, {
            enumerable: true,
            get: function() {
                return source[key];
            }
        });
    });
    return dest;
};
exports.export = function(dest, destName, get) {
    Object.defineProperty(dest, destName, {
        enumerable: true,
        get: get
    });
};

},{}],"3cCYB":[function(require,module,exports) {
/** Return a new DOM element with specified tagName, attributes given
 *  by object attrs and internal elements appendees which can be text
 *  or HTML elements.  Note that .append(TextOrElement...) can be
 *  called on the returned element to append further string text or a
 *  DOM elements to it while setAttribute() can be used for setting
 *  its attributes.
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "makeElement", ()=>makeElement);
/** Given a baseUrl and req, return a URL object which contains
 *  req as query-parameters appended to baseUrl.
 */ parcelHelpers.export(exports, "makeQueryUrl", ()=>makeQueryUrl);
/** Return a key-value mapping for all non-empty data from form */ parcelHelpers.export(exports, "getFormData", ()=>getFormData);
function makeElement(tagName, attrs = {}, ...appendees) {
    const element = document.createElement(tagName);
    for (const [k, v] of Object.entries(attrs))element.setAttribute(k, v);
    element.append(...appendees);
    return element;
}
function makeQueryUrl(baseUrl, req) {
    const url = new URL(baseUrl);
    Object.entries(req).forEach(([k, v])=>url.searchParams.append(k, v));
    return url;
}
function getFormData(form) {
    const pairs = [
        ...new FormData(form).entries()
    ].map(([k, v])=>[
            k,
            v
        ]).filter(([_, v])=>v.trim().length > 0);
    return Object.fromEntries(pairs);
}

},{"@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["6fQGg","CnCET"], "CnCET", "parcelRequireeeb6")

//# sourceMappingURL=index.bf1e63c0.js.map
