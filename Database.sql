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
	Avartar VARCHAR(MAX) DEFAULT NULL,
	LastActivity DATETIME,
);
GO

-- 2
CREATE TABLE Car(
	CarID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	UserID INT FOREIGN KEY REFERENCES [User](UserID) ON DELETE CASCADE,
	CarName VARCHAR(500) NOT NULL,
	Brand VARCHAR(MAX),
	RegistrationNumber VARCHAR(50) NOT NULL,
	[Year] INT,
    MaintenanceResgistrationDate DATE DEFAULT CURRENT_TIMESTAMP,
    CarImage VARCHAR(MAX),
	[Status] VARCHAR(50) DEFAULT NULL CHECK ([Status] IN ('Active', 'Maintaining'))
);
GO

-- 3
CREATE TABLE CarSystem ( 
	CarSystemID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	CarSystemName VARCHAR(200) NOT NULL,
);
GO

CREATE TABLE PartInfo (
	PartID INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    PartName VARCHAR(200) NOT NULL,
	CarSystemID INT NOT NULL FOREIGN KEY REFERENCES CarSystem(CarSystemID) ON DELETE CASCADE,
	[Image]  NVARCHAR(500)
);
GO

CREATE TABLE CarPart (
    CarID INT NOT NULL FOREIGN KEY REFERENCES Car(CarID) ON DELETE CASCADE,
    PartID INT NOT NULL FOREIGN KEY REFERENCES PartInfo(PartID),
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
	ServiceTypeDescription VARCHAR(MAX),
    ServiceImage VARCHAR(MAX)
);
GO

-- 6
CREATE TABLE [Service] (
	ServiceID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
	ServiceTypeID INT FOREIGN KEY REFERENCES [ServiceType](ServiceTypeID) ON DELETE CASCADE,
	PartID INT,
	ServiceName VARCHAR(200) NOT NULL,
	AffectInventory TINYINT DEFAULT 0,
	ServiceDescription VARCHAR(MAX),
	ServicePrice FLOAT NOT NULL,
	Checking TINYINT DEFAULT 0
);
GO

-- 7
CREATE TABLE Branch (
	BranchID INT IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	BranchName VARCHAR(200) NOT NULL,
	BranchAddress VARCHAR(MAX)
);
GO

-- 8
CREATE TABLE AccessoryInfo (
	AccessoryID INT IDENTITY (1, 1) NOT NULL PRIMARY KEY,
	AccessoryName VARCHAR(200) NOT NULL,
	ServiceID INT NOT NULL FOREIGN KEY REFERENCES Service(ServiceID),
	[Description] VARCHAR(MAX) NOT NULL
);
GO

-- 9
CREATE TABLE Inventory (
	BranchID INT NOT NULL FOREIGN KEY REFERENCES Branch(BranchID),
	AccessoryID INT NOT NULL FOREIGN KEY REFERENCES AccessoryInfo(AccessoryID),
	Quantity INT,
	UnitPrice FLOAT,
	CONSTRAINT pk_Inventory PRIMARY KEY (BranchID, AccessoryID),

);
GO
 
-- 7
CREATE TABLE [Order] (
	UserID INT NOT NULL FOREIGN KEY REFERENCES [User](UserID) ON DELETE CASCADE,
    OrderID INT NOT NULL,
    CarID INT NOT NULL FOREIGN KEY REFERENCES [Car](CarID),
    PartID INT NOT NULL FOREIGN KEY REFERENCES [PartInfo](PartID),
	ServiceID INT FOREIGN KEY REFERENCES [Service](ServiceID),
	BranchID INT FOREIGN KEY REFERENCES Branch(BranchID),
    QuantityUsed INT NOT NULL,
    EstimatedCost FLOAT NOT NULL,
	OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_Orders PRIMARY KEY (UserID, OrderID)
);
GO

-- 8
CREATE TABLE Messages (
    MessageID INT PRIMARY KEY IDENTITY,
    SenderID INT NOT NULL,
    ReceiverID INT NOT NULL,
    Content VARCHAR(MAX) NOT NULL,
    SentAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SenderID) REFERENCES [User](UserID),
    FOREIGN KEY (ReceiverID) REFERENCES [User](UserID),
);
GO

CREATE TABLE MessageReads (
    ReadID INT NOT NULL,
    UserID INT NOT NULL,
    MessageID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES [User](UserID),
    FOREIGN KEY (MessageID) REFERENCES Messages(MessageID)
);
GO

