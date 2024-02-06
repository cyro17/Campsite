
const mongoose = require('mongoose')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const campSite = require('../models/campsite')

mongoose.connect('mongodb://localhost:27017/campsite', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campSite.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 50);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new campSite({
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/cyro1706/image/upload/v1662919983/campsite/ti7yhtzhpk9e85grp7lx.jpg',
                    filename: 'campsite/ti7yhtzhpk9e85grp7lx',
                },
                {
                    url: 'https://res.cloudinary.com/cyro1706/image/upload/v1662919983/campsite/sglmq4ra0dvonk19ndsj.jpg',
                    filename: 'campsite/sglmq4ra0dvonk19ndsj',
                },
                {
                    url: 'https://res.cloudinary.com/cyro1706/image/upload/v1662919976/campsite/vqsuss3o0igq4jj2re4l.jpg',
                    filename: 'campsite/vqsuss3o0igq4jj2re4l',
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt consequatur laborum unde facilis labore, deserunt obcaecati, aut harum fugiat, at alias suscipit. Quis aliquam numquam, voluptatem tempore obcaecati ad earum?',
            price,
            author: '631b21fa1681cb94ab8b828f'
        });

        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
})


