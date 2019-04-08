<?php
	class IndexModel extends Model
	{
		public function validate($username, $password)
		{
			$sql = 'select password, ui.isActive, rightId, ui.name from user_info as ui left join dept_info di on ui.deptId=di.id where ui.id = ? and di.isActive=1';
			$res = $this->query($sql, array($username));
			if(count($res)==0 || $res[0]['isActive']=='0' || $password!=$res[0]['password']){
				echo 'fail';
			}else{
				$_SESSION['user'] = $username;
				$_SESSION['username'] = $res[0]['name'];
				$rightId = $res[0]['rightId'];
				$_SESSION['user_right'] = $rightId;
				$sql = 'select pageEntrance from right_info where id = ?';
				$res = $this->query($sql, array($rightId));
				if(count($res)>0){
					echo 'success:' . APP_URL . $res[0]['pageEntrance'];
				}else{
					echo 'fail';
				}
			}
		}

		public function modifyPassword($username, $oldPassword, $newPassword)
		{
			$sql = 'select id from user_info where id=? and isActive=1 and password=?';
			$res = $this->query($sql, array($username, $oldPassword));
			if(count($res) == 0){
				echo 'wrong password';
			}else{
				$sql = 'update user_info set password=? where id=?';
				if($this->execute($sql, array($newPassword, $username))){
					echo 'success';
				}else{
					echo 'fail';
				}
			}
		}

		public function getTasks($l, $r)
		{
			$sql = 'select mi.code as modelCode, pi.code as partCode,pi.name as partName,ptl.name as taskName,mai.code as machineCode,mai.name as machineName,mdi.name as machineDept,ui.id as userId,ui.name as userName,udi.name as userDept,ptl.startTime,ptl.finishTime,ptl.machineTime,ptl.userTime from part_task_list as ptl left join part_info pi on ptl.belongedPart=pi.id left join model_info mi on pi.belongedModel=mi.id left join machine_info mai on ptl.machineId=mai.id left join user_info ui on ptl.userId=ui.id left join dept_info udi on ui.deptId=udi.id left join dept_info mdi on mai.belongedDept=mdi.id where ptl.flag=1 and ptl.finishTime>=? and ptl.finishTime<=? order by mdi.id';
			return $this->query($sql, array($l, $r));
		}
	}
?>