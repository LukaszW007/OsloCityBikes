import axios from "axios";
export default class APIConnector {
    static getJson(url, args) {
        return axios
            .get(url, {
            responseType: "json",
        })
            .then((data) => {
            return data;
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
