# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: us-cdbr-iron-east-05.cleardb.net (MySQL 5.6.36-log)
# Database: heroku_1b62b8e3149877c
# Generation Time: 2018-03-22 18:08:27 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table channels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `channels`;

CREATE TABLE `channels` (
  `cID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `purpose` varchar(255) DEFAULT NULL,
  `createdAt` bigint(20) NOT NULL,
  `type` varchar(8) NOT NULL,
  PRIMARY KEY (`cID`),
  UNIQUE KEY `cID_UNIQUE` (`cID`),
  KEY `name_INDEX` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table messages
# ------------------------------------------------------------

DROP TABLE IF EXISTS `messages`;

CREATE TABLE `messages` (
  `mID` int(11) NOT NULL AUTO_INCREMENT,
  `text` mediumtext NOT NULL,
  `createdAt` bigint(20) NOT NULL,
  `uID` int(11) NOT NULL,
  `cID` int(11) NOT NULL,
  `enabled` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`mID`),
  UNIQUE KEY `mID_UNIQUE` (`mID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `uID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `imageURL` varchar(255) DEFAULT NULL,
  `googleID` varchar(45) NOT NULL,
  `createdAt` bigint(20) NOT NULL,
  `lastActiveAt` bigint(20) NOT NULL,
  `lastLoginAt` bigint(20) NOT NULL,
  PRIMARY KEY (`uID`),
  KEY `googleID_INDEX` (`googleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table users2channels
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users2channels`;

CREATE TABLE `users2channels` (
  `ucID` int(11) NOT NULL AUTO_INCREMENT,
  `uID` int(11) NOT NULL,
  `cID` int(11) NOT NULL,
  `joinedAt` bigint(20) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ucID`),
  UNIQUE KEY `ucID_UNIQUE` (`ucID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;