CREATE TABLE Payment(
	UserID INT FOREIGN KEY REFERENCES [User](UserID),
	PaymentID INT NOT NULL,
	CarID INT NOT NULL FOREIGN KEY REFERENCES Car(CarID),
	PaymentMethod VARCHAR(200),
	PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP,
	Amount FLOAT NOT NULL,
	CONSTRAINT pk_Payments PRIMARY KEY (UserID, PaymentID)
);
GO

CREATE TABLE Bill(
	UserID INT,
	PaymentID INT,
    PartID INT NOT NULL FOREIGN KEY REFERENCES PartInfo(PartID),
	ServiceID INT FOREIGN KEY REFERENCES [Service](ServiceID),
	BranchID INT FOREIGN KEY REFERENCES Branch(BranchID),
    QuantityUsed INT NOT NULL,
	TotalPrice FLOAT NOT NULL,
	OrderDate DATETIME NOT NULL,
	CONSTRAINT fk_Bills FOREIGN KEY (UserID, PaymentID) REFERENCES Payment(UserID, PaymentID),
	CONSTRAINT pk_Bills PRIMARY KEY (UserID, PaymentID, PartID, ServiceID)
);
GO


-- mesage 
CREATE PROCEDURE UpsertMessageRead
    @UserID INT,
    @ReadID INT,
    @MessageID INT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM MessageReads WHERE UserID = @UserID AND ReadID = @ReadID)
    BEGIN
        -- Nếu bản ghi đã tồn tại, thực hiện cập nhật
        UPDATE MessageReads
        SET MessageID = @MessageID
        WHERE UserID = @userId and ReadID = @ReadID
    END
    ELSE
    BEGIN
        -- Nếu bản ghi chưa tồn tại, thực hiện chèn mới
        INSERT INTO MessageReads (UserID, ReadID, MessageID)
        VALUES (@UserID, @ReadID, @MessageID);
    END
END;
GO

INSERT INTO [CarSystem](CarSystemName) VALUES 
('Engine System'),
('Braking System'),
('Electrical System'),
('Air Conditioning System'),
('Fuel System'),
('Battery System'),
('Shock Absorbers System'),
('Wheel System');
GO

INSERT INTO PartInfo(PartName, CarSystemID, [Image]) VALUES 
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
('Wheel Hub', 8,'/resource/CarPark_image/WheelHub.webp');
GO

-- Trigger for Car Parts
CREATE TRIGGER InsertCar
ON Car
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
   INSERT INTO [CarPart](CarID, PartID)
    SELECT 
        i.CarID,
        ROW_NUMBER() OVER (PARTITION BY i.CarID ORDER BY p.CarSystemID) AS PartID
    FROM inserted i
	CROSS JOIN PartInfo p
END;
GO

-- Trigger for Order
CREATE TRIGGER InsertOrder
ON [Order]
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Cập nhật đơn hàng nếu đã tồn tại
    UPDATE o
    SET o.QuantityUsed = o.QuantityUsed + i.QuantityUsed,
        o.EstimatedCost = (o.QuantityUsed + i.QuantityUsed) * COALESCE(inv.UnitPrice, 0) + COALESCE(s.ServicePrice, 0)
    FROM [Order] o
    INNER JOIN inserted i
        ON o.UserID = i.UserID
        AND o.CarID = i.CarID 
        AND o.PartID = i.PartID
        AND o.BranchID = i.BranchID
        AND COALESCE(o.ServiceID, 0) = COALESCE(i.ServiceID, 0)
    LEFT JOIN AccessoryInfo ai ON ai.ServiceID = i.ServiceID
    LEFT JOIN Inventory inv ON inv.BranchID = i.BranchID
                             AND inv.AccessoryID = ai.AccessoryID
    LEFT JOIN [Service] s ON s.ServiceID = i.ServiceID
    WHERE i.QuantityUsed >= 0; -- Cho phép QuantityUsed = 0

    -- Chèn đơn hàng mới nếu chưa tồn tại
    INSERT INTO [Order](UserID, OrderID, CarID, PartID, ServiceID, BranchID, QuantityUsed, EstimatedCost)
    SELECT
        i.UserID,
        COALESCE((SELECT MAX(o.OrderID) FROM [Order] o WHERE o.UserID = i.UserID), 0) + 1,
        i.CarID,
        i.PartID,
        i.ServiceID,
        i.BranchID,
        i.QuantityUsed,
        (i.QuantityUsed * COALESCE(inv.UnitPrice, 0)) + COALESCE(s.ServicePrice, 0)
    FROM inserted i
    LEFT JOIN AccessoryInfo ai ON ai.ServiceID = i.ServiceID
    LEFT JOIN Inventory inv ON inv.BranchID = i.BranchID
                             AND inv.AccessoryID = ai.AccessoryID
    LEFT JOIN [Service] s ON s.ServiceID = i.ServiceID
    WHERE NOT EXISTS (
        SELECT 1
        FROM [Order] o
        WHERE o.UserID = i.UserID
        AND o.CarID = i.CarID 
        AND o.PartID = i.PartID
        AND o.BranchID = i.BranchID
        AND COALESCE(o.ServiceID, 0) = COALESCE(i.ServiceID, 0)
    )
    AND i.QuantityUsed >= 0; -- Cho phép QuantityUsed = 0
