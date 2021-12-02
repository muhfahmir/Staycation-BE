const Item = require("../models/Item");
const Treasure = require("../models/Activity");
const Traveler = require("../models/Booking");
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Booking = require("../models/Booking");
const Member = require("../models/Member");

module.exports = {
  landingPage: async (req, res) => {
    try {
      // mostPicked
      const mostPicked = await Item.find()
        .select("_id title country city price unit imageId")
        .populate({ path: "imageId", select: "id imageUrl" })
        .limit(5);

      // category
      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title country city isPopular imageId",
          perDocumentLimit: 4,
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });
      // hero
      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      // logic isPopular
      for (let i = 0; i < category.length; i++) {
        for (let j = 0; j < category[i].itemId.length; j++) {
          const item = await Item.findOne({ _id: category[i].itemId[j]._id });
          item.isPopular = false;
          await item.save();

          if (category[i].itemId[0] === category[i].itemId[j]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      // testimonial
      const testimonial = {
        _id: "asdasdadsadas",
        imageUrl: "images/testimonial2.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a greate trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasures: treasure.length,
          cities: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      // item
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name qty imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "imageId", select: "_id imageUrl" });

      // bank
      const bank = await Bank.find();

      // testimonial
      const testimonial = {
        _id: "asdasdadsadas",
        imageUrl: "images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "As a wife I can pick a great trip with my own lovely family ... thank you!",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };
      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  bookingPage: async (req, res) => {
    try {
      const {
        idItem,
        duration,
        // price,
        bookingStartDate,
        bookingEndDate,
        firstName,
        lastName,
        email,
        phoneNumber,
        accountHolder,
        bankFrom,
      } = req.body;

      if (!req.file)
        return res.status(404).json({ message: "Image not found" });

      if (
        idItem === undefined ||
        duration === undefined ||
        // price === undefined ||
        bookingStartDate === undefined ||
        bookingEndDate === undefined ||
        firstName === undefined ||
        lastName === undefined ||
        email === undefined ||
        phoneNumber === undefined ||
        accountHolder === undefined ||
        bankFrom === undefined
      ) {
        res.status(404).json({ message: "Lengkapi semua field" });
      }

      // item
      const item = await Item.findOne({ _id: idItem });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      item.sumBooking += 1;

      await item.save();

      let total = item.price * duration;
      let tax = total * 0.1;

      const invoice = Math.floor(1000000 * Math.random() * 9000000);

      // member save
      const member = await Member.create({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      // booking save
      const newBooking = {
        invoice,
        bookingStartDate,
        bookingEndDate,
        total: (total += tax),
        itemId: {
          _id: item.id,
          title: item.title,
          price: item.price,
          duration: duration,
        },

        memberId: member.id,
        payments: {
          proofPayment: `images/${req.file.filename}`,
          bankFrom: bankFrom,
          accountHolder: accountHolder,
        },
      };

      const booking = await Booking.create(newBooking);

      res.status(201).json({ message: "Success booking", booking });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
