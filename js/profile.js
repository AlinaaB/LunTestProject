/**
 * Created by Alina on 04.11.2015.
 */

var my_name = "";
var my_email = "";
var my_country = "Country";
var my_city = "City";
var my_city_index = 0;
var my_country_index = 0;
var my_social_netw = {};
var my_avatar = "";

window.onload = load();


// first load, start again
function load() {
    var http = createRequestObject();
    if (http) {
        http.open('get', "step1.html");
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                document.getElementById('content').innerHTML = http.responseText;
            }
        }
        http.send(null);
    } else {
        document.location = link;
    }

    [].forEach.call(document.getElementsByClassName('step'), function (item, i, arr) {
        if (item.value !== "1") {
            item.disabled = true;

        }
    });
    document.getElementsByClassName('next')[0].value = 'Следующий';
    my_name = "";
    my_email = "";
    my_country = "Country";
    my_city = "City";
    my_city_index = 0;
    my_country_index = 0;
    my_social_netw = {};
    my_avatar = "";
}


function showContent(link) {

    var cur_page = document.getElementById('page').innerHTML;


    //save data from current page
    switch (cur_page) {
        case "1":

            my_name = document.getElementsByClassName('name')[0].value;

            var patt = /^(([А-Я][а-я]+\s?){1,5})|(([A-Z][a-z]+\s?){1,5})$/;
            if (!my_name || !(patt.test(my_name))) {
                error("Некорректное имя", "name");
                return;
            }
            my_email = document.getElementsByClassName('email')[0].value;

            if (!my_email || !(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-z]+$/.test(my_email))) {
                error("Некорректный почтовый адрес", "email");
                return;
            }
            break;

        case "2":
            my_country = document.getElementById('countries').options[document.getElementById('countries').selectedIndex].text;
            my_city = document.getElementById('cities').options[document.getElementById('cities').selectedIndex] ? document.getElementById('cities').options[document.getElementById('cities').selectedIndex].text : "";
            my_city_index = document.getElementById('cities').value;
            my_country_index = document.getElementById('countries').value;

            if (my_country == "Country") {
                error("Выберите страну", "countries");
                return;
            }

            if (my_city == "City" || !my_city) {
                error("Выберите город", "cities");
                return;
            }
            break;

        case "3":

            var flag = false;

            [].forEach.call(document.getElementsByClassName('social'), function (item, i, arr) {
                var label = item.className.split(" ")[1];

                if (item.checked) {
                    my_social_netw[label] = document.getElementById(label).value;
                    if (my_social_netw[label] == "" || !(/^[a-z]+\.(com|ru)\/[a-z1-9]+$/).test(my_social_netw[label])) {
                        flag = true;
                    }
                } else {
                    delete my_social_netw[label];
                }
            });

            if (flag) {
                error("Заполните выбранные поля", "", true);
                return;
            }
            break;

        case "4":
            [].forEach.call(document.getElementsByName('prof-img'), function (item, i, arr) {
                if (item.checked) {

                    my_avatar = item.value;
                }
            });

            if (!my_avatar || my_avatar == "dog") {
                error("Выберите фотографию с котиком", my_avatar, true);
                return;
            }
            break;
    }

//load next page
    var cont = document.getElementById('content');
    var loading = document.getElementById('loading');

    cont.innerHTML = loading.innerHTML;

    var http = createRequestObject();
    if (http) {
        http.open('get', link);
        http.onreadystatechange = function () {
            if (http.readyState == 4) {
                cont.innerHTML = http.responseText;
                initial(link.substr(0, link.length - 5));
            }
        }

        http.send(null)


    } else {
        document.location = link;
    }
}

function createRequestObject() {
    try {
        return new XMLHttpRequest()
    }
    catch (e) {
        try {
            return new ActiveXObject('Msxml2.XMLHTTP')
        }
        catch (e) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP')
            }
            catch (e) {
                return null;
            }
        }
    }
}

//
function initial(page) {

// set saved data
    switch (page) {

        case "step1":
            document.getElementsByClassName('next')[0].value = 'Следующий';
            if (my_name !== "") {
                document.getElementsByClassName('name')[0].value = my_name;
            }
            if (my_email !== "") {
                document.getElementsByClassName('email')[0].value = my_email;
            }
            break;

        case "step2":
            document.getElementsByClassName('next')[0].value = 'Следующий';
            var dropdown = document.getElementById('countries');

            $("#countries").change(function () {
                var country = document.getElementById('countries').value;
                var cities = document.getElementById('cities');
                $.getJSON("cities.json", function (data) {
                    var html = "";
                    for (var key in data) {
                        if (data[key]["country"] == country) {
                            html += "<option value=" + key + ">" + data[key]['name'] + "</option>";
                        }
                    }
                    html = "<option disabled selected hidden>City</option>" + html;
                    cities.innerHTML = html;

                    if (my_city !== "City") {
                        document.getElementById('cities').value = "" + my_city_index;
                    }
                });
            });

            $.getJSON("countries.json", function (data) {
                var html = "";
                for (var key in data) {
                    html += "<option value=" + key + ">" + data[key] + "</option>"
                }
                html = "<option disabled selected hidden>Country</option>" + html;
                dropdown.innerHTML = html;

                if (my_country !== "Country") {

                    document.getElementById('countries').value = "" + my_country_index;
                    document.getElementById('countries').dispatchEvent(new Event('change'));
                }
            });
            break;

        case "step3":
            document.getElementsByClassName('next')[0].value = 'Следующий';

            for (soc in my_social_netw) {
                document.getElementsByClassName(soc)[0].checked = true;
                document.getElementById(soc).style.display = "block";
                document.getElementById(soc).value = my_social_netw[soc];
            }
            break;

        case "step4":
            document.getElementsByClassName('next')[0].value = 'Завершить';
            document.getElementById(my_avatar).checked = true;

            break;

        case "finish":
            document.getElementsByClassName('name')[0].innerHTML = my_name;
            document.getElementsByClassName('email')[0].innerHTML = my_email;
            document.getElementsByClassName('country-city')[0].innerHTML = my_city + ", " + my_country;
            var soc = "";
            for (i in my_social_netw) {
                soc += "<span>" + i + ":</span> " + my_social_netw[i] + "<br>";
            }
            document.getElementsByClassName('social')[0].innerHTML = soc;
            document.getElementsByClassName('avatar')[0].style.backgroundImage = "url(../images/" + my_avatar + ".jpg)";

            break;
    }
}

// step3 social networks fields
function checkb(soc) {
    if (document.getElementsByClassName(soc)[0].checked) {
        document.getElementById(soc).style.display = "block";
    } else {
        document.getElementById(soc).style.display = "none";
    }
}

// show error block with error message
function error(msg, el, flag) {
    if (!flag) {
        document.getElementsByClassName(el)[0].style.outlineColor = "red";
        document.getElementsByClassName(el)[0].focus();
    }
    document.getElementsByClassName('error')[0].style.display = "block";
    document.getElementsByClassName('error')[0].innerHTML = msg;
}


//previous button
function previous() {
    var page = parseInt(document.getElementById('page').innerHTML);

    if (page !== 1) {
        showContent('step' + (page - 1) + '.html');
    } else {
        console.log('page doesn\'t exist');
    }
}

//next button
function next() {
    if (document.getElementsByClassName('next')[0].value !== 'Завершить') {
        var page = parseInt(document.getElementById('page').innerHTML);
        if (page !== 4) {
            document.getElementsByClassName('step')[document.getElementById('page').innerHTML].disabled = false;
            showContent('step' + (page + 1) + '.html');
        }
    } else {
        showContent('finish.html');
    }
}