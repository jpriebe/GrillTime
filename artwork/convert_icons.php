#!/usr/bin/php -q
<?php

$icons = array (
'stopwatch.png',
'thermometer.png',
);


foreach ($icons as $icon)
{
    $icon2x = preg_replace ('#\.png#', '@2x.png', $icon);
    $icon3x = preg_replace ('#\.png#', '@3x.png', $icon);

    $cmd = "convert $icon -bordercolor none -border 30x30 -gravity center -crop 30x30+0+0 tmp.png";
    print "$cmd\n";
    `$cmd`;

    copy ('tmp.png', "../Resources/iphone/images/$icon");
    copy ('tmp.png', "../Resources/android/images/res-ldpi/$icon");
    copy ('tmp.png', "../Resources/android/images/res-mdpi/$icon");

    $cmd = "convert $icon2x -bordercolor none -border 60x60 -gravity center -crop 60x60+0+0 tmp.png";
    print "$cmd\n";
    `$cmd`;

    copy ('tmp.png', "../Resources/iphone/images/$icon2x");
    copy ('tmp.png', "../Resources/android/images/res-hdpi/$icon");
    copy ('tmp.png', "../Resources/android/images/res-xhdpi/$icon");

    $cmd = "convert $icon2x -bordercolor none -border 90x90 -gravity center -crop 90x90+0+0 tmp.png";
    print "$cmd\n";
    `$cmd`;

    copy ('tmp.png', "../Resources/iphone/images/$icon3x");
    copy ('tmp.png', "../Resources/android/images/res-xxhdpi/$icon");
}
