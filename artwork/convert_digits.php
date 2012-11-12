<?php

for ($i = 0; $i < 10; $i++)
{
    $cmd = "convert digits/blue_green/$i.png -resize 400x666 ../Resources/images/digits/$i.png";
    print "$cmd\n";
    `$cmd`;
}

$cmd = "convert digits/blue_green/colon.png -resize 100x666 ../Resources/images/digits/colon.png";
print "$cmd\n";
`$cmd`;

$cmd = "convert digits/blue_green/x.png -resize 200x666 ../Resources/images/digits/x.png";
print "$cmd\n";
`$cmd`;


?>
