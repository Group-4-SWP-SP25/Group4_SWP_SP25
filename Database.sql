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
    CONSTRAINT pk_CarPart PRIMARY KEY (CarID, PartID),
    [Image]  NVARCHAR(500)

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
	PartID INT,
	ServiceName VARCHAR(200) NOT NULL,
	AffectInventory TINYINT NOT NULL,
	ServiceDescription TEXT,
	ServicePrice FLOAT NOT NULL,
	Checking TINYINT DEFAULT 0
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
CREATE TABLE Messages (
    MessageID INT PRIMARY KEY IDENTITY,
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Content TEXT NOT NULL,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    IsRead BIT DEFAULT 0,
    FOREIGN KEY (SenderID) REFERENCES [User](UserID),
    FOREIGN KEY (ReceiverID) REFERENCES [User](UserID),
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
        CarSystemID INT,
		[Image] VARCHAR(500)
    );

    -- Thêm danh sách các bộ phận mặc định
    INSERT INTO @DefaultParts (PartName, CarSystemID, [Image])
    VALUES 
        ('Engine Oil', 1,'/resource/CarPark_image/Oil.webp'),
        ('Spark Plug', 1,'/resource/CarPark_image/SparkPlug.webp'),
        ('Injector', 1,'/resource/CarPark_image/InjectorE.webp'),
        ('Cooling System', 1,'/resource/CarPark_image/CoolingSystem.webp'),
        ('Brake Pad', 2,'/resource/CarPark_image/BrakePad.webp'),
        ('Rotor', 2,'/resourc	e/CarPark_image/Rotor.webp'),
        ('Fluid', 2,'/resource/CarPark_image/Fluids.webp'),
		('Bulb', 3,'/resource/CarPark_image/Buld.webp'),
        ('Fuse', 3,'/resource/CarPark_image/Fuse.webp'),
        ('Electric System', 3,'/resource/CarPark_image/ElectricSystem.webp'),
		('Wiring', 3,'/resource/CarPark_image/Wiring.webp'),
        ('Gas', 4,'/resource/CarPark_image/Gas.webp'),
		('Condenser', 4,'/resource/CarPark_image/Condenser.webp'),
		('Filter', 4,'/resource/CarPark_image/FilterF.webp'),
        ('Pump', 5,'/resource/CarPark_image/Pump.webp'),
        ('Filter', 5,'/resource/CarPark_image/FilterA.webp'),
		('Injection', 5,'/resource/CarPark_image/InjectorF.webp'),
		('Charging', 6,'/resource/CarPark_image/Charging.webp'),
		('Terminal', 6,'/resource/CarPark_image/Terminal.webp'),
        ('Shock', 7,'/resource/CarPark_image/Shock.webp'),
        ('Control Arm', 7,'/resource/CarPark_image/ControlArm.webp'),
        ('Tie Rod', 7,'/resource/CarPark_image/TieRod.webp'),
		('Suspension', 7,'/resource/CarPark_image/Suspension.webp'),
        ('Tire', 8,'/resource/CarPark_image/Tire.webp'),
        ('Rim', 8,'/resource/CarPark_image/Rim.webp'),
        ('Wheel Hub', 8,'/resource/CarPark_image/WheelHub.webp')

   INSERT INTO CarPart (CarID, PartID, PartName, CarSystemID, [Image])
    SELECT 
        i.CarID,
        ROW_NUMBER() OVER (PARTITION BY i.CarID ORDER BY d.CarSystemID) AS PartID,
        d.PartName,
        d.CarSystemID,
		d.Image
    FROM inserted i
    CROSS JOIN @DefaultParts d;
END;
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

INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB)
VALUES ('doanhieu18', 'doanhieu18@', 'Hieu', 'Doan', 'doanhieu180204@gmail.com', '0325413488', '2004-02-18');

GO
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

