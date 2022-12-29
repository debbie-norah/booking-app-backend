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

router.get("/performanceDashboard", async (rec, res) => {
  async function findBookings(){
    const result = await Booking.find();
    return result;
  }
  findBookings().then((result)=>{
    const tickets = result.length;
    var netBookings = 0
    const experiences = [];
    const expBookings = [];
    const expTickets = [];
    const grossBookings = [0,0,0,0,0,0,0,0,0,0,0,0];
    const ticketSold = [0,0,0,0,0,0,0,0,0,0,0,0];
    var adults = 0;
    var children = 0;
    var others = 0;
    if(result.length!=0){
    for(let i = 0; i<result.length; i++){
      if(result[i].details.experienceId!=null || result[i].details.experienceId!=undefined){
      if(!experiences.includes(result[i].details.experienceId)){
        experiences.push(result[i].details.experienceId);
        expBookings.push(result[i].amount);
        expTickets.push(1);
      }
      else{
        expBookings[experiences.indexOf(result[i].details.experienceId)] += result[i].amount;
        expTickets[experiences.indexOf(result[i].details.experienceId)] += 1;
      }
    }
      netBookings +=result[i].amount;
      grossBookings[result[i].details.date.getMonth()] += result[i].amount;
      ticketSold[result[i].details.date.getMonth()]++;
      adults += result[i].pax.adults;
      children += result[i].pax.children;
      others += result[i].pax.infants;
    }}
    return res.status(200).json({data:[{noTickets:tickets,totalamount:netBookings,totalBookingValue:grossBookings,monthlyTickets:ticketSold,paxdata:{nadult:adults,nchildren:children,nothers:others},experience:experiences,expBookings:expBookings, expTickets:expTickets}]});
  }).catch((err)=>{
    res.status(400).json({message:"Something went wrong",error:err})
  })
  
})

module.exports = router;