END;
GO

CREATE TRIGGER DeleteOrder
ON [Order]
FOR DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Cập nhật lại số lượng trong Inventory khi đơn hàng bị hủy
    UPDATE ivt
    SET ivt.Quantity = ivt.Quantity - d.QuantityUsed
    FROM Inventory ivt
    INNER JOIN deleted d ON ivt.BranchID = d.BranchID
    INNER JOIN AccessoryInfo ai ON ai.ServiceID = d.ServiceID
                                AND ivt.AccessoryID = ai.AccessoryID;
END;
GO

DISABLE TRIGGER DeleteOrder ON [Order];
GO

CREATE TRIGGER InsertPayment
ON Payment
INSTEAD OF INSERT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Payment(PaymentID, UserID, CarID, PaymentMethod, Amount)
    SELECT
        COALESCE((SELECT MAX(p.PaymentID) FROM Payment p WHERE p.UserID = i.UserID), 0) + 1,
        i.UserID,
		i.CarID,
        i.PaymentMethod,
        i.Amount
    FROM inserted i;
END;
GO     

INSERT INTO [ServiceType](ServiceTypeName, ServiceTypeDescription, ServiceImage) VALUES 
-- 1
('Wheel System', 'Your wheels are more than just round things that keep you rolling. They''re the foundation of your vehicle''s performance, safety, and overall driving experience.<br><br>At AUTO247, we understand the critical role your wheels play, and that''s why we offer a comprehensive Wheel System Service designed to keep you cruising in confidence.', 'https://autostreamcarcare.com/wp-content/uploads/2024/05/AutoStream-Maryland-Tire-Repair.jpg'),
--2
('Braking System', 'Your brakes are arguably the most critical safety feature on your vehicle. They''re your first line of defense in preventing accidents and ensuring your safety on the road.<br><br>At AUTO247, we understand the importance of a reliable braking system, and that''s why we offer a comprehensive Braking System Service designed to keep you stopping safely and confidently.', 'https://d2hucwwplm5rxi.cloudfront.net/wp-content/uploads/2021/06/24113921/5-SIGNS-YOUR-CAR-BRAKES-NEED-REPAIR-Cover-240620210426.jpg'),
-- 3
('Engine System', 'Your engine is the heart of your vehicle. It''s the powerhouse that propels you forward, delivering the performance and reliability you depend on.<br><br>At AUTO247, we understand the vital role your engine plays, and that''s why we offer a comprehensive Engine System Service designed to keep your engine running smoothly and efficiently.', 'https://status-automotive.com/wp-content/uploads/2024/02/auto-engine-repair-1.jpg'),
-- 4
('Battery System', 'Your car battery is the unsung hero of your vehicle. It''s the source of electrical power that starts your engine, powers your lights, and keeps your accessories running.<br><br>At AUTO247, we understand the critical role your battery plays, and that''s why we offer a comprehensive Battery System Service designed to keep you powered up and on the go.', 'https://repairsmith-prod-wordpress.s3.amazonaws.com/2021/07/iStock-1251530338-1.jpg'),
-- 5
('Electrical System', 'Your vehicle''s electrical system is like its nervous system, responsible for powering everything from your headlights and infotainment system to your engine''s ignition and vital safety features.<br><br>At AUTO247, we understand the intricate role your electrical system plays, and that''s why we offer a comprehensive Electrical System Service designed to keep your vehicle running smoothly and safely.', 'https://www.affordablekarkare.com/custom/16.2Electrical.webp'),
-- 6
('Air Conditioning System', 'Imagine driving on a hot summer day, stuck in traffic, and your air conditioning system suddenly stops working. Not a pleasant experience, right?<br><br>At AUTO247, we understand the importance of a reliable air conditioning system, and that''s why we offer a comprehensive Air Conditioning System Service designed to keep you cool and comfortable all year round.', 'https://blog.napacanada.com/wp-content/uploads/2023/06/Car-Air-Conditioning-Climatisation-des-vehicules-1.jpg'),
-- 7
('Shock Absorbers System', 'Your shock absorbers are the unsung heroes of your vehicle''s suspension system. They''re responsible for keeping your ride smooth and comfortable, even on the bumpiest roads.<br><br>At AUTO247, we understand the vital role your shock absorbers play, and that''s why we offer a comprehensive Shock Absorbers System Service designed to keep you riding in comfort and control.', 'https://germanic.ae/wp-content/uploads/2024/03/Shock-Absorber-Repair.webp'),
-- 8
('Fuel System', 'Your fuel system is the lifeline of your engine, responsible for delivering the precise amount of fuel needed for optimal performance.<br><br>At AUTO247, we understand the critical role your fuel system plays, and that''s why we offer a comprehensive Fuel System Service designed to keep your engine running strong and efficiently.', 'https://milexcompleteautocare.com/wp-content/uploads/2023/11/GettyImages-652660336.jpg'),
-- 9
('Cleaning and Maintenance', 'Your car is more than just a mode of transportation; it''s an extension of your personality and a reflection of your style.<br><br>At AUTO247, we understand the importance of keeping your car looking and feeling its best, and that''s why we offer a comprehensive range of Cleaning and Maintenance services designed to help you maintain your car''s appearance and preserve its value.', 'https://di-uploads-pod18.dealerinspire.com/executivehonda/uploads/2024/03/EAG_March_Blog-1.jpg');
GO

