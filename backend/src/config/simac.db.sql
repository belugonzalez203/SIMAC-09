BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "areas" (
	"id_area"	TEXT NOT NULL,
	"name_area"	TEXT NOT NULL,
	"in_charge"	TEXT,
	"contact_number_area"	TEXT,
	PRIMARY KEY("id_area")
);
CREATE TABLE IF NOT EXISTS "users" (
	"id_user"	TEXT NOT NULL,
	"name_user"	TEXT NOT NULL,
	"type_user"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	PRIMARY KEY("id_user")
);
CREATE TABLE IF NOT EXISTS "type_maintenance" (
	"id_type"	INTEGER NOT NULL,
	"name_type"	TEXT NOT NULL,
	PRIMARY KEY("id_type" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "class_maintenance" (
	"id_class"	INTEGER NOT NULL,
	"name_class"	TEXT NOT NULL,
	PRIMARY KEY("id_class" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "service_status_equipment" (
	"id_service"	INTEGER NOT NULL,
	"name_service"	TEXT NOT NULL,
	PRIMARY KEY("id_service" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "work_order_technicians" (
	"id_order_tech"	INTEGER NOT NULL,
	"id_order"	INTEGER NOT NULL,
	"id_tech"	TEXT NOT NULL,
	FOREIGN KEY("id_tech") REFERENCES "technicians"("id_tech"),
	FOREIGN KEY("id_order") REFERENCES "work_orders"("id_order"),
	PRIMARY KEY("id_order_tech" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "type_change_maintenance" (
	"id_type_change"	INTEGER NOT NULL,
	"name_change"	TEXT NOT NULL,
	"hour_change"	INTEGER NOT NULL,
	PRIMARY KEY("id_type_change" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "spare_parts" (
	"id_spare_part"	INTEGER NOT NULL,
	"code_spare_part"	INTEGER NOT NULL,
	"name_spare_part"	TEXT NOT NULL,
	"stock_spare_part"	INTEGER,
	"id_type_change"	INTEGER,
	PRIMARY KEY("id_spare_part" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "hourmeters" (
	"id_hourmeter"	INTEGER NOT NULL,
	"id_equip"	INTEGER NOT NULL,
	"id_type_change"	INTEGER NOT NULL,
	"hour_current"	INTEGER NOT NULL,
	"hour_change"	INTEGER NOT NULL,
	"next_hour_change"	INTEGER NOT NULL,
	"hour_alert"	INTEGER NOT NULL,
	PRIMARY KEY("id_hourmeter" AUTOINCREMENT),
	FOREIGN KEY("id_equip") REFERENCES "equipments"("id_equip"),
	FOREIGN KEY("id_type_change") REFERENCES "type_change_maintenance"("id_type_change")
);
CREATE TABLE IF NOT EXISTS "work_orders" (
	"id_order"	INTEGER NOT NULL,
	"id_user"	TEXT NOT NULL,
	"id_tech"	TEXT NOT NULL,
	"id_equip"	INTEGER NOT NULL,
	"date_request"	TEXT NOT NULL,
	"hour_request"	TEXT NOT NULL,
	"date_delivery"	TEXT,
	"id_type"	INTEGER NOT NULL,
	"id_class"	INTEGER NOT NULL,
	"priority"	TEXT,
	"work_requested"	TEXT,
	"start_date"	TEXT,
	"start_hour"	TEXT,
	"completion_date"	TEXT,
	"completion_hour"	TEXT,
	"observations"	TEXT,
	"work_performed_details"	TEXT,
	"failure_analysis"	TEXT,
	"failure_cause"	TEXT,
	"work_finished"	INTEGER DEFAULT 0,
	FOREIGN KEY("id_class") REFERENCES "class_maintenance"("id_class"),
	FOREIGN KEY("id_user") REFERENCES "users"("id_user"),
	FOREIGN KEY("id_type") REFERENCES "type_maintenance"("id_type"),
	FOREIGN KEY("id_equip") REFERENCES "equipments"("id_equip"),
	FOREIGN KEY("id_tech") REFERENCES "technicians"("id_tech"),
	PRIMARY KEY("id_order" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "work_order_spare_parts" (
	"id_order_spare"	INTEGER NOT NULL,
	"id_order"	INTEGER NOT NULL,
	"id_spare_part"	INTEGER NOT NULL,
	"quantity_used"	INTEGER,
	PRIMARY KEY("id_order_spare" AUTOINCREMENT),
	FOREIGN KEY("id_spare_part") REFERENCES "spare_parts"("id_spare_part"),
	FOREIGN KEY("id_order") REFERENCES "work_orders"("id_order")
);
CREATE TABLE IF NOT EXISTS "equipments" (
	"id_equip"	INTEGER NOT NULL,
	"code_equip"	TEXT NOT NULL,
	"name_equip"	TEXT NOT NULL,
	"number_plate"	TEXT NOT NULL,
	"brand_equip"	TEXT,
	"model_equip"	TEXT,
	"chassis_equip"	TEXT NOT NULL,
	"id_service"	INTEGER NOT NULL DEFAULT 1,
	"id_area"	TEXT,
	FOREIGN KEY("id_service") REFERENCES "service_status_equipment"("id_service"),
	PRIMARY KEY("id_equip" AUTOINCREMENT),
	FOREIGN KEY("id_area") REFERENCES "areas"("id_area")
);
CREATE TABLE IF NOT EXISTS "technicians" (
	"id_tech"	TEXT NOT NULL,
	"name_tech"	TEXT NOT NULL,
	"contact_number_tech"	TEXT,
	"id_area"	TEXT,
	"id_user"	TEXT,
	PRIMARY KEY("id_tech"),
	FOREIGN KEY("id_user") REFERENCES "users"("id_user"),
	FOREIGN KEY("id_area") REFERENCES "areas"("id_area")
);
INSERT INTO "areas" VALUES ('COM','Comercial',NULL,NULL);
INSERT INTO "areas" VALUES ('PROD','Producción',NULL,NULL);
INSERT INTO "areas" VALUES ('BARB','Molienda de Barbotina',NULL,NULL);
INSERT INTO "areas" VALUES ('ESM','Molienda de Esmaltes',NULL,NULL);
INSERT INTO "areas" VALUES ('REQP','Renovación de Equipos',NULL,NULL);
INSERT INTO "areas" VALUES ('ADM','Administración',NULL,NULL);
INSERT INTO "areas" VALUES ('ADQU','Adquisiciones',NULL,NULL);
INSERT INTO "areas" VALUES ('SEG','Seguridad Industrial',NULL,NULL);
INSERT INTO "areas" VALUES ('EXP','Exportación',NULL,NULL);
INSERT INTO "areas" VALUES ('PRMA','Preparado de masas',NULL,NULL);
INSERT INTO "users" VALUES ('1','Admin1','ADMIN','12345');
INSERT INTO "users" VALUES ('2','José María Gutierrez','TECH','12345');
INSERT INTO "users" VALUES ('3','Antonio Zambrana','TECH','12345');
INSERT INTO "users" VALUES ('4','Pedro Tacuya','TECH','12345');
INSERT INTO "users" VALUES ('5','Ariel Delgadillo','TECH','12345');
INSERT INTO "users" VALUES ('6','Alfonso Calizaya','TECH','12345');
INSERT INTO "users" VALUES ('7','Julio C. Lobo','TECH','12345');
INSERT INTO "type_maintenance" VALUES (1,'Mecánico');
INSERT INTO "type_maintenance" VALUES (2,'Eléctrico');
INSERT INTO "type_maintenance" VALUES (3,'Electrónico');
INSERT INTO "class_maintenance" VALUES (1,'Correctivo');
INSERT INTO "class_maintenance" VALUES (2,'Predictivo');
INSERT INTO "class_maintenance" VALUES (3,'Preventivo');
INSERT INTO "class_maintenance" VALUES (4,'Proactivo');
INSERT INTO "class_maintenance" VALUES (5,'Mejoramiento');
INSERT INTO "service_status_equipment" VALUES (1,'Trabajando');
INSERT INTO "service_status_equipment" VALUES (2,'Mantenimiento');
INSERT INTO "work_order_technicians" VALUES (1,3,'AZ');
INSERT INTO "work_order_technicians" VALUES (2,3,'PT');
INSERT INTO "work_order_technicians" VALUES (3,3,'PT');
INSERT INTO "work_order_technicians" VALUES (4,3,'PT');
INSERT INTO "work_order_technicians" VALUES (9,5,'JSM');
INSERT INTO "work_order_technicians" VALUES (10,5,'PT');
INSERT INTO "work_order_technicians" VALUES (11,5,'AC');
INSERT INTO "work_order_technicians" VALUES (12,5,'JCL');
INSERT INTO "work_order_technicians" VALUES (13,1,'JCL');
INSERT INTO "type_change_maintenance" VALUES (1,'Aceite motor',250);
INSERT INTO "type_change_maintenance" VALUES (2,'Filtro transmisión',1000);
INSERT INTO "type_change_maintenance" VALUES (3,'Filtro hidráulico',2000);
INSERT INTO "type_change_maintenance" VALUES (4,'Aceite transmisión',2000);
INSERT INTO "type_change_maintenance" VALUES (5,'Aceite caja',1000);
INSERT INTO "type_change_maintenance" VALUES (6,'Aceite corona',2000);
INSERT INTO "type_change_maintenance" VALUES (7,'Filtro aire Pala 950H',500);
INSERT INTO "type_change_maintenance" VALUES (8,'Filtro de aire Pala 938',1000);
INSERT INTO "type_change_maintenance" VALUES (9,'Aceite hidráulico',3000);
INSERT INTO "type_change_maintenance" VALUES (10,'Líquido refrigerante',3000);
INSERT INTO "type_change_maintenance" VALUES (11,'Líquido frenos',10000);
INSERT INTO "type_change_maintenance" VALUES (12,'Correa',5000);
INSERT INTO "spare_parts" VALUES (1,'68-05-0052','FILTRO DE ACEITE DE MOTOR W7 MULT 3/4-S',NULL,1);
INSERT INTO "spare_parts" VALUES (2,'68-05-0007','FILTRO DE GASOLINA AUXILIAR 91H2012350',NULL,NULL);
INSERT INTO "spare_parts" VALUES (3,'68-05-0023','FILTRO DE GASOLINA PRIMARIO GU86',NULL,NULL);
INSERT INTO "spare_parts" VALUES (4,'75-17-0146','CORREA AX-46',NULL,12);
INSERT INTO "spare_parts" VALUES (5,'68-01-0051','ACEITE SHELL DE MOTOR 20W/50',NULL,1);
INSERT INTO "spare_parts" VALUES (6,'68-05-0150','FILTRO DE ACEITE WK-66',NULL,NULL);
INSERT INTO "spare_parts" VALUES (7,'68-05-0051','ACEITE DE MOTOR 20W/50',NULL,1);
INSERT INTO "spare_parts" VALUES (8,'75-67-0444','BOMBA DE AGUA',NULL,NULL);
INSERT INTO "spare_parts" VALUES (9,'75-67-0443','POLEA DE BOMBA DE AGUA',NULL,NULL);
INSERT INTO "spare_parts" VALUES (10,'75-67-0040','BUJIAS',NULL,NULL);
INSERT INTO "spare_parts" VALUES (11,'75-67-0547','ORING SELLO DE BOMBA',NULL,NULL);
INSERT INTO "spare_parts" VALUES (12,'75-67-0060','DISTRIBUIDOR DE ENCENDIDO',NULL,NULL);
INSERT INTO "spare_parts" VALUES (13,'75-75-0020','RODAMIENTOS 83B880 BCM DISTRIBUIDOR',NULL,NULL);
INSERT INTO "spare_parts" VALUES (14,'75-72-0019','RETEN 12,43 X 22 X 6  DISTRIBUIDOR',NULL,NULL);
INSERT INTO "spare_parts" VALUES (15,'75-67-0011','MOTOR DE ARRANQUE',NULL,NULL);
INSERT INTO "spare_parts" VALUES (16,'75-67-0054','CARBURADOR 16010-FU500',NULL,NULL);
INSERT INTO "spare_parts" VALUES (17,'75-22-0077','INDUCIDO',NULL,NULL);
INSERT INTO "spare_parts" VALUES (18,'75-67-0390','BENDIX',NULL,NULL);
INSERT INTO "spare_parts" VALUES (19,'75-75-0892','ROTULAS',NULL,NULL);
INSERT INTO "spare_parts" VALUES (20,'75-67-0028','BATERIA DE 12 VOLTIOS 75 AMP.',NULL,NULL);
INSERT INTO "spare_parts" VALUES (21,'68-05-0114','FILTRO DE AIRE PRIMARIO 2456375',NULL,NULL);
INSERT INTO "spare_parts" VALUES (22,'68-05-0115','FILTRO DE AIRE SEGUNDARIO 2456376',NULL,NULL);
INSERT INTO "spare_parts" VALUES (23,'68-05-0116','FILTRO DE ACEITE DE MOTOR 1R1807',NULL,NULL);
INSERT INTO "spare_parts" VALUES (24,'68-05-0111','FILTRO DE DIESEL DE AGUA 4238525 (326-1644)',NULL,NULL);
INSERT INTO "spare_parts" VALUES (25,'68-01-0110','ACEITE DE MOTOR DE DIESEL 15W/40 CAT.',NULL,1);
INSERT INTO "spare_parts" VALUES (26,'68-05-0109','FILTRO DE COMBUSTIBLE 1R0749',NULL,NULL);
INSERT INTO "spare_parts" VALUES (27,'68-05-0107','FILTRO DE TRANSMICION 3416643',NULL,2);
INSERT INTO "spare_parts" VALUES (28,'68-05-0108','FILTRO HIDRAULICO 4656506',NULL,3);
INSERT INTO "spare_parts" VALUES (29,'68-05-0206','FILTRO DE ACEITE DE MOTOR 269-8325',NULL,1);
INSERT INTO "spare_parts" VALUES (30,'68-05-0095','FILTRO DE DIESEL 299-8229',NULL,NULL);
INSERT INTO "spare_parts" VALUES (31,'68-05-0073','FILTRO DE AIRE PRIMARIO 256-702',NULL,7);
INSERT INTO "spare_parts" VALUES (32,'68-05-0063','FILTRO DE AIRE SEGUNDARIO 256-703',NULL,8);
INSERT INTO "spare_parts" VALUES (33,'68-05-0197','FILTRO DE TRANSMISION 1G-8878',NULL,2);
INSERT INTO "spare_parts" VALUES (34,'68-05-0196','FILTRO DE HIDRAULICO 144-0832',NULL,3);
INSERT INTO "spare_parts" VALUES (35,'68-05-0195','FILTRO HIDRAULICO 225-4118',NULL,3);
INSERT INTO "spare_parts" VALUES (36,'68-05-0015','FILTRO DE DIESEL AUXILIAR PM2040',NULL,NULL);
INSERT INTO "hourmeters" VALUES (1,12,1,21222,20640,20890,250);
INSERT INTO "hourmeters" VALUES (2,12,2,20640,20640,21640,1000);
INSERT INTO "hourmeters" VALUES (3,12,3,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (4,12,4,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (5,12,5,20640,20640,5868,86786);
INSERT INTO "hourmeters" VALUES (6,12,6,6389,4589,8989,654);
INSERT INTO "hourmeters" VALUES (7,12,7,78678,786786,78678,78678);
INSERT INTO "hourmeters" VALUES (8,12,8,456,7869,786,786);
INSERT INTO "hourmeters" VALUES (9,12,9,546,786,786,786);
INSERT INTO "hourmeters" VALUES (10,12,10,786,786,786,786);
INSERT INTO "hourmeters" VALUES (11,12,11,123,786,786,867);
INSERT INTO "hourmeters" VALUES (12,12,12,786,786,786,786);
INSERT INTO "hourmeters" VALUES (13,2,1,20640,20640,20890,250);
INSERT INTO "hourmeters" VALUES (14,2,2,20640,20640,21640,1000);
INSERT INTO "hourmeters" VALUES (15,2,3,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (16,2,4,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (17,2,5,20640,20640,5868,86786);
INSERT INTO "hourmeters" VALUES (18,2,6,6389,4589,8989,654);
INSERT INTO "hourmeters" VALUES (19,2,7,78678,786786,78678,78678);
INSERT INTO "hourmeters" VALUES (20,2,8,456,7869,786,786);
INSERT INTO "hourmeters" VALUES (21,2,9,546,786,786,786);
INSERT INTO "hourmeters" VALUES (22,2,10,786,786,786,786);
INSERT INTO "hourmeters" VALUES (23,2,11,123,786,786,867);
INSERT INTO "hourmeters" VALUES (24,2,12,786,786,786,786);
INSERT INTO "hourmeters" VALUES (25,7,1,20640,20640,20890,250);
INSERT INTO "hourmeters" VALUES (26,7,2,20640,20640,21640,1000);
INSERT INTO "hourmeters" VALUES (27,7,3,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (28,7,4,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (29,7,5,20640,20640,5868,86786);
INSERT INTO "hourmeters" VALUES (30,7,6,6389,4589,8989,654);
INSERT INTO "hourmeters" VALUES (31,7,7,78678,786786,78678,78678);
INSERT INTO "hourmeters" VALUES (32,7,8,456,7869,786,786);
INSERT INTO "hourmeters" VALUES (33,7,9,546,786,786,786);
INSERT INTO "hourmeters" VALUES (34,7,10,786,786,786,786);
INSERT INTO "hourmeters" VALUES (35,7,11,123,786,786,867);
INSERT INTO "hourmeters" VALUES (36,7,12,786,786,786,786);
INSERT INTO "hourmeters" VALUES (37,8,1,20640,20640,20890,250);
INSERT INTO "hourmeters" VALUES (38,8,2,20640,20640,21640,1000);
INSERT INTO "hourmeters" VALUES (39,8,3,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (40,8,4,20640,20640,22640,2000);
INSERT INTO "hourmeters" VALUES (41,8,5,20640,20640,5868,86786);
INSERT INTO "hourmeters" VALUES (42,8,6,6389,4589,8989,654);
INSERT INTO "hourmeters" VALUES (43,8,7,78678,786786,78678,78678);
INSERT INTO "hourmeters" VALUES (44,8,8,456,7869,786,786);
INSERT INTO "hourmeters" VALUES (45,8,9,546,786,786,786);
INSERT INTO "hourmeters" VALUES (46,8,10,786,786,786,786);
INSERT INTO "hourmeters" VALUES (47,8,11,123,786,786,867);
INSERT INTO "work_orders" VALUES (1,'1','JSM',1,'2025-05-15','14:30',NULL,1,1,'Alta',NULL,NULL,NULL,'2025-07-10',NULL,'aaaaaaaaaa','aaaaaaaaa','aaaaaaaaaaa','aaaaaaaaa',1);
INSERT INTO "work_orders" VALUES (2,'1','JSM',1,'2025-06-30','18:56','2025-06-25',1,1,'Media','lkf;nvgJKsnv',NULL,NULL,'2025-07-02',NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO "work_orders" VALUES (3,'1','AZ',1,'2025-07-01','15:37','2025-07-10',1,1,'Media','Cambiar aceite motor

Cambiar aceite hidraulico',NULL,NULL,'2025-07-10',NULL,'zzz','zzzz','zz','zzzz',0);
INSERT INTO "work_orders" VALUES (4,'1','PT',10,'2025-07-01','15:39','2025-07-03',3,5,'Alta','jhghuyy',NULL,NULL,'2025-07-03',NULL,NULL,NULL,NULL,NULL,1);
INSERT INTO "work_orders" VALUES (5,'1','AD',3,'2025-07-04','16:15','2025-07-18',2,3,'Alta','hybvviu5',NULL,NULL,'2025-07-18',NULL,'test','test','test','test',1);
INSERT INTO "work_orders" VALUES (6,'1','JSM',7,'2025-07-10','10:16','2025-07-17',1,1,'Alta','dfrftwr',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO "work_orders" VALUES (7,'1','JSM',7,'2025-07-10','10:16','2025-07-17',1,1,'Alta','dfrftwr',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO "work_orders" VALUES (8,'1','AC',9,'2025-07-10','10:36','2025-07-11',3,2,'Media','wertqwr',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0);
INSERT INTO "work_order_spare_parts" VALUES (1,5,2,1);
INSERT INTO "work_order_spare_parts" VALUES (2,5,4,1);
INSERT INTO "work_order_spare_parts" VALUES (3,1,2,1);
INSERT INTO "work_order_spare_parts" VALUES (4,1,5,1);
INSERT INTO "equipments" VALUES (1,'MC-05','Montacarga','HYSTER 50','Hyster',NULL,'0000',1,'COM');
INSERT INTO "equipments" VALUES (2,'MC-18','Montacarga','CAT 3,5 T','Caterpillar','GP35NM','AT13H50133',1,'PROD');
INSERT INTO "equipments" VALUES (3,'MC-16','Montacarga','CAT 3,5 T','Caterpillar','GP35NM','AT13H500063',1,'PROD');
INSERT INTO "equipments" VALUES (4,'MC-02','Montacarga','HYSTER 50','Hyster','H 50','0000',1,'PROD');
INSERT INTO "equipments" VALUES (5,'MC-10','Montacarga','2,5T','Heli',NULL,'0000',1,NULL);
INSERT INTO "equipments" VALUES (6,'MC-17','Montacarga','Komatsu','Komatsu',NULL,'0000',1,NULL);
INSERT INTO "equipments" VALUES (7,'VW-04','Volqueta','4278FDL','Worker 31-310','GP35NM5','AT13H50063',1,'PRMA');
INSERT INTO "equipments" VALUES (8,'PC-05','Pala','950 H','Caterpillar','GP35NM5','CAT0950HLJLX00794',1,'PRMA');
INSERT INTO "equipments" VALUES (9,'PC-04','Pala','938 H','Caterpillar','938H','JKM00407',2,'PRMA');
INSERT INTO "equipments" VALUES (10,'PC-02','Pala','FR12B','Fiat-Allis',NULL,'0000',2,NULL);
INSERT INTO "equipments" VALUES (11,'MC-19','Montacarga','3 T','Komatsu',NULL,'0000',1,NULL);
INSERT INTO "equipments" VALUES (12,'MC-15','Montacarga','CAT 3,5 T','Caterpillar',NULL,'0000',1,'COM');
INSERT INTO "technicians" VALUES ('JSM','José María Gutierrez','68582781',NULL,'2');
INSERT INTO "technicians" VALUES ('AZ','Antonio Zambrana',NULL,NULL,'3');
INSERT INTO "technicians" VALUES ('PT','Pedro Tacuya',NULL,NULL,'4');
INSERT INTO "technicians" VALUES ('AD','Ariel Delgadillo',NULL,NULL,'5');
INSERT INTO "technicians" VALUES ('AC','Alfonso Calizaya',NULL,NULL,'6');
INSERT INTO "technicians" VALUES ('JCL','Julio C. Lobo',NULL,NULL,'7');
COMMIT;
