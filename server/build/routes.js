import express from "express";
import { getStationInformation, getStationInformationState, getStationInformationById, getStationStatus, getStationStatusById, getStationStatusState, } from "./controllers.js";
import { getStations, getStationsInfo, getStationsInfoById, deleteAllStationsInfo, getStatusesUpdatesCount } from "./mongoDB/fetch-data.js";
import { migrateStatusCollection, updateStationFromAPI, updateStationStatusFromAPI } from "./mongoDB/fetch-data.js";
import { apiKeyChecker, ipWhitelistMiddleware } from "./utils/middleware.js";
import { isServerless } from "./mongoDB/utils.js";
const router = express.Router();
router.get("/station_information", getStationInformation);
router.get("/station_information_state", getStationInformationState);
router.get("/station_information/:id", getStationInformationById);
router.get("/station_status", getStationStatus);
router.get("/station_status_state", getStationStatusState);
router.get("/station_status/:id", getStationStatusById);
//from MongoDB
router.get("/stations", getStations);
router.get("/stations_info", getStationsInfo);
router.delete("/delete_all_stations_info", apiKeyChecker, ipWhitelistMiddleware, deleteAllStationsInfo);
router.get("/stations_info/:id", getStationsInfoById);
// router.get("/test", mongoCheck);
if (isServerless) {
    router.post("/updatedbstation", apiKeyChecker, ipWhitelistMiddleware, updateStationFromAPI);
    router.post("/updatedbstationstatus", apiKeyChecker, ipWhitelistMiddleware, updateStationStatusFromAPI);
    router.post("/migrateStatuses", apiKeyChecker, ipWhitelistMiddleware, migrateStatusCollection);
    router.get("/checkStatusesUpdatesCount", apiKeyChecker, getStatusesUpdatesCount);
}
export default router;