INSERT INTO [Service](ServiceTypeID, PartID, ServiceName, AffectInventory, ServiceDescription, ServicePrice) VALUES
(1, 24, 'Tire Replacement', 1, 'Installing new tires', 3600000),
(1, 24, 'Tire Rotation', 0, 'Rotating tires for even wear', 960000),
(1, 24, 'Run-Flat Tire Repair', 0, 'Fixing damage on run-flat tires', 1200000),
(1, 24, 'Performance Tire Upgrade', 1, 'Installing high-performance tires', 5000000),
(1, 24, 'Off-Road Tire Installation', 1, 'Mounting off-road tires', 4500000),
(1, 25, 'Rim Polishing', 0, 'Cleaning and restoring rim finish', 1680000),
(1, 25, 'Alloy Wheel Crack Repair', 0, 'Fixing cracks in alloy wheels', 1500000),
(1, 25, 'Wheel Weight Balancing', 0, 'Balancing wheels for smooth rotation', 500000),
(1, 25, 'Rim Restoration', 0, 'Restoring rim surface for a polished look', 2400000),
(1, 25, 'Rim Replacement', 1, 'Installing new rims', 4800000),
(1, 26, 'Wheel Balancing', 0, 'Ensuring even weight distribution on wheels', 1200000),
(1, 26, 'Wheel Alignment', 0, 'Adjusting angles for proper wheel alignment', 1920000),
(1, 26, '4x4 Drivetrain Service', 0, 'Servicing drivetrain for 4WD vehicles', 3000000),
(1, 26, 'Differential Fluid Change', 1, 'Replacing fluid in differential', 1000000),
(1, 26, 'Wheel Bearing Replacement', 1, 'Replacing worn-out wheel bearings', 3360000),
(1, 26, 'Wheel Hub Greasing', 0, 'Lubricating wheel hub for smooth rotation', 1200000), 

(2, 5, 'Brake Pad Inspection', 0, 'Checking brake pad thickness and wear', 600000),
(2, 5, 'Brake Pad Replacement', 1, 'Installing new brake pads', 1920000),
(2, 5, 'Brake Pad Adjustment', 0, 'Adjusting brake pads for optimal contact', 1200000),
(2, 5, 'Brake Line Replacement', 1, 'Installing new brake lines', 1800000),
(2, 6, 'Brake Rotor Resurfacing', 0, 'Smoothing brake rotors for better performance', 2400000),
(2, 6, 'Brake Rotor Replacement', 1, 'Installing new brake rotors', 3600000),
(2, 6, 'Brake Rotor Cleaning', 0, 'Removing rust and debris from rotors', 1440000),
(2, 6, 'Brake Rotor Resurfacing', 0, 'Smoothing the rotor surface', 1000000),
(2, 6, 'Brake Pedal Adjustment', 0, 'Adjusting pedal sensitivity', 600000),
(2, 6, 'ABS Module Repair', 0, 'Repairing the ABS system', 2500000),
(2, 7, 'Brake Fluid Top-Up', 1, 'Adding brake fluid to maintain levels', 720000),
(2, 7, 'Brake Fluid Replacement', 1, 'Flushing old brake fluid and refilling', 1920000),
(2, 7, 'Brake Fluid Leak Repair', 0, 'Fixing leaks in the brake fluid system', 2400000),

