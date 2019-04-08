<?php
	class ShowModel extends Model
	{
		public function getData()
		{
			$sql = 'select ptl.machineId, mi.code as modelCode, pi.code as partCode, pi.name as partName, ptl.name as taskName, ptl.userId, ui.name, ptl.startTime from part_task_list as ptl left join part_info pi on ptl.belongedPart = pi.id left join model_info mi on pi.belongedModel = mi.id left join user_info ui on ptl.userId = ui.id where ptl.flag =1 and ptl.finishTime is null';
			$tasks = $this->query($sql, array());
			$sql = 'select mi.id as machineId, mi.code as machineCode, mi.name as machineName, di.name as deptName from machine_info as mi left join dept_info di on mi.belongedDept=di.id where mi.isActive=1 and mi.isVirtual=0 and di.isActive=1 order by mi.belongedDept';
			$machies = $this->query($sql, array());

			$tmp = [];
			foreach ($tasks as $value) {
				$tmp[$value['machineId']] = [
												'modelCode'=>$value['modelCode'],
												'partCode'=>$value['partCode'],
												'partName'=>$value['partName'],
												'taskName'=>$value['taskName'],
												'userId'=>$value['userId'],
												'userName'=>$value['name'],
												'startTime'=>$value['startTime'],
												'totalTime'=>(time()-$value['startTime'])
											];
			}
			$res = [];
			foreach ($machies as $key => $value) {
				$id = $value['machineId'];
				if(isset($tmp[$id])){
					$res[$key] = $tmp[$id];
					$res[$key]['deptName'] = $value['deptName'];
					$res[$key]['machineCode'] = $value['machineCode'];
					$res[$key]['machineName'] = $value['machineName'];
					$res[$key]['state'] = '1';
				}else{
					$def = '-';
					$res[$key]['modelCode'] = $def;
					$res[$key]['partCode'] = $def;
					$res[$key]['partName'] = $def;
					$res[$key]['taskName'] = $def;
					$res[$key]['userId'] = $def;
					$res[$key]['userName'] = $def;
					$res[$key]['startTime'] = $def;
					$res[$key]['totalTime'] = $def;
					$res[$key]['machineCode'] = $value['machineCode'];
					$res[$key]['machineName'] = $value['machineName'];
					$res[$key]['deptName'] = $value['deptName'];
					$res[$key]['state'] = '0';
				}
			}
			return $res;
		}
	}
?>