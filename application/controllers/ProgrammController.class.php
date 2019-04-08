<?php
  class ProgrammController extends Controller
  {
	  public function defaultView()
	  {
		  $this->action = 'programmView';
		  $this->view = new View($this->controller, $this->action);
		  $this->programmView();  
	  }
	  public function programmView()
	  {
		  Core::rightFilter(['1', '6']);
		  $programmModel=new ProgrammModel;
		  $models=$programmModel->getModels();
		  $userId=$_SESSION['user'];
		  $modelInfo=$programmModel->getModelInfo($userId);
		  $this->assign('models',$models);
		  $this->assign('modelInfo',$modelInfo);
		  $this->render();
	  }
	  public function start()
	  {
		  Core::rightFilter(['1', '6']);
		  $modelId=$_POST['modelId'];
		  $userId=$_SESSION['user'];
		  $programmModel=new ProgrammModel;
		  $res=$programmModel->startTiming($modelId,$userId);
		  echo $res;
	  }
	  public function terminate()
	  {
		  Core::rightFilter(['1', '6']);
		  $modelId=$_POST['modelId'];
		  $userId=$_SESSION['user'];
		  $programmModel=new ProgrammModel;
		  $res=$programmModel->endTiming($modelId,$userId);
		  echo $res;
	  }
  }
?>