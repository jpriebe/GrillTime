var TU = require ('/TitanUp/TitanUp');

function AboutView (params)
{
    var _self = null;
    var _container_view = null;
    var _aip = null;

    var _copyright = '© Copyright [YEAR] smorgasbork';

    _process_params ();
    _init ();
    return _self;

    function _process_params ()
    {
        if (typeof params === 'undefined')
        {
            params = {};
        }
        else
        {
            params = JSON.parse (JSON.stringify (params));
        }

        var config;

        if (typeof params.backgroundColor === 'undefined')
        {
            params.backgroundColor = TU.UI.Theme.lightBackgroundColor;
        }

        if (typeof params.textColor === 'undefined')
        {
            params.textColor = TU.UI.Theme.darkTextColor;
        }

        if (typeof params.config !== 'undefined')
        {
            config = params.config;
            delete params.config;
        }
        else
        {
            config = {};
        }

        if (typeof config.copyright !== 'undefined')
        {
            _copyright = config.copyright;
        }

        var year = new Date ().getFullYear ();
        Ti.API.info ("year: " + year);
        _copyright = _copyright.replace ('[YEAR]', year);
    }

    function _init ()
    {
        _self = Ti.UI.createView (params);

        _container_view = Ti.UI.createScrollView ({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            layout: 'vertical'
        });

        var l;

        var spacing = 16;

        var v = Ti.UI.createView ({
            top: spacing,
            left: spacing,
            right: spacing,
            height: Ti.UI.SIZE
        });

        var iv = Ti.UI.createImageView ({
            top: 0,
            width: 48,
            height: 48,
            left: 0,
            image: '/appicon.png'
        });

        var longpress_count = 0;

        iv.addEventListener ('longpress', function (e)
        {
            longpress_count++;

            TU.Logger.info ('[AboutView] longpress on app icon (' + longpress_count + ')');

            if (longpress_count == 3)
            {
                var player = Ti.Media.createSound ({url: "/audio/LOZ_Secret.mp3"});
                player.play ();
                Ti.App.Properties.setBool ('General.admin_options_available', true);
            }
        });

        var version_components = Ti.App.getVersion ().split ('.');

        var new_version_components = [];
        for (var i = 0; i < version_components.length; i++)
        {
            new_version_components.push (version_components[i]);
            if (i == 2)
            {
                break;
            }
        }

        var version = new_version_components.join ('.')
            + "/" + Ti.App.Properties.getInt ('tu-build-number', 0);

        var deploy_type = Ti.App.getDeployType ();
        if (deploy_type !== 'production')
        {
            version += " (" + Ti.App.getDeployType () + ")";
        }

        var msg = Ti.App.getName ()
            + "\n" + version;

        if (Ti.App.Properties.getBool ('General.admin_options_available', false))
        {
            msg += "\nbuilt " + Ti.App.Properties.getString ('tu-build-time-str', '')
            + "\nTi SDK version " + Ti.getVersion ();
        }

        l = Ti.UI.createLabel ({
            top: 0,
            left: 2 * spacing + 48,
            right: spacing,
            color: params.textColor,
            font: TU.UI.Theme.fonts.medium,
            text: msg
        });

        v.add (iv);
        v.add (l);

        _container_view.add (v);

        l = Ti.UI.createLabel ({
            color: params.textColor,
            font: TU.UI.Theme.fonts.medium,
            top: spacing,
            left: spacing,
            right: spacing,
            text: _copyright
        });

        _container_view.add (l);

        l = Ti.UI.createLabel ({
            top: spacing,
            left: spacing,
            right: spacing,
            color: params.textColor,
            font: TU.UI.Theme.fonts.mediumBold,
            text: 'Open Source Credits'
        });

        _container_view.add (l);

        var f = Ti.Filesystem.getFile (Ti.Filesystem.resourcesDirectory, 'credits.txt');
        var contents = f.read ();

        l = Ti.UI.createLabel ({
            top: parseInt (spacing / 2),
            left: spacing,
            right: spacing,
            color: params.textColor,
            font: TU.UI.Theme.fonts.small,
            text: contents.text
        });

        _container_view.add (l);

        _self.add (_container_view);
    }
}

module.exports = AboutView;
