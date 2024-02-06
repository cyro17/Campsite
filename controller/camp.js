const campsite = require('../models/campsite');
const { cloudinary } = require('../cloudinary')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken })


module.exports.index = async (req, res) => {
    const camps = await campsite.find({});
    res.render("camps/index", { camps });
}

module.exports.renderNewForm = (req, res) => {
    res.render("camps/new");
}

module.exports.createCamp = async (req, res, next) => {

    const geoData = await geocoder.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send()
    const camp = new campsite(req.body.camp);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully made a new camp!');
    res.redirect(`/camps/${camp._id}`)
}


module.exports.showCamp = async (req, res) => {
    const camp = await campsite.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that camp!');
        return res.redirect('/camps');
    }
    res.render('camps/show', { camp });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await campsite.findById(id)
    if (!camp) {
        req.flash('error', 'Cannot find that camp!');
        return res.redirect('/camps');
    }
    res.render('camps/edit', { camp });
}

module.exports.updateCamp = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const camp = await campsite.findByIdAndUpdate(id, { ...req.body.camp });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated camp!');
    res.redirect(`/camps/${camp._id}`)
}


module.exports.deleteCamp = async (req, res) => {
    const { id } = req.params;
    await campsite.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted camp')
    res.redirect('/camps');
}