(3, 1, 'Engine Oil Change', 0, 'Replacing old engine oil with fresh oil', 1200000),
(3, 1, 'Engine Oil System Flush', 0, 'Cleaning the engine oil system thoroughly', 1680000),
(3, 1, 'Engine Oil Leak Check', 0, 'Inspecting and fixing engine oil leaks', 960000),
(3, 1, 'Engine Oil Filter Replacement', 1, 'Replacing clogged oil filter for better flow', 720000),
(3, 1, 'Engine Mount Replacement', 0, 'Replacing worn-out engine mounts', 2000000),
(3, 1, 'Engine Tuning', 0, 'Adjusting engine parameters for performance', 1800000),
(3, 1, 'Advanced Engine Diagnostics', 0, 'Full engine health scan with detailed report', 1500000),
(3, 1, 'Turbocharger Inspection', 0, 'Checking turbo performance & efficiency', 1200000),
(3, 1, 'Supercharger Installation', 1, 'Installing a supercharger for more power', 5000000),
(3, 1, 'Turbo Intercooler Upgrade', 1, 'Installing performance intercooler', 5000000),
(3, 1, 'Exhaust System Cleaning', 0, 'Cleaning exhaust for better airflow', 1200000),
(3, 2, 'Spark Plug Inspection', 0, 'Checking spark plug condition for wear', 600000),
(3, 2, 'Spark Plug Cleaning', 0, 'Cleaning deposits from spark plugs', 480000),
(3, 2, 'Spark Plug Replacement', 1, 'Installing new spark plugs for better ignition', 840000),
(3, 2, 'High-Performance Spark Plug Install', 1, 'Upgrading to high-performance spark plugs', 900000),
(3, 2, 'Ignition System Check', 0, 'Diagnosing and repairing ignition issues', 1440000),
(3, 2, 'Ignition Coil Replacement', 1, 'Installing new ignition coils', 1300000),
(3, 4, 'Cooling System Flush', 1, 'Draining and refilling coolant system', 2160000),
(3, 4, 'Cooling System Leak Check', 0, 'Identifying leaks in the cooling system', 1440000),
(3, 4, 'Coolant Replacement', 1, 'Replacing old coolant for optimal performance', 1200000),
(3, 4, 'Radiator Cleaning', 0, 'Removing debris and buildup from radiator', 1680000),
(3, 4, 'Radiator Flush', 0, 'Cleaning the radiator for better cooling', 900000),
(3, 4, 'Engine Cooling Fan Replacement', 1, 'Replacing the engine cooling fan', 1400000),

(4, 18, 'Battery Load Test', 0, 'Testing battery under load', 400000),
(4, 18, 'Battery Management System Update', 0, 'Updating BMS software', 900000),
(4, 18, 'Charging System Check', 0, 'Testing battery and alternator performance', 1200000),
(4, 18, 'Battery Charging Service', 0, 'Recharging car battery for optimal power', 720000),
(4, 18, 'Hybrid Battery Balancing', 0, 'Rebalancing hybrid battery cells', 3000000),
(4, 19, 'Ground Cable Replacement', 1, 'Replacing battery ground cables', 700000),
(4, 19, 'Battery Terminal Cleaning', 0, 'Cleaning corrosion from battery terminals', 600000),
(4, 19, 'Battery Terminal Replacement', 1, 'Installing new battery terminals', 960000),

