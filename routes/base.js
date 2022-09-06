const express = require("express");
const path = require("path");
const Razorpay = require("razorpay");
const router = express.Router();
const crypto = require("crypto");
const Booking = require("../models/Booking");
const User = require("../models/User");

router.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server running" });
});

//For serving images
router.get("/images/cities/:city", (req, res) => {
  const city = req.params.city;
  const filepath = path.join(
    __dirname,
    "..",
    "images",
    "cities",
    `${city}.png`
  );
  res.sendFile(filepath);
});

router.get("/images/experiences/:city/:experience", (req, res) => {
  const city = req.params.city;
  const experience = req.params.experience;
  const filepath = path.join(
    __dirname,
    "..",
    "images",
    "experiences",
    city,
    `${experience}.png`
  );
  res.sendFile(filepath);
});

router.get("/images/variants/:city/:experience/:variant", (req, res) => {
  const city = req.params.city;
  const experience = req.params.experience;
  const variant = req.params.variant;
  const filepath = path.join(
    __dirname,
    "..",
    "images",
    "variants",
    city,
    experience,
    `${variant}.png`
  );
  res.sendFile(filepath);
});

//Razorpay

router.post("/payment-orders", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    instance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong..." });
      }
      res.status(200).json({ data: order });
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error..." });
  }
});

router.post("/payment-verify", async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    // Saving booking information to backend in the booking schema
    const booking = new Booking(req.body.bookingInformation);
    const bookingResponse = await booking.save();

    // Updating the booking of user by pushing bookingId into bookings array
    const userResponse = await User.findOneAndUpdate(
      { email: bookingResponse.user.email },
      { $push: { bookings: bookingResponse._id } }
    ); // Pushes bookingResponse._id to the bookings array in the user collection

    // Creating a new user if updation returns null i.e user does not exist in database
    if (userResponse === null) {
      const user = new User({
        email: bookingResponse.user.email,
        bookings: [bookingResponse._id],
      });
      const userCreationResponse = await user.save();
      console.log(userCreationResponse);
    }
    console.log(userResponse);
    const sign = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");
    if (razorpaySignature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error..." });
  }
});

module.exports = router;