INSERT INTO Service (ServiceName, PartID, ServiceDescription, ServicePrice, AffectInventory, ServiceTypeID) VALUES
('Engine Oil Change', 1, 'Replacing old engine oil with fresh oil', 1200000, 1, 1),
('Engine Oil Flush', 1, 'Cleaning the engine oil system thoroughly', 1680000, 0, 1),
('Engine Oil Leak Check', 1, 'Inspecting and fixing engine oil leaks', 960000, 0, 1),
('Engine Oil Filter Replacement', 1, 'Replacing clogged oil filter for better flow', 720000, 1, 1),
('Spark Plug Inspection', 2, 'Checking spark plug condition for wear', 600000, 0, 1),
('Spark Plug Cleaning', 2, 'Cleaning deposits from spark plugs', 480000, 0, 1),
('Spark Plug Replacement', 2, 'Installing new spark plugs for better ignition', 840000, 1, 1),
('Ignition System Check', 2, 'Diagnosing and repairing ignition issues', 1440000, 0, 1),
('Fuel Injector Cleaning', 3, 'Cleaning fuel injectors to improve efficiency', 1920000, 0, 1),
('Fuel Injector Repair', 3, 'Fixing faulty fuel injectors', 2880000, 0, 1),
('Fuel Injector Calibration', 3, 'Adjusting injector spray pattern', 2400000, 0, 1),
('Cooling System Flush', 4, 'Draining and refilling coolant system', 2160000, 1, 1),
('Cooling System Leak Check', 4, 'Identifying leaks in the cooling system', 1440000, 0, 1),
('Radiator Cleaning', 4, 'Removing debris and buildup from radiator', 1680000, 0, 1),
('Coolant Replacement', 4, 'Replacing old coolant for optimal performance', 1200000, 1, 1),
('Brake Pad Inspection', 5, 'Checking brake pad thickness and wear', 600000, 0, 2),
('Brake Pad Replacement', 5, 'Installing new brake pads', 1920000, 1, 2),
('Brake Pad Adjustment', 5, 'Adjusting brake pads for optimal contact', 1200000, 0, 2),
('Brake Rotor Resurfacing', 6, 'Smoothing brake rotors for better performance', 2400000, 0, 2),
('Brake Rotor Replacement', 6, 'Installing new brake rotors', 3600000, 1, 2),
('Brake Rotor Cleaning', 6, 'Removing rust and debris from rotors', 1440000, 0, 2),
('Brake Fluid Top-Up', 7, 'Adding brake fluid to maintain levels', 720000, 1, 2),
('Brake Fluid Replacement', 7, 'Flushing old brake fluid and refilling', 1920000, 1, 2),
('Brake Fluid Leak Repair', 7, 'Fixing leaks in the brake fluid system', 2400000, 0, 2),
('Headlight Bulb Replacement', 8, 'Changing old headlight bulbs', 960000, 1, 3),
('Tail Light Bulb Replacement', 8, 'Replacing faulty tail light bulbs', 840000, 1, 3),
('Interior Light Bulb Replacement', 8, 'Installing new interior light bulbs', 600000, 1, 3),
('Fuse Check', 9, 'Inspecting fuses for electrical issues', 480000, 0, 3),
('Fuse Replacement', 9, 'Replacing blown fuses', 360000, 1, 3),
('Fuse Box Cleaning', 9, 'Cleaning corrosion from fuse box', 720000, 0, 3),
('Electrical System Diagnosis', 10, 'Checking car’s electrical components', 2400000, 0, 3),
('Alternator Check', 10, 'Testing alternator for proper charging', 1200000, 0, 3),
('Battery Voltage Test', 10, 'Measuring battery voltage performance', 600000, 0, 3),
('Wiring Check', 11, 'Inspecting electrical wiring for damage', 1440000, 0, 3),
('Wiring Harness Replacement', 11, 'Installing new wiring harness', 2880000, 1, 3),
('Wiring Short Circuit Fix', 11, 'Repairing short circuits in wiring', 2160000, 0, 3),
('AC Gas Refill', 12, 'Refilling air conditioning refrigerant', 1920000, 1, 4),
('AC Compressor Check', 12, 'Diagnosing AC compressor performance', 1680000, 0, 4),
('AC Gas Leak Detection', 12, 'Identifying leaks in AC refrigerant system', 1200000, 0, 4),
('AC Condenser Cleaning', 13, 'Removing dust and debris from AC condenser', 1440000, 0, 4),
('AC Condenser Repair', 13, 'Fixing leaks or clogs in AC condenser', 2880000, 0, 4),
('AC Condenser Replacement', 13, 'Installing new AC condenser', 4320000, 1, 4),
('Air Filter Cleaning', 14, 'Removing dust from air filter', 600000, 0, 4),
('Air Filter Replacement', 14, 'Installing new air filter', 960000, 1, 4),
('Fuel Filter Replacement', 16, 'Replacing clogged fuel filter', 1200000, 1, 5),
('Fuel Pump Cleaning', 15, 'Cleaning fuel pump for better efficiency', 1680000, 0, 5),
('Fuel Pump Repair', 15, 'Fixing fuel pump issues', 2400000, 0, 5),
('Fuel Pump Replacement', 15, 'Installing new fuel pump', 3600000, 1, 5),
('Tire Replacement', 24, 'Installing new tires', 3600000, 1, 7),
('Tire Rotation', 24, 'Rotating tires for even wear', 960000, 0, 8),
('Wheel Balancing', 26, 'Ensuring even weight distribution on wheels', 1200000, 0, 8),
('Wheel Alignment', 26, 'Adjusting angles for proper wheel alignment', 1920000, 0, 8),
('Rim Polishing', 25, 'Cleaning and restoring rim finish', 1680000, 0, 8),
('Shock Absorber Check', 20, 'Inspecting shock absorbers for leaks', 1200000, 0, 7),
('Shock Absorber Replacement', 20, 'Installing new shock absorbers', 4320000, 1, 7),
('Suspension Inspection', 23, 'Checking suspension system components', 1440000, 0, 7),
('Suspension Repair', 23, 'Fixing worn suspension components', 4800000, 1, 7),
('Tie Rod End Replacement', 22, 'Installing new tie rod ends', 2880000, 1, 7),
('Tie Rod Alignment', 22, 'Adjusting tie rods for proper steering', 1680000, 0, 7),
('Control Arm Inspection', 21, 'Checking control arms for wear and damage', 1200000, 0, 7),
('Control Arm Replacement', 21, 'Installing new control arms', 4320000, 1, 7),
('Suspension Lubrication', 23, 'Lubricating suspension components', 960000, 0, 7),
('Suspension Bushing Replacement', 23, 'Replacing worn-out suspension bushings', 2880000, 1, 7),
('Charging System Check', 18, 'Testing battery and alternator performance', 1200000, 0, 6),
('Battery Charging Service', 18, 'Recharging car battery for optimal power', 720000, 0, 6),
('Battery Terminal Cleaning', 19, 'Cleaning corrosion from battery terminals', 600000, 0, 6),
('Battery Terminal Replacement', 19, 'Installing new battery terminals', 960000, 1, 6),
('Wheel Bearing Replacement', 26, 'Replacing worn-out wheel bearings', 3360000, 1, 8),
('Wheel Hub Greasing', 26, 'Lubricating wheel hub for smooth rotation', 1200000, 0, 8),
('Rim Refinishing', 25, 'Restoring rim surface for a polished look', 2400000, 0, 8),
('Rim Replacement', 25, 'Installing new rims', 4800000, 1, 8),
('Gas Leak Detection', 12, 'Identifying leaks in the fuel system', 2160000, 0, 4),
('Gas Tank Cleaning', 12, 'Removing debris and dirt from the gas tank', 1920000, 0, 4),
('Fuel Injection Tuning', 17, 'Adjusting fuel injection for better efficiency', 2880000, 0, 5),
('Fuel Injection Cleaning', 17, 'Cleaning deposits from injectors', 2400000, 0, 5),
('AC Filter Replacement', 14, 'Installing a new air conditioning filter', 1200000, 1, 4),
('AC System Diagnostics', 13, 'Checking AC performance and detecting issues', 2160000, 0, 4),
('AC Vent Cleaning', 13, 'Removing dust from AC vents for better airflow', 1440000, 0, 4),
('Advanced Engine Diagnostics', 1, 'Full engine health scan with detailed report', 1500000, 0, 1),
('Engine Mount Replacement', 1, 'Replacing worn-out engine mounts', 2000000, 1, 1),
('Engine Tuning', 1, 'Adjusting engine parameters for performance', 1800000, 0, 1),
('Turbocharger Inspection', 1, 'Checking turbo performance & efficiency', 1200000, 0, 1),
('Supercharger Installation', 1, 'Installing a supercharger for more power', 5000000, 1, 1),
('High-Performance Spark Plug Install', 2, 'Upgrading to high-performance spark plugs', 900000, 1, 1),
('Ignition Coil Replacement', 2, 'Installing new ignition coils', 1300000, 1, 1),
('Injector Leak Test', 3, 'Testing for fuel injector leaks', 700000, 0, 1),
('Injector Calibration', 3, 'Fine-tuning injectors for optimal performance', 1100000, 0, 1),
('Engine Cooling Fan Replacement', 4, 'Replacing the engine cooling fan', 1400000, 1, 1),
('Radiator Flush', 4, 'Cleaning the radiator for better cooling', 900000, 0, 1),
('Brake Line Replacement', 5, 'Installing new brake lines', 1800000, 1, 2),
('ABS Module Repair', 6, 'Repairing the ABS system', 2500000, 0, 2),
('Brake Rotor Resurfacing', 6, 'Smoothing the rotor surface', 1000000, 0, 2),
('Brake Pedal Adjustment', 6, 'Adjusting pedal sensitivity', 600000, 0, 2),
('Brake System Bleeding', 7, 'Removing air from brake lines', 500000, 0, 2),
('Adaptive Lighting Calibration', 8, 'Calibrating advanced car lighting', 1200000, 0, 3),
('HID/LED Headlight Conversion', 8, 'Upgrading halogen to HID/LED headlights', 2000000, 1, 3),
('Electrical Short Detection', 10, 'Identifying wiring shorts', 900000, 0, 3),
('ECU Reprogramming', 10, 'Updating ECU software', 2500000, 0, 3),
('Hybrid Battery Balancing', 10, 'Rebalancing hybrid battery cells', 3000000, 0, 3),
('Complete Wiring Harness Replacement', 11, 'Replacing all car wiring', 6000000, 1, 3),
('Fuse Box Upgrade', 9, 'Installing an upgraded fuse box', 900000, 1, 3),
('Gas Pressure Sensor Repair', 12, 'Fixing pressure sensor in the fuel system', 1100000, 0, 4),
('Fuel Line Replacement', 12, 'Installing new fuel lines', 1500000, 1, 4),
('Fuel Rail Cleaning', 15, 'Removing dirt from fuel rails', 900000, 0, 5),
('Throttle Body Cleaning', 17, 'Cleaning throttle body for smooth air intake', 800000, 0, 5),
('High-Flow Fuel Injector Install', 17, 'Installing performance fuel injectors', 3000000, 1, 5),
('AC Compressor Repair', 13, 'Repairing AC compressor', 2000000, 0, 4),
('AC Evaporator Cleaning', 13, 'Cleaning evaporator for better cooling', 1000000, 0, 4),
('AC Expansion Valve Replacement', 14, 'Installing new expansion valve', 1400000, 1, 4),
('Battery Load Test', 18, 'Testing battery under load', 400000, 0, 6),
('Battery Management System Update', 18, 'Updating BMS software', 900000, 0, 6),
('Ground Cable Replacement', 19, 'Replacing battery ground cables', 700000, 1, 6),
('Heavy-Duty Suspension Upgrade', 23, 'Installing reinforced suspension parts', 4000000, 1, 7),
('Air Suspension System Repair', 23, 'Fixing air suspension leaks', 2500000, 0, 7),
('Wheel Alignment Correction', 26, 'Adjusting wheel angles for proper alignment', 800000, 0, 8),
('Alloy Wheel Crack Repair', 25, 'Fixing cracks in alloy wheels', 1500000, 0, 8),
('Wheel Weight Balancing', 25, 'Balancing wheels for smooth rotation', 500000, 0, 8),
('Run-Flat Tire Repair', 24, 'Fixing damage on run-flat tires', 1200000, 0, 8),
('Performance Tire Upgrade', 24, 'Installing high-performance tires', 5000000, 1, 8),
('Off-Road Tire Installation', 24, 'Mounting off-road tires', 4500000, 1, 8),
('4x4 Drivetrain Service', 26, 'Servicing drivetrain for 4WD vehicles', 3000000, 0, 8),
('Differential Fluid Change', 26, 'Replacing fluid in differential', 1000000, 1, 8),
('Underbody Rust Prevention', 23, 'Applying rust-proof coating', 1800000, 0, 7),
('Steering Rack Adjustment', 22, 'Fine-tuning steering rack', 900000, 0, 7),
('Tie Rod End Replacement', 22, 'Installing new tie rod ends', 1300000, 1, 7),
('Performance Control Arm Upgrade', 21, 'Upgrading to reinforced control arms', 2500000, 1, 7),
('Hydraulic Power Steering Service', 21, 'Maintaining hydraulic steering system', 1400000, 0, 7),
('Air Filter Cleaning', 14, 'Cleaning engine air filter', 400000, 0, 4),
('Cabin Air Filter Replacement', 14, 'Installing new cabin air filter', 600000, 1, 4),
('Windshield Wiper Motor Replacement', 10, 'Replacing wiper motor', 1500000, 1, 3),
('Adaptive Cruise Control Repair', 10, 'Fixing adaptive cruise system', 2500000, 0, 3),
('Door Lock Mechanism Fix', 10, 'Repairing electronic door locks', 1200000, 0, 3),
('Smart Key Programming', 10, 'Programming new smart key', 1800000, 0, 3),
('Heated Seat Repair', 10, 'Fixing heating elements in seats', 1400000, 0, 3),
('Dashboard Digital Display Fix', 10, 'Repairing digital dashboard screens', 2000000, 0, 3),
('Sunroof Leak Repair', 23, 'Sealing sunroof leaks', 1200000, 0, 7),
('Engine Block Crack Inspection', 1, 'Checking for cracks in engine block', 3000000, 0, 1),
('Turbo Intercooler Upgrade', 1, 'Installing performance intercooler', 5000000, 1, 1),
('Exhaust System Cleaning', 1, 'Cleaning exhaust for better airflow', 1200000, 0, 1);
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