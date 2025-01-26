import axios from "axios";

export class Xhr {
	static getJson(url: string, args: any) {
		return axios
			.get(url, {
				// params: args,
				responseType: "json",
			})
			.then((data: any) => {
				console.log("AXIOS response from : ", url, " ", data.data);
				return data;
			})
			.catch((error: any) => {
				console.log(`${error.name}\n${error.message}`);
			});
	}
}
export class XhrSecure {
	static getJson(url: string, args: any) {
		return axios
			.get(url, {
				headers: {
					"x-api-key": process.env.CRON_JOB_API_KEY,
				},
				responseType: "json",
			})
			.then((data: any) => {
				console.log("AXIOS response from : ", url, " ", data.data);
				return data;
			})
			.catch((error: any) => {
				console.log(`${error.name}\n${error.message}`);
				throw error;
			});
	}
}
