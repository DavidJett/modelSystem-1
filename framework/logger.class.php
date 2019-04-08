<?php
	defined('RUNTIME_PATH') or define('RUNTIME_PATH', dirname($_SERVER['SCRIPT_FILENAME']).'/runtime/');
	defined('LOG_PATH') or define('LOG_PATH', RUNTIME_PATH.'logs/');
	class Logger
	{	
		public static function info($msg)
		{
			if (! is_dir(LOG_PATH)) {  
				mkdir(LOG_PATH);
			}
			$filename = LOG_PATH . '/' . date('YmdHi') . '.txt';
			$content = date("Y-m-d H:i:s")."\r\n".$msg."\r\n \r\n \r\n ";
			file_put_contents($filename, $content, FILE_APPEND);
		}
	}
?>