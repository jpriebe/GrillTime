var TU = require ('/TitanUp/TitanUp');
var MainView = require ('/ui/common/MainView');

function MainWindow ()
{
    var mitems = [
        { identifier: "slideshow", caption: L('Slideshow') },
        { identifier: "settings", caption: L('Settings') },
        { identifier: "about", caption: L('About') }
    ];
    
    var _main_view = new MainView ();
    
    var _self = TU.UI.createDrawerMenuWM ({
        title: TU.getAppName (),
        title_image: '/images/title_logo.png',
        backgroundColor: TU.UI.Theme.backgroundColor,
        main_view: _main_view,
        menu_params: {
            background_color: TU.UI.Theme.darkBackgroundColor
        },
        ios_options: {
            bar_color: TU.UI.Theme.darkBackgroundColor, // ios-only
            bar_text_color: 'white'
        },
        orientation_modes: [ Ti.UI.PORTRAIT ],
        menu_items: mitems
    });
    
    function on_menu_item_selected (e)
    {
        var v = null;
        switch (e.identifier)
        {
            case 'slideshow':
                var SlideshowView = require ('/ui/common/SlideshowView');
                v = new SlideshowView ();
                var w = Ti.UI.createWindow ();
                w.add (v);
                TU.UI.openWindow (w);
                break;

            case 'settings':
                var SettingsView = require ('/ui/common/SettingsView');
                v = new SettingsView ();
                var w = Ti.UI.createWindow ();
                w.add (v);
                TU.UI.openWindow (w);
                break;

            case 'about':
                var AboutView = require ('/ui/common/AboutView');
                v = new AboutView ({
                    backgroundColor: TU.UI.Theme.darkBackgroundColor,
                    textColor: TU.UI.Theme.lightTextColor
                });
                var w = Ti.UI.createWindow ();
                w.add (v);
                TU.UI.openWindow (w);
                break;
        }
    }
    
    _self.addEventListener ('menu_item_selected', on_menu_item_selected);
    
    return _self;
}


module.exports = MainWindow;
