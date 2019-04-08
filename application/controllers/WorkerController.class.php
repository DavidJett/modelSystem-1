<?php
	class WorkerController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'workerView';
			$this->view = new View($this->controller, $this->action);
			$this->workerView();
		}

		public function workerView()
		{
			Core::rightFilter(['1', '4', '8']);
			$this->render();
		}

		public function refreshPending()
		{
			Core::rightFilter(['1', '4', '8']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$workerModel = new WorkerModel;
			echo json_encode($workerModel->getPendingTasks($userId), JSON_UNESCAPED_UNICODE);
		}

		public function refreshRunning()
		{
			Core::rightFilter(['1', '4', '8']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$workerModel = new WorkerModel;
			echo json_encode($workerModel->getRunningTasks($userId), JSON_UNESCAPED_UNICODE);
		}

		public function accept()
		{
			Core::rightFilter(['1', '4', '8']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$workerModel = new WorkerModel;
			if($workerModel->accept($_POST['taskId'], $userId)){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function reject()
		{
			Core::rightFilter(['1', '4', '8']);
			if(!isset($_SESSION['user'])){
				return;
			}else{
				$userId = $_SESSION['user'];
			}
			$workerModel = new WorkerModel;
			if($workerModel->reject($_POST['taskId'], $userId)){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function startTask()
		{
			Core::rightFilter(['1', '4', '8']);
			$workerModel = new WorkerModel;
			if($workerModel->startTask($_POST['taskId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function pauseTask()
		{
			Core::rightFilter(['1', '4', '8']);
			$workerModel = new WorkerModel;
			if($workerModel->pauseTask($_POST['taskId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function endTask()
		{
			Core::rightFilter(['1', '4', '8']);
			$workerModel = new WorkerModel;
			if($workerModel->endTask($_POST['taskId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}
	}
?>