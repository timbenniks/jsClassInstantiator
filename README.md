## JavaScript Class Instantiator
This piece of code makes instantiating JavaScript classes a breeze.

## The problem
We mostly create highly dynamic websites with loads of JavaScript and little page reloads.
Contents get's added by ajax and DOM events are all over the place.

Keeping track of events and JavaScript that is bound to DOM nodes can be a pain when the html is big and new content is constantly loaded with ajax.

I created this script to avoid having to worry about the state of events and classes.

## The solution
The ClassInstantiator instantiates classes by scanning DOM nodes that have the `data-widget` tag.
It binds the instance of the widget it found to the DOM node that has the `data-widget` attribute.
Because the instance has been bound to the DOM node you just have to query the node to gain access to the public functions of the class.

The `data-widget` tag gives extra semantics to the html and also enables less technical people to add JavaScript to a new piece of html in an easy way. Just add `data-widget="tooltip"` and you are done.

The instantiator is not meant for classes that do not interact with the DOM.

## How to use

```html
<div class="my-awesome-html">
	<p>
		Some nice <span data-widget="tooltip" title="I am a tooltip">text</span> about something.
	</p>
</div>
```

```javascript
$(function($, ns)
{
	ns.ClassInstantiatorInstance = new ns.ClassInstantiator();

	// After your content / html has been loaded:
	ns.ClassInstantiatorInstance.scan($('.my-awesome-html'));

}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));
```

### After an ajax call
When new content has been loaded into an html element, new nodes with the `data-widget` attribute could have been added. Rescan the element after the ajax call to instantiate new classes.

If the nodes already have an instance, the script will return that instance and will not create a new instance. If the instance does not exist the script will instantiate the class for that node.

### Adding options to instances
If you add `data-options` attribute to a node which has a `data-widget` attribute, the script will grab the contents of the `data-options` attribute and adds these as an object to the class it instantiates.

```html
<p>Some nice <span data-widget="tooltip" data-options='{"title":"I am a tooltip"}'>text</span> about something.</p>
```
Notice the single quotes around the object in the `data-options` attribute.

## Dependencies
jQuery