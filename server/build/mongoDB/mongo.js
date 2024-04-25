// mongodb+srv://wisznu07:<password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
// if (process.argv.length < 3) {
// 	console.log("give password as argument");
// 	process.exit(1);
// }
const password = process.argv[2];
let url = process.env.MONGODB_URI;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    url = process.env.MONGODB_URI_DEV;
}
mongoose.set("strictQuery", false);
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});
(async () => {
    try {
        await mongoose.connect(url);
        console.log("connected to MongoDB");
    }
    catch (error) {
        console.log("error connecting to MongoDB:", error.message);
    }
})();
// Station schema
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
export const stationStatus = new mongoose.Schema({
    name: { type: String, required: true },
    station_id: { type: String, required: true },
    num_bikes_available: { type: Number, required: true },
    num_docks_available: { type: Number, required: true },
    capacity: { type: Number, required: true },
    dayStamp: { type: Number, required: true },
    timeStamp: { type: Date, required: true },
});
export const addApiStatusDataToStationsInfoCollection = async (stationsStatusFromAPI) => {
    if (!stationsStatusFromAPI) {
        console.log("stationsStatusFromAPI has no data: ", stationsStatusFromAPI);
    }
    const documents = [];
    for (const station of stationsStatusFromAPI) {
        //check does the station even exists in mongoDb collection of stations
        const collectionStationData = await Station.find({
            station_id: station.station_id,
        }).lean(true);
        if (collectionStationData.length > 0) {
            const stationItem = new StationInfo({
                station_id: station.station_id,
                name: collectionStationData[0].name,
                num_bikes_available: station.num_vehicles_available,
                num_docks_available: station.num_docks_available,
                capacity: station.num_docks_available,
                dayStamp: new Date().getDay(),
                timeStamp: new Date(),
            });
            documents.push(stationItem);
            // stationItem.save().then((savedStation) => {
            // 	// response.json(savedStation)
            // 	console.log("station status saved!");
            // });
        }
    }
    await StationInfo.insertMany(documents);
    console.log("Saving to mongoDB is done");
};
export const addApiDataToStationsCollection = (stationsFromAPI) => {
    stationsFromAPI.map(async (station) => {
        const stationItem = new Station({
            station_id: station.station_id,
            address: station.address,
            name: station.name,
            cross_street: station.cross_street,
            lat: station.lat,
            lon: station.lon,
            is_virtual_station: station.is_virtual_station,
            capacity: station.capacity,
            station_area: {
                type: station.station_area.type,
                coordinates: station.station_area.coordinates,
            },
            rental_uris: {
                android: station.rental_uris.android,
                ios: station.rental_uris.ios,
            },
            dateOfLastUpdate: new Date(),
        });
        await stationItem.save().then((savedStation) => {
            // response.json(savedStation)
            console.log("station saved!");
        });
    });
};
export const updateStationsCollection = async (apiData) => {
    const collectionData = await Station.find().lean(true);
    const collectionDataCount = collectionData.length;
    const missingItemsArray = [];
    if (apiData?.length !== collectionDataCount) {
        const missingItems = apiData.filter((apiDataItem) => {
            const checkedItem = collectionData.filter((collectionDataItem) => collectionDataItem.station_id === apiDataItem.station_id);
            if (checkedItem.length > 0) {
                return null;
            }
            else {
                return apiDataItem;
            }
        });
        // console.log("missingItems ", missingItems);
        missingItemsArray.push(...missingItems);
    }
    if (missingItemsArray.length > 0) {
        addApiDataToStationsCollection(missingItemsArray);
    }
};
export const deleteAllInCollection = async () => {
    const collectionData = await StationInfo.deleteMany({});
    // console.log("collectionData ", collectionData);
};
export const Station = mongoose.model("Station", stationSchema);
export const StationInfo = mongoose.model("stations_status", stationStatus);
// export const StationInfo = mongoose.model("StationInfo", stationStatus);
// Station.find({}).then((result) => {
// 	result.forEach((note) => {
// 		console.log(note);
// 	});
// 	mongoose.connection.close();
// });
// const station = new Station({
// 	station_id: "4683",
// 	address: "Valle Vision",
// 	name: "Valle Vision",
// 	cross_street: "Valle",
// 	lat: 59.91606483663281,
// 	lon: 10.807177606311825,
// 	is_virtual_station: false,
// 	capacity: 21,
// 	station_area: {
// 		type: "MultiPolygon",
// 		coordinates: [
// 			[
// 				[
// 					[10.806948306023173, 59.91613614756602],
// 					[10.80693754708878, 59.91603598985276],
// 					[10.807457049923272, 59.915989763114],
// 					[10.807503159643403, 59.91609377318596],
// 					[10.806948306023173, 59.91613614756602],
// 				],
// 			],
// 		],
// 	},
// 	rental_uris: {
// 		android: "oslobysykkel://stations/4683",
// 		ios: "oslobysykkel://stations/4683",
// 	},
// });
// station.save().then(() => {
// 	console.log("station saved!");
// 	// mongoose.connection.close();
// });
