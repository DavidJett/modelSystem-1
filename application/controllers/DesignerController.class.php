<?php
  class DesignerController extends Controller
  {
	  public function defaultView()
	  {
		  $this->action = 'designerView';
		  $this->view = new View($this->controller, $this->action);
		  $this->designerView();  
	  }
	  public function designerView()
	  {
		  Core::rightFilter(['1', '5']);
		  $designerModel=new DesignerModel;
		  $models=$designerModel->getModels();
		  $userId=$_SESSION['user'];
		  $modelInfo=$designerModel->getModelInfo($userId);
		  $this->assign('models',$models);
		  $this->assign('modelInfo',$modelInfo);
		  $this->render();
	  }
	  public function start()
	  {
		  Core::rightFilter(['1', '5']);
		  $designerModel=new DesignerModel;
		  $modelId=$_POST['modelId'];
		  $userId=$_SESSION['user'];
		  $res=$designerModel->startTiming($modelId,$userId);
		  echo $res;
	  }
	  public function terminate()
	  {
		  Core::rightFilter(['1', '5']);
		  $designerModel=new DesignerModel;
		  $modelId=$_POST['modelId'];
		  $userId=$_SESSION['user'];
		  $res=$designerModel->endTiming($modelId,$userId);
		  echo $res;
	  }
  }
?>