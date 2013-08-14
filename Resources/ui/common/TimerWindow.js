var TU = require ('/TitanUp/TitanUp');
var BackgroundManager = require ('/ui/common/BackgroundManager');

if (TU.Device.getOS () == 'android')
{
    var _alarmModule = require('bencoding.alarmmanager');
    var _alarmManager = _alarmModule.createAlarmManager();
}
            

function TimerWindow ()
{
	var _self = null;
	
	var _currOrientation = '';
	
	var _vdigitsTimeContainer = null;
	var _vdigitsTime = [];
	
	var _vdigitsSegmentContainer = null;
	var _vdigitsSegment = [];
	
	var _vbuttons = null;
	
    var _btnPlay = null;
    var _btnPause = null;
	var _btnReset = null;
	
	var _status = 'initialized';
	
	var _iv_bg = null;
	
	var _wVFD = 0;
	var _hVFD = 0;

	var _notifications = [];
	var _soundPlayer = Ti.Media.createSound({url:"/sounds/alarm2.mp3"});
	
	var _segmentLength = Ti.App.Properties.getInt('option_timer_segment_length', 240);
	var _numSegments = Ti.App.Properties.getInt('option_timer_num_segments', 4);

	var _remaining = _segmentLength;  // time in seconds remaining on timer
	var _currSegment = 0;

	var _timerStarted = 0;        // the wall time when the timer started
	var _timerStartValue = 0;     // remaining time on timer when it started
	var _iTimer = null;	          // interval we use while timer is running
	
    
    // snapshot of state at the time the notifications were set
 	var _alarmData = Ti.App.Properties.getObject ('alarmData', null);

	var _isPaused = false;
	var _isResuming = false;
	
	_self = Ti.UI.createWindow ({
		backgroundColor: '#000',
		title: 'Timer'
	});
	
	var margin = TU.UI.Sizer.getDimension (10);
	var btnw = TU.UI.Sizer.getDimensionExact (45, 60, 90, 120, 180);
	var btnh = TU.UI.Sizer.getDimensionExact (45, 60, 90, 120, 180);	
	
    Ti.Gesture.addEventListener('orientationchange', function(e) {
        createUI ();
    });
	
    // fired when an app resumes from suspension
    Ti.App.addEventListener('resume',function(e){
        Ti.API.info("[Ti.App.resume] app is resuming from the background");
        _isResuming = true;
        
        if (_status != 'running')
        {
            return;
        }
        
        tick ();
    });
    
    Ti.App.addEventListener('resumed',function(e){
        Ti.API.info("[Ti.App.resumed] app has resumed from the background");
        _isResuming = false;
        _isPaused = false;
    });
    
    if (TU.Device.getOS() == 'ios')
    {    	
		Ti.App.iOS.addEventListener('notification',function(e)
		{
			Ti.API.info("[Ti.App.iOS.notification] local notification received: " + JSON.stringify(e));
			if (!_isResuming)
			{
				playSound ();
			}
		});
    }
		
    Ti.App.addEventListener('pause', function(e) {
        Ti.API.info ("[Ti.App.pause] app was paused from the foreground");
        _isPaused = true;
        _isResuming = false;
    });
    
    
    function initAlarmData ()
    {
        var alarmTimes = [];
        
        var now = new Date ().getTime ();
        var t = parseInt (now / 1000);
        
        for (var i = 0; i < _numSegments - _currSegment; i++)
        {
            if (i == 0)
            {
                t += _remaining;
            }
            else
            {
                t += _segmentLength;
            }
            alarmTimes.push (t);
        }

        var o = {};
        o.timeResumed = now;
        o.times = alarmTimes;
        o.startSegment = _currSegment;
        o.currSegment = _currSegment;
        o.title = L("GrillTime");
        o.message = L("Timer_segment_fmt");
        
        return o;
    }
    
    
    function scheduleNotifications ()
    {
		var offset = 0;
		
		_alarmData = initAlarmData ();

        if (TU.Device.getOS () == 'ios')
        {
    		_notifications = [];
    		for (var i = 0; i < _numSegments - _currSegment; i++)
    		{
    			var segnum = _currSegment + i + 1;
    
				if (offset == 0)
				{
					offset = new Date().getTime () + _remaining * 1000;
				}
				else
				{
					offset += _segmentLength * 1000;
				}
				
				var ndate = new Date (offset);
				Ti.API.info ('[scheduleNotification] scheduling notification for ' + ndate.toString());

				var n = Ti.App.iOS.scheduleLocalNotification ({
					alertBody: L("Timer_segment") + " " + segnum,
				    alertAction: L("OK"),
				    sound: "/sounds/alarm2.mp3",
				    date: ndate
				});
				
				_notifications.push (n);				
    		}
    		
    		return;
		}
		
		if (TU.Device.getOS () == 'android')
        {
            var now = new Date ().getTime ();
            now = parseInt (now  / 1000);
            
            _alarmData.sound = "/sounds/alarm2.mp3";
            _alarmData.icon = Ti.App.Android.R.drawable.appicon,
            _alarmData.title = L("GrillTime");
            _alarmData.message = L("Timer_segment_fmt");
            _alarmData.running = true;
 
            _alarmManager.addAlarmService({
                second: _alarmData.times[0] - now,
                interval: 10000000, // we have no intention of actually running this service more than once,
                                    // but not specifying it seems to cause a NullPointerExceptions in
                                    // TiJSIntervalService.destroyRunners()
                service:'com.smorgasbork.grilltime.BackgroundNotificationService',
            });
        }
        
        Ti.API.debug ('[scheduleNotifications] setting alarmData object to ' + JSON.stringify (_alarmData))
        Ti.App.Properties.setObject ('alarmData', _alarmData);
    }
    
    
    function cancelNotifications ()
    {
		if (TU.Device.getOS () == 'ios')
		{
			Ti.App.iOS.cancelAllLocalNotifications ();
		}
		else if (TU.Device.getOS () == 'android')
		{
            _alarmManager.cancelAlarmService ();
		}
    }
    
    
    function timerIsRunning ()
    {
    	if (_iTimer == null)
    	{
    		return false;
    	}
    	
    	return true;
    }
    
	function stopTimer ()
	{
		if (!timerIsRunning ())
		{
			// not running
			return;
		}
		
        if (_status != 'complete')
        {
            Ti.API.debug ('[stopTimer] stopping timer before complete; cancelling notifications');
    		cancelNotifications ();
    		
            _alarmData.currSegment = _currSegment;
            _alarmData.remaining = _remaining;
            _alarmData.running = false;
            Ti.API.debug ('[stopTimer] setting alarmData object to ' + JSON.stringify (_alarmData));
            Ti.App.Properties.setObject ('alarmData', _alarmData);
  		}
		
		clearInterval (_iTimer);
		_iTimer = null;
		
        setButtonEnabled (_btnPlay, _status != 'complete');
        setButtonEnabled (_btnPause, false);
        setButtonEnabled (_btnReset, true);
	}
	
	function resetTimer ()
	{
		_remaining = _segmentLength;
		_currSegment = 0;
		_status = 'initialized';
		
		setDigits();

        setButtonEnabled (_btnPlay, true);
        setButtonEnabled (_btnPause, false);
        setButtonEnabled (_btnReset, false);
	}
	
	function computeRemaining ()
	{
	    var now = new Date().getTime ();
	    now = parseInt (now / 1000);
    	var elapsed = parseInt (now - (_alarmData.timeResumed / 1000));
    	
    	//Ti.API.debug ("[computeRemaining] _remaining: " + _remaining);
    	//Ti.API.debug ("[computeRemaining] _currSegment: " + _currSegment);

		for (var i = 0; i < _alarmData.times.length; i++)
		{
	    	//Ti.API.debug ("[computeRemaining] times[" + i + "]: " + _alarmData.times[i]);
	    	
			if (now < _alarmData.times[i])
			{
				_remaining = _alarmData.times[i] - now;
				_currSegment = i;
		    	//Ti.API.debug ("[computeRemaining] setting _remaining: " + _remaining);
		    	//Ti.API.debug ("[computeRemaining] setting _currSegment: " + _currSegment);
				return;
			}
		}
		
    	//Ti.API.debug ("[computeRemaining] all segments elapsed");
    	_currSegment = _numSegments - 1;
		_remaining = 0;
	}	
	
	function tick ()
	{
		if (_isPaused)
		{
			return;
		}
		
		computeRemaining ();
		setDigits ();
					
		if (_remaining == 0)
		{
			if (_currSegment == _numSegments - 1)
			{
				_status = 'complete';
				stopTimer ();
			}
		}
	}
	
	
	function startTimer (newNotifications)
	{
		Ti.App.Properties.setInt('option_timer_segment_length', _segmentLength);
		Ti.App.Properties.setInt('option_timer_num_segments', _numSegments);

		_timerStarted = new Date().getTime();
		
		_status = 'running';
		
        setButtonEnabled (_btnPlay, false);
        setButtonEnabled (_btnPause, true);
        setButtonEnabled (_btnReset, false);
		
		_timerStartValue = _remaining;
		_iTimer = setInterval (function () { tick(); }, 100);
		
		if (newNotifications)
		{
            scheduleNotifications ();
		}
	}
	
	function secondsToTimestr (time)
	{
		var min = parseInt (time / 60);
		var sec = time % 60;
		
		var d = [];
		d[0] = parseInt (min / 10);
		d[1] = min % 10;
		d[2] = parseInt (sec / 10);
		d[3] = sec % 10;
		
		return '' + d[0] + d[1] + ':' + d[2] + d[3]; 
	}
	
	
	function timestrToSeconds (timestr)
	{
		var components = timestr.split (':');
		return parseInt (components[0]) * 60 + parseInt (components[1]);
	}
	
	function playSound ()
	{
		_soundPlayer.play();
	}
	
	function setDigits ()
	{
		var min = parseInt (_remaining / 60);
		var sec = _remaining % 60;
		
		var d = [];
		d[0] = parseInt (min / 10);
		d[1] = min % 10;
		d[2] = parseInt (sec / 10);
		d[3] = sec % 10;
		
		var madeChanges = false;
		
		for (var i = 0; i < 4; i++)
		{
			var currimg = _vdigitsTime[i].image;
			var newimg = "/images/digits/" + d[i] + ".png";
			
			if (currimg == newimg)
			{
				continue;
			}
			
			madeChanges = true;

            _vdigitsTime[i].image = newimg;
		}

		var segmentsRemaining = _numSegments - _currSegment;

		// are we totally done?
		if ((segmentsRemaining == 1) && (_remaining == 0))
		{
			segmentsRemaining = 0;
		}

		d[4] = parseInt (segmentsRemaining / 10);
		d[5] = segmentsRemaining % 10;
		
		for (var i = 0; i < 2; i++)
		{
            var currimg = _vdigitsSegment[i].image;
            var newimg = "/images/digits/" + d[i + 4] + ".png";

			if (currimg == newimg)
			{
				continue;
			}
			
			madeChanges = true;

            _vdigitsSegment[i].image = newimg;
		}
		
		if (madeChanges)
		{
            Ti.API.debug ('[setDigits] ' + d[0] + d[1] + ':' + d[2] + d[3] + ' x ' + d[4] + d[5]);
		}
	}
	
	var _touchStartY = 0;
	var _touchStartValue = 0;
	var _touchStartIncrement = 0;
	function onTimeTouchStart (e)
	{
		if (_status != 'initialized')
		{
			return;	
		}
		
		_touchStartIncrement = 15;
		if (e.source == _vdigitsTime[0])
		{
			_touchStartIncrement = 600;
		}
		else if (e.source == _vdigitsTime[1])
		{
			_touchStartIncrement = 60;
		}
		
		_touchStartY = e.y;
		_touchStartValue = _segmentLength;
	}	

	function onTimeTouchMove (e)
	{
		if (_status != 'initialized')
		{
			return;	
		}
		
		var delta = parseInt ((e.y - _touchStartY) / (_hVFD / 4) * -1);
		_segmentLength = delta * _touchStartIncrement + _touchStartValue;
		
		if (_segmentLength < 15)
		{
			_segmentLength = 15;
		}
		if (_segmentLength > 5940)
		{
			_segmentLength = 5940;
		}
		
		if (_remaining != _segmentLength)
		{
			_remaining = _segmentLength;
			setDigits();
		}
	}	

	function onSegmentTouchStart (e)
	{
		if (_status != 'initialized')
		{
			return;	
		}
		
		_touchStartIncrement = 1;
		if (e.source == _vdigitsSegment[0])
		{
			_touchStartIncrement = 10;
		}
		
		_touchStartY = e.y;
		_touchStartValue = _numSegments;
	}	

	function onSegmentTouchMove (e)
	{
		if (_status != 'initialized')
		{
			return;	
		}

		var delta = parseInt ((e.y - _touchStartY) / (_hVFD / 4) * -1);
		_numSegments = delta * _touchStartIncrement + _touchStartValue;
		
		if (_numSegments < 1)		
		{
			_numSegments = 1;
		}
		if (_numSegments > 99)
		{
			_numSegments = 99;
		}
		
		_currSegment = 0;
		setDigits();
	}	

	function destroyUI ()
	{
		if (_vdigitsTimeContainer == null)
		{
			return;
		}
		
		_self.remove (_iv_bg);
		_self.remove (_vdigitsTimeContainer);
        _self.remove (_vdigitsSegmentContainer);
		
		for (var i = 0; i < 4; i++)
		{
			_vdigitsTime[i] = null;
		}
        _vdigitsTime = [];

		for (var i = 0; i < 2; i++)
		{
			_vdigitsSegment[i] = null;
		}
        _vdigitsSegment = [];
		
		_self.remove (_vbuttons);
	}
	
	
	function layoutTimeDigits ()
	{
	    var l = 0;
		for (i = 0; i < 4; i++)
		{
			var i1 = i + 1;

            var vd = Ti.UI.createImageView ({
                left: l,
                width: _wVFD,
                height: _hVFD,
                image: "/images/digits/0.png"
            });

            l += _wVFD;
			
			_vdigitsTime.push (vd);
			_vdigitsTimeContainer.add (vd);
			
			if (i == 1)
			{
				var w4 = parseInt (_wVFD / 4);
				var vcolon = Ti.UI.createImageView ({
					left: l,
					width: w4,
					height: _hVFD,
					image: '/images/digits/colon.png'
				});
				l += w4;
				
				_vdigitsTimeContainer.add (vcolon);
			}
		}
	}
	
	function layoutSegmentDigits ()
	{
	    var l = 0;
		var w2 = parseInt (_wVFD / 2);
		var vx = Ti.UI.createImageView ({
			left: l,
			width: w2,
			height: _wVFD,
			image: '/images/digits/x.png'
		});
		l += w2;
		
		_vdigitsSegmentContainer.add (vx);

		for (i = 0; i < 2; i++)
		{
			var i1 = i + 1;
			
            var vd = Ti.UI.createImageView ({
                left: l,
                width: _wVFD,
                height: _hVFD,
                image: "/images/digits/0.png"
            });

            l += _wVFD;
            
            _vdigitsSegment.push (vd);
            _vdigitsSegmentContainer.add (vd);
		}
	}
	
	
	function setButtonEnabled (btn, enabled)
	{
	    if (btn == null)
	    {
	        return;
	    }
	    
	    if (enabled)
	    {
	        btn.setEnabled (true);
	        btn.setOpacity (1.0);
	    }
	    else
	    {
            btn.setEnabled (false);
            btn.setOpacity (0.5);
	    }
	}
	
	
	function createUILandscape ()
	{
		_iv_bg = BackgroundManager.getBackgroundIV ();
		_self.add (_iv_bg);
	
		_wVFD = parseInt ((TU.Device.getDisplayWidth() - 2 * margin) / 6.75);
		_hVFD = parseInt (_wVFD * 666 / 400);
		
		var y = margin;
		
		_vdigitsTimeContainer = Ti.UI.createView ({
			top: y,
			left: margin,
			width: parseInt (4.25 * _wVFD),
			height: _hVFD
		});
		
		_vdigitsSegmentContainer = Ti.UI.createView ({
			top: y,
			right: margin,
			width: parseInt (2.5 * _wVFD),
			height: _hVFD
		});
		
		_currOrientation = 'landscape';
	}
	

	function createUIPortrait ()
	{
		_iv_bg = BackgroundManager.getBackgroundIV ();
		_self.add (_iv_bg);
		
		_wVFD = parseInt ((TU.Device.getDisplayWidth() - 2 * margin) / 4.25);
		_hVFD = parseInt (_wVFD * 666 / 400);
		
		var y = margin;
		
		_vdigitsTimeContainer = Ti.UI.createView ({
			top: y,
			left: margin,
			right: margin,
			height: _hVFD
		});
		
		_vdigitsSegmentContainer = Ti.UI.createView ({
			top: 2 * y + _hVFD,
			right: margin,
			width: parseInt (2.5 * _wVFD),
			height: _hVFD
		});

		_currOrientation = 'portrait';
	}
	
	function createUI ()
	{
		var w = TU.Device.getDisplayWidth();
		var h = TU.Device.getDisplayHeight();
		
		if (w > h)
		{
			if (_currOrientation == 'landscape')
			{
			    return;
			}
            destroyUI ();
            createUILandscape ();
		}
		else
		{
			if (_currOrientation == 'portrait')
			{
			    return;
			}
            destroyUI ();
            createUIPortrait ();
		}
		
		layoutTimeDigits ();
		layoutSegmentDigits ();
		
		_vdigitsTimeContainer.addEventListener ('touchstart', onTimeTouchStart);
		_vdigitsTimeContainer.addEventListener ('touchmove', onTimeTouchMove);
		_vdigitsSegmentContainer.addEventListener ('touchstart', onSegmentTouchStart);
		_vdigitsSegmentContainer.addEventListener ('touchmove', onSegmentTouchMove);
		
		setDigits (_remaining);		
		_self.add (_vdigitsTimeContainer);
		_self.add (_vdigitsSegmentContainer);

        _vbuttons = Ti.UI.createView ({
            bottom: margin,
            layout: 'horizontal',
            height: btnh,
            width: Ti.UI.SIZE
        });		
		
        _btnPlay = Ti.UI.createButton ({
            height: btnh,
            width: btnw,
            left: 0,
            title: "",
            backgroundImage: '/images/play.png'
        });

        _btnPause = Ti.UI.createButton ({
            height: btnh,
            width: btnw,
            left: margin,
            title: "",
            backgroundImage: '/images/pause.png'
        });

		_btnReset = Ti.UI.createButton ({
            height: btnh,
            width: btnw,
            left: margin,
            title: "",
			backgroundImage: '/images/refresh.png'
		});

        _vbuttons.add (_btnPlay);
        _vbuttons.add (_btnPause);
        _vbuttons.add (_btnReset);

        if (_iTimer == null)
        {
            setButtonEnabled (_btnPlay, _status != 'complete');
            setButtonEnabled (_btnPause, false);
            setButtonEnabled (_btnReset, true);
        }
        else
        {
            setButtonEnabled (_btnPlay, false);
            setButtonEnabled (_btnPause, true);
            setButtonEnabled (_btnReset, false);
        }
        		
		_btnPlay.addEventListener ('click', function (e) {
            if (!timerIsRunning ())
            {
                startTimer (true);
                return;
            }
		});
		
        _btnPause.addEventListener ('click', function (e) {
            var dlg = Titanium.UI.createAlertDialog({
                title: L('Pause_Timer'),
                message: L('Are_you_sure'),
                buttonNames: [L('Yes'), L('No')],
                cancel: 1
            });
     
            dlg.addEventListener('click', function(e) {
                if (e.index === e.source.cancel) {
                    return;
                }
     
                if (e.index != 0)
                {
                    return;
                }
                
                stopTimer();
            });
            
            dlg.show ();
        });

		_btnReset.addEventListener('click', function(e)
		{
			if (timerIsRunning ())
			{
				return;
			}
			
			if (_status == 'complete')
			{
				resetTimer ();
				return;
			}
			
			var dlg = Titanium.UI.createAlertDialog({
			    title: L('Reset_Timer'),
			    message: L('Are_you_sure'),
			    buttonNames: [L('Yes'), L('No')],
			    cancel: 1
			});
	 
			dlg.addEventListener('click', function(e) {
				if (e.index === e.source.cancel) {
					return;
				}
	 
	 			if (e.index != 0)
	 			{
	 				return;
	 			}
	 			
	 			resetTimer();
	 		});
	 		
	 		dlg.show ();
	 	});	

        
        _self.add (_vbuttons);
	}	
	
    createUI ();
    
    if (_alarmData != null)
    {
        Ti.API.debug ("app launching; found active alarmData");
        
        if (_alarmData.running)
        {
            // if the timer is already running, notifications/alarms should
            // already be scheduled; we don't want to reschedule.
            Ti.API.debug ("timer was running when app exited; starting back up...");
            computeRemaining ();
            startTimer (false);
        }
        else
        {
            _currSegment = _alarmData.currSegment;
            _remaining = _alarmData.remaining;
        }
    }

	return _self;
}

module.exports = TimerWindow;