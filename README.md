Campsite is a website where users can create and review campgrounds. In order to review or create a campground, you must have an account. This project was part of Colt Steele's web dev course on udemy.

This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Campsite
![home_page](https://github.com/cyro17/Campsite/assets/91148357/e931ad04-5bb0-40d8-90c7-0de0caa623ec)
![login_page](https://github.com/cyro17/Campsite/assets/91148357/0b2b221f-bff2-4639-974c-a012a5458c5b)
![user_end_1](https://github.com/cyro17/Campsite/assets/91148357/9ca23811-41e8-426e-817b-171d2963a997)
![user_end_2](https://github.com/cyro17/Campsite/assets/91148357/cdcda616-3ffc-4b29-9640-b9ea1507df0a)
![user_end_3](https://github.com/cyro17/Campsite/assets/91148357/69e95ee8-1b83-4ebc-8402-04217bae133f)

## Features

- Users can create, edit, and remove campgrounds
- Users can review campgrounds once, and edit or remove their review
- User profiles include more information on the user (full name, email, phone, join date), their campgrounds, and the option to edit their profile or delete their account
- Search campground by name or location
- Sort campgrounds by highest rating, most reviewed, lowest price, or highest price

## Run it locally

1. Install [mongodb](https://www.mongodb.com/)
2. Create a cloudinary account to get an API key and secret code

```

Create a .env file (or just export manually in the terminal) in the root of the project and add the following:

```

DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'

```

Run `mongod` in another terminal and `node app.js` in the terminal with the project.
```
