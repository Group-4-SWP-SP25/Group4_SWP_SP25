class Inventory {
  constructor(inventoryData) {
    this.partID = inventoryData.PartID;
    this.partName = inventoryData.PartName;
    this.carSystemID = inventoryData.CarSystemID;
    this.description = inventoryData.Description;
    this.quantity = inventoryData.Quantity;
    this.unitPrice = inventoryData.UnitPrice;
  }
  InventoryInfo() {
    let data = {
      partID: this.partID,
      partName: this.partName,
      carSystemID: this.carSystemID,
      description: this.description,
      quantity: this.quantity,
      unitPrice: this.unitPrice,
    };
    return data;
  }
}
