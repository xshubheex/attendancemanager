const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
]
const E1 = {
    '0':[],
    '1':[11,11,2,6,3],
    '2':[3,5,4,6,10,4],
    '3':[4,2,1,6,12,12],
    '4':[1,4,13,13,3,2],
    '5':[9,9,5,3,2,4],
    '6':[],
}


// ****** LOCAL STORAGE **********

// Tackle Conditions For New
if (!window.localStorage.getItem("AMSubjects"))
    window.localStorage.setItem("AMSubjects",JSON.stringify({}));
if (!window.localStorage.getItem("idcount"))
    window.localStorage.setItem("idcount",0);
if (!window.localStorage.getItem("AMAttendance"))
    window.localStorage.setItem("AMAttendance",JSON.stringify({}));
if (!window.localStorage.getItem("AMTimeTable"))
    window.localStorage.setItem("AMTimeTable",JSON.stringify({
        "0":[],
        "1":[],
        "2":[],
        "3":[],
        "4":[],
        "5":[],
        "6":[]
    }));

// predefined
const subjectvalue = document.getElementById('floatingSubjectAdd');
const subjectPageBtn = document.getElementById('subjectPageBtn');
const allsubjectsadd = document.getElementById('allsubjectsadd');
const allsubjectsmark = document.getElementById('allsubjectsmark');
const divforalert = document.getElementById('foralerts');
const navtoggler = document.querySelector('.navbar-toggler');
const navlinks = document.querySelectorAll('.nav-lin');
const ttDays = document.getElementById('TimeTableDays');
const addSubjectToTT = document.getElementById('addSubjectToTT');
const daySelect = document.getElementById('day-select');
const markTodaysAttendance = document.getElementById('markTodaysAttendance');
const todaysAllAttendance = document.getElementById('todaysAllAttendance');
const todaysDate = new Date();
const thisDaySelect = document.getElementById('day-mark-attendance');
let editFlag = false;
let subjectIdToEdit;
let subjectsOutput = JSON.parse(localStorage.getItem('AMSubjects'));
let id_count = JSON.parse(localStorage.getItem('idcount'));
let attendance = JSON.parse(window.localStorage.getItem('AMAttendance'));
let timeTable = JSON.parse(window.localStorage.getItem('AMTimeTable'));

function getFromLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem('list')) : [];
}

function addToLocalStorage(id, value) {
    const grocery = { id: id, value: value };
    let items = getFromLocalStorage();
    items.push(grocery);
    localStorage.setItem('list', JSON.stringify(items));

}

function removeFromLocalStorage(id) {
    let items = getFromLocalStorage();
    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));

}

function editLocalStorage(id, value) {
    let items = getFromLocalStorage();
    items = items.map(function (item) {
        if (item.id === id)
            item.value = value;
        return item;
    });

    localStorage.setItem("list", JSON.stringify(items));
}


function removeSubjectFromDay(dayId, posInArray){
    let arr = timeTable[dayId];
    arr.splice(posInArray,1);
    timeTable[dayId]=arr;
    window.localStorage.setItem("AMTimeTable",JSON.stringify(timeTable));
}

// Function For Close Buttons
function forclosebtns(e) {
    e.parentElement.classList.add('d-none');
}

// ------- Home Page ------------

function removeSubjectFromToday(e){
    // console.log(e.parentElement);
    if(e.innerHTML == "Attend"){
        e.innerHTML = "Leave";
        // e.parentElement.parentElement
        e.parentElement.classList.remove('text-muted');
        e.classList.add('text-danger')
    }
    else{
        e.innerHTML = "Attend";
        e.parentElement.classList.add('text-muted');
        
        e.classList.remove('text-danger')
    }
    // const parent = e.parentElement.parentElement;
    // const child = e.parentElement;
    // parent.removeChild(child);
}

function confirmTodaysAttendance(e){
    const todaysAttendance = document.getElementsByClassName('todaysAttendance');
    Array.from(todaysAttendance).forEach((e)=>{
        // console.log(!e.classList.contains('text-muted'));
        // console.log(attendance[e.dataset.idx][0]);
        if(!e.classList.contains('text-muted')){
            attendance[e.dataset.idx][0]++;
        }
        attendance[e.dataset.idx][1]++;
    });
    window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
    refreshAttendanceMarkPage();
    todaysAllAttendance.innerHTML = ``;
    thisDaySelect.value = "-1";
}
function cancelTodaysAttendance(){
    todaysAllAttendance.innerHTML = ``;
    thisDaySelect.value = "-1";
}

