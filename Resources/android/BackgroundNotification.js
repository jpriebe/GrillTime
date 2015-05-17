Ti.API.debug ('[BackgroundNotification] starting...');

var service = Ti.Android.currentService;
var serviceIntent = service.getIntent();

var alarmData = Ti.App.Properties.getObject ('alarmData');

setNotification (alarmData);

alarmData.currSegment++;

var idx = parseInt (alarmData.currSegment) - parseInt (alarmData.startSegment);

Ti.API.debug ('[BackgroundNotification] alarmData.currSegment: ' + alarmData.currSegment);
Ti.API.debug ('[BackgroundNotification] idx: ' + idx);
Ti.API.debug ('[BackgroundNotification] alarmData.times.length: ' + alarmData.times.length);

if (idx < alarmData.times.length)
{
    var _alarmModule = require('bencoding.alarmmanager');
    var _alarmManager = _alarmModule.createAlarmManager();
    
    var now = parseInt (new Date ().getTime () / 1000);
    
    var nexttime = alarmData.times[idx] - now;

    Ti.API.debug ('[BackgroundNotification] scheduling next alarm for ' + nexttime + ' seconds from now...');

    _alarmManager.addAlarmService({
        second: nexttime,
        interval: 10000000, // we have no intention of actually running this service more than once,
                            // but not specifying it seems to cause a NullPointerExceptions in
                            // TiJSIntervalService.destroyRunners()
        service: 'com.smorgasbork.grilltime.BackgroundNotificationService'
    });

    Ti.API.debug ('[BackgroundNotification] setting alarmData object to ' + JSON.stringify (alarmData));
    Ti.App.Properties.setObject ('alarmData', alarmData);
}
else
{
    Ti.API.debug ('[BackgroundNotification] all segments fired; clearing alarmData property.');
    Ti.App.Properties.setObject ('alarmData', null);
}

Ti.Android.stopService (serviceIntent);

Ti.API.debug ('[BackgroundNotification] done.');

function setNotification (alarmData, sound)
{
    var activity = Ti.Android.currentActivity;
    var intent = Ti.Android.createIntent({
        action : Ti.Android.ACTION_MAIN,
        className : 'com.smorgasbork.grilltime.GrilltimeActivity',
        flags : Ti.Android.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED | Ti.Android.FLAG_ACTIVITY_SINGLE_TOP
    });
    intent.addCategory(Titanium.Android.CATEGORY_LAUNCHER);
    
    var pending = Ti.Android.createPendingIntent({
        activity : activity,
        intent : intent,
        type : Ti.Android.PENDING_INTENT_FOR_ACTIVITY,
        flags : Ti.Android.FLAG_ACTIVITY_NO_HISTORY
    });

    var segment1 = alarmData.currSegment + 1;
    var message = String.format (alarmData.message, segment1);
    
    Ti.API.debug ('[BackgroundNotification] setting notification...');
    Ti.API.debug ('                            - title = ' + alarmData.title);
    Ti.API.debug ('                            - message = ' + message);
    Ti.API.debug ('                            - sound = ' + alarmData.sound);

    var cfg = {
        contentIntent : pending,
        contentTitle : alarmData.title,
        contentText : message,
        tickerText : message,
        // "when" will only put the timestamp on the notification and nothing else.
        // Setting it does not show the notification in the future
        when : new Date().getTime(),
        icon : Ti.App.Android.R.drawable.appicon,
        flags : Titanium.Android.FLAG_AUTO_CANCEL | Titanium.Android.FLAG_SHOW_LIGHTS | Titanium.Android.FLAG_INSISTENT,
    };

    var notification = Ti.Android.createNotification(cfg);
    
    if (alarmData.sound != '')
    {
        // would like to play sound via the notification, but it doesn't work:
        // http://jira.appcelerator.org/browse/TIMOB-5239
        var soundPlayer = Ti.Media.createSound({url: alarmData.sound});
        soundPlayer.play(); 
    }

    Ti.Android.NotificationManager.notify (1, notification);

    // shave-and-a-haircut...two-bits!
    Ti.Media.vibrate([0,100,200,100,100,100,100,100,200,100,500,100,225, 100]);
}
