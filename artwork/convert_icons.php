<?php

$icons = array (
'stopwatch.png',
'thermometer.png',
'gear.png',
);


foreach ($icons as $icon)
{
    $icon2x = preg_replace ('#\.png#', '@2x.png', $icon);

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
}


$icons = array (
'play',
'pause',
'refresh',
);


foreach ($icons as $icon)
{
    $icon2x = $icon . '@2x';

    $cmd = "convert blue_green/$icon.png -bordercolor none -border 45x45 -gravity center -crop 45x45+0+0 tmp.png";
    print "$cmd\n";
    `$cmd`;

    copy ('tmp.png', "../Resources/iphone/images/$icon.png");
    copy ('tmp.png', "../Resources/android/images/res-ldpi/$icon.png");
    copy ('tmp.png', "../Resources/android/images/res-mdpi/$icon.png");

    $cmd = "convert blue_green/$icon2x.png -bordercolor none -border 90x90 -gravity center -crop 90x90+0+0 tmp.png";
    print "$cmd\n";
    `$cmd`;

    copy ('tmp.png', "../Resources/iphone/images/$icon2x.png");
    copy ('tmp.png', "../Resources/android/images/res-hdpi/$icon.png");
    copy ('tmp.png', "../Resources/android/images/res-xhdpi/$icon.png");
}
