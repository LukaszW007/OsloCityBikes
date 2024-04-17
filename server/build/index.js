import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import APIConnector from "./connectors/axiosConnector.js";
import { requestLogger, unknownEndpoint, errorHandler, } from "./utils/middleware.js";
import cors from "cors";
import { Station, StationInfo, addApiStatusDataToStationsInfoCollection, deleteAllInCollection, updateStationsCollection, } from "./mongoDB/mongo.js";
const app = express();
//MongoDB
let url = process.env.MONGODB_URI;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    url = process.env.MONGODB_URI_DEV;
}
mongoose.set("strictQuery", false);
(async () => {
    try {
        await mongoose.connect(url);
        console.log("connected to MongoDB");
    }
    catch (error) {
        console.log("error connecting to MongoDB:", error.message);
    }
})();
// mongoose
// 	.connect(url)
// 	.then((result) => {
// 		console.log("connected to MongoDB");
// 	})
// 	.catch((error) => {
// 		console.log("error connecting to MongoDB:", error.message);
// 	});
///////////////
let originUrl = "https://oslo-city-bikes.vercel.app";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    originUrl = "http://localhost:3000";
}
const corsOptions = {
    origin: originUrl,
    credentials: true,
    optionSuccessStatus: 200,
};
// console.log('corsOptions',corsOptions);
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(express.json());
app.use(errorHandler);
// const PORT = process.env.PORT || 3001;
const dataFetching = async () => {
    let fetchedData = {
        stationInformation: null,
        stationInformationState: null,
        stationStatus: null,
        stationStatusState: null,
    };
    APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json", null).then((data) => {
        // console.log('data',data);
        if (data) {
            console.info("Stations information data is fetched", data.headers.date);
            fetchedData.stationInformation = data.data.data.stations;
            fetchedData.stationInformationState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
        // fetchedData.stationInformationState = JSON.parse(data);
    });
    APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", null).then((data) => {
        // console.log('data',data);
        if (data) {
            console.info("Stations status data is fetched", data.headers.date);
            fetchedData.stationStatus = data.data.data.stations;
            fetchedData.stationStatusState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
    });
    return fetchedData;
};
const fetchedAPIData = await dataFetching();
//////
//Data fetching from API to update the map
setInterval(() => {
    dataFetching();
    console.log("Data is fetching");
}, 60 * 1000);
//////
//Data fetching from API to update mongoDB
setInterval(async () => {
    // await dataFetching();
    const apiStatusData = fetchedAPIData.stationStatus;
    console.log("apiStatusData type", typeof apiStatusData);
    console.log("apiStatusData length ", apiStatusData);
    addApiStatusDataToStationsInfoCollection(apiStatusData);
    const apiData = fetchedAPIData.stationInformation;
    updateStationsCollection(apiData);
    console.log("Data is fetching to update mongoDB");
}, 1 * 60 * 1000);
// fetching directly from service API
app.get("/", (request, response) => {
    response.send("<h1>Oslo City Bikes server</h1>");
});
app.get("/api/station_information", (request, response) => {
    response.json(fetchedAPIData.stationInformation);
});
app.get("/api/station_information_state", (request, response) => {
    try {
        response.json(fetchedAPIData.stationInformationState);
    }
    catch (err) {
        console.error(err);
        response.json({ success: false });
    }
});
app.get("/api/station_information/:id", (request, response) => {
    const id = request.params.id;
    let station;
    if (fetchedAPIData.stationInformation) {
        station = fetchedAPIData.stationInformation.find((st) => st.station_id === id);
    }
    else {
        console.log("Data is empty or not fetched from Oslo CityBike API");
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
});
app.get("/api/station_status", (request, response) => {
    response.json(fetchedAPIData.stationStatus);
});
app.get("/api/station_status_state", (request, response) => {
    try {
        response.json(fetchedAPIData.stationStatusState);
    }
    catch (err) {
        console.error(err);
        response.json({ success: false });
    }
});
app.get("/api/station_status/:id", (request, response) => {
    const id = request.params.id;
    let station;
    if (fetchedAPIData.stationStatus) {
        station = fetchedAPIData.stationStatus.find((st) => st.station_id === id);
    }
    else {
        console.log("Data is empty or not fetched from Oslo CityBike API");
    }
    if (station) {
        response.json(station);
    }
    else {
        response.status(404).end();
    }
});
////////////////////
//fething from Mongo
////////////////////
app.get("/api/stations", async (request, response) => {
    let collectionData = await Station.find().lean(true);
    if (collectionData.length <= 0) {
        const apiData = await fetchedAPIData.stationInformation;
        await updateStationsCollection(apiData);
        collectionData = await Station.find().lean(true);
    }
    response.json(collectionData);
});
app.get("/api/stations_info", async (request, response) => {
    let collectionStatusData = await StationInfo.find().lean(true);
    if (collectionStatusData.length <= 0) {
        const apiStatusData = await fetchedAPIData.stationStatus;
        await addApiStatusDataToStationsInfoCollection(apiStatusData);
        collectionStatusData = await StationInfo.find().lean(true);
        console.log("Added new info about stations to DB");
    }
    response.json(collectionStatusData);
});
app.get("/api/delete_all_stations_info", async (request, response) => {
    await deleteAllInCollection();
    const collectionStatusData = await StationInfo.find().lean(true);
    response.json(collectionStatusData);
});
app.get("/api/stations_info/:id", async (request, response) => {
    const id = request.params.id;
    StationInfo.find({
        station_id: id,
    })
        .lean(true)
        .then((station) => {
        if (station.length > 0) {
            response.json(station);
        }
        else {
            response.status(404).end();
        }
    })
        .catch((error) => {
        console.log(error);
        response.status(500).end();
    });
});
app.use(unknownEndpoint);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
