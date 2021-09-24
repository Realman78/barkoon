const tasksDiv = document.getElementById("tasksDiv");
const textAreaDescription = document.getElementById('textAreaDescription')
const addTaskButton = document.getElementById('addTaskButton')
const logoutButton = document.getElementById('logoutButton')

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

function createTask(task){
    return `<div class="task">
            <span class="taskDescription">
                ${task.description}
            </span>
        </div>`
}

function onDragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.id);

  event.currentTarget.style.backgroundColor = "#d0eb6c";
  event.currentTarget.style.cursor = "grab";
}

function onDragOver(event) {
  event.preventDefault();
}

function onDrop(event) {
  const id = event.dataTransfer.getData("text");

  const draggableElement = document.getElementById(id);
  draggableElement.style.backgroundColor = "#4AAE9B";
  draggableElement.style.cursor = "grab";

  const dropzone = event.target;

  if(dropzone.id == 'tasksDiv' || dropzone.id == 'tasksDivInProgress' || dropzone.id == 'tasksDivInReview' || dropzone.id == 'tasksDivDone') {
    dropzone.appendChild(draggableElement);
  }  

  event.dataTransfer.clearData();
}

addTaskButton.addEventListener('click', e =>{
    e.preventDefault()
    //Task desc koji dobivam od textArea-e i user cemo poslije zamijenit sa pravim userima 
    const taskDescription = textAreaDescription.value
    //bodyData su parametri koji ulaze kao novi task, moras napravit objekt od njih i stringify-at
    //tako da ih u requestu dolje (*!*) može primit pa onda po tome dodajen u db
    const bodyData = JSON.stringify({
        description: taskDescription,
        user: user.username
    })
    addTask(bodyData)
})

logoutButton.addEventListener('click', (e)=>{
    e.preventDefault()
    console.log(e.target)
})

async function updateTask(id, bodyData){
    fetch('/tasks/update/'+id, {
        method: 'PATCH',
        headers:{
            'Content-Type': 'application/json'
        },
        body: bodyData
    }).then(async (res)=>{
        const result = await res.text()
        document.location.reload()
        console.log(result)
    })
}

async function addTask(taskData){
    fetch('/tasks/add', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        // *!*
        body: taskData
    }).then(async (res)=>{
        const result = await res.text()
        document.location.reload()
        console.log(result)
    })
}

addTextareaButton.addEventListener('click', (e)=>{
    if(textAreaDescription.style.display == "none") {
        textAreaDescription.style.display = "block";
    } else {
        textAreaDescription.style.display = "none";
    }
    })

getTasks();
