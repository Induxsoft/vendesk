
CREATE TABLE IF NOT EXISTS `sales_pipeline` (
  `sys_pk` int(11) NOT NULL AUTO_INCREMENT,
  `sys_guid` varchar(32) NOT NULL,
  `sys_dtcreated` datetime NOT NULL,
  `sys_timestamp` datetime NOT NULL,
  `sys_recver` int(11) DEFAULT NULL,
  `sys_deleted` tinyint(1) DEFAULT NULL,
  `sys_lock` int(11) DEFAULT NULL,
  `sys_info` varchar(32) DEFAULT NULL,
  `sys_user` varchar(32) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `probability` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`sys_pk`),
  UNIQUE KEY `sys_guid` (`sys_guid`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `sales_pipeline_stage` (
  `sys_pk` int(11) NOT NULL AUTO_INCREMENT,
  `sys_guid` varchar(32) NOT NULL,
  `sys_dtcreated` datetime NOT NULL,
  `sys_timestamp` datetime NOT NULL,
  `sys_recver` int(11) DEFAULT NULL,
  `sys_deleted` tinyint(1) DEFAULT NULL,
  `sys_lock` int(11) DEFAULT NULL,
  `sys_info` varchar(32) DEFAULT NULL,
  `sys_user` varchar(32) DEFAULT NULL,
  `ref_pipeline` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `probability` decimal(4,1) DEFAULT NULL,
  `stuck_in_days` int(11) DEFAULT NULL,
  PRIMARY KEY (`sys_pk`),
  UNIQUE KEY `sys_guid` (`sys_guid`),
  KEY `ref_pipeline` (`ref_pipeline`),
  CONSTRAINT `sales_pipeline_stage_ibfk_1` FOREIGN KEY (`ref_pipeline`) REFERENCES `sales_pipeline` (`sys_pk`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;

