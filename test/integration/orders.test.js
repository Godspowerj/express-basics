import { jest } from "jest/globals";



import supertest from "supertest";
import mongoose from "mongoose";
import Order from "../../models/order";
import { app } from "../../app";


const requests = supertest(app);

describe("/orders", () => {
  
  it("it should return all orders", async () => {
    const response = await requests.get("/orders");
    expect(response.status).toBe(200);
  });


  it("should return an order with the particular ID ", async () => {
    
    const fakeUserId = new mongoose.Types.ObjectId();
    const fakeProductId = new mongoose.Types.ObjectId();

    
    const order = await Order.create({
      user: fakeUserId,
      product: [
        {
          productId: fakeProductId,
          quantity: 2,
        },
      ],
      totalAmount: 300,
      status: "pending",
      paymentReference: "test_ref_123",
    });

    const response = await requests.get(`/orders/${order._id}`);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("_id", order._id.toString());
  });

});