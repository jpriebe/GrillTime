var TU = require ('/TitanUp/TitanUp');
var BackgroundManager = require ('/ui/common/BackgroundManager');

function TempDetailWindow (detail)
{
	var _detail = detail;
	var _self = null;
	var _tv_menu = null;
	var _iv_bg = null;
	var _btn_options = null;
	var _dlg_options = null;
	
    var margin = TU.UI.Sizer.getDimension (10);
    var rowh = TU.UI.Sizer.getDimension (50);	
	var btnw = TU.UI.Sizer.getDimensionExact (30, 30, 60, 60);
	var btnh = TU.UI.Sizer.getDimensionExact (30, 30, 60, 60);	
	
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
	
    _tv_menu = Ti.UI.createTableView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: 2 * margin + btnh,
        borderRadius: margin,
        borderColor: TU.UI.Theme.textColor,
        separatorColor: TU.UI.Theme.textColor, 
        backgroundColor: 'transparent',
        zIndex: 200
    });
    
    function load_data () {
	    var rows = [];
	    
	    var idx = Ti.App.Properties.getInt ('option_temps_source', 0);
	    
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
	    	
	    	var temp = (idx == 0)
	    		? detail[i].values.usda
	    		: detail[i].values.chef;
	    	 
	    	var l2 = Ti.UI.createLabel ({
	    		text: temp,
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
    }

	load_data ();
	
	_self.add (_tv_menu);
	
	var opts = {
		options: [L('USDA_Temps'), L('Chefs_Temps')],
		title: L('Temp_Source')
	};
	
	if (TU.Device.getOS() == 'android') {
		var idx = Ti.App.Properties.getInt ('option_temps_source', 0);
		opts.selectedIndex = idx;
	}
	
	_dlg_options = Ti.UI.createOptionDialog(opts);
	
	_dlg_options.addEventListener('click',function(e)
	{
		Ti.App.Properties.setInt ('option_temps_source', e.index);
		load_data ();
	});
	
	
	_btn_options = Titanium.UI.createButton({
		height: btnh,
		width: btnw,
		bottom: margin,
		right: margin,
		backgroundImage: '/images/gear.png',
		zIndex: 200
	});
	
	_btn_options.addEventListener('click', function()
	{
		_dlg_options.show();
	});	
	
	_self.add (_btn_options);
	
	return _self;
}

module.exports = TempDetailWindow;
