DROP TABLE if EXISTS `qrycrmantiguedadsaldos`;
CREATE ALGORITHM=undefined SQL SECURITY DEFINER VIEW `qrycrmantiguedadsaldos` AS
SELECT `dcxc`.`sys_pk` AS `pkdcxc`,`z`.`sys_pk` AS `pkcliente`, DATE_FORMAT(`dcxc`.`fecha`,_utf8'%d/%m/%y') AS `fecha`, DATE_FORMAT(`dcxc`.`aplicacion`,_utf8'%d/%m/%y') AS `aplicacion`,`dcxc`.`referencia` AS `referencia`,(CASE WHEN ((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) <= 0) THEN (((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) ELSE 0 END) AS `no_vencido`,(CASE WHEN (((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) >= 1) AND ((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) <= 30)) THEN (((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) ELSE 0 END) AS `menor30`,(CASE WHEN (((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) >= 31) AND ((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) <= 60)) THEN (((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) ELSE 0 END) AS `menor60`,(CASE WHEN (((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) >= 61) AND ((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) <= 90)) THEN (((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) ELSE 0 END) AS `menor90`,(CASE WHEN ((TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) >= 91) THEN (((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) ELSE 0 END) AS `mayor90`
FROM (`cliente` `z`
JOIN (`cdocumentos`
JOIN `dcxc` ON((`cdocumentos`.`id` = `dcxc`.`documento`))) ON((`z`.`sys_pk` = `dcxc`.`icliente`)))
WHERE ((`dcxc`.`aplicable` <> 0) AND ((((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) <> 0))
ORDER BY `dcxc`.`sys_pk`;

DROP TABLE if EXISTS `qrycrmsaldoclientes`;
CREATE ALGORITHM=undefined SQL SECURITY DEFINER VIEW `qrycrmsaldoclientes` AS
SELECT `dcxc`.`sys_pk` AS `pkdcxc`,`cliente`.`sys_pk` AS `pkcliente`,`cliente`.`codigo` AS `ccodigo`,`cliente`.`nombre` AS `cnombre`,`dcxc`.`referencia` AS `referencia`,`dcxc`.`aplicacion` AS `vencimiento`,(TO_DAYS(NOW()) - TO_DAYS(`dcxc`.`aplicacion`)) AS `dias`, IFNULL(`agente`.`sys_pk`,0) AS `pkagente`, IFNULL(`agente`.`codigo`,_latin1'0000') AS `acodigo`, IFNULL(`agente`.`nombre`,_latin1'sin vendedor') AS `anombre`,(((YEAR(`dcxc`.`aplicacion`) * 10000) + (MONTH(`dcxc`.`aplicacion`) * 100)) + DAYOFMONTH(`dcxc`.`aplicacion`)) AS `ndfecha`,`dcxc`.`debe` AS `importe`,(((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) AS `saldo`,`dcxc`.`acuerdodepago` AS `acuerdopago`,`ut_crm_acuerdos`.`fpagoacordada` AS `vencimientoacuerdo`,(((YEAR(`ut_crm_acuerdos`.`fpagoacordada`) * 10000) + (MONTH(`ut_crm_acuerdos`.`fpagoacordada`) * 100)) + DAYOFMONTH(`ut_crm_acuerdos`.`fpagoacordada`)) AS `ndfechaacuerdo`
FROM ((((`dcxc`
LEFT JOIN `ut_crm_acuerdos` ON((`dcxc`.`acuerdodepago` = `ut_crm_acuerdos`.`sys_pk`)))
JOIN `cliente` ON((`dcxc`.`icliente` = `cliente`.`sys_pk`)))
LEFT JOIN `venta` ON((`dcxc`.`iventa` = `venta`.`sys_pk`)))
LEFT JOIN `agente` ON((`venta`.`iagente` = `agente`.`sys_pk`)))
WHERE ((`dcxc`.`aplicable` <> 0) AND ((((`dcxc`.`debe` + `dcxc`.`intmoratorios`) - `dcxc`.`bonificaciones`) - `dcxc`.`pagos`) <> 0))
GROUP BY `cliente`.`sys_pk`,`cliente`.`codigo`,`cliente`.`nombre`,`dcxc`.`referencia`,`dcxc`.`aplicacion`,`dcxc`.`debe`;

DROP TABLE if EXISTS `qrycrmventas`;
CREATE ALGORITHM=undefined SQL SECURITY DEFINER VIEW `qrycrmventas` AS
SELECT `venta`.`sys_pk` AS `pkventa`,`venta`.`fecha` AS `fecha`,((`dventa`.`cantidad` * `dventa`.`factor`) - IFNULL(`z`.`cantidade`,0)) AS `cantidad`, ROUND(((((((`dventa`.`impuesto1` + `dventa`.`impuesto2`) + `dventa`.`impuesto3`) + `dventa`.`impuesto4`) + ((`dventa`.`cantidad` * `dventa`.`factor`) * `dventa`.`precio`)) - `dventa`.`descuento1`) - `dventa`.`descuento2`) - IFNULL(((((((((`z`.`precio` * `z`.`cantidade`) * `z`.`tipocambio`) + `z`.`impuesto1`) + `z`.`impuesto2`) + `z`.`impuesto3`) + `z`.`impuesto4`) - `z`.`descuento1`) - `z`.`descuento2`),0),8) AS `importe`,`venta`.`referencia` AS `referencia`, DATE_FORMAT(`venta`.`fecha`,_utf8'%d/%m/%y') AS `sfecha`,`producto`.`sys_pk` AS `sys_pk`,`producto`.`codigo` AS `codigo`,`producto`.`descripcion` AS `descripcion`, YEAR(`venta`.`fecha`) AS `anio`, MONTH(`venta`.`fecha`) AS `mes`,`venta`.`icliente` AS `icliente`
FROM (((`dventa`
JOIN `venta` ON((`dventa`.`fk_venta_detalle` = `venta`.`sys_pk`)))
JOIN `producto` ON((`dventa`.`iproducto` = `producto`.`sys_pk`)))
LEFT JOIN `qrydevventasproductos` `z` ON(((`venta`.`sys_pk` = `z`.`pkventa`) AND (`dventa`.`sys_pk` = `z`.`pkdventa`) AND (`producto`.`sys_pk` = `z`.`pkproducto`))))
WHERE (((`venta`.`documento` = 3) AND (`venta`.`statusfacturacion` = 1) AND (`venta`.`statusadministrativo` <> 99)) OR ((`venta`.`documento` = 6) AND (`venta`.`statusfacturacion` = 1) AND (`venta`.`statusadministrativo` <> 99)) OR ((`venta`.`documento` = 4) AND (`venta`.`statusadministrativo` <> 99)))
ORDER BY `venta`.`fecha` DESC;