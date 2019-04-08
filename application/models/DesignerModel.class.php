<?php
   class DesignerModel extends Model
   {
	   public function getModels()
	   {
		   $sql='select id,code from model_info where finishTime is null order by startTime DESC';
		   $models=$this->query($sql,array());
		   return $models;
	   }
	   public function getModelInfo($userId)
	   {
		   $sql0="select belongedPart from part_task_list where userId='$userId' and finishTime is null";
		   $res=$this->query($sql0,array());
		   if(count($res)>0)
		   {
		     $partId=$res[0]['belongedPart'];
		     $sql1="select belongedModel from part_info where id='$partId'";
		     $modelId=$this->query($sql1,array())[0]['belongedModel'];
		     $sql2="select code from model_info where id='$modelId'";
		     $modelCode=$this->query($sql2,array())[0]['code'];
		     return [$modelId,$modelCode];
		   }
		   return "Unlock";
	   }
	   public function startTiming($modelId,$userId)
	   {   
	       $startTime=time();
		   $sql_1="select id from part_info where belongedModel='$modelId' and code='DSNCODE' limit 1";
		   $res=$this->query($sql_1,array());
		   if(count($res) == 0){
		       $this->execute('insert into part_info(code,name,belongedModel) values(\'PROCODE\',\'编程\', ?)',array($modelId));
		       $this->execute('insert into part_info(code,name,belongedModel) values(\'DSNCODE\',\'设计\', ?)',array($modelId));
		   }
		   $res=$this->query($sql_1,array());
		   $partId=$res[0]['id'];
		   $sql0="select id from part_task_list where belongedPart='$partId' and userId='$userId' and finishTime is null";
		   $rows0=$this->query($sql0,array());
		   if(count($rows0)>0)
	          return "current_unfinished";			   
		   $sql1="select id from part_task_list where userId='$userId' and finishTime is null";
		   $rows1=$this->query($sql1,array());	     
		   $sql2="insert into part_task_list(name,belongedPart,userId,startTime) values('Design','$partId','$userId','$startTime')";
	       $this->execute($sql2,array());
		   $sql3="select id from part_task_list where belongedPart='$partId' and userId='$userId' and finishTime is null";
		   $rows3=$this->query($sql3,array());
		   if(count($rows3)>0)
		   {
			  if(count($rows1)>0)
			     return "success_other_unfinished";
		      else
			     return "success";
		   }
		   else
		   {
			   if(count($rows1)>0)
				   return "sqlfail_other_unfinished";
			   else
			   return "sqlfail";
           }
	   }
	   public function endTiming($modelId,$userId)
	   {
		   $finishTime=time();
		   $sql_1="select id from part_info where belongedModel='$modelId' and code='DSNCODE' limit 1";
		   $partId=$this->query($sql_1,array())[0]['id'];
		   $sql0="select id,startTime from part_task_list where belongedPart='$partId' and userId='$userId' and finishTime is null";
		   $rows0=$this->query($sql0,array());
		   $num=count($rows0);
		   if($num==1)
		   {
			   $startTime=$rows0[0]['startTime'];
			   $id=$rows0[0]['id'];
			   $sql1="select lowWage,highWage from user_info where id='$userId' and isActive=1";
			   $rows1=$this->query($sql1,array());
			   if(count($rows1)!=1)
				   return "exception";
			   $lowWage=$rows1[0]['lowWage'];
			   $highWage=$rows1[0]['highWage'];
			   $res=Core::calRestTime($startTime,$finishTime,json_decode(REST_TIME_8, true));
			   $lowPayedTime=$res[0];
			   $highPayedTime=$res[1];
			   $userTime=$lowPayedTime+$highPayedTime;
			   $sql2="update part_task_list set finishTime='$finishTime',lowPayedTime='$lowPayedTime',highPayedTime='$highPayedTime',lowWage='$lowWage',highWage='$highWage',userTime='$userTime' where id='$id'";
			   $this->execute($sql2,array());
			   return "success";
		   }
		   else if($num==0)
		   {
			   return "finished";
		   }
		   else
		   {
			   return "exception";
		   }
	   }
   }
   
?>