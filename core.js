/**
 * By Oscar Godson ( @oscargodson / oscargodson.com )
 * License:http://www.opensource.org/licenses/mit-license.php
 */
var Core = function(){
  /**
   * Change these if you want
   */
  var settings = {
    widgetWrapperElement: 'div',
    prefixOnWidgetId: 'core-'
  }
  
  //change to "true" to get error logs in your console
  var errors = false
  ,   extensions = {}
  ,   listeners = {};
  
  //Used to check if objects are actually DOM nodes
  function isNode(o){
    return (
      typeof Node === "object" ? o instanceof Node : 
      typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
  }
  
  /**
   * @description 
   * Core.extend() creates a new widget but doesn't actually run any code until Core.load() is
   * called. You can pass it parameters in the callback function so that you can set options
   * when you use Core.load().
   *
   * @argument {String} name  Name of your widget so that you can call .remove() and .load()
   * @argument {Function} func  The callback function to be called when .load() is invoked
   * @argument {Function} removeFunc  The callback function to be called when .unload() or .remove()
   *           is invoked
   * @returns {Object} the Core
   */
  var extend = function(name,func,removeFunc){
    name = name || '';
    func = func || function(){};
    removeFunc = removeFunc || function(){};
    if(typeof extensions[name] == 'undefined'){
      extensions[name] = {
        name: name,
        onLoad: func,
        onUnload: removeFunc,
        loaded:false
      }
    }
    else{
      if(errors){
        throw new Error('Core extend() error: the extension "'+name+'" already exists');
      }
    }
    return this;
  }
  
  /**
   * @description
   * Core.load() loads and runs a widget that was defined by Core.extend(). The options you
   * pass here will be run in the callback of the Core.extend() method. The location param is
   * optional, but if you are doing any DOM manipulation or attaching any event listeners you
   * should put a location.
   *
   * @argument {String} name  The name of your widget which you named with .extend()
   * @argument {String}{Object} params  Whatever you want to give back to extend() to use as params
   * @argument {Object}  sel  The optional param which places the generated HTML as a child of
   * @returns {Object} the Core
   */
  var load = function(name,params,sel){
    name = name || '';
    params = params || '';
    
    if(typeof params == 'object' && isNode(params)){
      sel = params;
    }
    
    if(typeof extensions[name]  !== 'undefined'){
      if(extensions[name].loaded == false){
        if(sel){
          var widgetElement = document.createElement(settings.widgetWrapperElement);
          widgetElement.setAttribute('id',settings.prefixOnWidgetId+name);
          sel.appendChild(widgetElement);
        }
        extensions[name].loaded = true;
        extensions[name].onLoad.call(widgetElement,params); 
      }
      else{
        if(errors){
          throw new Error('Core load() error: the extension "'+name+'" is already loaded');
        }
      }
    }
    else{
      if(errors){
        throw new Error('Core load() error: the extension "'+name+'" doesn\'t exist');
      }
    }
    return this;
  }
  
  /**
   * @description
   * Core.remove() does what it says and completely removed a widget. If the widget was built
   * correctly all pushes, listens, and bound events will stop working since all of the widget's DOM
   * and code is completely removed.
   *
   * @param {String} name  The name of the extension you want to remove
   * @param {String}{Object} params  Params to be given to the 3rd param of extend upon removal
   * @returns {Object} the Core
   */
  var remove = function(name,params){
    name = name || '';
    params = params || '';
    if(typeof extensions[name] !== 'undefined'){
      var el = document.getElementById(settings.prefixOnWidgetId+name)
      ,   elParent = el.parentNode;
      elParent.removeChild(el);
      extensions[name].onUnload.call(el,params);
      delete extensions[name];
    }
    else{
      if(errors){
        throw new Error('Core remove() error: the extension "'+name+'" doesn\'t exist');
      }
    }
  }
  
  /**
   * @description
   * Core.unload() "unloads" a widget. This means that you can then recall it with Core.load().
   * If you use Core.remove() you won't be able to call it back because everything is removed.
   * Core.unload() will call remove, so anything a widget had as the 3rd param in the .extend()
   * method will be run and everything else will be removed as well.
   * 
   * @param {String} name  The name of the extension you want to unload
   * @param {String}{Object} params  Params to be given to the 3rd param of extend upon removal
   * @returns {Object} the Core
   */
  var unload = function(name,params){
    name = name || '';
    params = params || '';
    if(typeof extensions[name] !== 'undefined'){
      var temp = extensions[name];
      temp.loaded = false;
      remove(name,params);
      extensions[name] = temp;
    }
    else{
      if(errors){
        throw new Error('Core unload() error: the extension "'+name+'" doesn\'t exist');
      }
    }
    return this;
  }
  
  /**
   * @description
   * Push events make your code a lot cleaner and more flexible and allows you to interact with
   * other widgets without them ever having to know if you exist. When you call Core.push() it
   * tells all the Core.listen() methods to run their code. If the event never happens, such as
   * getting tweets and Twitter is down, a "timeline" widget would just never get updated and there
   * would be no JS errors.
   *
   * @param {String} name  The name of the event you want to push
   * @param {String}{Object} value  The value you want to send to .listen()
   * @returns {Object} the Core
   */
  var push = function(name, value){
    name = name || '';
    value = value || '';
    if(typeof listeners[name] !== 'undefined'){
      listeners[name].call(this,value);
    }
    else{
      if(errors){
        throw new Error('Core push() error: the extension "'+name+'" doesn\'t exist');
      }
    }
  }
  
  /**
   * @description
   * After a push is sent all Core.listen()s that are listening for that specific push's name are
   * notified and the callback is run. In the callback, the value of the push is returned.
   *
   * @param {String} name  The name of the push event you are listening for
   * @param {Function} callback  The function to invoke when the push event is sent
   * @returns {Object} the Core
   */
  var listen = function(name, callback){
    name = name || '';
    callback = callback || function(){};
    listeners[name] = callback;
  }
  
  return {
    extend:extend,
    load:load,
    remove:remove,
    unload:unload,
    push:push,
    listen:listen
  }
}();