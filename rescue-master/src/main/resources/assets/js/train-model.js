'use strict';

var loginInfo = void 0;

window.onload = function () {
    initializeVideoRendering();
    var serializedData = localStorage.getItem('user');
    loginInfo = JSON.parse(serializedData);
};

var isUploading = false;

var video = document.getElementById('video');

var canvas = document.getElementById('canvas');

// Trigger photo take
document.getElementById("save-button").addEventListener("click", function () {
    uploadPhoto();
});

var image = void 0;

function uploadPhoto() {
    if (isUploading) {
        return;
    }
    isUploading = true;
    image = canvas.toDataURL("image/jpg");
    //console.log(image);
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/jpg');

    var blobUrl = URL.createObjectURL(blob);
    var img = document.createElement('img');
    // img.src = blobUrl;
    // document.body.appendChild(img);

    var formData = new FormData();
    formData.append('photo', blob, "i.jpg");
    $.ajax({
        type: "POST",
        url: baseUrl + '/candidate/upload-photo',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        headers: {
            'Authorization': 'Bearer ' + loginInfo.token
        },
        success: function success(json) {
            console.log("success.");
            window.location = "/landingpage.html";
            isUploading = false;
        },
        error: function error(xhr, ajaxOptions, thrownError) {
            isUploading = false;
            console.log('Error upload ' + xhr.responseText);
        }
    });
}

function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];
    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {
        type: mime
    });
}

function photoUpload(params) {
    console.log('inside photo upload', params);
    var xhr = new XMLHttpRequest();
    var body = new FormData();
    body.append('photo', params);
    console.log(body);
    xhr.open('POST', baseUrl + '/candidate/upload-photo');
    xhr.setRequestHeader('Authorization', 'Bearer ' + loginInfo.token);
    xhr.send(body);
    console.log(xhr);
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('working', xhr.responseText);
            /*
            return callback(JSON.parse(xhr.responseText));*/
        } else {
            console.log('error', xhr.responseText);
            null;
        }
    };
}

function initializeVideoRendering() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track(video, tracker, {
        camera: true
    });
    tracker.on('track', function (event) {
        context.clearRect(0, 0, video.width, video.height);
        event.data.forEach(function (rect) {
            // context.strokeStyle = '#a64ceb';
            //context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            // context.font = '11px Helvetica';
            // context.fillStyle = "#fff";
            //context.fillText(`x: ${rect.x}px`, rect.x + rect.width + 5, rect.y + 11);
            //context.fillText(`y: ${rect.y}px`, rect.x + rect.width + 5, rect.y + 22);
            //context.drawImage(video, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);
        });

        if (event.data.length === 1) {
            var rect = event.data;
            $('#save-button').removeClass("disabled");
            $('#is-detected').text("face detected");
            context.drawImage(video, 0, 0, video.width, video.height);
            //context.drawImage(video, rect.x, rect.y, rect.width, rect.height, 0, 0, canvas.width, canvas.height);
            uploadPhoto();
            //console.log("one detected");
        } else {
            $('#save-button').addClass("disabled");
            //console.log(event.data.length);
            $('#is-detected').text("face not detected");
            //context.clearRect(0, 0, canvas.width, canvas.height)
        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
    });
    // var gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}

function saveFullFrame() {
    var canvas = document.getElementById('canvas');
    console.log("Saving image");
    /*let img = canvas.toDataURL();*/
    var imgData = canvas.toDataURL();
    /*document.getElementById("theimage").src = canvas.toDataURL();*/
}

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}