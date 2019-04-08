<?php
	class FitterModel extends Model
	{
		public function getMembers($userId)
		{
			$sql = 'select s.id,s.name from user_info as s left join user_info t on s.deptId=t.deptId where t.id=? and t.isActive=1';
			return $this->query($sql, array($userId));
		}

		public function getPendingTasks($userId)
		{
			$sql = 'select pt.id, pt.publishTime, mi.code as modelCode, pt.procedureName, mai.code as machineCode, mai.name as machineName from pending_task as pt left join model_info mi on pt.modelId=mi.id left join machine_info mai on pt.machineId=mai.id where pt.workerId=? and pt.state=1 and mai.isActive=1 order by pt.publishTime ASC';
			$res = $this->query($sql, array($userId));
			foreach ($res as $key => $value) {
				$res[$key]['publishTime'] = date("Y-m-d H:i:s", $res[$key]['publishTime']);
			}
			return $res;
		}

		public function getRunningTasks($userId)
		{
			$sql = 'select ptl.id, ptl.name, ptl.state, pi.code as partCode, pi.name as partName, mi.code as modelCode, mai.code as machineCode, mai.name as machineName, ptl.startTime, ptl.userTime, ptl.curStartTime from part_task_list as ptl left join part_info pi on ptl.belongedPart=pi.id left join model_info mi on pi.belongedModel=mi.id left join machine_info mai on ptl.machineId=mai.id where userId=? and flag=1 and ptl.finishTime is null order by ptl.startTime DESC';
			$res = $this->query($sql, array($userId));
			foreach ($res as $key => $value) {
				$userTime = floatval($res[$key]['userTime']);
				if($res[$key]['state'] == '1'){	
					$userTime += floatval(time()) - floatval($res[$key]['curStartTime']);
					$res[$key]['userTime'] = strval(floor($userTime/60));
				}else{
					$res[$key]['userTime'] = strval(floor($userTime/60));
				}
				$res[$key]['startTime'] = date("Y-m-d H:i:s", $res[$key]['startTime']);
				$res[$key]['curStartTime'] = date("Y-m-d H:i:s", $res[$key]['curStartTime']);
			}
			return $res;
		}

		public function accept($taskId, $members, $userId)
		{
			$sql = 'select partId, machineId, procedureName from pending_task where id=? and state=1 and workerId=?';
			$res = $this->query($sql, array($taskId, $userId));
			if(count($res) == 0){
				return false;
			}else{
				$sql = 'update pending_task set state=2 where id=? and workerId=?';
				if(!$this->execute($sql, array($taskId, $userId))){
					return false;
				}
				$lowWage = 0;
				$highWage = 0;
				foreach ($members as $value) {
					$sql = 'select lowWage, highWage, social from user_info where id=?';
					$tmp = $this->query($sql, array($value));
					$lowWage += (floatval($tmp[0]['lowWage'])+floatval($tmp[0]['social']));
					$highWage += floatval($tmp[0]['highWage']);
				}
				
				$sql = 'insert into part_task_list (name, belongedPart, machineId, startTime, lowWage, highWage, userId, state, pendTaskId) values(?,?,?,?,?,?,?,?,?)';
				$time = time();
				if(!$this->execute($sql, array($res[0]['procedureName'], $res[0]['partId'], $res[0]['machineId'], $time, $lowWage, $highWage, $userId, 0, $taskId))){
					return false;
				}
				return true;
			}
		}

		public function reject($taskId, $userId)
		{
			$sql = 'select id from pending_task where id=? and state=1 and workerId=?';
			$res = $this->query($sql, array($taskId, $userId));
			if(count($res) == 0)
				return false;
			$sql = 'update pending_task set state=3 where id=? and workerId=?';
			if(!$this->execute($sql, array($taskId, $userId))){
				return false;
			}
			return true;
		}

		public function startTask($taskId)
		{
			$sql = 'select id from part_task_list where id=? and state=0 and flag=1';
			$res = $this->query($sql, array($taskId));
			if(count($res) == 0)
				return false;
			$sql = 'update part_task_list set state=1, curStartTime=? where id=?';
			if(!$this->execute($sql, array(time(), $taskId))){
				return false;
			}
			return true;
		}

		public function pauseTask($taskId)
		{
			$sql = 'select userId, curStartTime, userTime, lowPayedTime, highPayedTime, workType from part_task_list as ptl left join machine_info mi on ptl.machineId=mi.id where ptl.id=? and state=1 and flag=1';
			$res = $this->query($sql, array($taskId));
			if(count($res) == 0)
				return false;
			$now = floatval(time());
			$userTime = floatval($res[0]['userTime']);
			$curStartTime = floatval($res[0]['curStartTime']);
			$lowPayedTime = floatval($res[0]['lowPayedTime']);
			$highPayedTime = floatval($res[0]['highPayedTime']);
			$userTime += $now - $curStartTime;
			$t = $this->calTime($curStartTime, $now, $res[0]['workType'], $res[0]['userId']);
			$lowPayedTime += $t[0];
			$highPayedTime += $t[1];
			$sql = 'insert into pause_time(userId,taskId,startTime,endTime) values(?,?,?,?)';
			$this->execute($sql, array($res[0]['userId'], $taskId, $curStartTime, $now));
			$sql = 'update part_task_list set state=0, userTime=?, lowPayedTime=?, highPayedTime=? where id=?';
			if(!$this->execute($sql, array(floor($userTime), floor($lowPayedTime), floor($highPayedTime), $taskId))){
				return false;
			}
			return true;
		}

		private function calTime($l, $r, $workType, $userId){
			$lowPayedTime = 0;
			$highPayedTime = 0;
			$sql = 'select finishTime, curStartTime from part_task_list where state<>0 and userId=? and (finishTime is null or finishTime>?)';
			$res = $this->query($sql, array($userId, $l));
			$sum = 0;
			foreach ($res as $value) {
				$finishTime = $value['finishTime'];
				$curStartTime = floatval($value['curStartTime']);
				if($finishTime == null){
					$sum += $r-max($curStartTime,$l);
				}else{
					$sum += floatval($finishTime) - max($curStartTime,$l);
				}
			}
			$sql = 'select startTime, endTime from pause_time where userId=? and endTime>?';
			$res = $this->query($sql, array($userId, $l));
			foreach ($res as $value) {
				$startTime = floatval($value['startTime']);
				$endTime = floatval($value['endTime']);
				$sum += $endTime - max($startTime,$l);
			}
			$res = ($r-$l)/$sum;
			if($workType == '0'){
				$t = Core::calRestTime($l, $r, json_decode(REST_TIME_8, true));
				$lowPayedTime += $t[0]*$res;
				$highPayedTime += $t[1]*$res;
			}else if($workType == '1'){
				$t = Core::calRestTime($l, $r, json_decode(REST_TIME_16, true));
				$lowPayedTime += $t[0]*$res;
				$highPayedTime += $t[1]*$res;
			}else{
				$lowPayedTime += ($r - $l)*$res;
			}
			return [$lowPayedTime, $highPayedTime];
		}

		public function endTask($taskId, $machineTime)
		{
			$machineTime = floatval($machineTime)*3600;
			$sql = 'select userId, state, curStartTime, userTime, lowPayedTime, highPayedTime, workType,pendTaskId from part_task_list as ptl left join machine_info mi on ptl.machineId=mi.id where ptl.id=? and flag=1';
			$res = $this->query($sql, array($taskId));
			if(count($res) == 0)
				return false;
			$now = floatval(time());
			$userTime = floatval($res[0]['userTime']);
			$curStartTime = floatval($res[0]['curStartTime']);
			$lowPayedTime = floatval($res[0]['lowPayedTime']);
			$highPayedTime = floatval($res[0]['highPayedTime']);
			if($res[0]['state'] == '1'){
				$userTime += $now - $curStartTime;
				$t = $this->calTime($curStartTime, $now, $res[0]['workType'], $res[0]['userId']);
				$lowPayedTime += $t[0];
				$highPayedTime += $t[1];
			}
			$sql = 'delete from pause_time where taskId=?';
			$this->execute($sql, array($taskId));
			$sql = 'update pending_task set state=4 where id=? and workerId=?';
			$this->execute($sql, array($res[0]['pendTaskId'], $res[0]['userId']));
			$sql = 'update part_task_list set state=2, machineTime=?, finishTime=?, userTime=?, lowPayedTime=?, highPayedTime=? where id=?';
			if(!$this->execute($sql, array(floor($machineTime), floor($now), floor($userTime), floor($lowPayedTime), floor($highPayedTime), $taskId))){
				return false;
			}
			return true;
		}
	}
?>