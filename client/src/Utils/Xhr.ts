import axios from 'axios';

export class Xhr {
    static async getJson(url: string, args: any) {
        try {
            const data = await axios.get(url, {
                // params: args,
                headers: {
                    'Client-Identifier': 'my-company',
                },
                responseType: 'json',
            });
            console.log('AXIOS response from : ', url, ' ', data.data);
            return data;
        } catch (error) {
            console.log(error);
        }
    }
}
