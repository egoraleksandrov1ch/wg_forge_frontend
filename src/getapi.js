export function getApi(url) {
    return new Promise(function(resolve, reject) {
        let req = new XMLHttpRequest();
        req.onload = () => {
            if (req.status == 200) {
                resolve(req.response);
            }
            else {
                reject(req.status);
            }
        };
        req.open('GET', url, true);
        req.responseType = 'json';
        req.send();
    }); 
};