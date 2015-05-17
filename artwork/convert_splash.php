#!/usr/bin/php
<?php

#### it seems that if you use JPEG image data in a file named 'default.png', 
#### it works (and it's #### a LOT smaller)
#### http://developer.appcelerator.com/question/117150/changing-splashscreen-defaultpng-to-defaultjpg
#### *** NOTE *** only works on iphone, not android

$configs = array (
'android/images/res-long-port-ldpi/default.png' => array ('-resize 240x400'),
'android/images/res-long-port-mdpi/default.png' => array ('-resize 360x600'),
'android/images/res-long-port-hdpi/default.png' => array ('-resize 480x800'),
'android/images/res-long-port-xhdpi/default.png' => array ('-resize 720x1200'),
'android/images/res-long-port-xxhdpi/default.png' => array ('-resize 960x1600'),

'android/images/res-notlong-port-ldpi/default.png' => array ('-resize 240x400', '-crop 240x320+0+40'),
'android/images/res-notlong-port-mdpi/default.png' => array ('-resize 320x533', '-crop 320x427+0+53'),
'android/images/res-notlong-port-hdpi/default.png' => array ('-resize 480x800', '-crop 480x640+0+80'),
'android/images/res-notlong-port-xhdpi/default.png' => array ('-resize 720x1200', '-crop 720x960+0+120'),
'android/images/res-notlong-port-xxhdpi/default.png' => array ('-resize 960x1600', '-crop 960x1280+0+160'),

'android/images/res-long-land-ldpi/default.png' => array ('-resize 400x240'),
'android/images/res-long-land-mdpi/default.png' => array ('-resize 600x360'),
'android/images/res-long-land-hdpi/default.png' => array ('-resize 800x480'),
'android/images/res-long-land-xhdpi/default.png' => array ('-resize 1200x720'),
'android/images/res-long-land-xxhdpi/default.png' => array ('-resize 1600x960'),

'android/images/res-notlong-land-ldpi/default.png' => array ('-resize 400x240', '-crop 320x240+40+0'),
'android/images/res-notlong-land-mdpi/default.png' => array ('-resize 533x320', '-crop 427x320+53+0'),
'android/images/res-notlong-land-hdpi/default.png' => array ('-resize 800x480', '-crop 640x480+80+0'),
'android/images/res-notlong-land-xhdpi/default.png' => array ('-resize 1200x720', '-crop 960x720+120+0'),
'android/images/res-notlong-land-xxhdpi/default.png' => array ('-resize 1600x960', '-crop 1280x960+160+0'),

'iphone/Default.png' => array ('-resize 320x533', '-crop 320x480+0+27'),
'iphone/Default@2x.png' => array ('-resize 640x1066', '-crop 640x960+0+54'),

'iphone/Default-Portrait.png' => array ('-resize 768x1280', '-crop 768x1024+0+128'),
'iphone/Default-Landscape.png' => array ('-resize 1280x768', '-crop 1024x768+128+0'),

'iphone/Default-568h@2x.png' => array ('-resize 682x1136', '-crop 640x1136+21+0'),

#### iphone 6
'iphone/Default-667h@2x.png' => array ('-resize 800x1334', '-crop 750x1334+25+0'),

#### iphone 6 plus
'iphone/Default-Portrait-736h@3x.png' => array ('-resize 1325x2208', '-crop 1242x2208+42+0'),
'iphone/Default-Landscape-736h@3x.png' => array ('-resize 2208x1325', '-crop 2208x1242+0+42'),

);


foreach ($configs as $png => $opt)
{
    $wildcard = preg_replace ('#\.png#', '*', $png);
    $cmd = "rm -f ../Resources/$wildcard";
    print "$cmd\n";
    `$cmd`;

    $source = (preg_match ('#-land#i', $png)) ? 'splash-land.png' : 'splash.png';

    $opt = join (' ', $opt);
    #$jpg = preg_replace ('#\.png#', ".jpg", $png);
    $cmd = "convert $source $opt -quality 75 ../Resources/$png";
    print "$cmd\n";
    `$cmd`;

    #$cmd = "mv ../Resources/$jpg ../Resources/$png";
    #print "$cmd\n";
    #`$cmd`;
}
