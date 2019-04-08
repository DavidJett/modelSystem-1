<?php
	class View
	{
		protected $variables = array();
		protected $controller;
		protected $action;

		function __construct($controller, $action)
		{
			$this->controller = $controller;
			$this->action = $action;
		}
	 
		public function assign($name, $value)
		{
			$this->variables[$name] = $value;
		}
	 
		public function render()
		{
			extract($this->variables);

			$head = APP_PATH . 'application/views/' . $this->controller . '/' . $this->action . 'Head.php';
			$layout = APP_PATH . 'application/views/' . $this->controller . '/' . $this->action . '.php';
			$js = APP_PATH . 'application/views/' . $this->controller . '/' . $this->action . 'Js.php';

			$header = APP_PATH . 'application/views/header.php';

			$footer = APP_PATH . 'application/views/footer.php';

			include ($head);
			
			include ($header);
			
			include ($layout);
						
			include ($js);

			include ($footer);
		}
	}
?>