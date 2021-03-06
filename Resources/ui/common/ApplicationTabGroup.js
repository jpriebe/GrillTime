var TU = require ("/TitanUp/TitanUp");

function ApplicationTabGroup() {
	var _self = TU.UI.createTGWM ();
		
	var TimerWindow = require ('/ui/common/TimerWindow');
	var win1 = new TimerWindow();
	
	var tab1 = Ti.UI.createTab({
		title: L('Timer'),
		icon: '/images/stopwatch.png',
		window: win1
	});
	
	_self.addTab(tab1);
	
	var TempsWindow = require ('/ui/common/TempsWindow');
	var win2 = new TempsWindow ();
	
	var tab2 = Ti.UI.createTab({
		title: L('Temps'),
		icon: '/images/thermometer.png',
		window: win2
	});
	
	_self.addTab(tab2);

	return _self;
};

module.exports = ApplicationTabGroup;
