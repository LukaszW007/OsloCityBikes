// mongodb+srv://wisznu07:<password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { stationSchema, stationsStatus, stationsStatusByDay, updateCountStatusSchema } from "./schemas.js";
import { connect, disconnect, hasStatusChanged, getCurrentWeek } from "./utils.js";
const password = process.argv[2];
mongoose.set("strictQuery", false);
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});
export const Station = mongoose.model("Station", stationSchema);
export const StationTemp = mongoose.model("Station", stationSchema);
export const StationsStatus = mongoose.model("stations_status", stationsStatus);
export const StationsStatusTemp = mongoose.model("stations_status", stationsStatus);
export const StationsStatusByDay = mongoose.model("stations_status_by_day", stationsStatusByDay);
export const UpdateCountStatus = mongoose.model("update_count_status", updateCountStatusSchema);
////////////////////////////////////////
// const uri =
// 	"mongodb+srv://<db_username>:<db_password>@cluster0.wzqvkl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
// 	serverApi: {
// 		version: ServerApiVersion.v1,
// 		strict: true,
// 		deprecationErrors: true,
// 	},
// });
// async function run() {
// 	try {
// 		// Connect the client to the server	(optional starting in v4.7)
// 		await client.connect();
// 		// Send a ping to confirm a successful connection
// 		await client.db("admin").command({ ping: 1 });
// 		console.log(
// 			"Pinged your deployment. You successfully connected to MongoDB!"
// 		);
// 	} finally {
// 		// Ensures that the client will close when you finish/error
// 		await client.close();
// 	}
// }
// run().catch(console.dir);
////////////////////////////////////
export const addApiStatusDataToStationStatusCollection2 = async (stationsStatusFromAPI) => {
    if (!stationsStatusFromAPI || stationsStatusFromAPI.length <= 0) {
        console.log("stationsStatusFromAPI has no data: ", stationsStatusFromAPI);
        return;
    }
    console.log("addApiStatusDataToStationStatusCollection");
    // await connect();
    const documents = [];
    for (const station of stationsStatusFromAPI) {
        //check does the station even exists in mongoDb collection of stations
        const collectionStationData = await Station.find({
            station_id: station.station_id,
        }).lean(true);
        if (collectionStationData.length > 0) {
            const stationItem = new StationsStatus({
                station_id: station.station_id,
                name: collectionStationData[0].name,
                num_bikes_available: station.num_vehicles_available,
                num_docks_available: station.num_docks_available,
                capacity: station.num_docks_available,
                dayStamp: new Date().getDay(),
                timeStamp: new Date(),
            });
            documents.push(stationItem);
            console.log("Documents:  ", documents.length);
            // stationItem.save().then((savedStation) => {
            // 	// response.json(savedStation)
            // 	console.log("station status saved!");
            // });
        }
    }
    console.log("documents.length ", documents.length);
    await StationsStatus.insertMany(documents);
    console.log("Saving to mongoDB is done", documents.length);
    // await disconnect();
};
export const addApiStatusDataToStationStatusCollection = async (fetchedStationStatusAPIData) => {
    const fetchedStatuses = fetchedStationStatusAPIData.stationStatus;
    const fetchedStatusesState = fetchedStationStatusAPIData.stationStatusState;
    //fetchedStatusesState.last_updated is POSIX/unix timestamp so has to be *1000
    const lastStautsesStateUpdate = new Date(fetchedStatusesState.last_updated * 1000);
    // Fetch all stations once to reduce multiple database calls
    const statuses = await StationsStatus.find().exec();
    const stationsFromMongo = await Station.find().exec();
    const latestAddedStatus = await StationsStatus.findOne().sort({ timeStamp: -1 }).limit(1);
    console.log("Latest added status to Mongo is: ", latestAddedStatus?.timeStamp);
    console.log("Latest ", fetchedStatusesState, " added status to API is: ", lastStautsesStateUpdate);
    const compare = latestAddedStatus ? lastStautsesStateUpdate > latestAddedStatus?.timeStamp : null;
    console.log("Mongo update is required: ", compare);
    if (!latestAddedStatus || (latestAddedStatus && lastStautsesStateUpdate.getTime() > latestAddedStatus?.timeStamp.getTime())) {
        const stationMap = new Map();
        stationsFromMongo.forEach((station) => {
            stationMap.set(station.station_id, station.name);
        });
        const newStatuses = [];
        // Loop through fetched statuses and compare with current statuses
        fetchedStatuses.forEach((status) => {
            const stationId = status.station_id;
            const currentStationStatus = stationMap.get(stationId);
            if (currentStationStatus) {
                // Check if the status has changed
                if (!latestAddedStatus || hasStatusChanged(fetchedStatuses, statuses, stationId)) {
                    // Create a new StationStatus object
                    const newStatus = new StationsStatus({
                        station_id: stationId,
                        name: stationMap.get(stationId),
                        num_bikes_available: status.num_vehicles_available,
                        num_docks_available: status.num_docks_available,
                        capacity: status.num_docks_available,
                        apiLastUpdate: status.last_reported,
                        dayStamp: new Date().getDay(),
                        timeStamp: new Date(),
                    });
                    newStatuses.push(newStatus);
                }
            }
        });
        // Bulk insert	new statuses();
        if (newStatuses.length > 0) {
            console.log(`All data: `, newStatuses.length);
            await StationsStatus.insertMany(newStatuses);
        }
        console.log("Status data has been updated in the StationStatus collection.");
        return newStatuses.length;
    }
    else {
        console.log(`Stations' statuses are up to date`);
        return 0;
    }
};
export const addApiDataToStationInformationCollection = async (stationsFromAPI) => {
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
        await stationItem.save();
        console.log("station saved!");
    });
    console.log("stations list is updated!");
    // await disconnect();
};
export const updateStationInformationCollection = async (apiData) => {
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
    console.log("missingItemsArray", missingItemsArray);
    if (missingItemsArray.length > 0) {
        await addApiDataToStationInformationCollection(missingItemsArray);
    }
    else {
        console.log("stations list is up to date!");
    }
};
export const deleteAllInCollection = async () => {
    await connect();
    const collectionData = await StationsStatus.deleteMany({});
    // console.log("collectionData ", collectionData);
    await disconnect();
};
// Migrating statuses collection to the collection of stations and an an array of their statuses
export const migrateData = async () => {
    const statuses = await StationsStatus.find().exec();
    const stationsFromMongo = await Station.find().exec();
    //checking the last migrated status of the last document in the collection to recognize date from where suppose to be started a new migration
    const migratedStatuses = await StationsStatusByDay.find().exec();
    let lastDateMigrated = null;
    let nextDay = null;
    if (migratedStatuses.length > 0) {
        lastDateMigrated =
            migratedStatuses[migratedStatuses.length - 1].statuses[migratedStatuses[migratedStatuses.length - 1].statuses.length - 1].timestamp;
        nextDay = new Date(lastDateMigrated).setDate(lastDateMigrated.getDate() + 1);
        nextDay = new Date(nextDay).setHours(0, 0, 0, 0);
    }
    let weekOfCollectedStatuses = -1;
    const migrationArray = [];
    for (const station of stationsFromMongo) {
        const arrayOfStatusesToMigrate = [];
        //filtering all collected statuses of particular station
        let statusesArrayOfStationId;
        if (nextDay) {
            statusesArrayOfStationId = statuses.filter((status) => status.station_id === station.station_id && status.timeStamp >= new Date(nextDay));
        }
        else {
            statusesArrayOfStationId = statuses.filter((status) => status.station_id === station.station_id);
        }
        for (const status of statusesArrayOfStationId) {
            if (!weekOfCollectedStatuses) {
                weekOfCollectedStatuses = getCurrentWeek(status.timeStamp);
            }
            //creating an array of all statuses
            const statusToMigrate = {
                day: status.dayStamp,
                week: getCurrentWeek(status.timeStamp),
                timestamp: status.timeStamp,
                num_bikes_available: status.num_bikes_available,
                num_docks_available: status.num_docks_available,
                apiLastUpdate: status.apiLastUpdate,
                capacity: status.capacity,
            };
            arrayOfStatusesToMigrate.push(statusToMigrate);
        }
        const singleDocument = {
            // creating a single document corresponding with the station which contains also array of this station's statuses
            station_id: station.station_id,
            name: station.name,
            week: weekOfCollectedStatuses,
            statuses: arrayOfStatusesToMigrate,
        };
        //Array ready to add to mongoDB collection
        migrationArray.push(singleDocument);
    }
    console.log("migrationArray.length ", migrationArray.length);
    await StationsStatusByDay.insertMany(migrationArray);
};
export const updateCountStatus = async (updatesNumber) => {
    const updateStatus = new UpdateCountStatus({ updates: updatesNumber });
    await updateStatus.save();
    console.log("Count of statuses updated: ", updateStatus);
};
