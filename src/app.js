// this is an example of improting data from JSON
// import 'orders' from '../data/orders.JSON';

export default (function () {
    
    function init() {
        let url = 'http://localhost:9000/api/orders.json';
        getApi(url);
        // console.log('hello');
    };
    function getApi(url) {
        let req = new XMLHttpRequest();
        req.onload = function() {
            let resp = req.response;
            // console.log(resp);
            roundArr(resp);
        };
        req.open('GET', url, true);
        req.responseType = 'json';
        req.send();
    };
    function roundArr(obj) {
        for(let i = 0; i <= obj.length; i++) {
            constructorTable(obj, i);
        };
    };
    function constructorTable(obj, i) {
        let lines = document.getElementById('lines');

        let line = document.createElement('tr');
        line.id = `order_${obj[i].id}`;
        lines.appendChild(line);

        let cellOne = document.createElement('td');
        cellOne.textContent = obj[i].transaction_id;
        line.appendChild(cellOne);

        let cellTwo = document.createElement('td');
        cellTwo.classList.add('user_data');
        cellTwo.textContent = obj[i].user_id;
        line.appendChild(cellTwo);

        let cellThree = document.createElement('td');
        let time = new Date(1970, 0, 1);
        time.setSeconds(obj[i].created_at);
        let monthTime = time.getMonth() + 1;
        if (time.getMonth() < 9) {
            monthTime = '0' + monthTime;
        }
        let editTime = `${time.getDay()}/${monthTime}/${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        cellThree.textContent = editTime;
        line.appendChild(cellThree);


        let cellFour = document.createElement('td');
        cellFour.textContent = `$${obj[i].total}`;
        line.appendChild(cellFour);

        let cellFive = document.createElement('td');
        if (obj[i].card_number.length == 16) {
            cellFive.textContent = `${obj[i].card_number[0]+obj[i].card_number[1]}**********${obj[i].card_number[12]+obj[i].card_number[13]+obj[i].card_number[14]+obj[i].card_number[15]}`;
        }
        else {
            cellFive.textContent = "Not entered full card number";
        }
        line.appendChild(cellFive);

        let cellSix = document.createElement('td');
        cellSix.textContent = obj[i].card_type;
        line.appendChild(cellSix);

        let cellSeven = document.createElement('td');
        cellSeven.textContent = `${obj[i].order_country} (${obj[i].order_ip})`;
        line.appendChild(cellSeven);
        console.log(time);
    };
    init();
    // document.getElementById("app").innerHTML = "<h1>Hello WG Forge</h1>";
}());