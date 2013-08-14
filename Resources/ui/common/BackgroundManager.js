var _idx = parseInt ((Math.random() * 7)) + 1;

function BackgroundManager ()
{
	
}

BackgroundManager.getBackgroundIV = function ()
{
	var background = '';
	
	var imgw = 0;
	var imgh = 0;
	var ivw = 0;
	var ivh = 0;
	
	var dc = Ti.Platform.displayCaps;
	if (dc.platformWidth > dc.platformHeight)
	{
		imgw = 1280;
		imgh = 1024;
		background = "/images/backgrounds/" + _idx + ".jpg";
	}
	else
	{
		imgw = 1024;
		imgh = 1280;
		background = "/images/backgrounds/" + _idx + "-port.jpg";	
	}
	
	ivw = dc.platformWidth;
	ivh = imgh / imgw * ivw;
	
	if (ivh < dc.platformHeight) {
		ivh = dc.platformHeight;
		ivw = imgw / imgh * ivh;
	};
	
	var iv = Ti.UI.createImageView ({
		width: ivw,
		height: ivh,
		bottom: 0,
		image: background	
	});
	
	return iv;
}

module.exports = BackgroundManager;