(5, 8, 'Headlight Bulb Replacement', 1, 'Changing old headlight bulbs', 960000),
(5, 8, 'Tail Light Bulb Replacement', 1, 'Replacing faulty tail light bulbs', 840000),
(5, 8, 'Interior Light Bulb Replacement', 1, 'Installing new interior light bulbs', 600000),
(5, 8, 'Adaptive Lighting Calibration', 0, 'Calibrating advanced car lighting', 1200000),
(5, 8, 'HID/LED Headlight Conversion', 1, 'Upgrading halogen to HID/LED headlights', 2000000),
(5, 9, 'Fuse Check', 0, 'Inspecting fuses for electrical issues', 480000),
(5, 9, 'Fuse Replacement', 1, 'Replacing blown fuses', 360000),
(5, 9, 'Fuse Box Cleaning', 0, 'Cleaning corrosion from fuse box', 720000),
(5, 9, 'Fuse Box Upgrade', 1, 'Installing an upgraded fuse box', 900000),
(5, 10, 'Electrical System Diagnosis', 0, 'Checking car’s electrical components', 2400000),
(5, 10, 'Alternator Check', 0, 'Testing alternator for proper charging', 1200000),
(5, 10, 'ECU Reprogramming', 0, 'Updating ECU software', 2500000),
(5, 11, 'Wiring Check', 0, 'Inspecting electrical wiring for damage', 1440000),
(5, 11, 'Wiring Harness Replacement', 1, 'Installing new wiring harness', 2880000),
(5, 11, 'Wiring Short Diagnosis', 0, 'Repairing short circuits in wiring', 2160000),

(6, 10, 'Windshield Wiper Motor Replacement', 1, 'Replacing wiper motor', 1500000),
(6, 12, 'AC Gas Refill', 1, 'Refilling air conditioning refrigerant', 1920000),
(6, 12, 'AC Compressor Check', 0, 'Diagnosing AC compressor performance', 1680000),
(6, 12, 'AC Gas Leak Detection', 0, 'Identifying leaks in AC refrigerant system', 1200000),
(6, 13, 'AC Condenser Cleaning', 0, 'Removing dust and debris from AC condenser', 1440000),
(6, 13, 'AC Condenser Repair', 0, 'Fixing leaks or clogs in AC condenser', 2880000),
(6, 13, 'AC Condenser Replacement', 1, 'Installing new AC condenser', 4320000),
(6, 13, 'AC System Diagnostics', 0, 'Checking AC performance and detecting issues', 2160000),
(6, 13, 'AC Vent Cleaning', 0, 'Removing dust from AC vents for better airflow', 1440000),
(6, 14, 'Air Filter Cleaning', 0, 'Removing dust from air filter', 600000),
(6, 14, 'Air Filter Replacement', 1, 'Installing new air filter', 960000),
(6, 14, 'AC Filter Replacement', 1, 'Installing a new air conditioning filter', 1200000),
(6, 14, 'AC Expansion Valve Replacement', 1, 'Installing new expansion valve', 1400000),

(7, 20, 'Shock Absorber Check', 0, 'Inspecting shock absorbers for leaks', 1200000),
(7, 20, 'Shock Absorber Replacement', 1, 'Installing new shock absorbers', 4320000),
(7, 21, 'Control Arm Inspection', 0, 'Checking control arms for wear and damage', 1200000),
(7, 21, 'Control Arm Replacement', 1, 'Installing new control arms', 4320000),
(7, 21, 'Performance Control Arm Upgrade', 1, 'Upgrading to reinforced control arms', 2500000),
(7, 21, 'Hydraulic Power Steering Service', 0, 'Maintaining hydraulic steering system', 1400000),
(7, 22, 'Tie Rod End Replacement', 1, 'Installing new tie rod ends', 2880000),
(7, 22, 'Tie Rod Alignment', 0, 'Adjusting tie rods for proper steering', 1680000),
(7, 22, 'Steering Rack Adjustment', 0, 'Fine-tuning steering rack', 900000),
(7, 23, 'Suspension Inspection', 0, 'Checking suspension system components', 1440000),
(7, 23, 'Suspension Repair', 1, 'Fixing worn suspension components', 4800000),
(7, 23, 'Suspension Lubrication', 0, 'Lubricating suspension components', 960000),
(7, 23, 'Suspension Bushing Replacement', 1, 'Replacing worn-out suspension bushings', 2880000),
(7, 23, 'Underbody Rust Prevention', 0, 'Applying rust-proof coating', 1800000),
(7, 23, 'Sunroof Leak Repair', 0, 'Sealing sunroof leaks', 1200000),

