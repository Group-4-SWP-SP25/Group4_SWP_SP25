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
	Phone VARCHAR(11) DEFAULT NULL ,
	DateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
	DOB DATETIME DEFAULT NULL,
	LastActivity DATETIME,
);
GO

-- 2
CREATE TABLE Car(
	CarID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	UserID INT FOREIGN KEY REFERENCES [User](UserID) ON DELETE CASCADE,
	CarName VARCHAR(500) NOT NULL,
	Brand TEXT,
	RegistrationNumber VARCHAR(50) NOT NULL,
	[Year] INT,
);
GO

-- 3
CREATE TABLE CarSystem ( 
	CarSystemID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	CarSystemName VARCHAR(200) NOT NULL,
);
GO

CREATE TABLE CarPart (
    CarID INT NOT NULL FOREIGN KEY REFERENCES Car(CarID) ON DELETE CASCADE,
    PartID INT NOT NULL,
    PartName VARCHAR(200) NOT NULL,
    CarSystemID INT NOT NULL FOREIGN KEY REFERENCES CarSystem(CarSystemID) ON DELETE CASCADE,
    InstallationDate DATETIME DEFAULT NULL,
    ExpiryDate DATETIME DEFAULT NULL,
    [Status] VARCHAR(10) DEFAULT NULL CHECK ([Status] IN ('Active', 'Broken', 'Expired')),
    CONSTRAINT pk_CarPart PRIMARY KEY (CarID, PartID)
);
GO

-- 5
CREATE TABLE ServiceType (
	ServiceTypeID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceTypeName VARCHAR(200),
	ServiceTypeDescription TEXT
);
GO

-- 6
CREATE TABLE [Service] (
	ServiceID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceTypeID INT FOREIGN KEY REFERENCES [ServiceType](ServiceTypeID) ON DELETE CASCADE,
	ServiceName VARCHAR(200) NOT NULL,
	ServiceDescription TEXT,
	ServicePrice FLOAT NOT NULL
);
GO

-- 7
CREATE TABLE Inventory (
	PartID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	PartName VARCHAR(200) NOT NULL,
	CarSystemID INT FOREIGN KEY REFERENCES CarSystem(CarSystemID) ON DELETE CASCADE,
	[Description] TEXT NOT NULL,
	Quantity INT NOT NULL,
	UnitPrice FLOAT NOT NULL
);
GO
 
-- 7
CREATE TABLE [Order] (
	UserID INT NOT NULL FOREIGN KEY REFERENCES [User](UserID) ON DELETE CASCADE,
    OrderID INT NOT NULL,
    CarID INT NOT NULL,
    PartID INT NOT NULL,
	ServiceID INT FOREIGN KEY REFERENCES [Service](ServiceID),
    QuantityUsed INT NOT NULL,
    EstimatedCost FLOAT NOT NULL,
	OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_Orders PRIMARY KEY (UserID, OrderID)
);
GO

-- MESSAGE
CREATE TABLE [Messages] (
    MessageID INT IDENTITY(1, 1) PRIMARY KEY,
    SenderID INT FOREIGN KEY REFERENCES [User](UserID),
    ReceiverID INT FOREIGN KEY REFERENCES [User](UserID),
    Content TEXT NOT NULL,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BIT DEFAULT 0
);
GO

-- Trigger for Car Parts
CREATE TRIGGER InsertCar
ON Car
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

	-- Danh sách các bộ phận mặc định của xe
    DECLARE @DefaultParts TABLE (
        PartName VARCHAR(200),
        CarSystemID INT
    );

    -- Thêm danh sách các bộ phận mặc định
    INSERT INTO @DefaultParts (PartName, CarSystemID)
    VALUES 
        ('Engine Oil', 1),
        ('Spark Plug', 1),
        ('Injector', 1),
        ('Cooling System', 1),
        ('Brake Pad', 2),
        ('Rotor', 2),
        ('Fluid', 2),
		('Bulb', 3),
        ('Fuse', 3),
        ('Electric System', 3),
		('Wiring', 3),
        ('Gas', 4),
		('Condenser', 4),
		('Filter', 4),
        ('Pump', 5),
        ('Filter', 5),
		('Injection', 5),
		('Charging', 6),
		('Terminal', 6),
        ('Shock', 7),
        ('Control Arm', 7),
        ('Tie Rod', 7),
		('Suspension', 7),
        ('Tire', 8),
        ('Rim', 8),
        ('Wheel Hub', 8);

   INSERT INTO CarPart (CarID, PartID, PartName, CarSystemID)
    SELECT 
        i.CarID,
        ROW_NUMBER() OVER (PARTITION BY i.CarID ORDER BY d.CarSystemID) AS PartID,
        d.PartName,
        d.CarSystemID
    FROM inserted i
    CROSS JOIN @DefaultParts d;
END;
GO

GO

