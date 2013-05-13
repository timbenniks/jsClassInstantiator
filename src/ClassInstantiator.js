/**
 * ClassInstantiator
 * @param  {object} ns	NameSpace
 * @dependencies JSON
 */
(function (ns)
{
	'use strict';

	/**
	 * ClassInstantiator Constructor.
	 * @param {String} dataAttr The data-attribute to scan for. Defaults to 'widget'.
	 * @constructor
	 */
	ns.ClassInstantiator = function (dataAttr)
	{
		var dataAttributeToScanFor = dataAttr || 'widget',
			widgetDictionary = [],

		/**
		 * Scan for elements that contain data-widget and instantiate the widget that is associated to the element.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 */
		scan = function (context)
		{
			context = context || document.body;

			var widgets = findWidgets(context),
			i = 0;

			if(widgets)
			{
				for(; i < widgets.length; i++)
				{
					instantiate(widgets[i].widget, widgets[i].widgetToInstantiate);
				}
			}
		},

		/**
		 * Find elements that contain data-widget and add teh element and the widget to the widgets array.
		 * Multiple widgets can be added to a DOM node. Seperate them by a ';'.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @return {array} returns an array with the widget DOM node and the widget name.
		 */
		findWidgets = function (context)
		{
			context = context || document.body;

			var widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']'),
				i = 0, c = 0,
				widgets = [];

			for (; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToInstantiate = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (; c < widgetToInstantiate.length; c++)
				{
					widgets.push({'widget': widget, 'widgetToInstantiate': widgetToInstantiate[c]});
				}
			}

			return widgets;
		},

		/**
		 * Instantiate a widget.
		 * @param {HTMLELement} element The DOM node from which to instantiate the widget.
		 * @param {string} widgetName The name of the widget to Instantiate.
		 * @return {instance} The instantiated widget.
		 */
		instantiate = function (element, widgetName)
		{
			var InstanceName = cleanUpInstanceName(widgetName),
				options;

			if (!widgetName || typeof InstanceName === 'string' || typeof InstanceName !== 'function')
			{
				return false;
			}

			/**
			 * When multiple widgets are applied to a single DOM node, use data-<widgetName>-options attributes
			 * to give the widgets their own options obejcts.
			 */
			options = getDataAttr(element, widgetName.toLowerCase() + 'Options') || getDataAttr(element, 'options') || {};

			if (typeof options === 'string')
			{
				options = JSON.parse(options);
			}

			if (!(element in widgetDictionary))
			{
				widgetDictionary[element] = [];
			}

			widgetDictionary[element][widgetName] = new InstanceName(element, options);

			if (widgetName in widgetDictionary[element])
			{
				return widgetDictionary[element][widgetName];
			}
		},

		/**
		 * Convert from string to function.
		 * @param {string} widgetName The name of the widget.
		 * @return {function} Return the function the string translates to.
		 */
		cleanUpInstanceName = function (widgetName)
		{
			var parts = widgetName.split('.');

			if (!parts.length)
			{
				throw ('Cannot split ' + widgetName + '  into a parts');
			}

			switch (parts.length)
			{
				case 1: return ns[parts[0]];
				case 2: return ns[parts[0]][parts[1]];
				case 3: return ns[parts[0]][parts[1]][parts[2]];
				case 4: return ns[parts[0]][parts[1]][parts[2]][parts[3]];
				default: throw ('Cannot find [' + widgetName + '] as a function in your namespace.');
			}
		},

		/**
		 * Get the widget instance for a DOM node.
		 * @param {HTMLElement} selector DOM on which the widget lives.
		 * @param {string} widgetName Name of the widget you are looking for.
		 * @return {instance} The instance of the widgetName.
		 */
		getWidgetBySelector = function (selector, widgetName)
		{
			if (selector in widgetDictionary)
			{
				if (widgetDictionary[selector][widgetName])
				{
					return widgetDictionary[selector][widgetName];
				}
			}
			else
			{
				throw ('Cannot find [' + widgetName + '] on: ' + selector);
			}
		},

		/**
		 * Get widgets in the context of a DOM node.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @param {string} widgetName Name of the widget you are looking for.
		 * @return {instance} The instance of the widgetName.
		 */
		getWidgetsInContext = function (context, widgetName)
		{
			var widgets = [], widgetsFound, i = 0, c = 0;

			context = context || document.body;

			widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']');

			for (; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToReturn = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (; c < widgetToReturn.length; c++)
				{
					if(widgetName && widgetName === widgetToReturn[c])
					{
						widgets.push(getWidgetBySelector(widget, widgetToReturn[c]));
						break;
					}
					else
					{
						widgets.push(getWidgetBySelector(widget, widgetToReturn[c]));
					}
				}
			}

			return widgets;
		},

		/**
		 * Destroy the widget instance by calling the destroy function and by
		 * removing the data form the DOM node.
		 * @param {HTMLElement} selector The DOM node of the widget.
		 * @param {string} widgetName The widget you want to destroy.
		 */
		destroyWidgetBySelector = function (selector, widgetName)
		{
			var widgetInstance = getWidgetBySelector(selector, widgetName);

			if (typeof widgetInstance.destroy === 'function')
			{
				widgetInstance.destroy();
			}
			else
			{
				throw ('Cannot find destroy function for: [' + widgetName + ']');
			}

			widgetDictionary[selector][widgetName] = null;
			delete widgetDictionary[selector][widgetName];
		},

		/**
		 * Destroy widgets in context.
		 * @param {HTMLElement} context The context in which to search for DOM nodes.
		 * @param {string} widgetName The widget you want to destroy.
		 */
		destroyWidgetsInContext = function (context, widgetName)
		{
			var widgets = [], widgetsFound, i = 0, c = 0;

			context = context || document.body;

			if (widgetName)
			{
				widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + '="' + widgetName + '"]');
			}
			else
			{
				widgetsFound = getNode(context, '[data-' + dataAttributeToScanFor + ']');
			}

			for (; i < widgetsFound.length; i++)
			{
				var widget = widgetsFound[i],
					widgetToDestroy = getDataAttr(widget, dataAttributeToScanFor).split(';');

				for (; c < widgetToDestroy.length; c++)
				{
					destroyWidgetBySelector(widget, widgetToDestroy[c]);
				}
			}

			return widgets;
		},

		/**
		 * Internal function that returns the value of a data attribute.
		 * Uses jQuery or Zepto if defined, otherwise resorts to dataset or getAttribute().
		 * @param {HTMLElement} node The DOM node on which to find the data attribute.
		 * @param {string} attr The name of the data attribute to find the value of.
		 * @return {string / object} The value of teh data attribute.
		 */
		getDataAttr = function (node, attr)
		{
			if ($ && typeof $ === 'function')
			{
				return $(node).data(attr);
			}
			else
			{
				if (node.dataset !== undefined && node.dataset !== null)
				{
					return node.dataset[attr];
				}
				else
				{
					return node.getAttribute('data-' + attr);
				}
			}
		},

		/**
		 * Returns a node. Uses jQuery or Zepto, otherwise resorts to querySelectorAll().
		 * @param  {HTMLElement} context The context in which to search for DOM nodes.
		 * @param  {string} selector DOM node to find in context.
		 * @return {object} Selected DOM node.
		 */
		getNode = function (context, selector)
		{
			context = context || document.body;

			if ($ && typeof $ === 'function')
			{
				return $(context).find(selector);
			}
			else
			{
				return context.querySelectorAll(selector);
			}
		};

		return {
			scan: scan,
			findWidgets: findWidgets,
			instantiate: instantiate,
			getWidgetBySelector: getWidgetBySelector,
			getWidgetsInContext: getWidgetsInContext,
			destroyWidgetsInContext: destroyWidgetsInContext,
			destroyWidgetBySelector: destroyWidgetBySelector,
			cleanUpInstanceName: cleanUpInstanceName,
			getDataAttr: getDataAttr,
			getNode: getNode
		};
	};

}(window.NAMESPACE = window.NAMESPACE || {}));