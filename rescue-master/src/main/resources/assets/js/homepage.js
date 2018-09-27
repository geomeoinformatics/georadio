'use strict';

function showSignUpForm() {
    $('#register-button').hide();
    $('#login').hide();
    $('#register').show(10);
}

function showLogin() {
    $('#register-button').show();
    $('#register').hide();
    $('#login').show();
}

function login() {
    var lat = 0;
    var lon = 0;

    navigator.geolocation.getCurrentPosition((loc) => {
        navigator.geolocation.getCurrentPosition(showPosition);

        function showPosition(position) {
            x.innerHTML = "Latitude: " + position.coords.latitude +
                "<br>Longitude: " + position.coords.longitude;

            lat = position.coords.latitude
            lon = position.coords.longitude
        }

        //lat = position.coords.latitude
        //lon = position.coords.longitude;
        console.log('The location in lat lon format is: [', loc.coords.latitude, ',', loc.coords.longitude, ']');
    })

    var data = $('#registration-form').append("latitude", lat).append("longitude", lon);
    $.ajax({
        type: "GET",
        url: `${baseUrl}/user/register`,
        data: data.serialize(),
        success: function success(json) {
            console.log("success.");
            if (json != null) {
                console.log(json);
                localStorage.setItem('user', JSON.stringify(json));
                localStorage.setItem('id', json.id);
                console.log("id");
                console.log(json.id);
                window.location = "landingpage.html";
            } else {
                $('#register-form-error').html("Something is not working");
            }
        },
        error: function error(json, ajaxOptions, thrownError) {
            $('#register-form-error').html(JSON.parse(json.responseText).message);
            if (json != null) {
                console.log(json);
                localStorage.setItem('user', JSON.stringify(json.responseText));
                localStorage.setItem('id', json.id);
                console.log("id");
                console.log(json.id);
                window.location = "landingpage.html";
            } else {
                $('#register-form-error').html("Something is not working");
            }
            console.log('Error in sign up ' + json.responseText);
            console.log(json);
        }
    });
}

function rescue() {
    var data = $('#rescueform');
    let user;
    let serializedData = localStorage.getItem('user');
            user = JSON.parse(serializedData);
    var id = localStorage.getItem("id");

    $.ajax({
        type: "GET",
        url: `${baseUrl}/user/rescue?user_id=${id}`,
        data: data.serialize(),
        success: function success(json) {
            console.log("success.");
            if (json != null) {
                console.log(json);
                localStorage.setItem('user', JSON.stringify(json));
                window.location = "landingpage.html";
            } else {
                $('#register-form-error').html("Something is not working");
            }
        },
        error: function error(json, ajaxOptions, thrownError) {
            $('#register-form-error').html(JSON.parse(json.responseText).message);
            if (json != null) {
                console.log(json);
                localStorage.setItem('user', JSON.stringify(json.responseText));
                window.location = "landingpage.html";
            } else {
                $('#register-form-error').html("Something is not working");
            }
            console.log('Error in sign up ' + json.responseText);
        }
    });
}
