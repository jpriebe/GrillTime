var TU = require ('/TitanUp/TitanUp');
var tinycolor = require ('/util/tinycolor');
var TimerView = require ('/ui/common/TimerView');
var TempsView = require ('/ui/common/TempsView');
var BackgroundManager = require ('/ui/common/BackgroundManager');


function MainView ()
{
    var _self = Ti.UI.createView ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    });
    
    var _iv_bg = BackgroundManager.getBackgroundIV ();
    _self.add (_iv_bg);
    
    var _overlay = Ti.UI.createView ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        opacity: 0.5
    });
    
    _self.add (_overlay);
    
    var _tv = TU.UI.createTabView ({
        top: 10,
        config: {
            tab_labels: [L('TIMER'), L('TEMPS')],

            tab_height: 24,
            tab_border_radius: 4,
            tab_spacing: 4,

            tab_panel_spacing: 4,

            tab_font: TU.UI.Theme.fonts.smallBold,

            tab_color: tinycolor (TU.UI.Theme.lightTextColor).darken (5).toString (),
            tab_color_active: tinycolor (TU.UI.Theme.lightTextColor).darken (5).toString (),
            tab_color_selected: TU.UI.Theme.lightTextColor,

            tab_background_color: tinycolor (TU.UI.Theme.highlightColor).darken (20).toString (),
            tab_background_color_active: tinycolor (TU.UI.Theme.highlightColor).brighten (10).toString (),
            tab_background_color_selected: TU.UI.Theme.highlightColor
        }
    });

    _tv.add_content_view (0, new TimerView ());
    _tv.add_content_view (1, new TempsView ());

    _self.add (_tv);

    return _self;
}

module.exports = MainView;
