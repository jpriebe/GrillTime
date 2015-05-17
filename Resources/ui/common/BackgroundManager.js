var _idx = parseInt ((Math.random() * 14)) + 1;

function BackgroundManager ()
{
	
}

BackgroundManager.getBackgroundImage = function ()
{
    var background = '';
    
    var dc = Ti.Platform.displayCaps;
    if (dc.platformWidth > dc.platformHeight)
    {
        background = "/images/backgrounds/" + _idx + ".jpg";
    }
    else
    {
        background = "/images/backgrounds/" + _idx + "-port.jpg";   
    }
    
    return background;
};


BackgroundManager.getBackgroundIV = function ()
{
	var iv = Ti.UI.createImageView ({
	    top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		image: BackgroundManager.getBackgroundImage ()	
	});
	
	return iv;
};

module.exports = BackgroundManager;