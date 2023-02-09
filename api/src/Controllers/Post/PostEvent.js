const { Event, Guide, Category } = require("../../db");
const { Router } = require("express");
const { uploadImage } = require("../../Utils/Cloudinary");
const router = Router();

router.post("/post", async (req, res, next) => {
  const {
    name,
    startDay,
    endDay,
    price,
    img,
    information,
    guide,
    category
  } = req.body;


  try {
    if (!req.files) {
      next(new Error("No se ha encontrado ningun archivo en la solicitud"))
    }
    if (req.files.img) {
      const status = true
      const result = await uploadImage(req.files.img.tempFilePath);
      const img = result;
      const newEvent = await Event.create({
        name,
        startDay,
        endDay,
        price,
        img,
        information,
        guide,
        category,
        status,
      });
      let guideDb = await Guide.findAll({
        where: {
          name: guide,
        },
      });
      let catDb = await Category.findAll({
        where: {
          name: category,
        },
      });
      newEvent.addCategory(catDb);
      newEvent.addGuide(guideDb);
      res.status(200).send(newEvent);
    }

  } catch (error) {
    next(error);
    res.status(500);
  }
});

module.exports = router;
