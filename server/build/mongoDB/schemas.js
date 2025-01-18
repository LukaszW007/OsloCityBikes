import mongoose from "mongoose";
export const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    station_id: { type: String, required: true },
    address: { type: String, required: true },
    cross_street: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    is_virtual_station: { type: Boolean, required: true },
    capacity: { type: Number, required: true },
    station_area: {
        type: { type: String, required: true },
        coordinates: { type: Array, required: true },
    },
    rental_uris: {
        android: { type: String, required: true },
        ios: { type: String, required: true },
    },
    dateOfLastUpdate: { type: Date, required: true },
});
// Station schema
export const stationsStatus = new mongoose.Schema({
    name: { type: String, required: true },
    station_id: { type: String, required: true },
    num_bikes_available: { type: Number, required: true },
    num_docks_available: { type: Number, required: true },
    capacity: { type: Number, required: true },
    apiLastUpdate: { type: Number, required: true },
    dayStamp: { type: Number, required: true },
    timeStamp: { type: Date, required: true },
});
export const stationsStatusByDay = new mongoose.Schema({
    station_id: { type: String, required: true },
    name: { type: String, required: true },
    statuses: [
        {
            day: { type: Number, required: true },
            week: { type: Number, required: true },
            timestamp: { type: Date, required: true },
            num_bikes_available: { type: Number, required: true },
            num_docks_available: { type: Number, required: true },
            apiLastUpdate: { type: Number, required: true },
            capacity: { type: Number, required: true },
        },
    ],
});
export const updateCountStatusSchema = new mongoose.Schema({
    updates: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
});
