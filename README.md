# OsloCityBikes
App to visualize current and historical rentals of the city bikes in Oslo.<br>
Available *[demo](https://oslo-city-bikes.vercel.app/)*

# App
The app is divided into a frontend, which is responsible for visual, client-side, and a backend, which is server-side.

# Frontend
The client side displays a map with marked all existing city bike racks and information about the bike's availability, address, and historical usage.

# Backend
The server side collects, stores, and serves data from the API (https://oslobysykkel.no/en/open-data/realtime). It acts as a proxy server between the client side and the API and as a connector between the client side and the database. 

# Database
The database used in the project is MongoDB served on MongoDB Atlas
