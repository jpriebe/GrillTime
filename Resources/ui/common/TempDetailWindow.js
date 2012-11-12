var TU = require ('/TitanUp/TitanUp');
var BackgroundManager = require ('/ui/common/BackgroundManager');

function TempDetailWindow (detail)
{
	var _detail = detail;
	var _self = null;
	var _tv_menu = null;
	var _iv_bg = null;
	
	_self = Ti.UI.createWindow ({
		title: detail.label
	});
	
	_iv_bg = BackgroundManager.getBackgroundIV ();
	_self.add (_iv_bg);
	
	var onOrientationChange = function(e) {
		_self.remove (_iv_bg);
		_iv_bg = BackgroundManager.getBackgroundIV ();
		_self.add (_iv_bg);
	};
	
	Ti.Gesture.addEventListener('orientationchange', onOrientationChange);

	_self.addEventListener ('close', function (e) {
		Ti.Gesture.removeEventListener ('orientationchange', onOrientationChange);
	});
	
	var v = Ti.UI.createView ({
		top: 0,
		bottom: 0,
		left: 0, 
		right: 0,
		backgroundColor: '#000',
		opacity: 0.6,
		zIndex: 100		
	});
	_self.add (v);
		
    var margin = TU.UI.Sizer.getDimension (10);
    var rowh = TU.UI.Sizer.getDimension (50);

    _tv_menu = Ti.UI.createTableView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        borderRadius: margin,
        borderColor: TU.UI.Theme.textColor,
        separatorColor: TU.UI.Theme.textColor, 
        backgroundColor: 'transparent',
        zIndex: 200
    });
    
    var rows = [];
    
    for (var i = 0; i < detail.length; i++)
    {
    	var r = Ti.UI.createTableViewRow ({
    		height: rowh,
    		selectedBackgroundColor: TU.UI.Theme.highlightColor,
    		color: TU.UI.Theme.textColor,
     		font: TU.UI.Theme.fonts.mediumBold
    	});
    	
    	var l1 = Ti.UI.createLabel ({
    		text: detail[i].label,
    		width: "70%",
    		left: margin,
    		color: TU.UI.Theme.textColor,
     		font: TU.UI.Theme.fonts.mediumBold
    	});
    	r.add (l1);
    	 
    	var l2 = Ti.UI.createLabel ({
    		text: detail[i].values.usda,
    		width: "20%",
    		right: margin,
    		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT,
    		color: TU.UI.Theme.textColor,
     		font: TU.UI.Theme.fonts.mediumBold
    	});
    	r.add (l2);

    	rows.push (r);
    }    
    
	_tv_menu.setData (rows);
	
	_self.add (_tv_menu);    
	
	return _self;
}

module.exports = TempDetailWindow;
