var TU = require ('/TitanUp/TitanUp');

function TempsWindow ()
{
	var _self = null;
	var _tv_menu = null;
	
	_self = Ti.UI.createWindow ({
		title: L('Temps'),
		backgroundColor: TU.UI.Theme.backgroundColor
	});
	
	
    var margin = TU.UI.Sizer.getDimension (10);
    var rowh = TU.UI.Sizer.getDimension (40);

    _tv_menu = Ti.UI.createTableView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        borderRadius: margin,
        borderColor: TU.UI.Theme.textColor,
        backgroundColor: TU.UI.Theme.lightBackgroundColor
    });
    
    var rows = [];
    
    var temps = require ('/data/SafeTemps').temps;
    for (var i = 0; i < temps.length; i++)
    {
    	var r = Ti.UI.createTableViewRow ({ 
    		title: temps[i].label,
    		height: rowh,
    		color: TU.UI.Theme.textColor,
    		backgroundColor: TU.UI.Theme.lightBackgroundColor,
    		selectedBackgroundColor: TU.UI.Theme.highlightColor
    	});
    	r.data = temps[i].temps;
    	
    	rows.push (r);
    }    
    
	_tv_menu.setData (rows);
	
	_tv_menu.addEventListener ('click', function (e) {
		var TempDetailWindow = require ('/ui/common/TempDetailWindow');
		var win = new TempDetailWindow (e.source.data);
		TU.UI.TGWM.openWindow (win);
	});
	
	_self.add (_tv_menu);    
	
	return _self;
}

module.exports = TempsWindow;
