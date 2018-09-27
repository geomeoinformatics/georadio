$(document).ready(function () {
    console.log("fetching list of exams");
    showCandidateInfo();
    loadExamList();
});

let loginInfo;
let tests = [];

function showAuthorize() {
    window.location = "/train-model.html";
}

function showMockTest() {
    window.location = "/login.html?mock-test=true";
}

function showCandidateInfo() {
    let serializedData = localStorage.getItem('user');
    loginInfo = JSON.parse(serializedData);
    if (loginInfo.picture !== undefined)
        $('#user-photo-div').append(`<img src="` + loginInfo.picture + `">`)
    $('#username').text(loginInfo.name);
    $('#user-email-value').text(loginInfo.email);
}

function loadExamList() {
    $.ajax({
        type: "GET",
        url: `${baseUrl}/candidate/list`,
        headers: {
            'Authorization': "Bearer " + loginInfo.token
        },
        success: function (response) {
            console.log("success.");
            console.log(response);
            tests = response;

            tests.forEach(function (test) {
                showExam(test)
            })
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#list-errors').html(xhr.responseText);
            console.log(`Error in sign up ${xhr.responseText}`);
        }
    });
}

function showExam(exam) {
    let statusString = "";
    switch (exam.has_applied) {
        case true:
            statusString = 'Applied for exam';
            break;
        case false:
            statusString = `<a href="javascript:;" onclick="registerForExam('` + exam.id + `')" class="btn secondary-content">Apply</a>`;
            break;
    }

    $('#list-collection').append(`<li class="collection-item avatar">
                            <img src='` + exam.photo + `' alt="" class="circle">
                            <span class="title">` + exam.name + `</span>
                            <p>` + (exam.organization ? exam.organization : "") + `</p>
                            <p>` + (exam.number ? "Registration ID: " + exam.number : '' ) + `</p>`
        + statusString + `</li>`)
}

function registerForExam(examId) {
    console.log("Registering for exam." + examId);
    $.ajax({
        type: "POST",
        url: `${baseUrl}/candidate/enroll-exam`,
        data: {
            'test_id': examId
        },
        headers: {
            'Authorization': "Bearer " + loginInfo.token
        },
        success: function (response) {
            console.log("success.");
            console.log(response);
            tests = response;
            let container = document.getElementById('list-collection');
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            loadExamList();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#list-errors').html(xhr.responseText);
            console.log(`Error in registering ${xhr.responseText}`);
        }
    });
}
