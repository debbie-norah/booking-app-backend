# Booking App

<hr>

- Clone the repo
- Set the environment variables
- run `npm run devStart` during development to spin up the server

# Architecture :

    - Backend :- Heroku - company email
    - Database :- MongoDB - company email
    - Frontend :- Vercel - company email

# Schema for DB

<hr>

**City Schema**

displayName:

country:

    code:

    displayName:

    currency:

    code:

    currencyName:

    timeZone:

thumbnailSrc:

**Experience Schema**

cityId:

displayName:

startingPrice:

highlights: [String]

nextAvailable:

duration:

thumbnailSrc:

**Variant Schema**

experienceId:

displayName:

startingTime:

duration:

startingPrice:

price:

    adult:

    children:

    infants:

unavailableDates:[Date]

highlights:[String]

availableTimeSlots:[String]

ticketsLeft:

# Image dimensions

- Cities - 150 x 150
- Experiences - 200 x 200
- Variants - 200 x 200

# While taking to production

- Get images from mongoDB and not through server storage
- Admin panel
- During payment, get price from backend using a productId or so
- Bookings once, should send an alert to the employee designated and the vendors
- UI improvements
- PWA
- Searchbar and filters:
  - Place, date, experiences
- Recommendation system with ML related tech
- SEO
- CMS integration for ease of modification of static content in the frontend
- An admin panel to create, read, update and delete data in the database (e.g experiences, variants, cities, etc.)
