<?php

$ch = curl_init();

$data = '';
$data .=     'code_url='.urlencode('http://jiffier.com/quickreader/assets/js/iscroll.js');
$data .= '&'.'code_url='.urlencode('http://jiffier.com/quickreader/assets/js/json.js');
$data .= '&'.'code_url='.urlencode('http://jiffier.com/quickreader/assets/js/store.js');
$data .= '&'.'code_url='.urlencode('http://jiffier.com/quickreader/assets/js/book.js');
$data .= '&'.'download=fabrizio.js';


curl_setopt($ch, CURLOPT_URL, "http://marijnhaverbeke.nl/uglifyjs");
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

$js = curl_exec($ch);

file_put_contents('assets/js/reader.min.js', $js);


curl_close($ch);

echo 'fatto'."\n";