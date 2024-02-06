
const campsite = require('./models/campsite')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError')
const { campSchema, reviewSchema } = require("./schema");

module.exports.isLoggedIn = (req, res, next) => {
    console.log("REQ.USER...")
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    console.log(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const camp = await campsite.findById(id);
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', "you don't have permission to do that! ");
        return res.redirect(`/camps/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "you don't have permission to do that! ");
        return res.redirect(`/camps/${id}`);
    }
    next();
}

module.exports.validate_review = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}