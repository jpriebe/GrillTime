#!/usr/bin/php
<?php

$i = 0;
foreach (glob ('backgrounds/*.jpg')  as $bg)
{
    $i++;
    print "$bg\n";

    $cmd = "identify -format '%w,%h' $bg";
    $output = chop (`$cmd`);
    list ($w, $h) = split (',', $output);
    print "w: $w, h: $h\n";

    $new_w = $w;
    $new_h = (int)(1024 / 1280 * $w);
    if ($new_h > $h)
    {
        $new_h = $h;
        $new_w = (int)(1280 / 1024 * $new_h);
    }
    $cmd = "convert -gravity Center -crop {$new_w}x{$new_h}+0+0 -resize 1280x1024 $bg -brightness-contrast -35x-15 ../Resources/images/backgrounds/$i.jpg";
    print "$cmd\n";
    `$cmd`;

    $new_h = $h;
    $new_w = (int)(1024 / 1280 * $h);
    if ($new_w > $w)
    {
        $new_w = $w;
        $new_h = (int)(1280 / 1024 * $new_w);
    }
    $cmd = "convert -gravity Center -crop {$new_w}x{$new_h}+0+0 -resize 1024x1280 $bg -brightness-contrast -35x-15 ../Resources/images/backgrounds/$i-port.jpg";
    print "$cmd\n";
    `$cmd`;
}
