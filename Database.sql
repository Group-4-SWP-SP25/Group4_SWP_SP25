USE master
GO

IF EXISTS (
	SELECT name
	FROM master.dbo.sysdatabases
	WHERE name = N'SWP_G4'
) BEGIN ALTER DATABASE SWP_G4
SET OFFLINE WITH ROLLBACK IMMEDIATE;

ALTER DATABASE SWP_G4
SET ONLINE;
DROP DATABASE SWP_G4;
END
GO

CREATE DATABASE SWP_G4;
GO

USE SWP_G4;
GO
-- 1
CREATE TABLE [User](
	UserID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	UserName VARCHAR(60) NOT NULL,
	[Password] VARCHAR(20) NOT NULL,
	FirstName NVARCHAR(100) NOT NULL,
	LastName NVARCHAR(100) NOT NULL,
	Email VARCHAR(200) NOT NULL UNIQUE,
	Address VARCHAR(200),
	Role VARCHAR(15) DEFAULT 'User',
	Phone VARCHAR(11) DEFAULT NULL UNIQUE,
	DateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
	DOB DATETIME NOT NULL,
	LastActivity DATETIME,
);
GO

-- 2
CREATE TABLE Car(
	UserID INT FOREIGN KEY REFERENCES [User](UserID),
	CarID INT NOT NULL,
	CarName VARCHAR(500),
	Brand TEXT,
	RegistrationNumber VARCHAR(50),
	[Year] INT,
	CONSTRAINT pk_Car PRIMARY KEY (UserID, CarID)
);
GO

-- 3
CREATE TABLE ServiceTypes (
	ServiceTypeID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceTypeName VARCHAR(200),
	ServiceTypeDescription TEXT
);

-- 4
CREATE TABLE Services (
	ServiceID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceTypeID INT FOREIGN KEY REFERENCES [ServiceTypes](ServiceTypeID),
	ServiceName VARCHAR(200),
	ServiceDescription TEXT
);


-- Sample data
INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB, LastActivity)
VALUES ('q8edh12hi', '1234', 'qwe8dyrwfhief', 'qwgufcqbw', 'qwficqwfc', '0123456789', '01/01/2000', '01/01/2010');

INSERT INTO [ServiceTypes](ServiceTypeName, ServiceTypeDescription)
VALUES ('Tires', 'Including: Tires Patching, Tires Replacement, Tires Pressure Check, Wheel Balancing and Wheel Alignment.'),
       ('Braking System', 'Including: Braking Pad Replacement, Braking Disc Replacement, Braking Fluid Change, Braking Maintenance and ABS System Check.'),
       ('Engine System', 'Including: Engine Oil Change, Engine Sparkplug Inspection, Engine Injector Cleaning, Engine Cooling System check and Engine Repair.'),
       ('Battery', 'Including: Battery Health check, Battery Charging, Battery Replacement and Battery Terminal Cleaning.'),
       ('Electrical System', 'Including: Bulb replacement, Fuse Replacement, Electrical system Diagnosis and Wiring Repair.'),
       ('Air Conditioning System', 'Including: AC Gas Refill, AC Condenser Cleaning, AC Filter Replacement and AC System Repair.'),
       ('Shock Absorbers System', 'Including: Shock Absorbers Replacement, Tie Rod Replacement, Control Arm Replacement and Suspension Alignment.'),
       ('Fuel System', 'Including: Fuel Pump Cleaning, Fuel Filter Replacement and Fuel Injection Repair.'),
       ('Cleaning & Maintenance', 'Including: Standard washes, Polishing, Interior Cleaning and Waterproof Coating.');

INSERT INTO [Services](ServiceTypeID, ServiceName, ServiceDescription) VALUES 
('1', 'Tires Patching', ''),
('1', 'Tires Replacement', ''),
('1', 'Tires Pressure Check', ''),
('1', 'Wheel Balancing', ''),
('1', 'Wheel Alignment', ''),

('2', 'Braking Pad Ceplacement', ''),
('2', 'Braking Disc Ceplacement', ''),
('2', 'Braking Fluid Change', ''),
('2', 'Braking Maintenance', ''),
('2', 'ABS System Check', ''),

('3', 'Engine Oil Change', ''),
('3', 'Engine Sparkplug Inspection', ''),
('3', 'Engine Injector Cleaning', ''),
('3', 'Engine Cooling system', ''),
('3', 'Engine Repair', ''),

('4', 'Battery Health Check', ''),
('4', 'Battery Charging', ''),
('4', 'Battery Replacement', ''),
('4', 'Battery Terminal Cleaning', ''),

('5', 'Bulb Replacement', ''),
('5', 'Fuse Replacement', ''),
('5', 'Electrical System Diagnosis', ''),
('5', 'Wiring Repair', ''),

('6', 'AC Gas Refill', ''),
('6', 'AC Condenser Cleaning', ''),
('6', 'AC Filter Replacement', ''),
('6', 'AC System Repair', ''),

('7', 'Shock Absorber Replacement', ''),
('7', 'Tie Rod Replacement', ''),
('7', 'Control Arm Replacement', ''),
('7', 'Suspension Alignment', ''),

('8', 'Fuel Pump Cleaning', ''),
('8', 'Fuel Filter Replacement', ''),
('8', 'Fuel Injection Repair', ''),

('9', 'Standard Washes', ''),
('9', 'Polishing', ''),
('9', 'Interior Cleaning', ''),
('9', 'Waterproof Coating.', '')
