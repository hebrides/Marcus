<?php

exec("cd ". getcwd(). " && /usr/local/bin/node get_quote.js rotated 2>&1", $output, $error);

echo $output[0]."\n\n";

echo $output[1]."\n\n";

echo $output[2]."\n\n";

?>
