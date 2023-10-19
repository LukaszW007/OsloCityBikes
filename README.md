# OsloCityBikes
App to visualize current and historical usage of city bikes in Oslo

# App
The app is divided into frontend part which is responsible for visual, client-side, and backend which is server-side.

# Frontend
Client-side displays a map with marked all existing city bike racks and information about bike's availability, address, and historical usage.

# Backend
The server side collects, stores, and serves data from API https://oslobysykkel.no/en/open-data/realtime. It acts as a proxy server between client-side and API, and the connector between client-side and database. 