(8, 15, 'Fuel Pump Cleaning', 0, 'Cleaning fuel pump for better efficiency', 1680000),
(8, 15, 'Fuel Pump Repair', 0, 'Fixing fuel pump issues', 2400000),
(8, 15, 'Fuel Pump Replacement', 1, 'Installing new fuel pump', 3600000),
(8, 15, 'Fuel Rail Cleaning', 0, 'Removing dirt from fuel rails', 900000),
(8, 16, 'Fuel Filter Replacement', 1, 'Replacing clogged fuel filter', 1200000),
(8, 17, 'Fuel Injection Tuning', 0, 'Adjusting fuel injection for better efficiency', 2880000),
(8, 17, 'Fuel Injection Cleaning', 0, 'Cleaning deposits from injectors', 2400000),
(8, 17, 'Fuel Injector Repair', 0, 'Fixing faulty fuel injectors', 2880000),
(8, 17, 'Fuel Injector Calibration', 0, 'Adjusting injector spray pattern', 2400000),
(8, 17, 'Injector Leak Test', 0, 'Testing for fuel injector leaks', 700000),
(8, 17, 'High-Flow Fuel Injector Install', 1, 'Installing performance fuel injectors', 3000000),
(8, 17, 'Throttle Body Cleaning', 0, 'Cleaning throttle body for smooth air intake', 800000);

INSERT INTO AccessoryInfo(ServiceID, AccessoryName, Description)
VALUES
(1, 'Tire Set', 'Replace with new tires'),
(4, 'High Performance Tires', 'Upgrade to high-performance tires'),
(5, 'Off-road Tires', 'Specialized tires for off-road use'),
(10, 'Wheel Rims', 'Replace with new wheel rims'),
(14, 'Differential Oil', 'Oil for differential replacement'),
(15, 'Wheel Bearing', 'Replace wheel bearings'),
(18, 'Brake Pads', 'New brake pads replacement'),
(20, 'Brake Fluid Hose', 'New brake fluid hoses'),
(22, 'Brake Discs', 'Replace with new brake discs'),
(27, 'Brake Fluid', 'Brake fluid refill'),
(28, 'Brake Fluid', 'Complete brake fluid replacement'),
(33, 'Engine Oil Filter', 'New engine oil filter'),
(38, 'Supercharger Kit', 'Install supercharger kit'),
(39, 'Intercooler', 'High-performance intercooler'),
(43, 'Spark Plugs', 'Replace spark plugs'),
(44, 'High Performance Spark Plugs', 'Upgrade to high-performance spark plugs'),
(46, 'Ignition Coil', 'Replace ignition coils'),
(47, 'Coolant Flush', 'Flush cooling system'),
(49, 'Coolant', 'Replace with new coolant'),
(52, 'Engine Cooling Fan', 'Replace engine cooling fan'),
(58, 'Battery Ground Cable', 'Replace battery ground cable'),
(60, 'Battery Terminals', 'Replace battery terminals'),
(61, 'Headlight Bulbs', 'Replace headlight bulbs'),
(62, 'Tail Light Bulbs', 'Replace tail light bulbs'),
(63, 'Interior Light Bulbs', 'Replace interior light bulbs'),
(65, 'HID/LED Headlights', 'Upgrade to HID/LED headlights'),
(67, 'Fuse', 'Replace fuse'),
(69, 'Fuse Box', 'Replace fuse box'),
(74, 'Wiring Harness', 'Replace vehicle wiring harness'),
(76, 'Wiper Motor', 'Replace windshield wiper motor'),
(77, 'AC Refrigerant', 'Refill air conditioning refrigerant'),
(82, 'AC Condenser', 'Replace air conditioning condenser'),
(86, 'Engine Air Filter', 'Replace engine air filter'),
(87, 'Cabin Air Filter', 'Replace cabin air filter'),
(88, 'AC Expansion Valve', 'Replace air conditioning expansion valve'),
(90, 'Shock Absorbers', 'Replace with new shock absorbers'),
(92, 'Control Arms', 'Replace control arms'),
(93, 'High Performance Control Arms', 'Upgrade to high-performance control arms'),
(95, 'Tie Rod Ends', 'Replace tie rod ends'),
(99, 'Suspension Struts', 'Replace suspension struts'),
(101, 'Suspension Bushings', 'Replace suspension bushings'),
(106, 'Fuel Pump', 'Replace fuel pump'),
(108, 'Fuel Filter', 'Replace fuel filter'),
(114, 'High Performance Fuel Injectors', 'Upgrade to high-performance fuel injectors');
GO

