const createGroupButton = document.getElementById('createGroupButton')
const logoutButton = document.getElementById('logoutLink')
const createOrganisationLink = document.getElementById('createOrganisationLink')
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
        groupNameInput.value = '';
        location.reload();
    })
})

settingsButton.addEventListener('click', (e) => {
    window.location = '/settings'
})

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
        if (input.innerHTML.length > 20) {
            input.innerHTML = data[i].name.substring(0, 20) + '...';
        }
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
                    if (inputGroup.innerHTML.length > 20) {
                        inputGroup.innerHTML = groups.name.substring(0, 12) + '...';
                    }
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

logoutButton.addEventListener('click', (e) => {
    e.preventDefault()
    fetch('/logout').then(() => {
        window.location = '/login'
    })
})

getGroups();