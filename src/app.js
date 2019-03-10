// this is an example of improting data from JSON
// import 'orders' from '../data/orders.JSON';

export default (function () {

    let urlOrders = 'http://localhost:9000/api/orders.json';
    let urlUsers = 'http://localhost:9000/api/users.json';
    let urlCompanies = 'http://localhost:9000/api/companies.json';

    let transactionID = document.getElementById('transactionID');
    let userInfo = document.getElementById('userInfo');
    let orderDate = document.getElementById('orderDate');
    let orderAmount = document.getElementById('orderAmount');
    let cardType = document.getElementById('cardType');
    let location = document.getElementById('location');
    let search = document.getElementById('search');

    let objOrders;

    function init() {
        getApi(urlOrders)
		.then( response => {
            objOrders = response;
            roundArr(response);
		});
    };

    function getApi(url) {
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

    function roundArr(obj) {
        let lines = document.getElementById('lines');
        lines.innerHTML = '';
        constructorStatistics(obj);
        for(let i = 0; i <= obj.length; i++) {
            constructorTable(obj, i);
        };  
    };

    function roundUsers(obj, id, elem) {
        for (let i = 0; i <= obj.length; i++) {
            if (obj[i].id == id) {
                constructorUser(obj[i], elem);
            }
        }
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
        getApi(urlUsers)
		.then( response => {
            roundUsers(response, obj[i].user_id, cellTwo);
		});
        line.appendChild(cellTwo);

        let cellThree = document.createElement('td');
        let time = new Date(1970, 0, 1);
        time.setSeconds(obj[i].created_at);
        let monthTime = time.getMonth() + 1;
        if (time.getMonth() < 9) {
            monthTime = '0' + monthTime;
        }
        let editTime = `${time.toString()[8] + time.toString()[9]}/${monthTime}/${time.getFullYear()}, ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
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
    };

    function constructorUser(obj, elem) {
        let userLink = document.createElement('a');
        userLink.href = '#userLink';
        if (obj.gender == 'Male') {
            userLink.textContent = `Mr. ${obj.first_name} ${obj.last_name}`;
        }
        else if (obj.gender == 'Female') {
            userLink.textContent = `Ms. ${obj.first_name} ${obj.last_name}`;
        }
        elem.appendChild(userLink);

        let infoUser = document.createElement('div');
        infoUser.classList.add('user-details');
        infoUser.classList.add('list-group');
        infoUser.style.position = 'absolute';
        infoUser.style.display = 'none';
        elem.appendChild(infoUser);

        constructorInfoUser(obj, infoUser);

        let k = true;
        userLink.onclick = () => {
            infoUser.style.display = k ? 'block' : 'none';
            k = !k;
            // console.log('hi');
        };
    };

    function constructorInfoUser(objUser, elem) {
        let birthday = document.createElement('p');
        birthday.classList.add('list-group-item');
        if (objUser.birthday !== null) {
            let time = new Date(1970, 0, 1);
            time.setSeconds(objUser.birthday);
            let monthTime = time.getMonth() + 1;
            if (time.getMonth() < 9) {
                monthTime = '0' + monthTime;
            }
            let editTime = `${time.toString()[8] + time.toString()[9]}/${monthTime}/${time.getFullYear()}`;
            birthday.textContent = `Birthday: ${editTime}`;
        } 
        else {
            birthday.textContent = 'Brithday: missing.';
        }
        elem.appendChild(birthday);

        let photoUser = document.createElement('p');
        photoUser.classList.add('list-group-item');
        let imgUser = document.createElement('img');
        imgUser.setAttribute('width', '100px');
        imgUser.setAttribute('src', objUser.avatar);
        photoUser.appendChild(imgUser);
        elem.appendChild(photoUser);

        getApi(urlCompanies)
		.then( response => {
            // console.log(objUser);
            for (let i = 0; i <= response.length; i++) {
                if (response[i].id == objUser.company_id) {
                    constructorCompanies(response[i], elem);
                }
                else if (objUser.company_id == null) {
                    let companyUser = document.createElement('p');
                    companyUser.classList.add('list-group-item');
                    companyUser.textContent = 'Company: missing.';
                    elem.appendChild(companyUser);
                    break;
                }
            };
        });
    };

    function constructorCompanies(obj, elem) {
        let companyUser = document.createElement('p');
        companyUser.classList.add('list-group-item');
        companyUser.textContent = 'Company: ';

        let nameCompany = document.createElement('a');
        nameCompany.setAttribute('href', obj.url);
        nameCompany.setAttribute('target', '_blank')
        nameCompany.textContent = obj.title;
        companyUser.appendChild(nameCompany);
        elem.appendChild(companyUser);

        if (obj.industry !== 'n/a') {
            let industry = document.createElement('p');
            industry.classList.add('list-group-item');
            industry.textContent = `Industry: ${obj.industry}`;
            elem.appendChild(industry);
        };
    };

    function constructorStatistics(obj) {
        let statistics = document.getElementById('statistics');
        statistics.innerHTML = '';
        let lineOrdersCount = document.createElement('tr');
        statistics.appendChild(lineOrdersCount);

        let cellOneStatistics = document.createElement('td');
        cellOneStatistics.setAttribute('scope', 'row');
        cellOneStatistics.textContent = 'Orders Count';
        lineOrdersCount.appendChild(cellOneStatistics);
        
        let cellTwoStatistics = document.createElement('td');
        cellTwoStatistics.setAttribute('colspan', '6');
        if (obj.length == 0) {
            cellTwoStatistics.textContent = 'n/a';
        }
        else {
            cellTwoStatistics.textContent = obj.length;
        }
        lineOrdersCount.appendChild(cellTwoStatistics);

        let ordersTotal = 0;
        for (let i = 0; i < obj.length; i++) {
            ordersTotal = ordersTotal + +obj[i].total;
        }

        let lineOrdersTotal = document.createElement('tr');
        statistics.appendChild(lineOrdersTotal);

        let cellThreeStatistics = document.createElement('td');
        cellThreeStatistics.setAttribute('scope', 'row');
        cellThreeStatistics.textContent = 'Orders Total';
        lineOrdersTotal.appendChild(cellThreeStatistics);

        let cellFourStatistics = document.createElement('td');
        cellFourStatistics.setAttribute('colspan', '6');
        if (obj.length == 0) {
            cellFourStatistics.textContent = 'n/a';
        }
        else {
            cellFourStatistics.textContent = `$ ${Math.round(ordersTotal)}`;
        }
        lineOrdersTotal.appendChild(cellFourStatistics);

        let objCopy = obj.concat([]);
        objCopy.sort( (a,b) => {
            if(+a.total > +b.total){
                return 1
            }
            else {
                return -1
            } 
        });
        let medianValue = 0;
        if (objCopy.length == 1) {
            medianValue = objCopy.total;
        }
        else if (objCopy.length%2 !== 0) {
            let item = objCopy.length / 2 + 0.5;
            medianValue = objCopy[item].total;
        }
        else if (objCopy.length%2 == 0 && objCopy.length !== 0) {
            let item = objCopy.length / 2 - 1;
            let itemCopy = objCopy.length / 2;
            // console.log(objCopy);
            medianValue = (+objCopy[item].total + +objCopy[itemCopy].total) / 2;
        }

        let lineMedianValue = document.createElement('tr');
        statistics.appendChild(lineMedianValue);

        let cellFiveStatistics = document.createElement('td');
        cellFiveStatistics.setAttribute('scope', 'row');
        cellFiveStatistics.textContent = 'Median Value';
        lineMedianValue.appendChild(cellFiveStatistics);

        let cellSixStatistics = document.createElement('td');
        cellSixStatistics.setAttribute('colspan', '6');
        if (obj.length == 0) {
            cellSixStatistics.textContent = 'n/a';
        }
        else {
            cellSixStatistics.textContent = `$ ${medianValue}`;
        }
        lineMedianValue.appendChild(cellSixStatistics);

        let averageCheck = +ordersTotal / +obj.length; 
        let lineAverageCheck = document.createElement('tr');
        statistics.appendChild(lineAverageCheck);

        let cellSevenStatistics = document.createElement('td');
        cellSevenStatistics.setAttribute('scope', 'row');
        cellSevenStatistics.textContent = 'Average Check';
        lineAverageCheck.appendChild(cellSevenStatistics);

        let cellEightStatistics = document.createElement('td');
        cellEightStatistics.setAttribute('colspan', '6');
        if (obj.length == 0) {
            cellEightStatistics.textContent = 'n/a';
        }
        else {
            cellEightStatistics.textContent = `$ ${Math.round(averageCheck)}`;
        }
        lineAverageCheck.appendChild(cellEightStatistics);

        let averageCheckFemale = 0;
        let averageCheckMale = 0;
        getApi(urlUsers)
        .then( response => {
            for (let i = 0; i < obj.length; i++) {
                for(let q = 0; q < response.length; q++) {
                    if (obj[i].user_id == response[q].id && response[q].gender == 'Female') {
                        averageCheckFemale = averageCheckFemale + +obj[i].total;
                    }
                    else if (obj[i].user_id == response[q].id && response[q].gender == 'Male') {
                        averageCheckMale = averageCheckMale + +obj[i].total;
                    }
                };
            };
            if (obj.length == 0) {
                cellTenStatistics.textContent = 'n/a';
                cellTwelveStatistics.textContent = 'n/a';
            }
            else {
                cellTenStatistics.textContent = `$ ${Math.round(averageCheckFemale)}`;
                cellTwelveStatistics.textContent = `$ ${Math.round(averageCheckMale)}`;
            }
        });

        let lineAverageCheckFemale = document.createElement('tr');
        statistics.appendChild(lineAverageCheckFemale);

        let cellNineStatistics = document.createElement('td');
        cellNineStatistics.setAttribute('scope', 'row');
        cellNineStatistics.textContent = 'Average Check (Female)';
        lineAverageCheckFemale.appendChild(cellNineStatistics);

        let cellTenStatistics = document.createElement('td');
        cellTenStatistics.setAttribute('colspan', '6');
        lineAverageCheckFemale.appendChild(cellTenStatistics);

        let lineAverageCheckMale = document.createElement('tr');
        statistics.appendChild(lineAverageCheckMale);

        let cellElevenStatistics = document.createElement('td');
        cellElevenStatistics.setAttribute('scope', 'row');
        cellElevenStatistics.textContent = 'Average Check (Male)';
        lineAverageCheckMale.appendChild(cellElevenStatistics);

        let cellTwelveStatistics = document.createElement('td');
        cellTwelveStatistics.setAttribute('colspan', '6');
        lineAverageCheckMale.appendChild(cellTwelveStatistics);
    };

    
     
    search.onkeyup = (e) => {
        let newArr = [];
        let lines = document.getElementById('lines');
        lines.innerHTML = '';
        const text = search.value;
        for(let i = 0; i < objOrders.length; i++) {
            let country = `${objOrders[i].order_country} (${objOrders[i].order_ip})`;
            if (objOrders[i].transaction_id.indexOf(text) === -1 && objOrders[i].total.indexOf(text) === -1 && objOrders[i].card_type.indexOf(text) === -1 && country.indexOf(text) === -1) {
                // console.log('ничего не нашло');
                let line = document.createElement('tr');
                lines.appendChild(line);
                let cellOne = document.createElement('td');
                cellOne.setAttribute('colspan', '7');
                cellOne.textContent = 'Nothing found';
                line.appendChild(cellOne);
            } 
            else {
                newArr.push(objOrders[i]);
                // console.log('что-то нашло');
            }
        };
        roundArr(newArr);
    };

 



    // function sortFunc(btn, elem) {
    //     transactionID.innerHTML = 'Transaction ID';
    //     orderDate.innerHTML = 'Order Date';
    //     orderAmount.innerHTML = 'Order Amount';
    //     cardType.innerHTML = 'Card Type';
    //     location.innerHTML = 'Location';
    //     userInfo.innerHTML = 'User Info';

    //     if(k == 0) {
    //         let indicator = document.createElement('span');
    //         indicator.innerHTML = ' &#8595;';
    //         btn.appendChild(indicator);
    //         let resp = objOrders.concat([]);
    //         resp.sort(function(a,b){
    //             console.log(objOrders);
    //             if(a > b){
    //                 console.log(a);
    //                 console.log(b);
    //                 return 1
    //             }
    //             else {
    //                 return -1
    //             }
    //         });
    //         roundArr(resp);
    //     }
    // };

    let k = 0;
    transactionID.onclick = () => {
        // sortFunc(transactionID, 'transaction_id');
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        if (k == 0) {
            k = k + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            transactionID.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.transaction_id > b.transaction_id){
                    return 1
                }
                else {
                    return -1
                }
            });
            roundArr(resp);
        }
        else if (k == 1) {
            k = k + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            transactionID.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.transaction_id > b.transaction_id){
                    return -1
                }
                else {
                    return 1
                }
            });
            roundArr(resp);
        }
        else if (k == 2) {
            k = 0;
            roundArr(objOrders);
        }
    };

    let j = 0;
    orderDate.onclick = () => {
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        if (j == 0) {
            j = j + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            orderDate.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.created_at > b.created_at){
                    return 1
                }
                else {
                    return -1
                }
            });
            roundArr(resp); 
        }
        else if (j == 1) {
            j = j + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            orderDate.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.created_at > b.created_at){
                    return -1
                }
                else {
                    return 1
                }
            });
            roundArr(resp);
        }
        else if (j == 2) {
            j = 0;
            roundArr(objOrders);
        }
    };

    let g = 0;
    orderAmount.onclick = () => {
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        if (g == 0) {
            g = g + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            orderAmount.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(+a.total > +b.total){
                    return 1
                }
                else {
                    return -1
                }
            });
            roundArr(resp); 
        }
        else if (g == 1) {
            g = g + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            orderAmount.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(+a.total > +b.total){
                    return -1
                }
                else {
                    return 1
                }
            });
            roundArr(resp);
        }
        else if (g == 2) {
            g = 0;
            roundArr(objOrders);
        }
    };

    let h = 0;
    cardType.onclick = () => {
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        if (h == 0) {
            h = h + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            cardType.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.card_type > b.card_type){
                    return 1
                }
                else {
                    return -1
                }
            });
            roundArr(resp); 
        }
        else if (h == 1) {
            h = h + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            cardType.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.card_type > b.card_type){
                    return -1
                }
                else {
                    return 1
                }
            });
            roundArr(resp);
        }
        else if (h == 2) {
            h = 0;
            roundArr(objOrders);
        }
    };

    let f = 0;
    location.onclick = () => {
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        if (f == 0) {
            f = f + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            location.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.order_country > b.order_country){
                    return 1
                }
                else if (a.order_country < b.order_country) {
                    return -1
                }
                else if (a.order_country == b.order_country) {
                    if (a.order_ip > b.order_ip) {
                        return 1
                    }
                    else {
                        return -1 
                    }
                }
            });
            roundArr(resp); 
        }
        else if (f == 1) {
            f = f + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            location.appendChild(indicator);
            let resp = objOrders.concat([]);
            resp.sort((a,b) => {
                if(a.order_country > b.order_country){
                    return -1
                }
                else if(a.order_country < b.order_country) {
                    return 1
                }
                else if (a.order_country == b.order_country) {
                    if (a.order_ip > b.order_ip) {
                        return -1
                    }
                    else {
                        return 1 
                    }
                }
            });
            roundArr(resp);
        }
        else if (f == 2) {
            f = 0;
            roundArr(objOrders);
        }
    };

    let p = 0;
    userInfo.onclick = () => {
        transactionID.innerHTML = 'Transaction ID';
        orderDate.innerHTML = 'Order Date';
        orderAmount.innerHTML = 'Order Amount';
        cardType.innerHTML = 'Card Type';
        location.innerHTML = 'Location';
        userInfo.innerHTML = 'User Info';
        let lines = document.getElementById('lines');
        lines.innerHTML = '';
        if (p == 0) {
            p = p + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8595;';
            userInfo.appendChild(indicator);
            getApi(urlUsers)
            .then( response => {
                let newArr = response.concat([]);
                newArr.sort( (a,b) => {
                    if (a.first_name > b.first_name) {
                        return 1
                    }
                    else if (a.first_name < b.first_name) {
                        return -1
                    }
                    else if (a.first_name == b.first_name) {
                        if (a.last_name > b.last_name) {
                            return 1
                        }
                        else {
                            return -1
                        }
                    }
                });
                for (let i = 0; i < newArr.length; i++) {
                    for (let q = 0; q < objOrders.length; q++) {
                        if (newArr[i].id == objOrders[q].user_id) {
                            constructorTable(objOrders, q);
                        }
                    }
                };
            });
        }
        else if (p == 1) {
            p = p + 1;
            let indicator = document.createElement('span');
            indicator.innerHTML = ' &#8593;';
            userInfo.appendChild(indicator);
            getApi(urlUsers)
            .then( response => {
                let newArr = response.concat([]);
                newArr.sort( (a,b) => {
                    if (a.first_name > b.first_name) {
                        return -1
                    }
                    else if (a.first_name < b.first_name) {
                        return 1
                    }
                    else if (a.first_name == b.first_name) {
                        if (a.last_name > b.last_name) {
                            return -1
                        }
                        else {
                            return 1
                        }
                    }
                });
                for (let i = 0; i < newArr.length; i++) {
                    for (let q = 0; q < objOrders.length; q++) {
                        if (newArr[i].id == objOrders[q].user_id) {
                            constructorTable(objOrders, q);
                        }
                    }
                };
            });
        }
        else if (p == 2) {
            p = 0;
            roundArr(objOrders);
        }
    };

    init();

    // document.getElementById("app").innerHTML = "<h1>Hello WG Forge</h1>";
}());