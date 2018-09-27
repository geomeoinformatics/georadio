'use strict';

window.onload = function () {
    loadInfo();
    initializeVideoRendering();
};

var infoData = void 0;
var isUploading = false;

function loadInfo() {
    var serializedData = localStorage.getItem('login');
    infoData = JSON.parse(serializedData);
    console.log("User ");
    console.log(infoData);
}

var video = document.getElementById('video');

document.getElementById("save-btn").addEventListener("click", function () {
    photoCheck();
});

var canvas = document.getElementById('canvas');
var image = void 0;
function photoCheck() {
    if (isUploading) {
        return;
    }
    isUploading = true;
    console.log("Checking image");
    image = canvas.toDataURL("image/jpg");
    //console.log(image)
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/jpg');

    var blobUrl = URL.createObjectURL(blob);
    var img = document.createElement('img');

    var formData = new FormData();
    formData.append('photo', blob, "c.jpg");
    //formData.append('user_id', infoData.userId);
    console.log("User id: " + infoData.userId);
    var resource = baseUrl + '/device/verify?user=' + infoData.userId;
    $.ajax({
        type: "POST",
        url: resource,
        cache: false,
        contentType: false,
        processData: false,
        data: formData,

        success: function success(json) {
            if (json.verified) {
                console.log("Verified");
                window.location = "/exam.html";
                $("#isIdentified").text("Authorized");
            } else {
                console.log("Not identified");
                $("#isIdentified").text("Face not identified");
            }
            isUploading = false;
        },
        error: function error(xhr, ajaxOptions, thrownError) {
            isUploading = false;
            console.log('Error upload ' + xhr.responseText);
        }
    });
}

function initializeVideoRendering() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var tracker = new tracking.ObjectTracker('face');
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);
    tracking.track(video, tracker, { camera: true });
    tracker.on('track', function (event) {
        context.clearRect(0, 0, video.width, video.height);
        event.data.forEach(function (rect) {
            context.strokeStyle = '#a64ceb';
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
        });

        if (event.data.length === 1) {
            //photoCheck();
            $('#save-btn').removeClass("disabled");
            $('#isDetected').text("face detected");
            //console.log("one detected");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            photoCheck();
        } else {
            $('#save-btn').addClass("disabled");
            //console.log(event.data.length);
            $('#isDetected').text("face not detected");
            //context.clearRect(0, 0, canvas.width, canvas.height)
        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
    });
    // var gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
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
    return new Blob(byteArrays, { type: mime });
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