<?php
	class Model extends Sql
	{
		protected $modle;
		public function __construct()
		{
			$this->connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
			$this->model = get_class($this);
			$this->model = substr($this->model, 0, -5);
		}
	}
?>