// import dotenv from "dotenv";
// dotenv.config();
export {};
// import express from "express";
// import router from "./routes.js";
// import cors from "cors";
// import {
// 	requestLogger,
// 	unknownEndpoint,
// 	errorHandler,
// } from "./utils/middleware.js";
// import { fetchedAPIData, dataFetching } from "./controllers.js";
// import {
// 	addApiStatusDataToStationStatusCollection,
// 	updateStationsCollection,
// } from "./coPilot_mongo.js";
// const app = express();
// // MongoDB connection logic is handled in mongo.ts and should be imported where needed
// let originUrl: string = "https://oslo-city-bikes.vercel.app";
// if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
// 	originUrl = "http://localhost:3000";
// }
// const corsOptions = {
// 	origin: originUrl,
// 	credentials: true,
// 	optionSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// app.use(requestLogger);
// app.use("/api", router);
// app.use(express.json());
// app.use(errorHandler);
// // Data fetching from API to update the map
// setInterval(async () => {
// 	await dataFetching();
// 	console.log("Data is fetching");
// }, 60 * 1000);
// // Data fetching from API to update MongoDB
// setInterval(async () => {
// 	let apiStatusData = null;
// 	while (apiStatusData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiStatusData = fetchedAPIData.stationStatus;
// 	}
// 	await addApiStatusDataToStationStatusCollection(apiStatusData!);
// 	let apiData = null;
// 	while (apiData === null) {
// 		await new Promise((resolve) => setTimeout(resolve, 500));
// 		apiData = fetchedAPIData.stationInformation;
// 	}
// 	await updateStationsCollection(apiData!);
// 	console.log("Data is fetching to update MongoDB");
// }, 60 * 1000);
// app.use(unknownEndpoint);
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
// 	console.log(`Server running on port ${PORT}`);
// });
// export default app;
