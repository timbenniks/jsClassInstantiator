/**
 * ClassInstantiator
 * @param  {object} $	jQuery
 * @param  {object} ns	NameSpace
 * @dependencies		jQuery
 */
(function ($, ns)
{
	"use strict";

	/**
	 * ClassInstantiator Constructor
	 * @param  {String} dataAttr The data-attribute to scan for. Defaults to 'widget'.
	 */
	ns.ClassInstantiator = function(dataAttr)
	{
		var dataAttributeToScanFor = dataAttr || 'widget',

		/**
		 * Scan for elements that contain data-widget and instantiate the widget that is associated to the element.
		 * Multiple widgets can be added to a DOM node. Seperate them by a ';'.
		 * @param  {HTMLElement} context The context in which to search for DOM nodes
		 */
		scan = function(context)
		{
			context = context || $(document.body);

			context.find('[data-'+ dataAttributeToScanFor +']').each(function()
			{
				var element = $(this),
					widgetToInstantiate = element.data('widget').split(';');

				$.each(widgetToInstantiate, function(key, val)
				{
					instantiate(element, val);
				});
			});
		},

		/**
		 * Instantiate a widget
		 * @param  {HTMLELement} element    The DOM node from which to instantiate the widget
		 * @param  {string} widgetName		The name of the widget to Instantiate
		 * @return {instance}				The instantiated widget
		 */
		instantiate = function(element, widgetName)
		{
			var InstanceName = cleanUpInstanceName(widgetName),
				options,
				existingWidget,
				instance;

			if(!widgetName || typeof InstanceName === 'string' || typeof InstanceName !== 'function')
			{
				return false;
			}

			/**
			 * When multiple widgets are applied to a single DOM node, use data-<widgetName>-options attributes
			 * to give the widgets their own options obejcts.
			 */
			options = element.data(widgetName.toLowerCase() +'Options') || element.data('options') || {};
			existingWidget = $.data(element[0], widgetName);

			if(existingWidget === undefined || existingWidget === null)
			{
				instance = $.data(element[0], widgetName, new InstanceName(element, options));
			}

			return instance;
		},

		/**
		 * Convert from string to function
		 * @param  {string} widgetName The name of the widget
		 * @return {funciton}          Return the function the string translates to
		 */
		cleanUpInstanceName = function(widgetName)
		{
			var parts = widgetName.split('.'),
				widgetClass;

			if(!parts.length)
			{
				throw('Cannot split ' + widgetName + '  into a parts');
			}

			while(parts.length)
			{
				widgetClass = ns[parts.shift()];

				if(!widgetClass)
				{
					throw('Cannot find [' + widgetName + '] as a function in your namespace.');
				}
			}

			return widgetClass;
		},

		/**
		 * Get the widget instance for a DOM node
		 * @param  {HTMLElement} selector	DOM on which the widget lives
		 * @param  {string} widgetName		Name of the widget you ar elooking for
		 * @return {instance}				The instance of the widgetName
		 */
		getWidgetBySelector = function(selector, widgetName)
		{
			return selector.data(widgetName);
		},

		/**
		 * Get widgets in teh context of a DOM node.
		 * @param  {HTMLElement} context	The context in which to search for DOM nodes
		 * @param  {string} widgetName		Name of the widget you are looking for
		 * @return {instance}				The instance of the widgetName
		 */
		getWidgetsInContext = function(context, widgetName)
		{
			var widgets = [],
			widgetsFound;

			context = context || $(document.body);

			if(widgetName)
			{
				widgetsFound = context.find('[data-'+ dataAttributeToScanFor +'="'+ widgetName +'"]');
			}
			else
			{
				widgetsFound = context.find('[data-'+ dataAttributeToScanFor + ']');
			}

			widgetsFound.each(function()
			{
				var element = $(this),
					widgetsOnNode = element.data('widget').split(';');

				$.each(widgetsOnNode, function()
				{
					widgets.push(getWidgetBySelector(element, this));
				});
			});

			return widgets;
		},

		/**
		 * Destroy the widget instance by calling the destroy function and by
		 * removing the data form the DOM node
		 * @param  {HTMLElement} selector	The DOM node of the widget
		 * @param  {string} widget			The widget you want to destroy
		 */
		destroyWidget =  function(selector, widget)
		{
			var widgetInstance = getWidgetBySelector(selector, widget);

			if(!widgetInstance)
			{
				return;
			}

			if(typeof widgetInstance.destroy === 'function')
			{
				widgetInstance.destroy();
			}

			$.removeData(selector[0], widget);
		},

		/**
		 * Dispose of widgets in context
		 * @param  {HTMLElement} context The context in which to search for DOM nodes
		 */
		destroyWidgetsInContext = function(context, widgetName)
		{
			var widgetsFound;

			context = context || $(document.body);

			if(widgetName)
			{
				widgetsFound = context.find('[data-'+ dataAttributeToScanFor +'="'+ widgetName +'"]');
			}
			else
			{
				widgetsFound = context.find('[data-'+ dataAttributeToScanFor + ']');
			}

			widgetsFound.each(function()
			{
				var disposeData = $(this).data('widget').split(';'),
					element = $(this);

				$.each(disposeData, function()
				{
					destroyWidget(element, this);
				});
			});
		};

		return {
			scan: scan,
			getWidgetBySelector: getWidgetBySelector,
			getWidgetsInContext: getWidgetsInContext,
			destroyWidgetsInContext: destroyWidgetsInContext,
			destroyWidget: destroyWidget
		};
	};

}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));