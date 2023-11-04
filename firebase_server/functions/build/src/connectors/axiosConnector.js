import axios from 'axios';
export class APIConnector {
  static getJson(url, args) {
    return axios.get(url, {
      // params: args,
      responseType: 'json',
    }).then((data) => {
      // console.log('AXIOS response from : ',url,' ',data.data);
      return data;
    }).catch((error) => {
      console.log(error);
    });
  }
}
