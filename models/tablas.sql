
CREATE TABLE IF NOT EXISTS `categorias` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `generos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `trailers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`poster` varchar(255) NOT NULL,
	`titulo` varchar(100) NOT NULL,
	`categoria_id` int NOT NULL,
	`genero_id` int NOT NULL,
	`resumen` text NOT NULL,
	`temporadas` int NOT NULL,
	`duracion` varchar(20) NOT NULL,
	`trailer` text NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `actores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombrecompleto` varchar(100) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `reparto` (
	`trailer_id` int NOT NULL,
	`actor_id` int NOT NULL,
	PRIMARY KEY (`trailer_id`, `actor_id`)
);

CREATE TABLE IF NOT EXISTS `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(50) NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `trailer_tags` (
	`trailer_id` int NOT NULL,
	`tag_id` int NOT NULL,
	PRIMARY KEY (`trailer_id`, `tag_id`)
);

CREATE TABLE IF NOT EXISTS `trailergenero` (
	`trailer_id` int NOT NULL,
	`genero_id` int NOT NULL,
	PRIMARY KEY (`trailer_id`, `genero_id`)
);

CREATE TABLE IF NOT EXISTS `traileractor` (
	`trailer_id` int NOT NULL,
	`actor_id` int NOT NULL,
	`personaje` varchar(100) NOT NULL,
	PRIMARY KEY (`trailer_id`, `actor_id`)
);



ALTER TABLE `trailers` ADD CONSTRAINT `trailers_fk3` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`);

ALTER TABLE `reparto` ADD CONSTRAINT `reparto_fk0` FOREIGN KEY (`trailer_id`) REFERENCES `trailers`(`id`);

ALTER TABLE `trailer_tags` ADD CONSTRAINT `trailer_tags_fk0` FOREIGN KEY (`trailer_id`) REFERENCES `trailers`(`id`);
ALTER TABLE `trailergenero` ADD CONSTRAINT `trailergenero_fk0` FOREIGN KEY (`trailer_id`) REFERENCES `trailers`(`id`);
ALTER TABLE `traileractor` ADD CONSTRAINT `traileractor_fk0` FOREIGN KEY (`trailer_id`) REFERENCES `trailers`(`id`);