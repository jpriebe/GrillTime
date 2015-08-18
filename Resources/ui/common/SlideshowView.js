var TU = require ('/TitanUp/TitanUp');

function SlideshowView (params)
{
    var images = [];
    for (var i = 0; i < 14; i++)
    {
        var i1 = i + 1;
        
        var renditions = [];
        renditions.push ({
            width: 1280,
            height: 1024,
            url: '/images/backgrounds/' + i1 + '.jpg'
        });
        renditions.push ({
            width: 1280,
            height: 1024,
            url: '/images/backgrounds/' + i1 + '.jpg'
        });
        
        images.push ({
            headline: '',
            abstract: '',
            renditions: renditions
        });
    }

    var gv = TU.UI.createGalleryView ({
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        config: {
            allowThumbview: false,
            images: images
        }
    });

    return gv;
}

module.exports = SlideshowView;
