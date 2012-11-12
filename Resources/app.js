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

    TU.UI.Theme.backgroundColor = '#333333';
    TU.UI.Theme.lightBackgroundColor = '#666666';
    TU.UI.Theme.darkBackgroundColor = '#000000';
    TU.UI.Theme.highlightColor = '#fe690b';
    TU.UI.Theme.textColor = '#ffffff';
    
	if (TU.Device.getOS () == 'ios')
	{
		var fontname = "Bitter";
		TU.UI.Theme.fonts = {
			small: { fontSize: 12, fontFamily: 'Bitter' },
			medium: { fontSize: 16, fontFamily: 'Bitter' },
			large: { fontSize: 24, fontFamily: 'Bitter' },
			smallBold: { fontSize: 12, fontWeight: 'bold', fontFamily: 'Bitter' },
			mediumBold: { fontSize: 16, fontWeight: 'bold', fontFamily: 'Bitter' },
			largeBold: { fontSize: 24, fontWeight: 'bold', fontFamily: 'Bitter' },
		};		
	}
	else
	{
		TU.UI.Theme.fonts = {
			small: { fontSize: '12dp', fontFamily: 'Bitter-Regular' },
			medium: { fontSize: '16dp', fontFamily: 'Bitter-Regular' },
			large: { fontSize: '24dp', fontFamily: 'Bitter-Regular' },
			smallBold: { fontSize: '12dp', fontWeight: 'bold', fontFamily: 'Bitter-Bold' },
			mediumBold: { fontSize: '16dp', fontWeight: 'bold', fontFamily: 'Bitter-Bold' },
			largeBold: { fontSize: '24dp', fontWeight: 'bold', fontFamily: 'Bitter-Bold' },
		};
	}
	
	var ApplicationTabGroup = require('ui/common/ApplicationTabGroup');
	new ApplicationTabGroup().open();
})();
