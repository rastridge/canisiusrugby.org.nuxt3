<?php
// File Location: /old-rosters/index.php

//require_once($_SERVER['DOCUMENT_ROOT']."/_lib/_base/include_path.php");
require_once("tpl_unsecure.php");


setHeader( 'Old Game Rosters');

openPage(true);
setContentHead('Old Game Rosters');
?>
 <iframe  src="https://canisiusrugby.org/old-rosters/home.html" width="100%" height="1000px"></iframe>

<?php
closePage();
?>