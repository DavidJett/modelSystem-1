<?php
	class ShowController extends Controller
	{
		public function defaultView()
		{
			$this->action = 'plannerView';
			$this->view = new View($this->controller, $this->action);
			$this->plannerView();
		}

		public function machineView()
		{
			Core::rightFilter(['1', '3', '7']);
			$showModel = new ShowModel;
			$this->assign('data', $showModel->getData());
			$this->render();
		}

		public function plannerView()
		{
			Core::rightFilter(['1', '7']);
			$plannerModel = new PlannerModel;
			$tasks = $plannerModel->getTasks();
			$procedure = $plannerModel->getProcedure();
			$activeModels = json_encode($plannerModel->getActiveModels(), JSON_UNESCAPED_UNICODE);
			$this->assign('tasks', $tasks);
			$this->assign('procedures', $procedure);
			$this->assign('activeModels', $activeModels);
			$this->render();
		}
	}
?>