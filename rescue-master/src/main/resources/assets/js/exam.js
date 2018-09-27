"use strict";

var infoData = void 0;
var questions = void 0;
var numberOfQuestions = void 0;
var currentQuestionNumber = 1;
var responses = [];
var isExamQCovered = false;
var testName = "Exam Portal";

var eventDuration = new Date().getTime() + 15 * 60 * 1000;
var durationUndetected = 0;
var durationNotDetectedTime = 60 * 1000;

var isdetected = true;
var isverified = true;

var forceCheckWhenDetected = false;

window.onload = function () {
    initializeVideoRendering();
    fetchInitialData();
    updateTime();
};

function updateTime() {
    var currentTime = new Date().getTime();
    var diffTime = eventDuration - currentTime;
    var duration = moment.duration(diffTime);
    $('#test-remaining-time').text(duration.hours() + ":" + duration.minutes() + ":" + duration.seconds());
    var durationFaceUndetected = moment.duration(durationUndetected);
    $('#test-face-not-detected-duration').text(durationFaceUndetected.hours() + ":" + durationFaceUndetected.minutes() + ":" + durationFaceUndetected.seconds());
    processFaceDetectionTime();
}

function fetchInitialData() {
    setInterval(updateTime, 1000);
    $('#isDetected').text("Face Detected");
    $('#recognized').text(isverified ? "Authorized" : "Unauthorized");
    var serializedData = localStorage.getItem('login');
    infoData = JSON.parse(serializedData);
    console.log(infoData);
    if (infoData.testName !== undefined) {
        testName = infoData.testName;
    }
    $('#logo-container').text(testName);
    showCandidateInfo();
    questions = JSON.parse(localStorage.getItem("questions"));
    numberOfQuestions = questions.length;
    renderFromNumber(1);
}

function showCandidateInfo() {
    $('#username').text(infoData.name);
}

document.getElementById("exam-authorize").addEventListener("click", function () {
    photoCheck();
});

var verifyTimer = setInterval(function () {
    if (!isdetected) {
        verifyFaceWhenDetected = true;
    } else
        photoCheck();
}, 10000);

var canvas = document.getElementById('canvas');

//Initializing image
var image = void 0;
var examDiv = document.getElementsByClassName("exam-container")[0];
var overlay = document.getElementsByClassName("overlay")[0];
var verifyFaceWhenDetected = false;

function photoCheck() {
    if (!isdetected && verifyFaceWhenDetected) {
        console.log("waiting for face");
        return;
    }
    console.log("Checking image");
    image = canvas.toDataURL("image/jpg");
    var base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
    var blob = base64ToBlob(base64ImageContent, 'image/jpg');
    var formData = new FormData();
    formData.append('photo', blob, "ce.jpg");
    formData.append('user_id', infoData.userId);
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
                isverified = true;
                verifyFaceWhenDetected = false;
                clearInterval(verifyTimer);
                verifyTimer = setInterval(function () {
                    photoCheck();
                }, 10000);
                showExam();
            } else {
                //clearInterval(verifyTimer);
                //verifyFaceWhenDetected = true;
                isverified = false;
                console.log("Wrong face");
                blockExam();
            }
        },
        error: function error(xhr, ajaxOptions, thrownError) {
            console.log('Error upload ' + xhr.responseText);
        }
    });
}

function showExam() {
    if (isExamQCovered) {
        isExamQCovered = false;
        examDiv.style.display = "block";
        overlay.style.display = "none";
    }
}

function blockExam() {
    if (!isExamQCovered) {
        isExamQCovered = true;
        examDiv.style.display = "none";
        overlay.style.display = "block";
    }
}