function markthisDaysAttendance(e){
    todaysAllAttendanceinnerHtml = `<div class="card">
        <div class="card-body">
        <div class="card-title fw-bold">${days[e]}'s All Lectures</div>
        <div class="card-text">
        <ul class="list-group list-group-flush">`
        todaysAllLectures = timeTable[e];
        todaysAllLectures.forEach((e)=>{
            // <li class="list-group-item">An item <button class="btn p-0"><i class="fas fa-minus-circle"></button></i></li>
            todaysAllAttendanceinnerHtml += `<li class="row todaysAttendance d-flex list-group-item px-0" data-idx="${e}"><div class="col-sm-9">${subjectsOutput[e]}</div><button onclick="removeSubjectFromToday(this)" data-idx="${e}" class="text-danger col-sm-2 btn p-0">Leave</li>`;
            // console.log(subjectsOutput[e]);
            
        });
        // console.log(todaysAllLectures);
                  
        todaysAllAttendanceinnerHtml += `</ul>
        </div>
        <button class="btn btn-sm btn-outline-success" onclick="confirmTodaysAttendance(this)">Confirm</button>
        <button class="btn btn-sm btn-outline-danger" onclick="cancelTodaysAttendance()">Cancel</button>
        </div>
        </div>`
        todaysAllAttendance.innerHTML = todaysAllAttendanceinnerHtml;
}

function homePage(){
    // attendanceTable
    let todaysAllAttendanceinnerHtml = '';
    let todaysAllLectures;
    markTodaysAttendance.addEventListener('click',()=>{
        markthisDaysAttendance(todaysDate.getDay());
    });
    thisDaySelect.addEventListener('change',(e)=>{
        // console.log(e.currentTarget.value);
        markthisDaysAttendance(e.currentTarget.value);
    });

}


// ------- AddSubjects Section ---------

// Close Navbar on Nav Link Click
function closeNavOnLinkClick(){
    Array.from(navlinks).forEach((e)=>{
        e.addEventListener('click',()=>{
            if (!navtoggler.classList.contains('collapsed')){
                navtoggler.click();
            }
        })
    });
}

function editThisSubject(e){
    editFlag = true;
    subjectIdToEdit = e.parentElement.parentElement.dataset.subjectid;
    subjectvalue.value = subjectsOutput[subjectIdToEdit];
    subjectPageBtn.innerHTML = "Edit";
}

function deleteThisSubject(e){
    console.log(e.parentElement.parentElement.dataset.subjectid);
    const subjectIdToDelete = e.parentElement.parentElement.dataset.subjectid;
    // attendanc
    delete attendance[subjectIdToDelete];
    delete subjectsOutput[subjectIdToDelete];
    // delete timeTable[subjectIdToDelete];
    for( let i=0; i<6; i++){
        timeTable[i] = timeTable[i].filter(item => item !== subjectIdToDelete);
    }
    window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
    window.localStorage.setItem("AMTimeTable", JSON.stringify(timeTable));
    window.localStorage.setItem("AMSubjects", JSON.stringify(subjectsOutput));
    refreshSubjectsList();
    refreshAttendanceMarkPage();
    homePage();
    console.log(attendance);
    console.log(timeTable);
    // arr.splice(posInArray,1);

}


// Add Subject Event Listener
// addSubjectBtn.addEventListener('click', () => {
    // });
    
    function subjectPageBtnFn(){
    if(editFlag){
        if (subjectvalue.value.length < 1) {
            divforalert.innerHTML = `<div class="alert alert-danger justify-content-between d-flex" role="alert">
                    <p class="mb-0">
                    New Subject Name should have length greater than zero
                    </p>
                    <button onclick="forclosebtns(this)" type="button" class="btn-close p-1" aria-label="Close"></button>
                    </div>`;
        }
        else{
            subjectsOutput[subjectIdToEdit] = subjectvalue.value;
            window.localStorage.setItem("AMSubjects", JSON.stringify(subjectsOutput));
            refreshSubjectsList();
            refreshAttendanceMarkPage();
            homePage();
            subjectvalue.value = "";
            subjectPageBtn.innerHTML = "Add";
            editFlag = false;    
        }
    }
    else{
        if (subjectvalue.value.length < 1) {
            divforalert.innerHTML = `<div class="alert alert-danger justify-content-between d-flex" role="alert">
                    <p class="mb-0">
                    Please Enter Something To Add
                    </p>
                    <button onclick="forclosebtns(this)" type="button" class="btn-close p-1" aria-label="Close"></button>
                    </div>`;
        }
        else {
            // subjectsOutput.push(subjectvalue.value);
            id_count++;
            subjectsOutput[id_count] = subjectvalue.value;
            window.localStorage.setItem("AMSubjects", JSON.stringify(subjectsOutput));
            window.localStorage.setItem("idcount",id_count);
            attendance[id_count] = [0,0];
            window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
            refreshAttendanceMarkPage();
            refreshSubjectsList();
            subjectvalue.value="";
        }

    }
}

