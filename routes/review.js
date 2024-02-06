
const express = require("express");

const router = express.Router({ mergeParams: true });
const reviews = require('../controller/review')

const { validate_review, isLoggedIn, isReviewAuthor } = require('../middleware')
const catchAsync = require("../utils/catchAsync");

router.post("/", isLoggedIn, validate_review, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
