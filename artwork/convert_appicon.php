#!/usr/bin/php
<?php

$configs = array (
'android/appicon.png' => array ('-resize 128x128'),
'iphone/appicon.png' => array ('-resize 57x57'),
'iphone/appicon@2x.png' => array ('-resize 114x114'),
);

foreach ($configs as $png => $opt)
{
    $wildcard = preg_replace ('#\.png#', '*', $png);
    $cmd = "rm -f ../Resources/$wildcard";
    print "$cmd\n";
    `$cmd`;

    $opt = join (' ', $opt);
    $cmd = "convert icon.png $opt ../Resources/$png";
    print "$cmd\n";
    `$cmd`;
}
