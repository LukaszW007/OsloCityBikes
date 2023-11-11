import axios from "axios";

export default class APIConnector {
  static getJson(url: string, args: any) {
    return axios
		.get(url, {
			// params: args,
			responseType: "json",
		})
		.then((data: any) => {
			// console.log('AXIOS response from : ',url,' ',data.data);
			return data;
		})
		.catch((error: any) => {
			console.error(error);
		});
  }
}
