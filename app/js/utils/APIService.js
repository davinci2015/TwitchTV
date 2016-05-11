const API = 'https://api.twitch.tv/kraken';

export function send (method, endpoint, data, success, error) {
    let url = `${API}${endpoint}`;
    data = JSON.stringify(data);

    let options = {
        method: method
    };
    if (data) options.body = data;

    fetch(url, options)
        .then( (res) => {
            if(res.status >= 200 && res.status < 300)
                return res;
            else {
                let error = new Error(res.statusText);
                error.res = res;
                throw error;
            }
        })
        .then( (res) => {
            return res.json();
        })
        .then(success)
        .catch(error)
}