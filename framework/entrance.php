<?php
	defined('FRAME_PATH') or define('FRAME_PATH', __DIR__.'/');
	defined('APP_PATH') or define('APP_PATH', dirname($_SERVER['SCRIPT_FILENAME']).'/');
	defined('CONFIG_PATH') or define('CONFIG_PATH', APP_PATH.'config/');
	defined('RUNTIME_PATH') or define('RUNTIME_PATH', APP_PATH.'runtime/');
	defined('DATA_PATH') or define('DATA_PATH', APP_PATH.'data/');
	defined('PUBLIC_PATH') or define('PUBLIC_PATH', APP_PATH.'public/');

	require_once APP_PATH . 'config/config.php';
	require_once FRAME_PATH . 'core.class.php';
	require_once FRAME_PATH . 'logger.class.php';

	date_default_timezone_set('PRC');
	$core = new Core;
	$core->run();
?>