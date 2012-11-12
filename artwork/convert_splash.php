#!/usr/bin/php
<?php

#### it seems that if you use JPEG image data in a file named 'default.png', 
#### it works (and it's #### a LOT smaller)
#### http://developer.appcelerator.com/question/117150/changing-splashscreen-defaultpng-to-defaultjpg
#### *** NOTE *** only works on iphone, not android

$configs = array (
'android/images/res-long-port-ldpi/default.png' => array ('-resize 240x400'),
'android/images/res-long-port-hdpi/default.png' => array ('-resize 480x800'),

'android/images/res-notlong-port-ldpi/default.png' => array ('-resize 240x400', '-crop 240x320+0+0'),
'android/images/res-notlong-port-mdpi/default.png' => array ('-resize 320x533', '-crop 320x480+0+0'),
'android/images/res-notlong-port-hdpi/default.png' => array ('-resize 480x800'),

'android/images/res-long-land-ldpi/default.png' => array ('-resize 400x240'),
'android/images/res-long-land-hdpi/default.png' => array ('-resize 800x480'),

'android/images/res-notlong-land-ldpi/default.png' => array ('-resize 400x240', '-crop 320x240+40+0'),
'android/images/res-notlong-land-mdpi/default.png' => array ('-resize 533x320', '-crop 480x320+27+0'),
'android/images/res-notlong-land-hdpi/default.png' => array ('-resize 800x480'),

'iphone/Default.png' => array ('-resize 320x533', '-crop 320x480+0+0'),
'iphone/Default@2x.png' => array ('-crop 640x960+0+0'),
);

foreach ($configs as $png => $opt)
{
    $wildcard = preg_replace ('#\.png#', '*', $png);
    $cmd = "rm -f ../Resources/$wildcard";
    print "$cmd\n";
    `$cmd`;

    $source = (preg_match ('#-land-#', $png)) ? 'splash-land.png' : 'splash.png';

    $opt = join (' ', $opt);
    #$jpg = preg_replace ('#\.png#', ".jpg", $png);
    $cmd = "convert $source $opt ../Resources/$png";
    print "$cmd\n";
    `$cmd`;

    #$cmd = "mv ../Resources/$jpg ../Resources/$png";
    #print "$cmd\n";
    #`$cmd`;
}