function refreshSubjectsList() {
    subjectsOutput = JSON.parse(window.localStorage.getItem("AMSubjects"));
    let allsubjectsaddinnerhtml = '<h6>Available Subjects:</h6>';
    if(Object.keys(subjectsOutput).length == 0){
        allsubjectsaddinnerhtml += ` No subjects added !! Please Add a subject`;
    }
    allsubjectsaddinnerhtml += '<ul class="list-group list-group-flush">';
    for (const [key, value] of Object.entries(subjectsOutput)) {
        allsubjectsaddinnerhtml += `<li class="list-group-item d-flex justify-content-between" data-subjectid="${key}"><div>${value}</div><div style="min-width:3rem;"><button class="btn p-0 m-0 me-2" onclick="editThisSubject(this)"><i class="far fa-edit text-success"></i></button><button class="btn p-0 m-0" onclick="deleteThisSubject(this)"><i class="fas fa-trash text-danger"></i></button></div></li>`;
    }
    allsubjectsaddinnerhtml += '</ul>';
    allsubjectsadd.innerHTML = allsubjectsaddinnerhtml;
}

// ------ Mark Attendance Section


function attend(e){
    const idtoattend = e.dataset.id;
    attendance[idtoattend][0]++;
    attendance[idtoattend][1]++;
    window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
    refreshAttendanceMarkPage();
}

function leave(e){
    const idtoleave = e.dataset.id;
    attendance[idtoleave][1]++;
    window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
    refreshAttendanceMarkPage();
}

function editAttendance(e){
    const idtoedit = e.dataset.id;
    const attendededit = parseInt(document.getElementById(`floatingAttended${idtoedit}`).value);
    const totaledit = parseInt(document.getElementById(`floatingTotal${idtoedit}`).value);
    if(attendededit<0 || totaledit<0){
        divforalert.innerHTML = `<div class="alert alert-danger justify-content-between d-flex" role="alert">
                <p class="mb-0">
                Attended / Total Lectures should be greater than equals to zero !!
                </p>
                <button onclick="forclosebtns(this)" type="button" class="btn-close p-1" aria-label="Close"></button>
                </div>`;
    }
    else if(attendededit<=totaledit){
        attendance[idtoedit][0]=attendededit;
        attendance[idtoedit][1]=totaledit;
        window.localStorage.setItem("AMAttendance", JSON.stringify(attendance));
    }
    else{
        divforalert.innerHTML = `<div class="alert alert-danger justify-content-between d-flex" role="alert">
                <p class="mb-0">
                Attended Lectures must be less than or equal to Total
                </p>
                <button onclick="forclosebtns(this)" type="button" class="btn-close p-1" aria-label="Close"></button>
                </div>`;
    }
    refreshAttendanceMarkPage();

}

