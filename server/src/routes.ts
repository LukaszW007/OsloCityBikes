import express from "express";
import {
	getStationInformation,
	getStationInformationState,
	getStationInformationById,
	getStationStatus,
	getStationStatusById,
	getStationStatusState,
	updateMongo,
	getStationsInfo,
	getStationsInfoById,
	deleteAllStationsInfo,
} from "./controllers.js";
import { updateMongoDB } from "./mongoDB/fetch-data.js";

const router = express.Router();

router.get("/station_information", getStationInformation);
router.get("/station_information_state", getStationInformationState);
router.get("/station_information/:id", getStationInformationById);
router.get("/station_status", getStationStatus);
router.get("/station_status_state", getStationStatusState);
router.get("/station_status/:id", getStationStatusById);
//from MongoDB
router.get("/stations", updateMongo);
router.get("/stations_info", getStationsInfo);
router.get("/delete_all_stations_info", deleteAllStationsInfo);
router.get("/stations_info/:id", getStationsInfoById);
router.get("/updatedb", updateMongoDB);

export default router;
