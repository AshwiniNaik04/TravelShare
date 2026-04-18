const express = require('express');
const { check } = require('express-validator');

const placesControllers =
  require('../controllers/places-controller');

const checkAuth =
  require('../middleware/check-auth');

const fileUpload =
  require('../middleware/file-upload');

const router = express.Router();


// ---------------- PUBLIC ROUTES ----------------

// Get place by id
router.get(
  '/:pid',
  placesControllers.getPlaceById
);

// Get places by user
router.get(
  '/user/:uid',
  placesControllers.getPlacesByUserId
);

router.use(checkAuth);

// ---------------- PROTECTED ROUTES ----------------

// Create place
router.post(
  '/',
  fileUpload.single('image'),
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address').not().isEmpty()
  ],
  placesControllers.createPlace
);


// Update place
router.patch(
  '/:pid',
  [
    check('title').not().isEmpty(),
    check('description').isLength({ min: 5 })
  ],
  placesControllers.updatePlace
);

// LIKE PLACE
router.patch(
  "/:pid/like",
  placesControllers.likePlace
);

// Delete place
router.delete("/:pid", placesControllers.deletePlace);


module.exports = router;