-- Trigger for Order
CREATE TRIGGER InsertOrder
ON [Order]
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;
    -- Update existing order quantity and recalculate EstimatedCost
    UPDATE o
    SET o.QuantityUsed = o.QuantityUsed + i.QuantityUsed,
        o.EstimatedCost = (o.QuantityUsed + i.QuantityUsed) * inv.UnitPrice + COALESCE(s.ServicePrice, 0)
    FROM [Order] o
    INNER JOIN inserted i
        ON o.UserID = i.UserID
        AND o.CarID = i.CarID 
        AND o.PartID = i.PartID 
        AND COALESCE(o.ServiceID, 0) = COALESCE(i.ServiceID, 0)
    INNER JOIN Inventory inv ON o.PartID = inv.PartID
    LEFT JOIN [Service] s ON o.ServiceID = s.ServiceID;

    -- Insert new order if it does not exist
    INSERT INTO [Order](UserID, OrderID, CarID, PartID, ServiceID, QuantityUsed, EstimatedCost)
    SELECT
        i.UserID,
        ISNULL(
            (SELECT MAX(OrderID) FROM [Order] o WHERE o.UserID = i.UserID), 0
        ) + 1,
        i.CarID,
        i.PartID,
        i.ServiceID,
        i.QuantityUsed,
        (i.QuantityUsed * inv.UnitPrice) + COALESCE(s.ServicePrice, 0)
    FROM inserted i
    INNER JOIN Inventory inv ON i.PartID = inv.PartID
    LEFT JOIN [Service] s ON i.ServiceID = s.ServiceID
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Order] o
        WHERE o.UserID = i.UserID
        AND o.CarID = i.CarID 
        AND o.PartID = i.PartID
        AND COALESCE(o.ServiceID, 0) = COALESCE(i.ServiceID, 0)
    );
END;
GO

CREATE TRIGGER DeleteOrder
ON [Order]
FOR DELETE
AS
BEGIN
	SET NOCOUNT ON;
	UPDATE ivt
    SET ivt.Quantity = ivt.Quantity - d.QuantityUsed
    FROM Inventory ivt
    INNER JOIN deleted d ON d.PartID = ivt.PartID;
END;
GO

DISABLE TRIGGER DeleteOrder ON [Order];
GO

-- Sample data

--INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB)
--VALUES ('doanhieu18', 'doanhieu18@', 'Hieu', 'Doan', 'doanhieu180204@gmail.com', '0325413488', '2004-02-18');


DECLARE @counter INT = 1
WHILE @counter <= 100
BEGIN
    INSERT INTO [User] (Username, Password, FirstName, LastName, Email, Phone, DOB, LastActivity)
    VALUES (
        CONCAT('user', @counter), -- Username
        'password', -- Password
        CONCAT('FirstName', @counter), -- FirstName
        CONCAT('LastName', @counter), -- LastName
        CONCAT('user', @counter, '@example.com'), -- Email
        CONCAT('01234567', @counter), -- Phone
        DATEADD(DAY, -@counter, GETDATE()), -- DOB
        GETDATE() -- LastActivity
    )
    SET @counter = @counter + 1
END;
GO

INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB, LastActivity)
VALUES ('q8edh12hi', '1234', 'qwe8dyrwfhief', 'qwgufcqbw', 'qwficqwfc', '0123456789', '01/01/2000', '01/01/2010');
GO

INSERT INTO [ServiceType](ServiceTypeName, ServiceTypeDescription) VALUES 
('Wheel System', 'Your wheels are more than just round things that keep you rolling. They''re the foundation of your vehicle''s performance, safety, and overall driving experience.<br><br>At AUTO247, we understand the critical role your wheels play, and that''s why we offer a comprehensive Wheel System Service designed to keep you cruising in confidence.'),
('Braking System', 'Your brakes are arguably the most critical safety feature on your vehicle. They''re your first line of defense in preventing accidents and ensuring your safety on the road.<br><br>At AUTO247, we understand the importance of a reliable braking system, and that''s why we offer a comprehensive Braking System Service designed to keep you stopping safely and confidently.'),
('Engine System', 'Your engine is the heart of your vehicle. It''s the powerhouse that propels you forward, delivering the performance and reliability you depend on.<br><br>At AUTO247, we understand the vital role your engine plays, and that''s why we offer a comprehensive Engine System Service designed to keep your engine running smoothly and efficiently.'),
('Battery System', 'Your car battery is the unsung hero of your vehicle. It''s the source of electrical power that starts your engine, powers your lights, and keeps your accessories running.<br><br>At AUTO247, we understand the critical role your battery plays, and that''s why we offer a comprehensive Battery System Service designed to keep you powered up and on the go.'),
('Electrical System', 'Your vehicle''s electrical system is like its nervous system, responsible for powering everything from your headlights and infotainment system to your engine''s ignition and vital safety features.<br><br>At AUTO247, we understand the intricate role your electrical system plays, and that''s why we offer a comprehensive Electrical System Service designed to keep your vehicle running smoothly and safely.'),
('Air Conditioning System', 'Imagine driving on a hot summer day, stuck in traffic, and your air conditioning system suddenly stops working. Not a pleasant experience, right?<br><br>At AUTO247, we understand the importance of a reliable air conditioning system, and that''s why we offer a comprehensive Air Conditioning System Service designed to keep you cool and comfortable all year round.'),
('Shock Absorbers System', 'Your shock absorbers are the unsung heroes of your vehicle''s suspension system. They''re responsible for keeping your ride smooth and comfortable, even on the bumpiest roads.<br><br>At AUTO247, we understand the vital role your shock absorbers play, and that''s why we offer a comprehensive Shock Absorbers System Service designed to keep you riding in comfort and control.'),
('Fuel System', 'Your fuel system is the lifeline of your engine, responsible for delivering the precise amount of fuel needed for optimal performance.<br><br>At AUTO247, we understand the critical role your fuel system plays, and that''s why we offer a comprehensive Fuel System Service designed to keep your engine running strong and efficiently.'),
('Cleaning and Maintenance', 'Your car is more than just a mode of transportation; it''s an extension of your personality and a reflection of your style.<br><br>At AUTO247, we understand the importance of keeping your car looking and feeling its best, and that''s why we offer a comprehensive range of Cleaning and Maintenance services designed to help you maintain your car''s appearance and preserve its value.');
GO

