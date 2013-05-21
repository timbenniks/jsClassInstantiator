(function ($, ns)
{
	'use strict';

	ns.Tooltip = function (el, options)
	{
		var element = $(el),
			title = options.title,

		init = function ()
		{
			element.on('mouseenter.tooltip', handleTooltip);
		},

		handleTooltip = function () {},

		destroy = function()
		{
			element.off('mouseenter.tooltip');
		};

		init();

		return {
			node: element[0],
			widget: 'Tooltip',
			options: options,
			destroy: destroy
		};
	};

}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));

(function ($, ns)
{
	'use strict';

	ns.OtherWidget = function (el, options)
	{
		var element = $(el),
			option = options.option,

		init = function () {},

		destroy = function()
		{
			return true;
		};

		init();

		return {
			node: element[0],
			widget: 'OtherWidget',
			options: options,
			destroy: destroy
		};
	};

}(jQuery, window.NAMESPACE = window.NAMESPACE || {}));

NAMESPACE.Scanner = new NAMESPACE.ClassInstantiator('widget');

module('ClassInstantiator helpers');

test('getNode', function()
{
	var node = NAMESPACE.Scanner.getNode(document.getElementById('qunit-fixture'), '[data-widget]');

	ok(node[0].tagName === 'EM', 'ClassInstantiator found <em> as the element which contains de data-widget attribute');
});

test('getDataAttr', function()
{
	var attrStr = NAMESPACE.Scanner.getDataAttr(document.getElementsByTagName('em')[0], 'widget');

	ok(attrStr === 'Tooltip;OtherWidget', 'ClassInstantiator found "Tooltip;OtherWidget" as the value of data-widget on <em>');
});

test('cleanUpInstanceName', function()
{
	var tooltipInstanceName = NAMESPACE.Scanner.cleanUpInstanceName('Tooltip'),
		otherWidgetInstanceName = NAMESPACE.Scanner.cleanUpInstanceName('OtherWidget');

	ok(typeof tooltipInstanceName === 'function', 'NAMESPACE.Tooltip function was returned from string "Tooltip"');
	ok(typeof otherWidgetInstanceName === 'function', 'NAMESPACE.Tooltip function was returned from string "OtherWidget"');
});

test('set/get/remove Widget from dictionary', function()
{
	var node = document.createElement('div'),
		widgetName = 'mightyWidget',
		instance = {widget: 'mightyWidget'};

	NAMESPACE.Scanner.setWidgetInDict(node, widgetName, instance);

	ok(NAMESPACE.Scanner.getWidgetFromDict(node, widgetName).widget === 'mightyWidget', 'The widget "mightyWidget" was returned by "getWidgetFromDict"');

	NAMESPACE.Scanner.removeWidgetFromDict(node, widgetName);

	ok(typeof NAMESPACE.Scanner.getWidgetFromDict(node, widgetName) === 'undefined', 'After "removeWidgetFromDict" the "getWidgetFromDict" for "mightyWidget" returns undefined');

});

module('ClassInstantiator core');

test('findWidgets', function()
{
	var findWidgetsResult = NAMESPACE.Scanner.findWidgets(document.getElementById('qunit-fixture'));

	ok(findWidgetsResult[0].widget === document.getElementsByTagName('em')[0], 'ClassInstantiator findWidgets function found "<em>" to be the element in the search result');
	ok(findWidgetsResult[0].widgetToInstantiate === 'Tooltip', 'ClassInstantiator findWidgets function found "Tooltip" to be the widget to instantiate in the search result');
});

test('instantiate', function()
{
	var findWidgetsResult = NAMESPACE.Scanner.findWidgets(document.getElementById('qunit-fixture')),
		instance = NAMESPACE.Scanner.instantiate(findWidgetsResult[0].widget, findWidgetsResult[0].widgetToInstantiate);

	ok(instance.widget === 'Tooltip', 'Instantiate returned the instance of the widget');
	ok(instance.options.title === 'I am a tooltip!', 'The widget instance returned the options object');
	ok(typeof instance.destroy === 'function', 'The widget instance has a destroy function');
});

test('scan', function()
{
	NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	var tooltipInstance = NAMESPACE.Scanner.getWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	ok(typeof tooltipInstance === 'object', 'ClassInstantiator found the "Tooltip" instance on the <em> node');
	ok(typeof destroyedTooltipInstance === 'undefined', 'The Tooltip instance was destroyed as it returns undefined when searching for it.');
});

test('getWidgetBySelector', function()
{
	NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	var tooltipInstance = NAMESPACE.Scanner.getWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	ok(typeof tooltipInstance === 'object', 'ClassInstantiator found the "Tooltip" instance on the <em> node');
	ok(tooltipInstance.widget === 'Tooltip', 'Instantiate returned the instance of the widget');
	ok(tooltipInstance.options.title === 'I am a tooltip!', 'The widget instance returned the options object');
	ok(typeof tooltipInstance.destroy === 'function', 'The widget instance has a destroy function');
});

test('destroyWidgetBySelector', function()
{
	NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	var tooltipInstance = NAMESPACE.Scanner.getWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	NAMESPACE.Scanner.destroyWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	var destroyedTooltipInstance = NAMESPACE.Scanner.getWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	ok(typeof tooltipInstance === 'object', 'ClassInstantiator found the "Tooltip" instance on the <em> node');
	ok(typeof destroyedTooltipInstance === 'undefined', 'The Tooltip instance was destroyed as it returns undefined when searching for it.');
});

test('getWidgetsInContext', function()
{
	NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	var allWidgetsInContext = NAMESPACE.Scanner.getWidgetsInContext(document.getElementById('qunit-fixture')),
		tooltipInContext = NAMESPACE.Scanner.getWidgetsInContext(document.getElementById('qunit-fixture'), 'Tooltip');

	ok(typeof allWidgetsInContext === 'object', 'getWidgetsInContext found an object for allWidgetsInContext');
	ok(allWidgetsInContext.length === 2, 'getWidgetsInContext found an object for allWidgetsInContext and its length is 2');
	ok(allWidgetsInContext[0].widget === 'Tooltip', 'getWidgetsInContext found an object and teh first widget is Tooltip');
	ok(allWidgetsInContext[1].widget === 'OtherWidget', 'getWidgetsInContext found an object and the first widget is OtherWidget');

	ok(typeof tooltipInContext === 'object', 'getWidgetsInContext found an object for tooltipInContext');
	ok(tooltipInContext.length === 1, 'getWidgetsInContext found an object for tooltipInContext and its length is 1');
	ok(tooltipInContext[0].widget === 'Tooltip', 'getWidgetsInContext found an object for tooltipInContext and the widget is Tooltip');
});

test('destroyWidgetsInContext', function()
{
	NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	var tooltipInstance = NAMESPACE.Scanner.getWidgetsInContext(document.getElementById('qunit-fixture'));

	NAMESPACE.Scanner.destroyWidgetsInContext(document.getElementById('qunit-fixture'));

	var destroyedTooltipInstance = NAMESPACE.Scanner.getWidgetBySelector(document.getElementsByTagName('em')[0], 'Tooltip');

	ok(typeof tooltipInstance === 'object', 'ClassInstantiator found the "Tooltip" instance in the <qunit-fixture> context');
	ok(typeof destroyedTooltipInstance === 'undefined', 'The Tooltip instance was destroyed as it returns undefined when searching for it.');
});