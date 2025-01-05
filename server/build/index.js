import dotenv from "dotenv";
dotenv.config();
import cron from "node-cron";
import express from "express";
import router from "./routes.js";
import APIConnector from "./connectors/axiosConnector.js";
import { requestLogger, unknownEndpoint, errorHandler, apiKeyChecker, ipWhitelistMiddleware } from "./utils/middleware.js";
import cors from "cors";
import { addApiStatusDataToStationStatusCollection, updateStationInformationCollection, } from "./mongoDB/mongo.js";
const app = express();
//MongoDB
let url = process.env.MONGODB_URI;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    url = process.env.MONGODB_URI_DEV;
}
// mongoose.set("strictQuery", false);
// (async () => {
// 	try {
// 		await mongoose.connect(url);
// 		console.log("connected to MongoDB");
// 	} catch (error: any) {
// 		console.log("error connecting to MongoDB:", error.message);
// 	}
// })();
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
app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/", (req, res) => res.status(404));
app.use("/api", router);
app.use(express.json());
app.use(errorHandler);
app.use(apiKeyChecker);
app.use(ipWhitelistMiddleware);
// const PORT = process.env.PORT || 3001;
console.log("RUN APP AGAIN");
export const dataStationInformationFetching = async () => {
    console.log("dataFetching");
    let fetchedData = {
        stationInformation: null,
        stationInformationState: null,
        stationStatus: null,
        stationStatusState: null,
    };
    console.log("dataFetching station_information");
    await APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json", null).then((data) => {
        // console.log('data',data);
        if (data) {
            // console.info(
            // 	"Stations information data is fetched",
            // 	data.headers.date
            // );
            fetchedData.stationInformation = data.data.data.stations;
            fetchedData.stationInformationState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
        console.log("data is Fetched station_information");
        // fetchedData.stationInformationState = JSON.parse(data);
    });
    return fetchedData;
};
export const dataStationStatusFetching = async () => {
    console.log("dataFetching");
    let fetchedData = {
        stationInformation: null,
        stationInformationState: null,
        stationStatus: null,
        stationStatusState: null,
    };
    console.log("dataFetching station_status");
    await APIConnector.getJson("https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json", null).then((data) => {
        // console.log('data',data);
        if (data) {
            // console.info("Stations status data is fetched", data.headers.date);
            fetchedData.stationStatus = data.data.data.stations;
            fetchedData.stationStatusState = {
                last_updated: data.data.last_updated,
                ttl: data.data.ttl,
                version: data.data.version,
            };
        }
        console.log("data is Fetched station_status");
    });
    return fetchedData;
};
export const fetchedStationInformationAPIData = await dataStationInformationFetching();
export const fetchedStationStatusAPIData = await dataStationStatusFetching();
//////
// Data fetching from API to update the map
cron.schedule("*/1 * * * *", async () => {
    console.log("Starting data fetch...");
    // await dataStationStatusFetching();
    console.log("Data is fetching");
    let apiStatusData = null;
    while (apiStatusData === null) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        apiStatusData = fetchedStationStatusAPIData;
        console.log("status will be added to mongoDB");
    }
    await addApiStatusDataToStationStatusCollection(apiStatusData);
    let apiData = null;
    // await dataStationInformationFetching();
    while (apiData === null) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        apiData = fetchedStationInformationAPIData.stationInformation;
        console.log("stations will be added to mongoDB");
    }
    // const apiData = fetchedAPIData.stationInformation;
    await updateStationInformationCollection(apiData);
    console.log("Data is fetching to update mongoDB");
});
// setInterval(() => {
// 	dataStationInformationFetching();
// 	dataStationStatusFetching();
// 	console.log("Data is fetching");
// }, 60 * 1000);
// // //////
// //Data fetching from API to update mongoDB
// setInterval(async () => {
// 	let apiStatusData = null;
// 	while (apiStatusData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiStatusData = fetchedAPIData.stationStatus;
// 		console.log("status will be added to mongoDB");
// 	}
// 	await addApiStatusDataToStationStatusCollection(apiStatusData!);
// 	let apiData = null;
// 	while (apiData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiData = fetchedAPIData.stationInformation;
// 		console.log("stations will be added to mongoDB");
// 	}
// 	// const apiData = fetchedAPIData.stationInformation;
// 	await updateStationInformationCollection(apiData!);
// 	console.log("Data is fetching to update mongoDB");
// }, 60 * 1000);
// //fetching directly from service API
// app.get("/", (request, response) => {
// 	response.send("<h1>Oslo City Bikes server</h1>");
// });
// app.get("/api/station_information", (request, response) => {
// 	response.json(fetchedAPIData.stationInformation);
// });
// app.get("/api/station_information_state", (request, response) => {
// 	try {
// 		response.json(fetchedAPIData.stationInformationState);
// 	} catch (err) {
// 		console.error(err);
// 		response.json({ success: false });
// 	}
// });
// app.get("/api/station_information/:id", (request, response) => {
// 	const id = request.params.id;
// 	let station;
// 	if (fetchedAPIData.stationInformation) {
// 		station = fetchedAPIData.stationInformation.find(
// 			(st) => st.station_id === id
// 		);
// 	} else {
// 		console.log("Data is empty or not fetched from Oslo CityBike API");
// 	}
// 	if (station) {
// 		response.json(station);
// 	} else {
// 		response.status(404).end();
// 	}
// });
// app.get("/api/station_status", (request, response) => {
// 	response.json(fetchedAPIData.stationStatus);
// });
// app.get("/api/station_status_state", (request, response) => {
// 	try {
// 		response.json(fetchedAPIData.stationStatusState);
// 	} catch (err) {
// 		console.error(err);
// 		response.json({ success: false });
// 	}
// });
// app.get("/api/station_status/:id", (request, response) => {
// 	const id = request.params.id;
// 	let station;
// 	if (fetchedAPIData.stationStatus) {
// 		station = fetchedAPIData.stationStatus.find(
// 			(st) => st.station_id === id
// 		);
// 	} else {
// 		console.log("Data is empty or not fetched from Oslo CityBike API");
// 	}
// 	if (station) {
// 		response.json(station);
// 	} else {
// 		response.status(404).end();
// 	}
// });
app.use(unknownEndpoint);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
export default app;
