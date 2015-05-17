#!/usr/bin/php
<?php

$configs = array (
'../platform/android/res/drawable-ldpi/appicon.png' => array ('-resize 36x36'),
'../platform/android/res/drawable-mdpi/appicon.png' => array ('-resize 48x48'),
'../platform/android/res/drawable-hdpi/appicon.png' => array ('-resize 72x72'),
'../platform/android/res/drawable-xhdpi/appicon.png' => array ('-resize 96x96'),
'../platform/android/res/drawable-xxhdpi/appicon.png' => array ('-resize 144x144'),

'../Resources/iphone/appicon.png' => array ('-resize 57x57'),               // iPhone/iPod non-retina
'../Resources/iphone/appicon@2x.png' => array ('-resize 114x114'),          // iPhone/iPod retina (iOS 6 and prior)
'../Resources/iphone/appicon-60@2x.png' => array ('-resize 120x120'),       // iPhone/iPod retina (iOS 7 and later)
'../Resources/iphone/appicon-60@3x.png' => array ('-resize 180x180'),       // iPhone 6 Plus
'../Resources/iphone/appicon-72.png' => array ('-resize 72x72'),            // iPad non-retina(iOS 6 and prior)
'../Resources/iphone/appicon-72@2x.png' => array ('-resize 144x144'),       // iPad retina (iOS 6 and prior)
'../Resources/iphone/appicon-76.png' => array ('-resize 76x76'),            // iPad non-retina (iOS 7 and later)
'../Resources/iphone/appicon-76@2x.png' => array ('-resize 152x152'),       // iPad retina (iOS 7 and later)

'../Resources/iphone/appicon-Small.png' => array ('-resize 29x29'),         // iPhone/iPod non-retina
'../Resources/iphone/appicon-Small-40.png' => array ('-resize 40x40'),      // Universal non-retina (iOS 7 and later)
'../Resources/iphone/appicon-Small-50.png' => array ('-resize 50x50'),      // iPad 1 & 2 (iOS 6 and prior)

'../Resources/iphone/appicon-Small@2x.png' => array ('-resize 58x68'),      // iPhone/iPod retina (iOS 6 and prior)
'../Resources/iphone/appicon-Small-40@2x.png' => array ('-resize 80x80'),   // Universal retina (iOS 7 and later)
'../Resources/iphone/appicon-Small-50@2x.png' => array ('-resize 100x100'), // iPad 3 (iOS 6 and prior)

'../Resources/iphone/appicon-Small@3x.png' => array ('-resize 87x87'),      // iPhone 6 Plus
'../Resources/iphone/appicon-Small-40@3x.png' => array ('-resize 120x120'), // iPhone 6 Plus
'../Resources/iphone/appicon-Small-50@3x.png' => array ('-resize 150x150'), // iPhone 6 Plus

'../Resources/iphone/iTunesArtwork.png' => array ('-resize 512x512'),
);


#### prep the android icon
$cmd = "convert icon.png -resize 144x144 tmp1.png";
print "$cmd\n";
`$cmd`;

$cmd = "convert -size 144x144 xc:none -fill white -draw 'roundRectangle 0,0 144,144 15,15' tmp1.png -compose SrcIn -composite tmp2.png";
print "$cmd\n";
`$cmd`;

#### make one for google play store
$cmd = "convert icon.png -resize 512x512 tmp1.png";
print "$cmd\n";
`$cmd`;

$cmd = "convert -size 512x512 xc:none -fill white -draw 'roundRectangle 0,0 512,512 45,45' tmp1.png -compose SrcIn -composite appicon_play_store.png";
print "$cmd\n";
`$cmd`;


foreach ($configs as $png => $opt)
{
    $wildcard = preg_replace ('#\.png#', '*', $png);
    $cmd = "rm -f $wildcard";
    print "$cmd\n";
    `$cmd`;

    if (!preg_match ('#android#', $png))
    {
        $opt = join (' ', $opt);
        $cmd = "convert icon.png $opt $png";
        print "$cmd\n";
        `$cmd`;
    }
    else
    {
        $opt = join (' ', $opt);
        $cmd = "convert icon.png $opt $png";
        print "$cmd\n";
        `$cmd`;
    }
}

`rm tmp*png`;
`mv ../../Resources/iphone/iTunesArtwork.png ../../Resources/iphone/iTunesArtwork`;
