<?php
	class Sql
	{
		protected $connect;
		public function connect($host, $username, $password, $dbname)
		{
			try{
				$dsn = sprintf("mysql:host=%s;dbname=%s;charset=utf8", $host, $dbname);
				$option = array(PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC);
				$this->connect = new PDO($dsn, $username, $password, $option);
			}catch(PDOException $e){
				Logger::info('连接数据库错误：' . $e->getMessage());
			}
		}
		public function close()
		{
			$this->connect = null;
		}
		public function execute($sql, $args)
		{
			$res = $this->connect->prepare($sql);
			for($i=0;$i<count($args);$i++){
				$res->bindParam($i+1, $args[$i]);
			}
			return $res->execute();
		}
		public function query($sql, $args)
		{
			$res = $this->connect->prepare($sql);
			for($i=0;$i<count($args);$i++){
				$res->bindParam($i+1, $args[$i]);
			}
			$res->execute();
			return $res->fetchAll();
		}
		public function executeAffair($sqls, $args)
		{
			$this->connect->beginTransaction();
			foreach ($sqls as $key => $value) {
				$pre = $this->connect->prepare($value);
				foreach ($args[$key] as $k => $val) {
					$pre->bindParam($k+1, $val);
				}
				$res = $pre->execute();
				if(!$res){
					$this->connect->rollback();
					return false;
				}
			}
			$this->connect->commit();
			return true;
		}
	}
?>