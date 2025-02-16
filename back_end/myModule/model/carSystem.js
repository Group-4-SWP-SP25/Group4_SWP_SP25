class CarSystem {
  constructor(carSystemData) {
    this.carSystemID = carSystemData.CarSystemID;
    this.carSystemName = carSystemData.CarSystemName;
  }
  CarSystemInfo() {
    let data = {
      carSystemID: this.carSystemID,
      carSystemName: this.carSystemName,
    };
    return data;
  }
}
