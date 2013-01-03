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
	 */
	ns.ClassInstantiator = function()
	{
		/**
		 * Scan for elements that contain data-widget and instantiate the widget that is associated to the element.
		 * @param  {HTMLElement} context The context in which to search for DOM nodes
		 */
		var scan = function(context)
		{
			context = context || $(document.body);

			context.find('[data-widget]').each(function(index, element)
			{
				instantiate(element, $(element).data('widget'));
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
				options, existingWidget, instance;

			if(!widgetName || typeof InstanceName === 'string' || typeof InstanceName !== 'function')
			{
				return false;
			}

			options = $(element).data('options') || {};
			existingWidget = $.data(element, widgetName);
			instance = existingWidget || $.data(element, widgetName, new InstanceName(element, options));

			if(typeof instance.destroy !== 'function')
			{
				throw(instance.widget + ' does not have a destroy function');
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
			var parts = widgetName.split('.');

			switch(parts.length)
			{
				case 1: return ns[ parts[0] ];
				case 2: return ns[ parts[0] ] [ parts[1] ];
				case 3: return ns[ parts[0] ] [ parts[1] ] [ parts[2] ];
				case 4: return ns[ parts[0] ] [ parts[1] ] [ parts[2] ] [ parts[3] ];

				default:
					throw('Cannot convert into a constructor');
			}
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
		 * Get all widgets inside a context
		 * @param  {HTMLElement} context    The html DOM node to search within
		 * @param  {string} widgetName		The widget you are looking for
		 * @return {array}					Returns an array of widget instances
		 */
		getWidgetsInContext = function(context, widgetName)
		{
			var widgets = [];
			context = context || $(document.body);

			context.find('[data-widget="'+ widgetName +'"]').each(function()
			{
				widgets.push(getWidgetBySelector($(this), widgetName));
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
		};

		return {
			scan: scan,
			getWidgetBySelector: getWidgetBySelector,
			getWidgetsInContext: getWidgetsInContext,
			destroyWidget: destroyWidget
		};
	};

}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));