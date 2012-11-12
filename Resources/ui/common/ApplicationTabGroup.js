var TU = require ("/TitanUp/TitanUp");

function ApplicationTabGroup() {
	var _self = TU.UI.TGWM.createTabGroup ();
		
	var TempsWindow = require ('/ui/common/TempsWindow');
	var win1 = new TempsWindow ();
	
	var tab1 = Ti.UI.createTab({
		title: L('Temps'),
		icon: '/images/KS_nav_ui.png',
		window: win1
	});
	
	_self.addTab(tab1);
	
	return _self;
};

module.exports = ApplicationTabGroup;
