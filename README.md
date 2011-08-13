#Core.js

Core.js is a simple, light-weight, base layer to your JS app. It has two parts:

1. App extensions
2. App pushes and updates

Core JS allows you to create apps that have multiple working widgets that all interact with each other without ever actually knowing about one another. You can remove any widget without another widget breaking or your browser ever throwing an error.

##Quick Start Examples

###Extensions

Here's an example of creating a widget and then loading it.

    Core.extend('widget',function(m){
      alert(m);
    });
      
    Core.load('widget','Hello World');

###Pushes and Updates

Here's an example of how to send a push and another item to receive it (uses jQuery just for example's sake):

    var i = 0;
    $(window).click(function(){
      Core.push('updateCount',i++);
    });

    Core.listen('updateCount',function(value){
      $('.counter').empty().append(i);
    });

##API

- Core.extend()
- Core.load()
- Core.remove()
- Core.push()
- Core.listen()

###`Core.extend(name, callback)`

`Core.extend()` creates a new widget but doesn't actually run any code until `Core.load()` is called. You can pass it parameters in the callback function so that you can set options when you use `Core.load()`.

**Example:**

    Core.extend('widget',function(msg){
      alert(msg);
    });

###`Core.load(name, options, location)`

`Core.load()` loads and runs a widget that was defined by `Core.extend()`. The options you pass here will be run in the callback of the `Core.extend()` method. The location param is optional, but if you are doing _any_ DOM manipulation or attaching any event listeners you should put a location. Why you ask?

_Note: to pass multiple params use a JS object like `{name:'Oscar', age: '21'}`_.

Behind the scenes it appends a `<div id="widgetName>` element in the location you specified with the ID of the widget based on it's name. This element can be accessed with "`this`" in the `Core.extend()` method.

**Example:**

This example builds from the previous example in `Core.extend()`

    Core.load('widget','#sidebar','Hello World!');

###`Core.remove(name)`

`Core.remove()` does what it says and completely removed a widget. If the widget was built correctly all pushes, listens, and bound events will stop working since all of the widget's DOM and code is completely removed.

**Example:**

    Core.remove('widget');

###`Core.push(name, value)`

Core.js has a concept of push events. Push events make your code a lot cleaner and more flexible and allows you to interact with other widgets without them ever having to know if you exist. When you call `Core.push()` it tells all the `Core.listen()` methods to run their code. If the event never happens, such as getting tweets and Twitter is down, a "timeline" widget would just never get updated and there would be no JS errors.

**Example:**

jQuery is used in the following example just for illutration purposes only. jQuery is not required.

    $(this).find('.widgetBtn').click(function(){
      Core.push('greet','Hi!');
    });

###`Core.listen(name, callback)`

After a push is sent all `Core.listen()`s that are listening for that specific push's name are notified and the callback is run. In the callback, the value of the push is returned.

**Example:**

This builds off the example above in `Core.push()` and is assumed this is in some other widget.

    Core.listen('greet',function(val){
      alert(val); //Would alert "Hi!"
    });

##Rules to Core.js

Core.js has some design best practices and rules for it to work best.

###Stick to your own DOM

Always use Core.js' DOM sandbox with this. Messing with another widget's DOM or even the page's DOM like the `<body>` doesn't only completely defeat the concept of Core.js, but also, it's just rude to the other widgets. Lastly, make sure you are careful about selecting elements too. Don't use `$('p')` in your widget code, use `$(this).find('p')`

###Be original when naming widgets

Even if you are a sole developer on a project, if you name a widget something simple like even a single character such as m you'll like likely trip on this later. Try to be original. If you have a twitter widget, don't call it "twitter", maybe call it "twitterizer" for example. The whole concept of Core.js is that valid code should never break.

###Fork me!

As with all great scripts and applications, Core.js is open source. It's on a GitHub, so feel free to send me pull requests!