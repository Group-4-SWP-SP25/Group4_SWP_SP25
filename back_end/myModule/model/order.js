class Order {
  constructor(orderData) {
    this.userID = orderData.UserID;
    this.orderID = orderData.OrderID;
    this.carID = orderData.CarID;
    this.partID = orderData.PartID;
    this.quantityUsed = orderData.QuantityUsed;
    this.estimatedCost = orderData.EstimatedCost;
    this.orderDate = orderData.OrderDate;
  }
  OrderInfo() {
    let data = {
      userID: this.userID,
      orderID: this.orderID,
      carID: this.carID,
      partID: this.partID,
      quantityUsed: this.quantityUsed,
      estimatedCost: this.estimatedCost,
      orderDate: this.orderDate,
    };
    return data;
  }
}

module.exports = Order;
``;
