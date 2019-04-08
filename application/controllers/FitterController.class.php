<?php
	class FitterController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'fitterView';
			$this->view = new View($this->controller, $this->action);
			$this->fitterView();
		}

		public function fitterView()
		{
			Core::rightFilter(['1', '9']);
			if(!isset($_SESSION['user'])){
				header('Location:' . APP_URL . 'Index/defaultView');
				exit;
			}else{
				$userId = $_SESSION['user'];
			}
			$fitterModel = new FitterModel;
			$this->assign('members', json_encode($fitterModel->getMembers($userId), JSON_UNESCAPED_UNICODE));
			$this->render();
		}

		public function refreshPending()
		{
			Core::rightFilter(['1', '9']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$fitterModel = new FitterModel;
			echo json_encode($fitterModel->getPendingTasks($userId), JSON_UNESCAPED_UNICODE);
		}

		public function refreshRunning()
		{
			Core::rightFilter(['1', '9']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$fitterModel = new FitterModel;
			echo json_encode($fitterModel->getRunningTasks($userId), JSON_UNESCAPED_UNICODE);
		}

		public function accept()
		{
			Core::rightFilter(['1', '9']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$fitterModel = new FitterModel;
			if($fitterModel->accept($_POST['taskId'], $_POST['members'], $userId)){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function reject()
		{
			Core::rightFilter(['1', '9']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$fitterModel = new FitterModel;
			if($fitterModel->reject($_POST['taskId'], $userId)){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function startTask()
		{
			Core::rightFilter(['1', '9']);
			$fitterModel = new FitterModel;
			if($fitterModel->startTask($_POST['taskId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function pauseTask()
		{
			Core::rightFilter(['1', '9']);
			$fitterModel = new FitterModel;
			if($fitterModel->pauseTask($_POST['taskId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function endTask()
		{
			Core::rightFilter(['1', '9']);
			$fitterModel = new FitterModel;
			if($fitterModel->endTask($_POST['taskId'], $_POST['machineTime'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}
	}
?>