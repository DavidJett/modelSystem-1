<?php
	class AdminController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'workerView';
			$this->view = new View($this->controller, $this->action);
			$this->workerView();
		}

		public function deptView()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			$this->assign('dept', $adminModel->getDept());
			$this->assign('right', $adminModel->getRight());
			$this->render();
		}

		public function workerView()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			$this->assign('finishedModels', $adminModel->getFinishedModels());
			$this->assign('worker', $adminModel->getWorker());
			$this->assign('dept', $adminModel->getWorkerDept());
			$this->render();
		}

		public function machineView()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			$this->assign('finishedModels', $adminModel->getFinishedModels());
			$this->assign('machine', $adminModel->getMachine());
			$this->assign('dept', $adminModel->getMachineDept());
			$this->render();
		}

		public function taskView()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			$this->assign('finishedModels', $adminModel->getFinishedModels());
			$this->assign('dept', $adminModel->getWorkerDept());
			$this->assign('model', $adminModel->getRoughModel());
			$param = func_get_args();

			$modelId = (!isset($param[0])||$param[0]=='-1')?null:$param[0];
			$partId = (!isset($param[1])||$param[1]=='-1')?null:$param[1];
			$deptId = (!isset($param[2])||$param[2]=='-1')?null:$param[2];
			$machineId = (!isset($param[3])||$param[3]=='-1')?null:$param[3];
			$workerId = (!isset($param[4])||$param[4]=='-1')?null:$param[4];
			$pageId = isset($param[5])?$param[5]:0;
			if($modelId){
				$this->assign('part', $adminModel->getRoughPart($modelId));
			}else{
				$this->assign('part', []);
			}
			$this->assign('worker', $adminModel->getRoughWorker($deptId));
			$this->assign('machine', $adminModel->getRoughMachine($deptId));

			$this->assign('modelId', $modelId);
			$this->assign('partId', $partId);
			$this->assign('deptId', $deptId);
			$this->assign('machineId', $machineId);
			$this->assign('workerId', $workerId);
			$this->assign('pageId', $pageId);

			$this->assign('task', $adminModel->getTask($pageId,$modelId,$partId,$deptId,$machineId,$workerId));
			$this->render();
		}

		public function deptSave()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->deptSave($_POST['id'], $_POST['name'], $_POST['isPlan'], $_POST['hasMachine'], $_POST['rightId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function deptRemove()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->deptRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function deptAdd()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->deptAdd($_POST['name'], $_POST['isPlan'], $_POST['hasMachine'], $_POST['rightId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getWorker()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getWorker(), JSON_UNESCAPED_UNICODE);
		}

		public function getWorkerById()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getWorkerById($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function getWorkerByDeptId()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getWorkerByDeptId($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function workerSave()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->workerSave($_POST['id'], isset($_POST['name'])?$_POST['name']:null, isset($_POST['phoneNum'])?$_POST['phoneNum']:null, $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function workerRemove()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->workerRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function workerAdd()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->workerAdd($_POST['id'], isset($_POST['name'])?$_POST['name']:null, isset($_POST['phoneNum'])?$_POST['phoneNum']:null, $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getMachine()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getMachine(), JSON_UNESCAPED_UNICODE);
		}

		public function getMachineByCodeAndName()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getMachineByCodeAndName($_POST['code'], $_POST['name']), JSON_UNESCAPED_UNICODE);
		}

		public function getMachineByDeptId()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getMachineByDeptId($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function machineSave()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->machineSave($_POST['id'], isset($_POST['name'])?$_POST['name']:null, $_POST['workWay'], $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function machineRemove()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->machineRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function machineAdd()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->machineAdd($_POST['code'], isset($_POST['name'])?$_POST['name']:null, $_POST['power'], $_POST['workWay'], $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getPartByModelId()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			echo json_encode($adminModel->getRoughPart($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function taskSave()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->taskSave($_POST['id'],$_POST['lowPayedTime'],$_POST['highPayedTime'],$_POST['machineTime']))
				echo 'success';
			else
				echo 'fail';
		}

		public function removeModel()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->removeModel($_POST['id'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function resetModel()
		{
			Core::rightFilter(['1', '2']);
			$adminModel = new AdminModel;
			if($adminModel->resetModel($_POST['id'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}
	}
?>