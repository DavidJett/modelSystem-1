<?php
	class AdminModel extends Model
	{
		public function getFinishedModels()
		{
			$sql = 'select id, code from model_info where finishTime is not null';
			return $this->query($sql, array());
		}

		public function getDept()
		{
			$sql = 'select id,name,isPlan,rightId,hasMachine from dept_info where rightId<>1 and isActive=1';
			return $this->query($sql ,array());
		}

		public function getRight()
		{
			$sql = 'select id,name from right_info where id<>1';
			$tmp = $this->query($sql ,array());
			$res = [];
			foreach ($tmp as $value) {
				$res[$value['id']] = $value['name'];
			}
			return $res;
		}

		public function deptSave($id, $name, $isPlan, $hasMachine, $rightId)
		{
			$sql = 'update dept_info set name=?,isPlan=?,hasMachine=?,rightId=? where id=?';
			return $this->execute($sql, array($name, $isPlan, $hasMachine, $rightId, $id));
		}

		public function deptRemove($id)
		{
			$sql = 'select id from user_info where isActive=1 and deptId=?';
			$res = $this->query($sql, array($id));
			if(count($res) != 0)
				return false;
			$sql = 'select id from machine_info where isActive=1 and belongedDept=?';
			$res = $this->query($sql, array($id));
			if(count($res) != 0)
				return false;
			$sql = 'update dept_info set isActive=0 where id=?';
			return $this->execute($sql, array($id));
		}

		public function deptAdd($name, $isPlan, $hasMachine, $rightId)
		{
			$sql = 'insert into dept_info (name,isPlan,hasMachine,rightId)values(?,?,?,?)';
			return $this->execute($sql, array($name, $isPlan, $hasMachine, $rightId));
		}

		public function getWorker()
		{
			$sql = 'select ui.id, ui.name, ui.phoneNum, ui.deptId from user_info as ui left join dept_info di on ui.deptId=di.id where ui.isActive=1 and di.rightId<>1 order by ui.deptId';
			return $this->query($sql ,array());
		}

		public function getWorkerById($id)
		{
			$sql = 'select id, name, phoneNum, deptId from user_info where isActive=1 and id=?';
			return $this->query($sql ,array($id))[0];
		}

		public function getWorkerByDeptId($id)
		{
			$sql = 'select id, name, phoneNum, deptId from user_info where isActive=1 and deptId=?';
			return $this->query($sql ,array($id));
		}

		public function getWorkerDept()
		{
			$sql = 'select id, name from dept_info where rightId <> 1 and isActive=1';
			$tmp = $this->query($sql, array());
			$res = [];
			foreach ($tmp as $value) {
				$res[$value['id']] = $value['name'];
			}
			return $res;
		}

		public function workerSave($id, $name, $phoneNum, $deptId)
		{
			$sql = 'select id from dept_info where id=? and isActive=1';
			$res = $this->query($sql, array($deptId));
			if(count($res) == 0){
				return false;
			}
			$sql = 'update user_info set name=?,phoneNum=?,deptId=? where id=?';
			return $this->execute($sql, array($name, $phoneNum, $deptId, $id));
		}

		public function workerRemove($id)
		{
			$sql = 'select id from part_task_list where userId=? and finishTime is null limit 1';
			$res = $this->query($sql, array($id));
			if(count($res) != 0){
				return false;
			}
			$sql = 'update user_info set isActive=0 where id=?';
			return $this->execute($sql, array($id));
		}

		public function workerAdd($id, $name, $phoneNum, $deptId)
		{
			$sql = 'select id from dept_info where id=? and isActive=1';
			$res = $this->query($sql, array($deptId));
			if(count($res) == 0){
				return false;
			}
			$sql = 'insert into user_info (id,password,name,phoneNum,deptId) values(?,?,?,?,?)';
			return $this->execute($sql, array($id, '123456', $name, $phoneNum, $deptId));
		}

		public function getMachine()
		{
			$sql = 'select id,code,name,belongedDept as deptId,workType from machine_info where isActive=1 order by deptId';
			return $this->query($sql ,array());
		}

		public function getMachineByCodeAndName($code, $name)
		{
			$sql = 'select id,code,name,belongedDept as deptId,workType from machine_info where isActive=1 and code=? and name=?';
			return $this->query($sql ,array($code, $name));
		}

		public function getMachineByDeptId($id)
		{
			$sql = 'select id,code,name,belongedDept as deptId,workType from machine_info where isActive=1 and belongedDept=?';
			return $this->query($sql ,array($id));
		}

		public function getMachineDept()
		{
			$sql = 'select id, name from dept_info where hasMachine=1 and isActive=1';
			$tmp = $this->query($sql, array());
			$res = [];
			foreach ($tmp as $value) {
				$res[$value['id']] = $value['name'];
			}
			return $res;
		}

		public function machineSave($id, $name, $workWay, $deptId)
		{
			$sql = 'select id from dept_info where id=? and isActive=1';
			$res = $this->query($sql, array($deptId));
			if(count($res) == 0){
				return false;
			}
			$sql = 'update machine_info set name=?,workType=?,belongedDept=? where id=?';
			return $this->execute($sql, array($name, $workWay, $deptId, $id));
		}

		public function machineRemove($id)
		{
			$sql = 'select id from part_task_list where machineId=? and finishTime is null limit 1';
			$res = $this->query($sql, array($id));
			if(count($res) != 0){
				return false;
			}
			$sql = 'update machine_info set isActive=0 where id=?';
			return $this->execute($sql, array($id));
		}

		public function machineAdd($code, $name, $power, $workWay, $deptId)
		{
			$sql = 'select id from dept_info where id=? and isActive=1';
			$res = $this->query($sql, array($deptId));
			if(count($res) == 0){
				return false;
			}
			$sql = 'insert into machine_info (code,name,power,workType,belongedDept,isVirtual) values(?,?,?,?,?,?)';
			return $this->execute($sql, array($code, $name, $power, $workWay, $deptId, 0));
		}

		public function getRoughMachine($deptId)
		{
			if($deptId){
				$sql = 'select id,code,name,belongedDept as deptId from machine_info where isActive=1 and belongedDept=? order by belongedDept';
				return $this->query($sql ,array($deptId));
			}else{
				$sql = 'select id,code,name,belongedDept as deptId from machine_info where isActive=1 order by belongedDept';
				return $this->query($sql ,array());
			}
		}

		public function getRoughWorker($deptId)
		{
			if($deptId){
				$sql = 'select id,name,deptId from user_info where isActive=1 and deptId=? and deptId<>1 and deptId<>2 order by deptId';
				return $this->query($sql ,array($deptId));
			}else{
				$sql = 'select id,name,deptId from user_info where isActive=1 and deptId<>1 and deptId<>2 order by deptId';
				return $this->query($sql ,array());
			}
		}

		public function getRoughModel()
		{
			$sql = 'select id, code from model_info';
			return $this->query($sql, array());
		}

		public function getRoughPart($modelId)
		{
			$sql = 'select id,code,name from part_info where belongedModel=?';
			return $this->query($sql, array($modelId));
		}

		public function getTask($pageId, $modelId, $partId, $deptId, $machineId, $userId)
		{
			$pageCnt = 20;
			$param = array();
			$cntSql = 'select count(*) as cnt from part_task_list as ptl left join machine_info mai on ptl.machineId=mai.id left join part_info pi on ptl.belongedPart=pi.id left join model_info mi on pi.belongedModel=mi.id left join user_info ui on ptl.userId=ui.id where ptl.flag=1 ';
			$sql = 'select ptl.id as taskId,ptl.name as taskName,ptl.finishTime as isFinished,ptl.machineTime,ptl.lowPayedTime,ptl.highPayedTime,mai.code as machineCode,mai.name as machineName,pi.code as partCode,pi.name as partName,mi.code as modelCode,ui.id as userId,ui.name as userName from part_task_list as ptl left join machine_info mai on ptl.machineId=mai.id left join part_info pi on ptl.belongedPart=pi.id left join model_info mi on pi.belongedModel=mi.id left join user_info ui on ptl.userId=ui.id where ptl.flag=1 ';
			if($modelId){
				$cntSql .= 'and mi.id=? ';
				$sql .= 'and mi.id=? ';
				array_push($param, $modelId);
			}
			if($partId){
				$cntSql .= 'and pi.id=? ';
				$sql .= 'and pi.id=? ';
				array_push($param, $partId);
			}
			if($deptId){
				$cntSql .= 'and ui.deptId=? ';
				$sql .= 'and ui.deptId=? ';
				array_push($param, $deptId);
			}
			if($machineId){
				$cntSql .= 'and mai.id=? ';
				$sql .= 'and mai.id=? ';
				array_push($param, $machineId);
			}
			if($userId){
				$cntSql .= 'and ui.id=?';
				$sql .= 'and ui.id=? ';
				array_push($param, $userId);
			}
			$sql .= 'order by ptl.startTime DESC limit '.$pageId*$pageCnt.','.$pageCnt;
			$task = $this->query($sql, $param);
			$total = $this->query($cntSql, $param);
			foreach ($task as $key => $value) {
				$isFinished = $task[$key]['isFinished'];
				if($isFinished!=null){
					$task[$key]['isFinished'] = 1;
				}else{
					$task[$key]['isFinished'] = 0;
				}
				$lowPayedTime = floatval($task[$key]['lowPayedTime']);
				$highPayedTime = floatval($task[$key]['highPayedTime']);
				$machineTime = floatval($task[$key]['machineTime']);
				$task[$key]['lowPayedTime'] = sprintf("%.2f", $lowPayedTime/3600);
				$task[$key]['highPayedTime'] = sprintf("%.2f", $highPayedTime/3600);
				$task[$key]['machineTime'] = sprintf("%.2f", $machineTime/3600);
			}
			$cnt = intval($total[0]['cnt']);
			$pageMx = floor($cnt/$pageCnt);
			if($cnt%$pageCnt != 0){
				$pageMx++;
			}
			return [$task,$pageMx];
		}

		public function taskSave($id, $low, $high, $machine)
		{
			$sql = 'update part_task_list set lowPayedTime=?,highPayedTime=?,machineTime=? where id=?';
			return $this->execute($sql, array($low*3600, $high*3600, $machine*3600, $id));
		}

		public function removeModel($id)
		{
			$sqls = [
					'insert into dump_model_info(id,code,startTime,finishTime) select id,code,startTime,finishTime from model_info where id=?',
					'insert into dump_part_info(id,code,name,belongedModel,amount) select id,code,name,belongedModel,amount from part_info where belongedModel=?',
					'insert into dump_part_task_list(id,name,belongedPart,machineId,startTime,finishTime,lowPayedTime,highPayedTime,userId,curStartTime,userTime,flag,state,lowWage,highWage,machineTime) select ptl.id,ptl.name,ptl.belongedPart,ptl.machineId,ptl.startTime,ptl.finishTime,ptl.lowPayedTime,ptl.highPayedTime,ptl.userId,ptl.curStartTime,ptl.userTime,ptl.flag,ptl.state,ptl.lowWage,ptl.highWage,ptl.machineTime from part_task_list as ptl left join part_info pi on ptl.belongedPart=pi.id where pi.belongedModel=?',
					'delete from part_task_list using part_task_list,part_info where part_task_list.belongedPart=part_info.id and part_info.belongedModel=?',
					'delete from model_info where id=?',
					'delete from part_info where belongedModel=?'
					];
			$parms = array(
					array($id),
					array($id),
					array($id),
					array($id),
					array($id),
					array($id)
				);
			return $this->executeAffair($sqls, $parms);
		}

		public function resetModel($id)
		{
			$sql = 'update model_info set finishTime=? where id=?';
			return $this->execute($sql, array(null, $id));
		}
	}
?>