<?php
	class RootController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'workerView';
			$this->view = new View($this->controller, $this->action);
			$this->workerView();
		}

		public function deptView()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			$this->assign('dept', $rootModel->getDept());
			$this->assign('right', $rootModel->getRight());
			$this->render();
		}

		public function workerView()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			$this->assign('finishedModels', $rootModel->getFinishedModels());
			$this->assign('worker', $rootModel->getWorker());
			$this->assign('dept', $rootModel->getWorkerDept());
			$this->render();
		}

		public function machineView()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			$this->assign('finishedModels', $rootModel->getFinishedModels());
			$this->assign('machine', $rootModel->getMachine());
			$this->assign('dept', $rootModel->getMachineDept());
			$this->render();
		}

		public function taskView()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			$this->assign('finishedModels', $rootModel->getFinishedModels());
			$this->assign('dept', $rootModel->getWorkerDept());
			$this->assign('model', $rootModel->getRoughModel());
			$param = func_get_args();

			$modelId = (!isset($param[0])||$param[0]=='-1')?null:$param[0];
			$partId = (!isset($param[1])||$param[1]=='-1')?null:$param[1];
			$deptId = (!isset($param[2])||$param[2]=='-1')?null:$param[2];
			$machineId = (!isset($param[3])||$param[3]=='-1')?null:$param[3];
			$workerId = (!isset($param[4])||$param[4]=='-1')?null:$param[4];
			$pageId = isset($param[5])?$param[5]:0;
			if($modelId){
				$this->assign('part', $rootModel->getRoughPart($modelId));
			}else{
				$this->assign('part', []);
			}
			$this->assign('worker', $rootModel->getRoughWorker($deptId));
			$this->assign('machine', $rootModel->getRoughMachine($deptId));

			$this->assign('modelId', $modelId);
			$this->assign('partId', $partId);
			$this->assign('deptId', $deptId);
			$this->assign('machineId', $machineId);
			$this->assign('workerId', $workerId);
			$this->assign('pageId', $pageId);

			$this->assign('task', $rootModel->getTask($pageId,$modelId,$partId,$deptId,$machineId,$workerId));
			$this->render();
		}

		public function deptSave()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->deptSave($_POST['id'], $_POST['name'], $_POST['isPlan'], $_POST['hasMachine'], $_POST['rightId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function deptRemove()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->deptRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function deptAdd()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->deptAdd($_POST['name'], $_POST['isPlan'], $_POST['hasMachine'], $_POST['rightId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getWorker()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getWorker(), JSON_UNESCAPED_UNICODE);
		}

		public function getWorkerById()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getWorkerById($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function getWorkerByDeptId()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getWorkerByDeptId($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function workerSave()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->workerSave($_POST['id'], isset($_POST['name'])?$_POST['name']:null, isset($_POST['lowWage'])?$_POST['lowWage']:null, isset($_POST['highWage'])?$_POST['highWage']:null, isset($_POST['social'])?$_POST['social']:null, isset($_POST['phoneNum'])?$_POST['phoneNum']:null, $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function workerRemove()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->workerRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function workerAdd()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->workerAdd($_POST['id'], isset($_POST['name'])?$_POST['name']:null, isset($_POST['lowWage'])?$_POST['lowWage']:null, isset($_POST['highWage'])?$_POST['highWage']:null, isset($_POST['social'])?$_POST['social']:null, isset($_POST['phoneNum'])?$_POST['phoneNum']:null, $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getMachine()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getMachine(), JSON_UNESCAPED_UNICODE);
		}

		public function getMachineByCodeAndName()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getMachineByCodeAndName($_POST['code'], $_POST['name']), JSON_UNESCAPED_UNICODE);
		}

		public function getMachineByDeptId()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getMachineByDeptId($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function machineSave()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->machineSave($_POST['id'], isset($_POST['name'])?$_POST['name']:null, $_POST['depreFee'],$_POST['power'], $_POST['workWay'], $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function machineRemove()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->machineRemove($_POST['id']))
				echo 'success';
			else
				echo 'fail';
		}

		public function machineAdd()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->machineAdd($_POST['code'], isset($_POST['name'])?$_POST['name']:null, $_POST['power'], $_POST['depreFee'], $_POST['workWay'], $_POST['deptId']))
				echo 'success';
			else
				echo 'fail';
		}

		public function getPartByModelId()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			echo json_encode($rootModel->getRoughPart($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function taskSave()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->taskSave($_POST['id'],$_POST['lowPayedTime'],$_POST['highPayedTime'],$_POST['machineTime']))
				echo 'success';
			else
				echo 'fail';
		}

		public function removeModel()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->removeModel($_POST['id'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function resetModel()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			if($rootModel->resetModel($_POST['id'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function upload()
		{
			Core::rightFilter(['1']);
			$rootModel = new RootModel;
			require_once PUBLIC_PATH.'/phpExcel/Classes/PHPExcel/IOFactory.php';
			$path = $_FILES['upfile']['tmp_name'];
			$sum = 0;
			$succ = 0;
			try{
				$excel = PHPExcel_IOFactory::load($path);
				$sheet = $excel->getActiveSheet(0);
				for($i=2;;$i++){
					$id = $sheet->getCell('A'.$i)->getValue();
					$lowWage = $sheet->getCell('C'.$i)->getValue();
					$highWage = $sheet->getCell('D'.$i)->getValue();
					$social = $sheet->getCell('E'.$i)->getValue();
					if(!$id){
						break;
					}
					if(!$lowWage) $lowWage = 0;
					if(!$highWage) $highWage = 0;
					if(!$social) $social = 0;
					if($rootModel->modifyWorker($id, $lowWage, $highWage, $social)){
						$succ ++;
					}
					$sum ++;
				}
			}catch(PHPExcel_Reader_Exception $e){}
			echo "一共读取了${sum}条记录, 成功执行了${succ}条记录";
			unlink($path);
		}
	}
?>