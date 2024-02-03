// mongodb+srv://wisznu07:<password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority
import mongoose from "mongoose";
if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://wisznu07:${password}@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority`;
mongoose.set("strictQuery", false);
mongoose.connect(url);
const stationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    station_id: { type: String, required: true },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    is_virtual_station: { type: Boolean, required: true },
    capacity: { type: Number, required: true },
    station_area: {
        type: { type: String, required: true },
        coordinates: { type: undefined, required: true },
    },
    rental_uris: {
        android: { type: String, required: true },
        ios: { type: String, required: true },
    },
    dateOfLastUpdate: Boolean,
});
const Station = mongoose.model("Note", stationSchema);
const station = new Station({
    content: "HTML is Easy",
    important: true,
});
station.save().then(() => {
    console.log("note saved!");
    mongoose.connection.close();
});
