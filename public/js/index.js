const tasksDiv = document.getElementById("tasksDiv");
const textAreaDescription = document.getElementById('textAreaDescription')
const addTaskButton = document.getElementById('addTaskButton')
const logoutButton = document.getElementById('logoutLink')

async function getTasks() {
    const res = await fetch('/tasks/getall')
    const data = await res.json()
    showTasks(data)
}

function showTasks(data) {
    data.forEach((task) => {
        tasksDiv.innerHTML += createTask(task)
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
    if (ev.target.id == 'tasksDiv' || ev.target.id == 'tasksDivInProgress' || ev.target.id == 'tasksDivInReview' || ev.target.id == 'tasksDivDone') {
        ev.target.appendChild(document.getElementById(data));
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
    console.log(val);
    console.log(event.target.id);

    input.addEventListener('click', (e) => {
        e.preventDefault();
        //updateTask(event.target.id, "123");
    })
}

addTaskButton.addEventListener('click', e => {
    e.preventDefault()
    //Task desc koji dobivam od textArea-e i user cemo poslije zamijenit sa pravim userima 
    const taskDescription = textAreaDescription.value
    //bodyData su parametri koji ulaze kao novi task, moras napravit objekt od njih i stringify-at
    //tako da ih u requestu dolje (*!*) može primit pa onda po tome dodajen u db
    const bodyData = JSON.stringify({
        description: taskDescription,
        user: user.username,
        stage: 1
    })
    addTask(bodyData)
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

addTextareaButton.addEventListener('click', (e) => {
    if (textAreaDescription.style.display == "none") {
        textAreaDescription.style.display = "block";
    } else {
        textAreaDescription.style.display = "none";
    }
})

function myFunction(x) {
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

getTasks();

logoutButton.addEventListener('click', (e)=>{
    e.preventDefault()
    fetch('/logout').then(()=>{
        window.location = '/login'
    })
})
