
const express = require("express");
const router = express.Router();
const camps = require('../controller/camp')
const catchAsync = require("../utils/catchAsync");
const flash = require('connect-flash')
const { isLoggedIn, isAuthor, validateCamp } = require('../middleware');

const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(camps.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(camps.createCamp))


router.get("/new", isLoggedIn, camps.renderNewForm);

router.route('/:id')
    .get(catchAsync(camps.showCamp))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCamp, catchAsync(camps.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(camps.deleteCamp));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(camps.renderEditForm));

module.exports = router;