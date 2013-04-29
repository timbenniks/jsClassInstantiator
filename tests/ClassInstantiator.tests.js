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

		handleTooltip = function ()
		{
			console.log('[Tooltip]: ', title);
		},

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

		init = function ()
		{
			console.log('[OtherWidget]: ', option);
		},

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

// scan
// getWidgetBySelector
// getWidgetsInContext
// destroyWidgetsInContext
// destroyWidget
// cleanUpInstanceName


NAMESPACE.Scanner = new NAMESPACE.ClassInstantiator('widget');

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

test('scan', function()
{
	var scanResult = NAMESPACE.Scanner.scan(document.getElementById('qunit-fixture'));

	ok(1 === 1, 'true');
});