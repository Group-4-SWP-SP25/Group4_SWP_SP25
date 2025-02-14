class Service {
  constructor(serviceData) {
    this.serviceID = serviceData.ServiceID;
    this.serviceName = serviceData.ServiceName;
    this.serviceTypeID = serviceData.ServiceTypeID;
    this.price = serviceData.Price;
    this.description = serviceData.Description;
  }

  serviceInfo() {
    let data = {
      serviceID: this.serviceID,
      serviceName: this.serviceName,
      serviceTypeID: this.serviceTypeID,
      price: this.price,
      description: this.description,
    };
    return data;
  }
}
