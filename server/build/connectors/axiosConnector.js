import axios from "axios";
export default class APIConnector {
    static async getJson(url, args) {
        return axios
            .get(url, {
            // params: args,
            responseType: "json",
        })
            .then((data) => {
            // console.log('AXIOS response from : ',url,' ',data.data);
            return data;
        })
            .catch((error) => {
            console.log(`${error.name}\n${error.message}`);
        });
    }
}
