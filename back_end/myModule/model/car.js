class Car {
  constructor(carData) {
    this.carID = carData.CarID;
    this.userID = carData.UserID;
    this.carName = carData.CarName;
    this.brand = carData.Brand;
    this.registrationNumber = carData.RegistrationNumber;
    this.year = carData.Year;
  }
  CarInfo() {
    let data = {
      carID: this.carID,
      userID: this.userID,
      carName: this.carName,
      brand: this.brand,
      registrationNumber: this.registrationNumber,
      year: this.year,
    };
    return data;
  }
}
