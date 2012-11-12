var TU = require ('/TitanUp/TitanUp');

function TempDetailWindow (detail)
{
	var _detail = detail;
	var _self = null;
	var _tv_menu = null;
	
	_self = Ti.UI.createWindow ({
		title: detail.label,
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
    
    for (var i = 0; i < detail.length; i++)
    {
    	var r = Ti.UI.createTableViewRow ({
    		height: rowh,
    		color: TU.UI.Theme.textColor,
    		backgroundColor: TU.UI.Theme.lightBackgroundColor,
    		selectedBackgroundColor: TU.UI.Theme.highlightColor
    	});
    	
    	var l1 = Ti.UI.createLabel ({
    		text: detail[i].label,
    		width: "70%",
    		left: margin
    	});
    	r.add (l1);
    	 
    	var l2 = Ti.UI.createLabel ({
    		text: detail[i].values.usda,
    		width: "20%",
    		right: margin,
    		textAlign: Ti.UI.TEXT_ALIGNMENT_RIGHT
    	});
    	r.add (l2);

    	rows.push (r);
    }    
    
	_tv_menu.setData (rows);
	
	_self.add (_tv_menu);    
	
	return _self;
}

module.exports = TempDetailWindow;
