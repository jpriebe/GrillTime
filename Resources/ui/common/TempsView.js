var TU = require ('/TitanUp/TitanUp');

function TempsView ()
{
	var _self = null;
	var _tv_menu = null;
	var _iv_bg = null;
	
	_self = Ti.UI.createView ({
	    top: 0,
	    left: 0,
	    right: 0,
	    bottom: 0
	});
	
    var margin = 10;
    var rowh = 50;

    _tv_menu = Ti.UI.createTableView ({
        top: margin,
        left: margin,
        right: margin,
        bottom: margin,
        separatorColor: 'transparent',
        backgroundColor: 'transparent',
        zIndex: 200        
    });
    
    var rows = []; 
    
    var temps = require ('/data/SafeTemps').temps;
    for (var i = 0; i < temps.length; i++)
    {
    	var r = Ti.UI.createTableViewRow ({ 
    		title: temps[i].label,
    		height: rowh,
    		color: TU.UI.Theme.textColor,
    		selectedBackgroundColor: TU.UI.Theme.highlightColor,
    		font: TU.UI.Theme.fonts.mediumBold
    	});
    	r.data = temps[i];
    	
    	rows.push (r);
    }    
    
	_tv_menu.setData (rows);
	
	_tv_menu.addEventListener ('click', function (e) {
		var TempDetailWindow = require ('/ui/common/TempDetailWindow');
		var win = new TempDetailWindow (e.source.data);
		TU.UI.openWindow (win);
	});
	
	_self.add (_tv_menu);    
	
	return _self;
}

module.exports = TempsView;
