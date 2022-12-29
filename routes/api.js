const express = require("express");
const router = express.Router();
const City = require("../models/City");
const Experience = require("../models/Experience");
const Variant = require("../models/Variant");

// For testing purposes to post new data to DB
router.get("/post-city-test", async (req, res) => {
  const city = new City({
    displayName: "Delhi",
    country: {
      code: "IN",
      displayName: "India",
      currency: {
        code: "INR",
        currencyName: "Rupee",
      },
      timeZone: "Asia/Kolkata",
    },
    thumbnailSrc: "https://picsum.photos/150/150/",
  });
  const response = await city.save();
  res.send("Successs");
});

router.get("/post-experience-test", async (req, res) => {
  const experience = new Experience({
    cityId: "63034bbd0373fc4212802628",
    displayName: "Louvre visit",
    startingPrice: 4500,
    highlights: [
      "Lorem ipsum dolor sit amet 1 ",
      "Lorem ipsum dolor sit amet 2 ",
    ],
    nextAvailable: new Date(2022, 7, 23),
    duration: "1hr. - 1.5hr.",
    thumbnailSrc: "https://picsum.photos/200/200",
  });
  const response = await experience.save();
  res.send("Success");
});

router.get("/post-variant-test", async (req, res) => {
  const variant = new Variant({
    experienceId: "63035cd3bcc229d8b394bd98",
    displayName: "Lorem ipsum 2",
    startingTime: "20:00",
    duration: "1hr",
    startingPrice: 6500,
    price: {
      adult: 6500,
      children: 4000,
      infants: 1000,
    },
    unavailableDates: [new Date(2022, 7, 23), new Date(2022, 7, 27)],
    highlights: [
      "Skip the line access to the 2nd level of the Eiffel Tower",
      "Expert bilingual (English and French-speaking) tour guide ",
      "1.5-hr guided tour",
      "Free exploration time post-tour (on your own)",
    ],
    availableTimeSlots: ["10:00 AM", "2:00 PM", "9:00 PM"],
    ticketsLeft: 5,
  });
  const response = await variant.save();
  res.send("Success");
});

// GET - /api/cities -> To find all cities from DB

router.get("/cities", async (req, res) => {
  try {
    const result = await City.find();
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/experiences -> To find all experiences from DB

router.get("/experiences", async (req, res) => {
  try {
    const cityId = req.query.cityId;
    const result = await Experience.find({ cityId: cityId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/variants -> To find all variants from DB

router.get("/variants", async (req, res) => {
  try {
    const experienceId = req.query.experienceId;
    const result = await Variant.find({ experienceId: experienceId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// GET - /api/experience/:experienceId -> To find all experiences from DB
router.get("/experience/:experienceId", async (req, res) => {
  try {
    const experienceId = req.params.experienceId;
    const result = await Experience.find({ _id: experienceId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.get("/city/:cityId", async (req, res) => {
  try {
    const cityId = req.params.cityId;
    const result = await City.find({ _id: cityId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

router.get("/experienceslist/:expe", async (req,res)=>{
  try{
  const result = [];
  const names = [];
  const exp = req.params.expe.split("|");
  
  const all = await Experience.find();
  for(let i = 0; i<exp.length; i++){
    for(let j = 0; j<all.length; j++){
      if(exp[i] == all[j]._id){
        names.push(all[j].displayName);
        result.push(all[i].cityId);
        break;
      }
    }
  }
  res.status(200).json({data:result,names:names});
}
catch(err){
  throw err;
}
})

router.get("/citieslist/:expe", async (req,res)=>{
  try{
  const result1 = [];
  const result2 = [];
  const exp = req.params.expe.split("|");
  
  const all = await City.find();
  for(let i = 0; i<exp.length; i++){
    for(let j = 0; j<all.length; j++){
      if(exp[i] == all[j]._id){
        result1.push(all[i].displayName);
        result2.push(all[i].country.displayName);
        break;
      }
    }
  }
  res.status(200).json({cityNames:result1, countryNames:result2});
}
catch(err){
  throw err;
}
})

// GET - /api/variant/:variantId -> To find all variants from DB
router.get("/variant/:variantId", async (req, res) => {
  try {
    const variantId = req.params.variantId;
    const result = await Variant.find({ _id: variantId });
    res.send(result);
  } catch (err) {
    throw err;
  }
});

module.exports = router;
