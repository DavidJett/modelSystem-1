<?php
	class IndexController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'loginView';
			$this->view = new View($this->controller, $this->action);
			$this->loginView();
		}

		public function loginView()
		{
			$this->render();
		}

		public function validate()
		{
			$indexModel = new IndexModel;
			$indexModel->validate($_POST['username'], $_POST['password']);
		}

		public function modifyPassword()
		{
			$indexModel = new IndexModel;
			$indexModel->modifyPassword($_POST['username'], $_POST['oldPassword'], $_POST['newPassword']);
		}

		public function downloadReport()
		{
			Core::rightFilter('all');
			$date = $_POST['date'];
			$cache = $_POST['cache'];
			$date = explode('~', $date);
			$start = intval(strtotime($date[0]));
			$end = intval(strtotime($date[1]))+86400;
			$this->makeReport($cache, $start, $end, $date[0].'---'.$date[1].'.xlsx', "从${date[0]} 00:00 到 ${date[1]} 23:59 的任务报表");

		}

		private function makeReport($cache, $l, $r, $name, $message)
		{
			Core::rightFilter('all');
			$path = DATA_PATH . 'report/';
			$reportPath = $path . $name;
			$lockFile = dirname(__FILE__) . "/report.lock";
			$fp = fopen($lockFile, 'w+');
			if(flock($fp, LOCK_EX)){
				if($cache == 'false' || !file_exists($reportPath)){
					$indexModel = new IndexModel;
					$tasks = $indexModel->getTasks($l, $r);
					copy($path.'template.xlsx',$reportPath);
					require_once PUBLIC_PATH.'/phpExcel/Classes/PHPExcel/IOFactory.php';
					$excel = PHPExcel_IOFactory::load($reportPath);
					$sheet = $excel->getActiveSheet(0);
					$sheet->setCellValue('A1', $message);
					$column = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
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
					for($j=0;$j<14;$j++){
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
					$writer->save($reportPath);
				}
				flock($fp, LOCK_UN);
			}
			echo $name;
		}

		public function printReport($name)
		{
			$reportPath = DATA_PATH . 'report/' . $name;
			$file = fopen($reportPath, 'r');
			$size = filesize($reportPath);
			ob_get_clean();
			Header('Expires: 0');
			Header("Content-type:text/plain");
			Header("Accept-Ranges: bytes");
			Header("Accept-Length:" . $size); 
			header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
			Header('Content-Disposition: attachment; filename="'.$name.'"');
			header("Pragma: public");
			$data = fread($file, $size);
			echo $data;
			fclose($file);
		}
}
?>