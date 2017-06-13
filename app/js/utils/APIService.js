const API = 'https://api.twitch.tv/kraken';
const clientId = 'o9tn6ven9v7wcc0ugqiq8gzrxemtmm';

export function send(method, endpoint, data, success, error) {
    let url = `${API}${endpoint}`;
    let options = {};
    data = JSON.stringify(data);

    if (data) options.body = data;
    options.method = method;
    options.headers = new Headers({
        'Client-ID': clientId
    });

    fetch(url, options)
        .then((res) => {
            if (res.status >= 200 && res.status < 300)
                return res;
            else {
                let error = new Error(res.statusText);
                error.res = res;
                throw error;
            }
        })
        .then((res) => {
            return res.json();
        })
        .then(success)
        .catch(error)
}