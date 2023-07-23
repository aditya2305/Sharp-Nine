import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {
  const options = {
    amount: Number(req.body.amount * 100), // amount in the smallest currency unit
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(200).json({ success: true, orderStatus: order });
};

export const paymentVerification = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET);

  hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
  let generatedSignature = hmac.digest("hex");

  if (generatedSignature == razorpay_signature) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
};