var alertCount = 0;
var alert1 = false;
var alert2 = false;
var alertFinal = false;
var undetectedSchedule;
var continuousFaceUndetected;

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
        if (event.data.length === 1) {
            isdetected = true;
            $('#isDetected').text("Face Detected");
            $('#recognized').text(isverified ? "Authorized" : "Unauthorized");
            context.drawImage(video, 0, 0, video.width, video.height);
            if (verifyFaceWhenDetected) {
                photoCheck();
            }
        } else {
            context.drawImage(video, 0, 0, video.width, video.height);
            $('#isDetected').text("Face Not Detected");
            $('#recognized').text(isverified ? "Authorized" : "Unauthorized");
            isdetected = false;

            /*if(!forceCheckWhenDetected){
                forceCheckWhenDetected = true;
                undetectedSchedule = setInterval(incrementForATime, 1000);
                console.log("intialized face detection check for 10 sec")
            }*/

            if (alertCount === 0) {
                if (!alert1 && durationUndetected > durationNotDetectedTime) {
                    console.log("Face not detected for a minute");
                    alert1 = true;
                    alertCount = 1;
                    blockExam();
                    alert("Face not detected for a minute");
                }
            } else if (alertCount === 1) {
                if (!alert2 && durationUndetected > 2 * durationNotDetectedTime) {
                    console.log("Face not detected for 2 minutes");
                    alert2 = true;
                    alertCount = 2;
                    blockExam();
                    alert("Face not detected for 2 minutes. Exam will end if face is not detected for 4 minutes.");
                }
            } else {
                if (durationUndetected > 4 * durationNotDetectedTime) {
                    console.log("Face not detected for 4 min ");
                    blockExam();
                    alert("Submitting response.");
                    submitResponseFinal();
                }
            }
            //context.clearRect(0, 0, canvas.width, canvas.height)
        }
        //context.clearRect(0, 0, canvas.width, canvas.height);
    });
    // let gui = new dat.GUI();
    // gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
    // gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
    // gui.add(tracker, 'stepSize', 1, 5).step(0.1);
}

function incrementForATime() {
    continuousFaceUndetected = continuousFaceUndetected + 1000;
    if (continuousFaceUndetected === 10 * 1000) {
        console.log("face not detected continuously for 10s.");
        continuousFaceUndetected = 0;
        forceCheckWhenDetected = true;
        blockExam();
        clearInterval(undetectedSchedule);
    }
}

function processFaceDetectionTime() {
    if (!isverified || isverified && !isdetected) {
        durationUndetected += 1000;
    }
}

function showQuestionLinks() {
    // let questionsSerialized = localStorage.getItem('questions');
    //let questionsResponse = JSON.parse(questionsSerailized);
    console.log("Loaded questions");
    //show question links
    questions.forEach(function (question) {
    });
}

function renderFromNumber(number) {
    currentQuestionNumber = number;
    var question = questions.find(function (x) {
        return x.number === number;
    });

    $('#previous-question-btn').off('click');
    $('#clear-response-btn').off('click');
    $('#submit-next-question-btn').off('click');

    $('#question-number').text(number);

    $('#question').text(question.question);
    $('#option1').text(question.optiona);
    $('#option2').text(question.optionb);
    $('#option3').text(question.optionc);
    $('#option4').text(question.optiond);
    $('.options').prop('checked', false);

    $('#previous-question-btn').on('click', function () {
        previousQuestion();
    });
    $('#clear-response-btn').on('click', function () {
        clearResponse();
    });
    $('#submit-next-question-btn').on('click', function () {
        submitAndNext();
    });
}

function submitResponseFinal() {
    console.log("Submitting response");
    $.ajax({
        type: "POST",
        url: baseUrl + '/device/submit-all?test_id=' + infoData.testId + "&user_id=" + infoData.userId,
        data: responses,
        contentType: "application/json",
        success: function success(json) {
            localStorage.removeItem('questions');
            localStorage.removeItem('user');
            localStorage.removeItem('login');
            window.location = "/login.html";
            console.log("submitted answer.");
        },
        error: function error(xhr, ajaxOptions, thrownError) {
            $('#login-form-error').html(JSON.parse(xhr.responseText).message);
            console.log('Error sending answer' + xhr.responseText);
        }
    });

}

function submitOneResponse() {
    console.log("submit response");
    //@todo Save response in local storage.
    let response = {
        "number": currentQuestionNumber,
        "option": 1
    };
    responses.push(response);
}

function previousQuestion() {
    console.log("previous");
    if (currentQuestionNumber <= 1) return;
    renderFromNumber(currentQuestionNumber - 1);
}

function submitAndNext() {
    console.log("Clicked submit and next");
    submitOneResponse();
    nextQuestion();
}

function nextQuestion() {
    console.log("Next");
    if (currentQuestionNumber >= numberOfQuestions) return;
    renderFromNumber(currentQuestionNumber + 1);
}

function clearResponse() {
    console.log("Clear response");
    $('.options').prop('checked', false);
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

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

//===internal
function filteredArray(arr, key, value) {
    var newArray = [];
    for (i = 0, l = arr.length; i < l; i++) {
        if (arr[i][key] === value) {
            newArray.push(arr[i]);
        }
    }
    return newArray;
}