/*
 * A tabbed application, consisting of multiple stacks of windows associated with tabs in a tab group.  
 * A starting point for tab-based application with multiple top-level windows. 
 * Requires Titanium Mobile SDK 1.8.0+.
 * 
 * In app.js, we generally take care of a few things:
 * - Bootstrap the application with any data we need
 * - Check for dependencies like device type, platform version or network connection
 * - Require and open our top-level UI component
 *  
 */

//bootstrap and check dependencies
if (Ti.version < 1.8 ) {
	alert('Sorry - this application template requires Titanium Mobile SDK 1.8 or later');
}

var TU = require ('/TitanUp/TitanUp');

// This is a single context application with mutliple windows in a stack
(function() {

    TU.UI.Theme.backgroundColor = '#72A697';
    TU.UI.Theme.lightBackgroundColor = '#D9B88F';
    TU.UI.Theme.darkBackgroundColor = '#606C70';
    TU.UI.Theme.highlightColor = '#A64521';
    TU.UI.Theme.textColor = '#20272A';
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup().open();
})();
