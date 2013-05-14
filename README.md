## JavaScript Class Instantiator
This piece of code makes instantiating JavaScript classes a breeze.

## Why you want this
Because of the dynamic nature of our work, DOM and JavaScript function instances events can be all over the place.
When the html often changes without a page reload it can be hard to keep track of their state.
I created this script to avoid having to worry about the state of events and function instances when creating new HTML.

## How it works
The point of this script is to keep your code as stateless as possible.
The class instantiator has a scan function that scans a specific piece of html.
If it finds DOM nodes with the `data-widget` attribute on it, it locates the JavaScript function which is named like the `data-widget` value and tries to instantiate it.

If the function exists and it can be instantiated, the class instantiator saves the instance in a dictionary.
`widgetDictionary[<HTMLElement>][<widgetInstance>];`

When the instance has public functions you can access these by asking the widget dictionary to return the instance you want by supplying the DOM node and the widget name.

### Added benefit
The `data-widget` tag gives extra semantics to the html and also enables less
technical people to add JavaScript to a new piece of html in an easy way.
Just add `data-widget="tooltip"` and you are done.

## Implementation
```html
<div id="my-awesome-html">
    <p>Nice <span data-widget="Tooltip" title="I am a Tooltip">text</span> about something.</p>
</div>
```

```javascript
(function(ns)
{
    ns.ClassInstantiatorInstance = new ns.ClassInstantiator('widget');
    ns.ClassInstantiatorInstance.scan(document.getElementById('my-awesome-html'));

}(window.NAMESPACE = window.NAMESPACE || {}));
```

```javascript
(function($, ns)
{
    'use strict';

    ns.Tooltip = function(element, options)
    {
        var el = $(element),
			title = el.attr('title'),

        init = function()
        {
             el.on('mouseenter.Tooltip mouseleave.Tooltip', handleToolTip);
        },

        handleToolTip = function(e)
        {
            // handle tooltip events
        },

        destroy = function()
        {
           el.off('mouseenter.Tooltip mouseleave.Tooltip');
        };

        init();

        return {
            destroy: destroy
		};
    };
}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));
```

Multiple widgets per DOM node are also possible. Just seperate them by a `;`.

```html
<div id="my-awesome-html">
    <p>Nice <span data-widget="Tooltip;AnotherWidget" title="I am a Tooltip">text</span> about something.</p>
</div>
```

The class instantiator is only meant to be used for functions that interact with DOM nodes. It is not meant for functions that are only called once.

### After an ajax call
When new content has been loaded into an html element, new nodes with the `data-widget` attribute could have been added.
If the html element used to contain widgets, there is a chance DOM events are still bound.
Even when the html is gone, the events are not garbage collected.

The class instantiator has `destroyWidgetsInContext` and `destroyWidgetBySelector` functions.
Run any of these before your AJAX call and they will remove the instance from the widget dictionary and they try to fire the destroy function of the widget instance.
Unbind DOM events in the destroy function to clean them up once and for all.

When the AJAX call is done and the new content is added, scan it to get the classes to instantiate.
If the scanned nodes already had an instance (it could be that you re-scanned a bigger area of the page), the script will return the existing instance
and will not create a new one.
If the instance does not exist in the dictionary yet, the script will instantiate the class for that node.

### Adding options to instances
If you add `data-options` attribute to a node which has a `data-widget` attribute,
the script will grab the contents of the `data-options` attribute and adds these
as an object to the class it instantiates. The options need to be in a JSON format.

```html
<p>Some nice <span data-widget="tooltip" data-options='{"title":"I am a tooltip"}'>text</span> about something.</p>
```
Notice the single quotes around the object in the `data-options` attribute.

When you have multiple widgets on one DOM node the options work like this:
```html
<p>Some nice <span data-widget="tooltip;anotherwidget" data-tooltip-options='{"title":"I am a tooltip"}' data-anotherwidget-options='{"option":"option value"}'>text</span> about something.</p>
```

### Class Instantiator public functions
The ClassInstantiator provides four public functions. Check the source code to see which variables they need.
* `Scan` Scan for elements that contain data-widget and instantiate the widget that is associated to the element.
* `getWidgetBySelector` Get the widget instance for a DOM node
* `getWidgetsInContext` Get all widgets inside a DOM node
* `destroyWidget` Destroy the widget instance by calling the destroy function and by removing the data form the DOM node
* `destroyWidgetsInContext` Destroy all the widgets inside a DOM node

## Dependencies
The script works with jQuery or Zepto if they are included in the project.
Without Zepto or jQuery the Class Instantiator will only work in modern browsers.
It does depend on JSON though.

## The widget itself
Your classes can be an object literal or a prototype, as long as they live in a namespace and have a public `destroy` function.

```javascript
(function(ns)
{
    'use strict';

    ns.EXAMPLE_CLASS = function(element, options)
    {
        var privareVar = 'privareVar',

        init = function()
        {
            // Do init stuff here or bind an event.
        },

        privateFunction = function()
        {
            // I'm a private function
        },

        publicFunction = function()
        {
            // I'm a public function because I am returned at the bottom.
        },

        destroy = function()
        {
           // If events where bound, unbind them here.
        };

        init();

        return {
            destroy: destroy,
            publicFunction: publicFunction
        };
    };
}(window.NAMESPACE = window.NAMESPACE || {}));
```