INSERT INTO [Service](ServiceTypeID, ServiceName, ServiceDescription, ServicePrice) VALUES 
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
GO

INSERT INTO CarSystem(CarSystemName) VALUES 
('Engine System'),
('Braking System'),
('Electrical System'),
('Air Conditioning System'),
('Fuel System'),
('Battery System'),
('Shock Absorbers System'),
('Wheel System');
GO

INSERT INTO Car(UserID, CarName, Brand, RegistrationNumber, [Year]) VALUES 
(1, 'Car 1', 'Toyota', '123456', 2010),
(1, 'Car 2', 'Honda', '654321', 2015),
(1, 'Car 3', 'Ford', '987654', 2018),
(1, 'Car 4', 'BMW', '125478', 2020);
GO

INSERT INTO Inventory (PartName, CarSystemID, [Description], Quantity, UnitPrice) VALUES (
    'Engine Oil', 1, 'Engine oil for lubrication and cooling.', 100, 50000),
    ('Spark Plug', 1, 'Spark plugs for ignition.', 50, 20000),
    ('Injector', 1, 'Fuel injectors for fuel delivery.', 30, 30000),
    ('Cooling System', 1, 'Cooling system components.', 20, 40000),
    ('Brake Pad', 2, 'Brake pads for stopping power.', 40, 60000),
    ('Rotor', 2, 'Brake rotors for braking force.', 30, 80000),
    ('Fluid', 2, 'Brake fluid for hydraulic system.', 50, 10000),
    ('Bulb', 3, 'Light bulbs for illumination.', 60, 5000),
    ('Fuse', 3, 'Fuses for electrical protection.', 40, 1000),
    ('Electric System', 3, 'Electrical system components.', 30, 20000),
    ('Wiring', 3, 'Wiring harness for electrical connections.', 20, 30000),
    ('Gas', 4, 'AC gas for cooling.', 50, 20000),
    ('Condenser', 4, 'AC condenser for heat exchange.', 30, 40000),
    ('Filter', 4, 'AC filters for air quality.', 40, 10000),
    ('Pump', 5, 'Fuel pump for fuel delivery.', 30, 30000),
    ('Filter', 5, 'Fuel filters for fuel quality.', 40, 20000),
    ('Injection', 5, 'Fuel injectors for fuel delivery.', 20, 40000),
    ('Charging', 6, 'Battery charging service.', 50, 10000),
    ('Terminal', 6, 'Battery terminals for electrical connections.', 40, 5000),
    ('Shock', 7, 'Shock absorbers for suspension.', 30, 60000),
    ('Control Arm', 7, 'Control arms for suspension.', 20, 80000),
    ('Tie Rod', 7, 'Tie rods for steering.', 40, 10000),
    ('Suspension', 7, 'Suspension components.', 50, 20000),
    ('Tire', 8, 'Tires for wheel system.', 100, 500000),
    ('Rim', 8, 'Rims for wheel system.', 50, 800000),
    ('Wheel Hub', 8, 'Wheel hubs for wheel system.', 30, 100000);
GO

INSERT INTO [Order](UserID, CarID, PartID, ServiceID, QuantityUsed) VALUES
(1, 1, 3, 1, 2)
GO

--ENABLE TRIGGER DeleteOrder ON [Order];
--GO

--DELETE FROM [Order];
--GO

--DISABLE TRIGGER DeleteOrder ON [Order]
--GO