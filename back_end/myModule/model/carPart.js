class CarPart {
  constructor(carPartData) {
    this.carID = carPartData.CarID;
    this.partID = carPartData.PartID;
    this.partName = carPartData.PartName;
    this.carSystemID = carPartData.CarSystemID;
    this.installationDate = carPartData.InstallationDate;
    this.expiryDate = carPartData.ExpiryDate;
    this.status = carPartData.Status;
  }
  CarPartInfo() {
    let data = {
      carID: this.carID,
      partID: this.partID,
      partName: this.partName,
      carSystemID: this.carSystemID,
      installationDate: this.installationDate,
      expiryDate: this.expiryDate,
      status: this.status,
    };
    return data;
  }
}
