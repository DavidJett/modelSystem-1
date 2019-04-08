<?php
	class PlannerModel extends Model
	{
		public function getTasks()
		{
			$sql = 'select mi.id as machineId, mi.code as machineCode, mi.name as machineName, di.name as deptName, mi.workType as workType from machine_info as mi left join dept_info di on mi.belongedDept = di.id where mi.isActive=1 and di.isActive=1';
			$machines = $this->query($sql, array());
			$machinesMap = [];
			$machinesVis = [];
			foreach ($machines as $key=>$value) {
				$id = strval($value['machineId']);
				if($value['workType'] == '0'){
					$workType = REST_TIME_8;
				}else if($value['workType'] == '1'){
					$workType = REST_TIME_16;
				}else{
					$workType = '[]';
				}
				$machinesMap[$id] = ['id'=>$id, 'code'=>$value['machineCode'], 'name'=>$value['machineName'], 'dept'=>$value['deptName'], 'resttime'=>$workType];
				$machinesVis[$id] = false;
			}

			$planPath = DATA_PATH . 'palnnerData.txt';
			$planFile = fopen($planPath, 'r');
			if(!$planFile){
				$res = [];
				foreach ($machinesMap as $key => $value) {
					$res[$key] = [];
					$res[$key][0] = $value;
					$res[$key][1] = [];
				}
				return json_encode($res, JSON_UNESCAPED_UNICODE);
			}
			$fileSize = filesize($planPath);
			if($fileSize == 0){
				$res = [];
			}else{
				$str = fread($planFile, $fileSize);
				$res = json_decode($str, true);
			}
			foreach ($res as $key => $value) {
				if(isset($machinesVis[$key])){
					foreach ($machinesMap[$key] as $k => $val) {
						$res[$key][0][$k] = $val;
					}
					$machinesVis[$key] = true;
				}else{
					unset($res[$key]);
				}
			}
			foreach ($machinesVis as $key => $value) {
				if(!$value){
					$res[$key] = [];
					$res[$key][0] = $machinesMap[$key];
					$res[$key][1] = [];
				}
			}
			fclose($planFile);
			return $this->abjust($res);
		}

		public function getActiveModels()
		{
			$sql = 'select id, code from model_info where finishTime is null';
			return $this->query($sql, array());
		}

		public function getFinishedModels()
		{
			$sql = 'select id, code from model_info where finishTime is not null';
			return $this->query($sql, array());
		}

		public function getParts($modelId)
		{
			$sql = 'select id, code, name, amount from part_info where belongedModel=? and code<>\'PROCODE\' and code<>\'DSNCODE\'';
			return $this->query($sql, array($modelId));
		}

		public function getDepts()
		{
			$sql = 'select id, name from dept_info where isPlan=1 and isActive=1';
			return $this->query($sql, array());
		}

		public function getWorkers($deptId)
		{
			$sql = 'select id,name from user_info where deptId = ? and isActive=1';
			return $this->query($sql, array($deptId));
		}

		public function publish($id, $deptId, $workerId, $modelId, $partId, $procedureName, $machineId)
		{
			if($workerId!=null && $workerId!=''){
				$sql = 'select id from pending_task where id=? and workerId=?';
				$res = $this->query($sql, array($id, $workerId));
				if(count($res)==0){
					$sql = 'insert into pending_task (id,workerId,modelId,partId,procedureName,state,machineId,publishTime) values(?,?,?,?,?,?,?,?)';
					return $this->execute($sql, array($id, $workerId, $modelId, $partId, $procedureName, 1, $machineId, time()));
				}else{
					$sql = 'update pending_task set state=?, modelId=?, partId=?, procedureName=?, machineId=?, publishTime=? where id=? and workerId=?';
					return $this->execute($sql, array(1, $modelId, $partId, $procedureName, $machineId, time(), $id, $workerId));
				}
			}else{
				$sql = 'select id from user_info where deptId=?';
				$res = $this->query($sql, array($deptId));
				foreach ($res as $value) {
					$sql = 'select id from pending_task where id=? and workerId=?';
					$res = $this->query($sql, array($id, $value['id']));
					if(count($res)==0){
						$sql = 'insert into pending_task (id,workerId,modelId,partId,procedureName,state,machineId,publishTime) values(?,?,?,?,?,?,?,?)';
					$this->execute($sql, array($id, $value['id'], $modelId, $partId, $procedureName, 1, $machineId, time()));
					}else{
						$sql = 'update pending_task set state=?, modelId=?, partId=?, procedureName=?, machineId=?, publishTime=? where id=? and workerId=?';
					$this->execute($sql, array(1, $modelId, $partId, $procedureName, $machineId, time(), $id, $value['id']));
					}
				}
				return true;
			}
		}

		public function getState($id)
		{
			$sql = 'select state from pending_task where id=?';
			$res = $this->query($sql, array($id));
			$priority = ['4','2','1','3'];
			foreach ($priority as $value) {
				foreach ($res as $val) {
					if($val['state'] == $value){
						return $value;
					}
				}
			}
			return 'null';
		}

		public function abjust($res)
		{
			$sql = 'select id, state from pending_task';
			$pendTask = $this->query($sql, array());
			$pendTaskMap = [];
			$pendTaskVis = [];
			$priority = ['4','2','1','3'];
			foreach ($pendTask as $value) {
				$id = $value['id'];
				$state = $value['state'];
				if(!array_key_exists($id, $pendTaskMap) || array_search($state, $priority)<array_search($pendTaskMap[$id], $priority)){
					$pendTaskMap[$id] = $state;
				}
				$pendTaskVis[$id] = false;
			}
			foreach ($res as $key=>$value) {
				foreach ($value[1] as $k=>$val) {
					$id = $val['id'];
					$state = $val['state'];
					if(isset($pendTaskMap[$id])){
						$pendTaskVis[$id] = true;
						$res[$key][1][$k]['state'] = $pendTaskMap[$id];
					}
				}
			}
			foreach ($pendTaskVis as $key => $value) {
				if(!$value){
					$sql = 'delete from pending_task where id=?';
					$this->execute($sql, array($key));
				}
			}
			return json_encode($res, JSON_UNESCAPED_UNICODE);
		}

		public function finishCheck($id)
		{
			$sql = 'select ptl.id from part_task_list as ptl left join part_info pi on ptl.belongedPart=pi.id where pi.belongedModel=? and ptl.finishTime is null limit 1';
			$res = $this->query($sql, array($id));
			if(count($res) == 0){
				return true;
			}else{
				return false;
			}
		}

		public function finishModel($id)
		{
			$sql = 'update model_info set finishTime=? where id=?';
			return $this->execute($sql, array(time(), $id));
		}

		public function getModelCodeById($id)
		{
			$sql = 'select code from model_info where id=?';
			return $this->query($sql, array($id))[0]['code'];
		}

		public function getTasksByModel($id)
		{
			$sql = 'select pi.code as partCode,pi.name as partName,ptl.name as taskName,mai.code as machineCode,mai.name as machineName,mdi.name as machineDept,ui.id as userId,ui.name as userName,udi.name as userDept,ptl.startTime,ptl.finishTime,ptl.machineTime,ptl.userTime from part_task_list as ptl left join part_info pi on ptl.belongedPart=pi.id left join model_info mi on pi.belongedModel=mi.id left join machine_info mai on ptl.machineId=mai.id left join user_info ui on ptl.userId=ui.id left join dept_info udi on ui.deptId=udi.id left join dept_info mdi on mai.belongedDept=mdi.id where ptl.flag=1 and mi.id=? order by mdi.id';
			return $this->query($sql, array($id));
		}

		public function getProcedure()
		{
			$path = DATA_PATH . 'procedureData.txt';
			$file = fopen($path, 'r');

			if(!$file){
				return '[]';
			}else{
				$size = filesize($path);
				if($size == 0){
					return '[]';
				}else{
					return fread($file, $size);
				}
			}
		}

		public function addProcedure($name)
		{
			$path = DATA_PATH . 'procedureData.txt';
			$file = fopen($path, 'r');

			if(!$file){
				return false;
			}else{
				$size = filesize($path);
				$str = fread($file, $size);
				$arr = json_decode($str, true);
				$arr[$name] = true;
				fclose($file);
				file_put_contents($path, json_encode($arr, JSON_UNESCAPED_UNICODE));
				return true;
			}
		}

		public function delProcedure($name)
		{
			$path = DATA_PATH . 'procedureData.txt';
			$file = fopen($path, 'r');

			if(!$file){
				return false;
			}else{
				$size = filesize($path);
				$str = fread($file, $size);
				$arr = json_decode($str, true);
				unset($arr[$name]);
				fclose($file);
				file_put_contents($path, json_encode($arr, JSON_UNESCAPED_UNICODE));
				return true;
			}
		}
	}
?>