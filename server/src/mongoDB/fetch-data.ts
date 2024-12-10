import { StationInformation } from "../index.js";
import {
	addApiDataToStationsCollection,
	connect,
	disconnect,
	Station,
} from "./mongo.js";

export const updateStationsCollection = async (
	apiData: StationInformation[]
) => {
	await connect();
	const collectionData = await Station.find().lean(true);
	const collectionDataCount = collectionData.length;
	const missingItemsArray: StationInformation[] = [];
	if (apiData?.length !== collectionDataCount) {
		const missingItems = apiData!.filter((apiDataItem) => {
			const checkedItem = collectionData!.filter(
				(collectionDataItem) =>
					collectionDataItem.station_id === apiDataItem.station_id
			);
			if (checkedItem.length > 0) {
				return null;
			} else {
				return apiDataItem;
			}
		});
		// console.log("missingItems ", missingItems);
		missingItemsArray.push(...missingItems);
	}

	if (missingItemsArray.length > 0) {
		addApiDataToStationsCollection(missingItemsArray);
	} else {
		console.log("stations list is up to date!");
		await disconnect();
	}
};