CREATE TRIGGER trg_AfterInsert_Branch
ON Branch
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Tạo bảng tạm lưu Quantity và UnitPrice (dữ liệu đã tách)
    DECLARE @AccessoryData TABLE (
        RowNum INT IDENTITY(1,1), -- Đánh số thứ tự để map với AccessoryID
        Quantity INT,
        UnitPrice FLOAT
    );

    -- Chèn dữ liệu vào bảng tạm (theo thứ tự AccessoryInfo)
    INSERT INTO @AccessoryData (Quantity, UnitPrice)
    VALUES
        (4, 1800000),
        (4, 2500000),
        (4, 2250000),
        (4, 2400000),
        (1, 500000),
        (2, 840000),
        (2, 480000),
        (2, 450000),
        (2, 900000),
        (1, 360000),
        (1, 960000),
        (1, 360000),
        (1, 10000000),
        (1, 5000000),
        (4, 105000),
        (4, 112500),
        (4, 162500),
        (1, 1080000),
        (1, 600000),
        (1, 700000),
        (1, 350000),
        (2, 240000),
        (2, 240000),
        (2, 210000),
        (2, 150000),
        (2, 500000),
        (1, 180000),
        (1, 450000),
        (1, 1440000),
        (1, 750000),
        (1, 960000),
        (1, 2160000),
        (1, 480000),
        (1, 600000),
        (1, 700000),
        (2, 1080000),
        (2, 1080000),
        (2, 1250000),
        (2, 720000),
        (2, 1200000),
        (4, 360000),
        (1, 1800000),
        (1, 600000),
        (4, 375000);

    -- Chèn dữ liệu vào bảng Inventory
    INSERT INTO Inventory (BranchID, AccessoryID, Quantity, UnitPrice)
    SELECT 
        i.BranchID,
        ai.AccessoryID,
        ad.Quantity,
        ad.UnitPrice
    FROM Inserted i
    CROSS JOIN (
        SELECT AccessoryID, ROW_NUMBER() OVER (ORDER BY AccessoryID) AS RowNum
        FROM AccessoryInfo
    ) ai
    INNER JOIN @AccessoryData ad ON ai.RowNum = ad.RowNum;
END;
GO

INSERT INTO Branch(BranchName, BranchAddress) VALUES
('Branch 1', '123 Nguyen Van Linh, District 7, Ho Chi Minh City'),
('Branch 2', '456 Le Van Luong, District 9, Ho Chi Minh City'),
('Branch 3', '789 Nguyen Huu Tho, District 4, Ho Chi Minh City');

-- Sample data

INSERT INTO [User](Username, Password, FirstName, LastName, Email, Phone, DOB, Role)
VALUES ('doanhieu18', 'doanhieu18@', 'Hieu', 'Doan', 'doanhieu180204@gmail.com', '0325413488', '2004-02-18', 'Admin');

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

GO

INSERT INTO [Car](UserID, CarName, Brand, RegistrationNumber, [Year], CarImage, [Status]) VALUES 
(1, 'Car 1', 'Toyota', '123456', 2010, 'https://vov.vn/sites/default/files/styles/large/public/2022-08/289624929_453408263095020_5408162982360432160_n.png', 'Active'),
(1, 'Car 2', 'Honda', '654321', 2015, 'https://akm-img-a-in.tosshub.com/indiatoday/styles/medium_crop_simple/public/2024-11/1_4.jpg', 'Maintaining'),
(1, 'Car 3', 'Ford', '987654', 2018, 'https://images.dealer.com/autodata/us/640/2020/USD00FOS372A0/USC80FOS371A01300.jpg', 'Active'),
(1, 'Car 4', 'BMW', '125478', 2020, '', 'Active'),
(2, 'Car 1', 'Toyota', '123456', 2010, 'https://vov.vn/sites/default/files/styles/large/public/2022-08/289624929_453408263095020_5408162982360432160_n.png', 'Active'),
(2, 'Car 2', 'Honda', '654321', 2015, 'https://akm-img-a-in.tosshub.com/indiatoday/styles/medium_crop_simple/public/2024-11/1_4.jpg', 'Maintaining'),
(2, 'Car 3', 'Ford', '987654', 2018, 'https://images.dealer.com/autodata/us/640/2020/USD00FOS372A0/USC80FOS371A01300.jpg', 'Active'),
(2, 'Car 4', 'BMW', '125478', 2020, '', 'Active');
GO

INSERT INTO [Order] (UserID, CarID, BranchID, PartID, ServiceID, QuantityUsed)
VALUES (2, 1, 1, 8, 114, 2);
GO


ENABLE TRIGGER DeleteOrder ON [Order];
GO

DELETE FROM [Order] WHERE UserID = 2 AND CarID = 1;
GO

DISABLE TRIGGER DeleteOrder ON [Order]
GO