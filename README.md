## JavaScript Class Instantiator
This piece of code makes it easier to instantiate classes and should make keeping state of classes and DOM events / interactiosn worry free.

## The basics
It instantiates classes by scanning DOM nodes that have the `data-widget` tag.
It binds the instance of the class to the DOM node and uses the singleton principle.
Because the instance has been bound to the DOM node you just have to query the node to gain access to the public functions of the class.

The instantiator is not really meant for classes that are loaded only once and are not connected to the DOM.

## Adding options to specific class instances

## How to use

## Dependencies
jQuery