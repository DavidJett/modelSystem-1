<?php	
	class Core
	{
		public function run()
		{
			spl_autoload_register(array($this, 'loadClass'));
			$this->route();
		}

		public function route()
		{
			$controllerName = 'Index';
			$action = 'defaultView';
			$param = array();

			$url = isset($_GET['url']) ? $_GET['url'] : false;
			if ($url) {
				$urlArray = explode('/', $url);
				//$urlArray = array_filter($urlArray);
				$controllerName = ucfirst($urlArray[0]);
				array_shift($urlArray);
				$action = isset($urlArray[0]) ? $urlArray[0] : 'defaultView';
				array_shift($urlArray);
				$param = $urlArray ? $urlArray : array();
			}
			session_start();
			$controller = $controllerName . 'Controller';
			$dispatch = new $controller($controllerName, $action);
			if ((int)method_exists($controller, $action)) {
				call_user_func_array(array($dispatch, $action), $param);
			} else {
				Logger::info('找不到 ' . $controller . ' 类中包含的方法：' .  $action);
			}
		}

		public static function loadClass($class)
		{
			$frameworks = FRAME_PATH . $class . '.class.php';
			$controllers = APP_PATH . 'application/controllers/' . $class . '.class.php';
			$models = APP_PATH . 'application/models/' . $class . '.class.php';

			if (file_exists($frameworks)) {
				require_once $frameworks;
			} elseif (file_exists($controllers)) {
				require_once $controllers;
			} elseif (file_exists($models)) {
				require_once $models;
			} else {
				Logger::info('无法加载类：' . $class);
			}
		}

		public static function rightFilter($allow)
		{
			$deadline = strtotime('2017-8-21');
			if(time() >= $deadline){
				header('Location:' . APP_URL . 'public/error-page/403.html');
				exit;
			}

			if(!isset($_SESSION['user'])){
				header('Location:' . APP_URL . 'Index/defaultView');
				exit;
			}
			$r = isset($_SESSION['user_right']) ? $_SESSION['user_right'] : false;
			if(!$r){
				header('Location:' . APP_URL . 'Index/defaultView');
				exit;
			}
			
			if($allow === 'all'){
				return;
			}

			foreach ($allow as $value){
				if($value == $r){
					return;
				}
			}
			header('Location:' . APP_URL . 'public/error-page/403.html');
			exit;
		}

		public static function calRestTime($l, $r, $arr)
		{
			$lowPayedTime = 0;
			$highPayedTime = 0;
			$restTime = 0;
			$workTime = 0;
			foreach ($arr as $key=>$value) {
				$arr[$key][0] *= 60;
				$arr[$key][1] *= 60;
				$restTime += $value[1] - $value[0];
			}
			$workTime = 1440*60 - $restTime;

			$d = floor(($r - $l)/86400);
			$lowPayedTime += $d*$workTime;
			$highPayedTime += $d*$restTime;

			$l = date('H', $l)*3600+date('i', $l)*60+date('s', $l);
			$r = date('H', $r)*3600+date('i', $r)*60+date('s', $r);

			if($l<$r){
				$tol = $r-$l;
				$high = 0;
				foreach ($arr as $value) {
					$ma = max($l, $value[0]);
					$mi = min($r, $value[1]);
					if($ma<$mi)
						$high += $mi-$ma;
				}
				$lowPayedTime += $tol-$high;
				$highPayedTime += $high;
			}else if($l>$r){
				$tol = 1440 - ($l-$r);
				$high = 0;
				foreach ($arr as $value) {
					$ma = max($l, $value[0]);
					$mi = min(1440, $value[1]);
					if($ma<$mi)
						$high += $mi-$ma;
					$ma = max(0, $value[0]);
					$mi = min($r, $value[1]);
					if($ma<$mi)
						$high += $mi-$ma;
				}
				$lowPayedTime += $tol-$high;
				$highPayedTime += $high;
			}
			return [$lowPayedTime, $highPayedTime];
		}
	}
?>