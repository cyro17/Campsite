
const Review = require('../models/review')
const campsite = require('../models/campsite')

module.exports.createReview = async (req, res) => {
    const camp = await campsite.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success", "succesfully added a review!");
    res.redirect(`/camps/${camp._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "succesfully deleted review!!");
    res.redirect(`/camps/${id}`);
}