// Order model
class Order {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.pair = data.pair;
    this.side = data.side; // 'buy' or 'sell'
    this.type = data.type; // 'market' or 'limit'
    this.amount = data.amount;
    this.price = data.price;
    this.status = data.status || "open"; // 'open', 'filled', 'cancelled', 'partial'
    this.filled = data.filled || 0;
    this.remaining = data.remaining || data.amount;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.filledAt = data.filledAt;
    this.cancelledAt = data.cancelledAt;
  }

  // Calculate filled percentage
  getFilledPercentage() {
    return ((this.filled / this.amount) * 100).toFixed(2);
  }

  // Get total value
  getTotalValue() {
    return this.amount * (this.price || 0);
  }

  // Check if order is active
  isActive() {
    return this.status === "open" || this.status === "partial";
  }

  // Validate order data
  static validate(data) {
    const errors = [];

    if (!data.pair || !data.pair.includes("/")) {
      errors.push("Valid trading pair is required");
    }

    if (!["buy", "sell"].includes(data.side)) {
      errors.push("Order side must be buy or sell");
    }

    if (!["market", "limit"].includes(data.type)) {
      errors.push("Order type must be market or limit");
    }

    if (typeof data.amount !== "number" || data.amount <= 0) {
      errors.push("Valid amount is required");
    }

    if (
      data.type === "limit" &&
      (typeof data.price !== "number" || data.price <= 0)
    ) {
      errors.push("Price is required for limit orders");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Mock orders database
const orders = [];

// Order service methods
class OrderService {
  static create(orderData) {
    const validation = Order.validate(orderData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const newOrder = new Order({
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    orders.push(newOrder);
    return newOrder;
  }

  static findById(id) {
    return orders.find((order) => order.id === id);
  }

  static findByUserId(userId) {
    return orders.filter((order) => order.userId === userId);
  }

  static findByPair(pair) {
    return orders.filter((order) => order.pair === pair.toUpperCase());
  }

  static findByStatus(status) {
    return orders.filter((order) => order.status === status);
  }

  static update(id, updateData) {
    const orderIndex = orders.findIndex((order) => order.id === id);
    if (orderIndex === -1) {
      throw new Error("Order not found");
    }

    orders[orderIndex] = {
      ...orders[orderIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    return orders[orderIndex];
  }

  static cancel(id, userId) {
    const order = this.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("Unauthorized to cancel this order");
    }

    if (!order.isActive()) {
      throw new Error("Cannot cancel order that is not active");
    }

    return this.update(id, {
      status: "cancelled",
      cancelledAt: new Date(),
    });
  }

  static fill(id, filledAmount) {
    const order = this.findById(id);
    if (!order) {
      throw new Error("Order not found");
    }

    const newFilled = order.filled + filledAmount;
    const newRemaining = order.amount - newFilled;

    let status = "partial";
    if (newRemaining <= 0) {
      status = "filled";
    }

    return this.update(id, {
      filled: newFilled,
      remaining: Math.max(0, newRemaining),
      status,
      filledAt: status === "filled" ? new Date() : order.filledAt,
    });
  }

  static getOrderBook(pair) {
    const pairOrders = this.findByPair(pair);
    const activeOrders = pairOrders.filter((order) => order.isActive());

    const bids = activeOrders
      .filter((order) => order.side === "buy")
      .sort((a, b) => b.price - a.price)
      .slice(0, 10);

    const asks = activeOrders
      .filter((order) => order.side === "sell")
      .sort((a, b) => a.price - b.price)
      .slice(0, 10);

    return {
      pair: pair.toUpperCase(),
      timestamp: new Date().toISOString(),
      bids: bids.map((order) => ({
        price: order.price,
        amount: order.remaining,
        total: order.price * order.remaining,
      })),
      asks: asks.map((order) => ({
        price: order.price,
        amount: order.remaining,
        total: order.price * order.remaining,
      })),
    };
  }

  static getTradingStats(pair) {
    const pairOrders = this.findByPair(pair);

    return {
      pair: pair.toUpperCase(),
      totalOrders: pairOrders.length,
      openOrders: pairOrders.filter((order) => order.status === "open").length,
      filledOrders: pairOrders.filter((order) => order.status === "filled")
        .length,
      cancelledOrders: pairOrders.filter(
        (order) => order.status === "cancelled"
      ).length,
      totalVolume: pairOrders
        .filter((order) => order.status === "filled")
        .reduce((sum, order) => sum + order.price * order.filled, 0),
    };
  }
}

module.exports = {
  Order,
  orders,
  OrderService
};
