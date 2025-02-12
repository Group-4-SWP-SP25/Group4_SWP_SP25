class Service {
    constructor(serviceData) {
        this.serviceID = serviceData.ServiceID;
        this.serviceTypeID = serviceData.ServiceTypeID;
        this.serviceName = serviceData.ServiceName;
        this.serviceDescription = serviceData.ServiceDescription;
        this.price = serviceData.Price;
    }

    serviceInfo() {
        let data = {
            serviceID: this.serviceID,
            serviceTypeID: this.serviceTypeID,
            serviceName: this.serviceName,
            serviceDescription: this.serviceDescription,
            price: this.price,
        };
        return data;
    }
}

module.exports = Service;
