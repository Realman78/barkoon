const tasksDiv = document.getElementById("tasksDiv");
const tasksDivInProgress = document.getElementById("tasksDivInProgress");
const tasksDivInReview = document.getElementById("tasksDivInReview");
const tasksDivDone = document.getElementById("tasksDivDone");
const textAreaDescription = document.getElementById('textAreaDescription')
const addTaskButton = document.getElementById('addTaskButton')
const logoutButton = document.getElementById('logoutLink')
const createOrganisationLink = document.getElementById('createOrganisationLink')
const createGroupButton = document.getElementById('createGroupButton')
const groupNameInput = document.getElementById('groupNameInput')
const settingsButton = document.getElementById('settingButton')
const groupsLink = document.getElementById("groupsLink");

createGroupButton.addEventListener('click', (e) => {
    e.preventDefault()
    const body = JSON.stringify({
        name: groupNameInput.value
    })
    fetch('/orgs/create', {
        method: "POST",
        body,
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(() => {
        console.log('ok')
        //tu napravi sta se desi kad se napravi grupa (ili organizacija ili kult)
    })
})

settingsButton.addEventListener('click', (e) => {
    window.location = '/settings'
})

async function getTasks() {
    const res = await fetch('/tasks/getall')
    const data = await res.json()
    showTasks(data)
}

async function getGroups() {
    const res = await fetch('/orgs/get');
    const data = await res.json();
    showGroups(data)
}

createOrganisationLink.addEventListener('click', e => {
    e.preventDefault();
    $("#createOrganisationModal").modal('show');
})

function showGroups(data) {
    for (var i = 0; i < 3; ++i) {
        if (data[i] == null) break;
        var input = document.createElement("button");
        input.classList.add("nav-link2");
        input.classList.add("groups");
        input.innerHTML = data[i].name;
        groupsLink.appendChild(input);
    }

    var input = document.createElement("button");
    input.classList.add("nav-link2");
    input.classList.add("groups");
    input.innerHTML = "more" + `<i id="more" class="fas fa-caret-down more"></i>`;
    groupsLink.appendChild(input);
    var allGroups = document.createElement("div");
    groupsLink.appendChild(allGroups);
    allGroups.classList.add("allGroups");
    input.addEventListener("click", (e) => {
        var more = document.getElementById("more");
        if (more.classList.contains("more")) {
            allGroups.style.display = "block";
            more.classList.remove("more");
            more.classList.add("more2");
            let i = 0;
            data.forEach((groups) => {
                if (i < 3) {
                    i++;
                } else {
                    var inputGroup = document.createElement("button");
                    inputGroup.classList.add("nav-link2");
                    inputGroup.classList.add("groups");
                    inputGroup.innerHTML = groups.name;
                    allGroups.appendChild(inputGroup);
                }
            })
        } else {
            if (allGroups != null) {
                more.classList.remove("more2");
                more.classList.add("more");
                while (allGroups.firstChild) {
                    allGroups.firstChild.remove()
                }

                allGroups.style.display = "none";
            }

        }
    });

    console.log(data);
}

function showTasks(data) {
    data.forEach((task) => {
        /* tasksDiv.innerHTML += createTask(task) */

        switch (task.stage) {
            case 1:
                tasksDiv.innerHTML += createTask(task)
                break;

            case 2:
                tasksDivInProgress.innerHTML += createTask(task)
                break;

            case 3:
                tasksDivInReview.innerHTML += createTask(task)
                break;

            case 4:
                tasksDivDone.innerHTML += createTask(task)

                break;
        }
    });
}

function createTask(task) {
    return `<div class="task draggable" draggable="true" ondragstart="drag(event)" id="card${task._id}">
                <span class="taskDescription" id="${task._id}" ondblclick="editTask(event)">
                    ${task.description}
                </span>
            </div>`
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var description = document.getElementById(data).innerText.replace(/</g, "&lt;");
    if (ev.target.id == 'tasksDiv' || ev.target.id == 'tasksDivInProgress' || ev.target.id == 'tasksDivInReview' || ev.target.id == 'tasksDivDone') {
        ev.target.appendChild(document.getElementById(data));
    }

    switch (ev.target.id) {
        case 'tasksDiv':
            updateTask(data.substring(4), JSON.stringify({
                description,
                stage: 1
            }));
            break;

        case 'tasksDivInProgress':
            updateTask(data.substring(4), JSON.stringify({
                description,
                stage: 2
            }));
            break;

        case 'tasksDivInReview':
            updateTask(data.substring(4), JSON.stringify({
                description,
                stage: 3
            }));
            break;

        case 'tasksDivDone':
            updateTask(data.substring(4), JSON.stringify({
                description,
                stage: 4
            }));
            fetch('/tasks/delete/' + data.substring(4), {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => res.json())
                .then(data => {
                    console.log(data)
                })
            break;
    }
}

function editTask(event, task) {
    var val = document.getElementById(event.target.id).innerHTML.trim();
    document.getElementById(event.target.id).innerHTML = "";
    var input = document.createElement("textarea");
    input.value = val;
    input.classList.add("no-outline");
    input.classList.add("edit");
    input.classList.add("task");
    input.onblur = function () {
        var description = this.value;
        this.parentNode.innerHTML = description;
        updateTask(event.target.id, JSON.stringify({
            description,
            stage: 1
        }));
    }
    this.innerHTML = "";
    event.target.appendChild(input);
    input.focus();
}

addTaskButton.addEventListener('click', e => {
    e.preventDefault()
    //Task desc koji dobivam od textArea-e i user cemo poslije zamijenit sa pravim userima 
    // const taskDescription = textAreaDescription.value
    //bodyData su parametri koji ulaze kao novi task, moras napravit objekt od njih i stringify-at
    //tako da ih u requestu dolje (*!*) može primit pa onda po tome dodajen u db

    /* if (textAreaDescription.style.display == "none") {
        textAreaDescription.style.display = "block";
    } else {
        textAreaDescription.style.display = "none";
    } */

    var input = document.createElement("textarea");
    input.classList.add("textarea");
    input.classList.add("task");
    tasksDiv.appendChild(input);

    input.onblur = function () {
        description = this.value;
        const bodyData = JSON.stringify({
            description: description,
            user: user.username,
            stage: 1
        })
        addTask(bodyData)
    }
    e.target.appendChild(input);
    input.focus();

    /* const bodyData = JSON.stringify({
        description: taskDescription,
        user: user.username,
        stage: 1
    })
    addTask(bodyData) */
})

logoutButton.addEventListener('click', (e) => {
    e.preventDefault()
    console.log(e.target)
})

async function updateTask(id, bodyData) {
    fetch('/tasks/update/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData
    }).then(async (res) => {
        const result = await res.text()
        console.log(result)
    })
}

async function addTask(taskData) {
    fetch('/tasks/add', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        // *!*
        body: taskData
    }).then(async (res) => {
        const result = await res.text()
        document.location.reload()
        console.log(result)
    })
}

/* function myFunction(x) {
    x.classList.toggle("change");
}

menu.addEventListener('click', (e) => {
    const nav = document.querySelector(".nav");
    const overlay = document.querySelector(".nav-overlay");

    if (nav.classList == "nav nav-open") {
        nav.classList.remove("nav-open");
        nav.classList.add("nav-close")
        overlay.classList.remove("nav-open");
        overlay.classList.add("nav-open");
    } else {
        nav.classList.remove("nav-close");
        nav.classList.add("nav-open");
        overlay.classList.remove("nav-open");
        overlay.classList.add("nav-open");
    }
})

function openOrganizations(e) {
    document.getElementById("dropdown").classList.toggle("show");
} */

getTasks();
getGroups();

/* logoutButton.addEventListener('click', (e) => {
    e.preventDefault()
    fetch('/logout').then(() => {
        window.location = '/login'
    })
}) */
