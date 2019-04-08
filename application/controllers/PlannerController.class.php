<?php
	class PlannerController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'plannerView';
			$this->view = new View($this->controller, $this->action);
			$this->plannerView();
		}

		public function plannerView()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			$tasks = $plannerModel->getTasks();
			$procedure = $plannerModel->getProcedure();
			$activeModels = json_encode($plannerModel->getActiveModels(), JSON_UNESCAPED_UNICODE);
			$finishedModels = json_encode($plannerModel->getFinishedModels(), JSON_UNESCAPED_UNICODE);
			$depts = json_encode($plannerModel->getDepts(), JSON_UNESCAPED_UNICODE);
			$this->assign('tasks', $tasks);
			$this->assign('procedures', $procedure);
			$this->assign('activeModels', $activeModels);
			$this->assign('finishedModels', $finishedModels);
			$this->assign('depts', $depts);
			$this->render();
		}

		public function procedureView()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			$procedure = $plannerModel->getProcedure();
			$this->assign('procedures', $procedure);
			$this->render();
		}

		public function getParts()
		{
			Core::rightFilter(['1', '3', '7']);
			$plannerModel = new PlannerModel;
			echo json_encode($plannerModel->getParts($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function getWorkers()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			echo json_encode($plannerModel->getWorkers($_POST['id']), JSON_UNESCAPED_UNICODE);
		}

		public function save()
		{
			Core::rightFilter(['1', '3']);
			if(!isset($_POST['data'])){
				echo 'fail';
				return;
			}
			$plannerModel = new PlannerModel;
			$planPath = DATA_PATH . 'palnnerData.txt';
			$data = $_POST['data'];
			$data = $plannerModel->abjust(json_decode($data, true));
			if(is_writable($planPath)){
				file_put_contents($planPath, $data, LOCK_EX);
			}
			echo 'success';
		}

		public function publish()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			if($plannerModel->publish($_POST['id'], $_POST['deptId'], $_POST['workerId'], $_POST['modelId'], $_POST['partId'], $_POST['procedureName'], $_POST['machineId'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function getState()
		{
			Core::rightFilter(['1', '3', '7']);
			$plannerModel = new PlannerModel;
			echo $plannerModel->getState($_POST['id']);
		}

		public function finishCheck()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			if($plannerModel->finishCheck($_POST['id'])){
				echo 'yes';
			}else{
				echo 'no';
			}
		}

		public function finishModel()
		{
			Core::rightFilter(['1', '3']);
			$lockFile = dirname(__FILE__) . "/finishModel.lock";
			$fp = fopen($lockFile, 'w+');
			if(flock($fp, LOCK_EX)){
				$plannerModel = new PlannerModel;
				$id = $_POST['id'];
				$code = $plannerModel->getModelCodeById($id);
				$tasks = $plannerModel->getTasksByModel($id);
				$path = DATA_PATH . 'task/';
				copy($path.'template.xlsx',$path.$id.'.xlsx');
				$path = $path.$id.'.xlsx';
				require_once PUBLIC_PATH.'/phpExcel/Classes/PHPExcel/IOFactory.php';
				$excel = PHPExcel_IOFactory::load($path);
				$sheet = $excel->getActiveSheet(0);
				$sheet->setCellValue('A1', $code);
				$column = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
				foreach ($tasks as $key => $value) {
					$r = $key+4;
					$index = 0;
					foreach ($value as $k => $val) {
						$c = $column[$index++];
						$pos = $c.$r;
						if($k=='startTime'||$k=='finishTime'){
							$sheet->setCellValue($pos, date('Y-m-d H:i:s', $val));
						}else if($k=='machineTime'||$k=='userTime'){
							$h = round($val/3600, 2);
							$sheet->setCellValue($pos, "${h}");
						}else{
							$sheet->setCellValue($pos, $val);
						}
					}
				}
				$len = count($tasks)+3;
				for($j=0;$j<13;$j++){
					$ma = 0;
					for($i=3;$i<=$len;$i++){
						$w = mb_strlen($sheet->getCell($column[$j].$i)->getValue());
						if($w>$ma){
							$ma = $w;
						}
					}
					$sheet->getColumnDimension($column[$j])->setWidth($ma);
				}
				$writer = PHPExcel_IOFactory::createWriter($excel, 'Excel2007');
				$writer->save($path);
				if($plannerModel->finishModel($_POST['id'])){
					echo "success";
				}else{
					echo "fail";
				}
				flock($fp, LOCK_UN);
			}
		}

		public function downloadExcel($id)
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			$path = DATA_PATH . 'task/' . $id . '.xlsx';
			if(!file_exists($path)){
				echo '<h2>文件不存在!</h2>';
				exit;
			}
			$code = $plannerModel->getModelCodeById($id);
			$file = fopen($path, 'r');
			$size = filesize($path);
			ob_get_clean();
			Header('Expires: 0');
			Header("Content-type:text/plain");
			Header("Accept-Ranges: bytes");
			Header("Accept-Length:" . $size); 
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0" );
			Header("Content-Disposition: attachment; filename=" . $code.'.xlsx');
			header("Pragma: public");
			$data = fread($file, $size);
			echo $data;
			fclose($file);
		}

		public function delProcedure()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			if($plannerModel->delProcedure($_POST['name'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}

		public function addProcedure()
		{
			Core::rightFilter(['1', '3']);
			$plannerModel = new PlannerModel;
			if($plannerModel->addProcedure($_POST['name'])){
				echo 'success';
			}else{
				echo 'fail';
			}
		}
	}
?>