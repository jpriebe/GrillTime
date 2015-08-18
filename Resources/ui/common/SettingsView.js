var TU = require ('/TitanUp/TitanUp');

var _margin = 16;

function SettingsView (params)
{
    var _self = null;
    var _sv = null;
    var _content_view = null;
    
    if (typeof params === 'undefined')
    {
        params = {};
    }
    

    params.backgroundColor = TU.UI.Theme.darkBackgroundColor;
    //params.layout = 'composite';

    _self = Ti.UI.createView (params);

    _sv = Ti.UI.createScrollView({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    });

    _content_view = Ti.UI.createView ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: Ti.UI.SIZE,
        layout: 'vertical'
    });

    var v, l, p, vals, validx;

    //v = create_section_header('General');
    //_content_view.add (v);

    v = Ti.UI.createView ({
        height: 48,
        top: _margin,
        left: _margin,
        right: _margin,
        layout: 'horizontal'
    });

    l = Ti.UI.createLabel ({
        font: TU.UI.Theme.fonts.medium,
        color: TU.UI.Theme.lightTextColor,
        left: 0,
        text: L("Temps"),
        width: Ti.UI.SIZE,
        height: Ti.UI.FILL
    });

    v.add (l);

    vals = [L('USDA_Temps'), L('Chefs_Temps')];
    validx = Ti.App.Properties.getInt ('option_temps_source', 0);
    
    p = TU.UI.createSimplePicker ({
        left: _margin,
        width: Ti.UI.FILL,
        height: 48,
        values: vals,
        value: vals[validx],
        parent: _self,
        backgroundColor: TU.UI.Theme.darkBackgroundColor,
        color: TU.UI.Theme.lightTextColor
    });

    p.addEventListener ('change', function (e) {
        Ti.App.Properties.setInt ('option_temps_source', e.index);
    });

    v.add (p);

    _content_view.add (v);
    
    //v = create_section_header('General');
    //_content_view.add (v);

    v = Ti.UI.createView ({
        height: 48,
        top: _margin,
        left: _margin,
        right: _margin,
        layout: 'horizontal'
    });

    l = Ti.UI.createLabel ({
        font: TU.UI.Theme.fonts.medium,
        color: TU.UI.Theme.lightTextColor,
        left: 0,
        text: L("Alarm"),
        width: Ti.UI.SIZE,
        height: Ti.UI.FILL
    });

    v.add (l);

    vals = [L('Alarm1'), L('Alarm2'), L('Alarm3'), L('Alarm4'), L('Alarm5')];
    validx = Ti.App.Properties.getInt ('option_alarm_sound', 0);
    
    p = TU.UI.createSimplePicker ({
        left: _margin,
        width: Ti.UI.FILL,
        height: 48,
        values: vals,
        value: vals[validx],
        parent: _self,
        backgroundColor: TU.UI.Theme.darkBackgroundColor,
        color: TU.UI.Theme.lightTextColor
    });

    p.addEventListener ('change', function (e) {
        var sound_idx = e.index + 1;
        
        var sp = Ti.Media.createSound({url:"/sounds/alarm" + sound_idx + ".mp3"});
        sp.play ();

        Ti.App.Properties.setInt ('option_alarm_sound', e.index);
    });

    v.add (p);

    _content_view.add (v);

    _sv.add (_content_view);

    _self.add (_sv);

    return _self;

    function create_switch (label, id ,value)
    {
        var margin2 = parseInt (_margin / 2);

        var v = Ti.UI.createView ({
            height: 48,
            top: margin2,
            left: margin2,
            right: margin2
        });

        var l = Ti.UI.createLabel ({
            font: TU.UI.Theme.fonts.medium,
            color: TU.UI.Theme.darkTextColor,
            left: margin2,
            right: 50,
            text: label
        });

        var switchparams = {
            right: margin2,
            value: value
        };

        if (TU.Device.getOS() == 'android')
        {
            switchparams.style = Titanium.UI.Android.SWITCH_STYLE_CHECKBOX;
        }

        var s = Ti.UI.createSwitch (switchparams);

        v.add (l);
        v.add (s);
        
        v.getSwitch = function () { return s; };
        v.getSwitchId = function() { return id; };

        v.addEventListener ('touchstart', function (e) {
            v.setBackgroundColor (_highlightColor);
        });
        v.addEventListener ('touchend', function (e) {
            v.setBackgroundColor (TU.UI.Theme.lightBackgroundColor);
        });
        v.addEventListener ('touchcancel', function (e) {
            v.setBackgroundColor (TU.UI.Theme.lightBackgroundColor);
        });

        v.addEventListener ('click', function (e) {
            s.setValue (!s.getValue ());
        });

        s.addEventListener ('click', function (e) {
            e.cancelBubble = true;
        });

        s.addEventListener ('change', function (e) {
            v.fireEvent (e.type, { 'switch_id': id, 'value': e.value });
            e.cancelBubble = true;
        });

        return v;
    }

    function create_section_header (caption)
    {
        var v = Ti.UI.createView ({
            backgroundColor: TU.UI.Theme.mediumBackgroundColor,
            height: 32,
            top: 16,
            left: 16,
            right: 16
        });

        var l = Ti.UI.createLabel ({
            color: TU.UI.Theme.darkTextColor,
            font: TU.UI.Theme.fonts.mediumBold,
            text:  caption.toUpperCase ()
        });

        v.add (l);

        return v;
    }
}

module.exports = SettingsView;
