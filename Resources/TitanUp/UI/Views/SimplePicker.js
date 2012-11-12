var TU = null;

/**
 * A class that makes a simple cross-platform picker.  On Android, it is a standard drop-down.
 * On iOS, it is a button that brings up a popup picker.
 * 
 * Fires event: 'TUchange' (note, not 'change' like the standard picker); event object contains
 * a single property, 'value'
 * 
 * Note that you need to call addToViews() to add the picker button and the popup to views;
 * the popup must be added to a view that uses absolute layout.
 */

function PickerPopup (title, values)
{
	var _self = Ti.UI.createWindow ({title: title});
	var _values = values;
	var _value = '';
	
	var _picker = null;
	var _btn_cancel = null;
	var _btn_done = null;
	var _toolbar = null;
	var _a_slide_in;
	var _a_slide_out;

	_a_slide_in =  Titanium.UI.createAnimation ({ bottom: 0 });
	_a_slide_out =  Titanium.UI.createAnimation ({ bottom: -251 });
	
	_self = Titanium.UI.createView({
		left: 0,
		right: 0,
		height: 251,
		bottom: -251,
		zIndex: 100
	});
 
	_btn_cancel =  Titanium.UI.createButton({
		title: 'Cancel',
		style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED
	});
 
	_btn_done =  Titanium.UI.createButton({
		title: 'Done',
		style: Titanium.UI.iPhone.SystemButtonStyle.DONE
	});
 
	var spacer =  Titanium.UI.createButton({
		systemButton: Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
	});
 
	_toolbar =  Titanium.UI.createToolbar({
		top: 0,
		items: [_btn_cancel, spacer, _btn_done]
	});
 
	_picker = Titanium.UI.createPicker({
		top: 43,
		left: 0,
		right: 0,
		selectionIndicator: true
	});
	_picker.selectionIndicator=true;
 
	var data = [];
	for (var i = 0; i < _values.length; i++)
	{
		data.push (Ti.UI.createPickerRow({title: _values[i]}));
	}	

	_picker.add (data);
	
	_self.add (_toolbar);
	_self.add (_picker);
	
	_btn_done.addEventListener('click', function (e) {
		var val = _picker.getSelectedRow (0);
		_value = val.title;
		_self.fireEvent ('done', { value: _value });
		
		_self.slideOut ();
	});
	
	_btn_cancel.addEventListener('click', function (e) {
		_self.slideOut ();
	});
	
	_self.slideIn = function ()
	{
		for (var i = 0; i < _values.length; i++)
		{
			if (_values[i] == _value)
			{
				_picker.setSelectedRow (0, i, false);
				break;
			}
		}
		_self.animate (_a_slide_in);
	}

	_self.slideOut = function ()
	{
		_self.animate (_a_slide_out);
	}
	
	_self.xsetValue = function (value)
	{
		_value = value;
	}
	
	return _self;
}


function SimplePicker (params)
{
	var _self = null;
	var _values = [];
	var _value = "";
	var _data = [];
	var _title = '';
	var _ppopup = null;
	
	var _label = null;
	var _btn_disclosure = null;
	
	var newparams = {};
	
	for (var k in params)
	{
		if (k == 'values')
		{
			_values = params[k];
			continue;
		}
		if (k == 'title')
		{
			_title = params[k];
			continue;
		}
		
		newparams[k] = params[k];
	}
	
	if (_values.length > 0)
	{
		_value = _values[0];
	}

	for (var i = 0; i < _values.length; i++)
	{
		_data.push (Ti.UI.createPickerRow({title: _values[i]}));
	}	

	if (TU.Device.getOS () == 'android')
	{
		if (typeof newparams.backgroundColor != "undefined")
		{
			// don't set a background color on android; that will remove the "control look" of
			// the picker...
			delete newparams.backgroundColor;
		}
		Ti.API.debug ('[SimplePicker] newparams: ' + JSON.stringify (newparams));
		
		_self = Ti.UI.createPicker (newparams);
		_self.addEventListener ('change', function (e) {
			_value = e.selectedValue[0];
			_self.fireEvent ('TUchange', { value: _value })
		});
		_self.add (_data);
	}
	else
	{
		newparams.height = 35;
		newparams.borderColor = '#9e9e9f';
		newparams.borderRadius = 5;
		newparams.backgroundColor = '#fff';
	
		_self = Ti.UI.createView (newparams);
		
		_label = Ti.UI.createLabel ({
			left: 10,
			top: 8,
			color: '#385487',
			font: { fontSize: 16, fontWeight: 'bold' },
			text: _value
		});
		
		var tr = Titanium.UI.create2DMatrix();
		tr = tr.rotate(90);
		_btn_disclosure = Ti.UI.createButton ({
			top: 2,
			right: 5,
			style: Ti.UI.iPhone.SystemButton.DISCLOSURE,
			transform: tr
		});
		
		_self.add (_label);
		_self.add (_btn_disclosure);
		
		_ppopup = new PickerPopup (_title, _values);
		_ppopup.addEventListener ('done', function (e) {
			if (e.value == _value)
			{
				return;
			}

			_value = e.value;
			_label.text = _value;
			
			_self.fireEvent ('TUchange', e);
		});
				
		_self.addEventListener ('click', function (e) {

			_ppopup.xsetValue (_value);
			_ppopup.slideIn ();
		});
	}
	
	
	_self.addToViews = function (v1, v2)
	{
		v1.add (_self);
		if (_ppopup)
		{
			v2.add (_ppopup);
		}
	}
	
	_self.xgetValue = function ()
	{
		return _value;
	};
	
	
	_self.xsetValue = function (value)
	{
		for (var i = 0; i < _values.length; i++)
		{
			if (_values[i] == value)
			{
				_value = value;
				if (TU.Device.getOS () == 'android')
				{
					_self.setSelectedRow (0, i, false);
				}
				else
				{
					_label.text = _value;
				}
			}
		}
	};
	
	return _self;
}


SimplePicker.TUInit = function (tu)
{
	TU = tu;
};


module.exports = SimplePicker;
