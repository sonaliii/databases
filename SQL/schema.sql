SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `chatterBox` ;
CREATE SCHEMA IF NOT EXISTS `chatterBox` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `chatterBox` ;

-- -----------------------------------------------------
-- Table `chatterBox`.`settings`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chatterBox`.`settings` ;

CREATE TABLE IF NOT EXISTS `chatterBox`.`settings` (
  `settingId` INT NOT NULL AUTO_INCREMENT,
  `signOffMessage` VARCHAR(255) NULL,
  `fontColor` VARCHAR(45) NOT NULL,
  `fontStyle` VARCHAR(45) NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`settingId`),
  UNIQUE INDEX `idsettings_UNIQUE` (`settingId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatterBox`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chatterBox`.`users` ;

CREATE TABLE IF NOT EXISTS `chatterBox`.`users` (
  `userId` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `settingId` INT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`userId`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `userId_UNIQUE` (`userId` ASC),
  INDEX `fk_users_settings1_idx` (`settingId` ASC),
  CONSTRAINT `fk_users_settings1`
    FOREIGN KEY (`settingId`)
    REFERENCES `chatterBox`.`settings` (`settingId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatterBox`.`rooms`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chatterBox`.`rooms` ;

CREATE TABLE IF NOT EXISTS `chatterBox`.`rooms` (
  `roomId` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`roomId`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  UNIQUE INDEX `roomId_UNIQUE` (`roomId` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatterBox`.`messages`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chatterBox`.`messages` ;

CREATE TABLE IF NOT EXISTS `chatterBox`.`messages` (
  `messageId` INT NOT NULL AUTO_INCREMENT,
  `message` TEXT NOT NULL,
  `authorId` INT NOT NULL,
  `recipientId` INT NULL,
  `roomId` INT NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`messageId`, `authorId`),
  UNIQUE INDEX `messageId_UNIQUE` (`messageId` ASC),
  INDEX `fk_messages_users_idx` (`authorId` ASC),
  INDEX `fk_messages_users1_idx` (`recipientId` ASC),
  INDEX `fk_messages_rooms1_idx` (`roomId` ASC),
  CONSTRAINT `fk_messages_users`
    FOREIGN KEY (`authorId`)
    REFERENCES `chatterBox`.`users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_users1`
    FOREIGN KEY (`recipientId`)
    REFERENCES `chatterBox`.`users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_rooms1`
    FOREIGN KEY (`roomId`)
    REFERENCES `chatterBox`.`rooms` (`roomId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `chatterBox`.`relationships`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `chatterBox`.`relationships` ;

CREATE TABLE IF NOT EXISTS `chatterBox`.`relationships` (
  `userId` INT NOT NULL,
  `userById` INT NOT NULL,
  `relationship` VARCHAR(45) NULL,
  `createdAt` TIMESTAMP NULL,
  `updatedAt` TIMESTAMP NULL,
  PRIMARY KEY (`userId`, `userById`),
  INDEX `fk_favorites_users2_idx` (`userById` ASC),
  CONSTRAINT `fk_favorites_users1`
    FOREIGN KEY (`userId`)
    REFERENCES `chatterBox`.`users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_favorites_users2`
    FOREIGN KEY (`userById`)
    REFERENCES `chatterBox`.`users` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