function refreshAttendanceMarkPage(){
    let allsubjectsmarkinnerhtml = '';
    if(Object.keys(subjectsOutput).length == 0){
        allsubjectsmarkinnerhtml = `
        No Subjects added till yet. Add a subject to continue.`;
        // No Subjects added till yet. <a class=" text-dark" id="addsubjects-tab" data-bs-toggle="tab"
        // data-bs-target="#addsubjects" type="button" role="tab" aria-controls="addsubjects"
        // aria-selected="false">Add a Subject</a> to continue`;
        
    }
    for (const [key, value] of Object.entries(attendance)) {
        allsubjectsmarkinnerhtml += `<div class="px-2 py-2 border-bottom m-0">
        <div class="row py-2">
        <h6>${subjectsOutput[key]}<a class="ps-2 text-success text-decoration-none" data-bs-toggle="collapse" href="#collapse${key}" role="button" aria-expanded="false" aria-controls="collapse1">(edit
            <i class="fas fa-angle-down text-dark"></i>)</a></h6><div class="attendancerow"><div class="d-inline mx-1"><span>Attendance:</span></div>`;
            if(value[1]!=0){
                if(value[0]*100/value[1] < 75){
                    allsubjectsmarkinnerhtml += `<div class="d-inline mx-1"><span class="text-danger">${value[0]}/${value[1]} | ${parseFloat(value[0]*100/value[1]).toFixed(2)}%</span></div>`;
                }  
                else{
                    allsubjectsmarkinnerhtml += `<div class="d-inline mx-1"><span class="text-success">${value[0]}/${value[1]} | ${parseFloat(value[0]*100/value[1]).toFixed(2)}%</div>`;
                }  
            }
            else{
                allsubjectsmarkinnerhtml += `No Lectures Till Yet`;
            }
            allsubjectsmarkinnerhtml+='</div>'
            
        allsubjectsmarkinnerhtml +=`</div>
            <div class="col-md-4 py-2">
            <button data-id="${key}" onclick="attend(this)" class="btn btn-outline-success">Attend</button>
            <button data-id="${key}" onclick="leave(this)" class="btn btn-outline-danger">Leave</button>
            </div>
        </div>
        <div class="collapse" id="collapse${key}">
            <div class="card card-body">
                <div class="row">
                    <div class="col-md-4 my-2">
                        <div class="form-floating">
                            <input type="number" class="form-control" id="floatingAttended${key}" placeholder="" value="${value[0]}">
                            <label for="floatingAttended${key}" class="fs-6">Attended Lectures</label>
                        </div>
                    </div>
                    <div class="col-md-4 my-2">
                        <div class="form-floating">
                            <input type="number" class="form-control" id="floatingTotal${key}" placeholder="" value="${value[1]}">
                            <label for="floatingTotal${key}" class="fs-6">Total Lectures</label>
                        </div>
                    </div>
                    <div class="col-md-4 my-2 align-self-center text-center">
                        <button class="btn btn-outline-primary" onclick="editAttendance(this)" data-id="${key}">Confirm Submit</button>
                    </div>
                </div>
            </div>
        </div>`;
    };
    allsubjectsmarkinnerhtml += '</ul>';
    allsubjectsmark.innerHTML = allsubjectsmarkinnerhtml;
}



// ------- Time Table -------
let ttdaysinnerhtml = '';
let addSubjectToTTOptionsinnerHtml = '';

function addSubjectToDay(e){
    const dayId = e.dataset.dayid;
    // console.log(e.dataset.dayid);
    const subjectToAdd = document.getElementById('subjectToAdd');
    // console.log(subjectToAdd.value);
    timeTable[dayId].push(subjectToAdd.value);
    // console.log(timeTable[dayId]);
    window.localStorage.setItem("AMTimeTable", JSON.stringify(timeTable));
    showchange(daySelect);
}

function deleteSubjectFromDay(e){
    const dayId = e.dataset.dayid;
    const posInArray = e.dataset.posOfDay;
    // console.log(e.parentElement.parentElement)
    const parent = e.parentElement.parentElement.parentElement;
    const child = e.parentElement.parentElement;
    parent.removeChild(child);
    removeSubjectFromDay(dayId, posInArray);
}

function showchange(e){
    ttdaysinnerhtml = '<div class="m-1">';
    if(timeTable[parseInt(e.value)].length==0)
        ttdaysinnerhtml += `No Lectures on ${days[parseInt(e.value)]}`;
    let posOfSubjectinArray = 0;
    timeTable[parseInt(e.value)].forEach((ee)=>{
        ttdaysinnerhtml += `<div class="d-flex justify-content-between"><div class="">${subjectsOutput[ee]}</div>
            <div class="" style="min-width:2rem;">
            <button class="btn p-0" data-dayid="${e.value}" data-posOfDay="${posOfSubjectinArray}" onclick="deleteSubjectFromDay(this)"><i class="fas fa-trash text-danger"></i></button>
            </div>
        </div>`;
        posOfSubjectinArray++;
    });
    ttdaysinnerhtml += '</div>';
    ttDays.innerHTML = ttdaysinnerhtml;

    addSubjectToTTOptionsinnerHtml = `<select id="subjectToAdd" class="form-select d-inline-block subject-options my-2" aria-label="select"> <option value="-1" selected disabled>Choose a Subject</option>`;
    for (const [key, value] of Object.entries(subjectsOutput)){
        addSubjectToTTOptionsinnerHtml += `<option value="${key}">${value}</option>`;
    }
    addSubjectToTTOptionsinnerHtml += `</select><button id="addSubjectToTTBtn" data-dayid="${e.value}" onclick="addSubjectToDay(this)" class="mx-2 btn my-2 d-imline-block btn-outline-primary">Add Subject</button>`;
    addSubjectToTT.innerHTML = addSubjectToTTOptionsinnerHtml;
}  



window.addEventListener("DOMContentLoaded", () => {
    homePage();
    refreshAttendanceMarkPage();
    refreshSubjectsList();
    closeNavOnLinkClick();
});
