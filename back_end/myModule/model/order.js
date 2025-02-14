class Order {
  constructor(orderData) {
    this.userID = orderData.UserID;
    this.orderID = orderData.OrderID;
    this.carID = orderData.CarID;
    this.partID = orderData.PartID;
    this.quantityUsed = orderData.QuantityUsed;
    this.estimatedCost = orderData.EstimatedCost;
  }
  OrderInfo() {
    let data = {
      userID: this.userID,
      orderID: this.orderID,
      carID: this.carID,
      partID: this.partID,
      quantityUsed: this.quantityUsed,
      estimatedCost: this.estimatedCost,
    };
    return data;
  }
}

module.exports = Order;
``;
