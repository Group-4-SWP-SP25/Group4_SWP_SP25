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
	ServiceDescription TEXT,
	Price FLOAT NOT NULL
);

-- 5
CREATE TABLE CarPart (
	PartID INT PRIMARY KEY,
	CarID INT,
	PartName VARCHAR(200),
	InstallationDate DATETIME,
	ExpiryDate DATETIME
)

-- 6
CREATE TABLE CarSystem (
	CarSystemID INT FOREIGN KEY REFERENCES [CarPart](PartID),
	CarSystemName VARCHAR(200),
	Status VARCHAR(50)
);

-- Sample data
INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB, LastActivity)
VALUES ('q8edh12hi', '1234', 'qwe8dyrwfhief', 'qwgufcqbw', 'qwficqwfc', '0123456789', '01/01/2000', '01/01/2010');

INSERT INTO [ServiceTypes](ServiceTypeName, ServiceTypeDescription) VALUES 
('Wheel System', 'Including: Tires Patching, Tires Replacement, Tires Pressure Check, Wheel Balancing and Wheel Alignment.'),
('Braking System', 'Including: Braking Pad Replacement, Braking Disc Replacement, Braking Fluid Change, Braking Maintenance and ABS System Check.'),
('Engine System', 'Including: Engine Oil Change, Engine Sparkplug Inspection, Engine Injector Cleaning, Engine Cooling System check and Engine Repair.'),
('Battery System', 'Including: Battery Health check, Battery Charging, Battery Replacement and Battery Terminal Cleaning.'),
('Electrical System', 'Including: Bulb replacement, Fuse Replacement, Electrical system Diagnosis and Wiring Repair.'),
('Air Conditioning System', 'Including: AC Gas Refill, AC Condenser Cleaning, AC Filter Replacement and AC System Repair.'),
('Shock Absorbers System', 'Including: Shock Absorbers Replacement, Tie Rod Replacement, Control Arm Replacement and Suspension Alignment.'),
('Fuel System', 'Including: Fuel Pump Cleaning, Fuel Filter Replacement and Fuel Injection Repair.'),
('Cleaning & Maintenance', 'Including: Standard washes, Polishing, Interior Cleaning and Waterproof Coating.');

INSERT INTO [Services](ServiceTypeID, ServiceName, ServiceDescription, Price) VALUES 
('1', 'Tires Patching', 'Repair small punctures in tires to restore functionality.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('1', 'Tires Replacement', 'Replace old or damaged tires with new ones for better safety and performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('1', 'Tires Pressure Check', 'Check and adjust tire pressure to ensure optimal driving conditions.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('1', 'Wheel Balancing', 'Balance wheels to prevent vibrations and ensure a smooth ride.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('1', 'Wheel Alignment', 'Adjust wheel angles to ensure proper alignment and even tire wear.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('2', 'Braking Pad Replacement', 'Replace worn-out brake pads to maintain effective braking performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('2', 'Braking Disc Replacement', 'Replace damaged or worn brake discs for better braking efficiency.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('2', 'Braking Fluid Change', 'Replace old brake fluid to ensure proper brake system function.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('2', 'Braking Maintenance', 'Inspect and maintain the braking system for optimal performance and safety.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('2', 'ABS System Check', 'Inspect and diagnose the ABS system to ensure it functions correctly.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('3', 'Engine Oil Change', 'Replace old engine oil to keep the engine running smoothly.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('3', 'Engine Sparkplug Inspection', 'Inspect and clean or replace spark plugs for better engine performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('3', 'Engine Injector Cleaning', 'Clean fuel injectors to improve fuel efficiency and engine performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('3', 'Engine Cooling system', 'Inspect and maintain the engine cooling system to prevent overheating.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('3', 'Engine Repair', 'Diagnose and repair engine issues to restore functionality.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('4', 'Battery Health Check', 'Check battery health and performance to ensure reliability.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('4', 'Battery Charging', 'Recharge the vehicle battery to restore power.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('4', 'Battery Replacement', 'Replace old or faulty batteries with new ones.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('4', 'Battery Terminal Cleaning', 'Clean battery terminals to ensure proper electrical connections.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('5', 'Bulb Replacement', 'Replace faulty or burnt-out bulbs for proper lighting.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('5', 'Fuse Replacement', 'Replace blown fuses to restore electrical functionality.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('5', 'Electrical System Diagnosis', 'Diagnose and troubleshoot electrical system issues.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('5', 'Wiring Repair', 'Repair or replace damaged wiring to restore electrical function.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('6', 'AC Gas Refill', 'Refill AC gas to restore cooling efficiency.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('6', 'AC Condenser Cleaning', 'Clean the AC condenser to improve cooling performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('6', 'AC Filter Replacement', 'Replace old AC filters for better air quality and cooling.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('6', 'AC System Repair', 'Diagnose and repair issues in the AC system.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('7', 'Shock Absorber Replacement', 'Replace worn-out shock absorbers for a smoother ride.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('7', 'Tie Rod Replacement', 'Replace damaged tie rods to ensure proper steering control.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('7', 'Control Arm Replacement', 'Replace worn control arms to maintain suspension stability.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('7', 'Suspension Alignment', 'Align suspension components for better handling and comfort.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('8', 'Fuel Pump Cleaning', 'Clean the fuel pump to ensure proper fuel delivery.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('8', 'Fuel Filter Replacement', 'Replace old fuel filters to maintain engine performance.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('8', 'Fuel Injection Repair', 'Repair or clean fuel injectors for optimal fuel efficiency.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),

('9', 'Standard Washes', 'Basic exterior cleaning to keep your car looking fresh.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('9', 'Polishing', 'Polish the exterior to restore shine and protect the paint.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('9', 'Interior Cleaning', 'Thorough cleaning of the car interior for a fresh and tidy look.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000),
('9', 'Waterproof Coating', 'Apply a waterproof coating to protect the exterior from water damage.', ROUND(ROUND(RAND() * 500000 + 750000, 0) / 10000, 0) * 10000);