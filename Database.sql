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
	ServiceTypeID INT FOREIGN KEY REFERENCES [ServiceTypes](ServiceTypeID),
	ServiceID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceName VARCHAR(200),
	ServiceDescription TEXT
);

-- Sample data
INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone)
VALUES ('q8edh12hi', '1234', 'qwe8dyrwfhief', 'qwgufcqbw', 'qwficqwfc', '0123456789');

INSERT INTO [ServiceTypes](ServiceTypeName, ServiceTypeDescription)
VALUES ('Tires', 'Including: Patching, Replacement, Pressure check, Wheel balancing and Wheel Alignment.'),
       ('Braking System', 'Including: Pad replacement, Disc replacement, Fluid replacement, Cleaning & Maintenance and ABS System check.'),
       ('Engine System', 'Including: Oil change, Spark plug inspection, Injector cleaning, Cooling system check and Engine repair.'),
       ('Battery', 'Including: Health check, Charging, Replacement and Terminal cleaning.'),
       ('Electrical System', 'Including: Bulb replacement, Fuse replacement, Electrical system diagnosis and Wiring repair.'),
       ('Air Conditioning System', 'Including: Gas refill, Condenser cleaning, Filter replacement and System repair.'),
       ('Shock Absorbers System', 'Including: Shock absorber replacement, Tie Rod/Control Arm Replacement and Suspension alignment.'),
       ('Fuel System', 'Including: Pump cleaning, Filter replacement and Injection repair.'),
       ('Cleaning & Maintenance', 'Including: Standard washes, Polishing, Interior cleaning and Waterproof coating.');