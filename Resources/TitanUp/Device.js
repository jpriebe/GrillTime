var _os = 'unknown';
var _displayWidth = 0;
var _displayHeight = 0;
var _workingWidth = 0;
var _workingHeight = 0;
var _density = '';
var _dpi = 0;
var _isTablet = false;
var _physicalWidth = 0;
var _physicalHeight = 0;
var _screensize = 0;

function Device () 
{
}

function initialize ()
{
    if (Ti.Platform.name === 'iPhone OS')
    {
        _os = 'ios';
    }
    else if (Ti.Platform.name === "android")
    {
        _os = 'android';
    }
    
    var dc = Ti.Platform.displayCaps;
	
	_displayWidth = dc.platformWidth;
	_displayHeight = dc.platformHeight;
	_density = dc.density;
	_dpi = dc.dpi;
	
	_physicalWidth = _displayWidth / _dpi;
	_physicalHeight = _displayHeight / _dpi;
	_screensize = Math.sqrt (_physicalWidth * _physicalWidth + _physicalHeight * _physicalHeight);
	
	var osname = Ti.Platform.osname;
	_isTablet = (osname === 'ipad') 
		|| ((osname === 'android') && (_screensize >= 6.25));
		
	Ti.API.debug ('[TU.Device] physicalWidth: ' + _physicalWidth);
	Ti.API.debug ('[TU.Device] physicalHeight: ' + _physicalHeight);
	Ti.API.debug ('[TU.Device] screensize: ' + _screensize);
	Ti.API.debug ('[TU.Device] isTablet: ' + (_isTablet) ? 'true' : 'false');
	
	_workingWidth = _displayWidth;
	_workingHeight = _displayHeight;
}


/**
 * Gets the OS string (either 'ios' or 'android')
 * @return string
 */
Device.getOS = function ()
{
	return _os;
};

/**
 * Gets the display width in native units
 * @return int
 */
Device.getDisplayWidth = function ()
{
	return _displayWidth;
};

/**
 * Gets the display height in native units
 * @return int
 */
Device.getDisplayHeight = function ()
{
	return _displayHeight;
};

/**
 * Gets the screen density ('low', 'medium', 'high', or 'xhigh')
 * @return string
 */
Device.getDensity = function ()
{
	return _density;
};

/**
 * Gets the device DPI
 * @return int
 */
Device.getDpi = function ()
{
	return _dpi;
};

/**
 * True if the device is a tablet (either an ipad or an android of screen size > 6.25 inches)
 * @return bool
 */
Device.getIsTablet = function ()
{
	return _isTablet;
};

/**
 * Gets the physical width of the screen in inches
 * @return float
 */
Device.getPhysicalWidth = function ()
{
	return _physicalWidth;
};

/**
 * Gets the physical height of the screen in inches
 * @return float
 */
Device.getPhysicalHeight = function ()
{
	return _physicalHeight;
};

/**
 * Gets the diagonal screensize in inches
 * @return float
 */
Device.getScreensize = function ()
{
	return _screensize;
};

/**
 * Gets the actual working width of the application in native units, minus navbars and tabs;
 * note that this library does not actually compute this working width and height; you must
 * capture it from within a postlayout event on your application's first window, and then call
 * setWorkingDimensions() to save the width and height for future reference.
 * @return int
 */
Device.getWorkingWidth = function ()
{
	return _workingWidth;
};

/**
 * Gets the actual working height of the application in native units, minus navbars and tabs;
 * note that this library does not actually compute this working width and height; you must
 * capture it from within a postlayout event on your application's first window, and then call
 * setWorkingDimensions() to save the width and height for future reference.
 * @return int
 */
Device.getWorkingHeight = function ()
{
	return _workingHeight;
};

/**
 * Set the working area of the application in native units; call this from within a postlayout
 * event listener in your application's first window.
 * @param int workingWidth
 * @param int workingHeight
 */
Device.setWorkingDimensions = function (workingWidth, workingHeight)
{
	_workingWidth = workingWidth;
	_workingHeight = workingHeight;
}

initialize ();

module.exports = Device;