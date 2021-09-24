const registrationForm = document.getElementById('registrationForm')
const usernameInput = document.getElementById('usernameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passInput')

registrationForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const username = usernameInput.value
    const email = emailInput.value
    const password = passwordInput.value
    if (!username || !email || !password) return alert('Fields cannot be empty')
    if (validateEmail(email)){
        registerUser(username, email, password)
    }else{
        alert('Incorrect email')
    }
})

async function registerUser(username, email, password){
    const bodyData = JSON.stringify({
        username, email, password
    })
    const res = await fetch('/register', {
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: bodyData
    })
    if (res.status === 409) return alert('username or email taken')
    if (res.status !== 201) return alert('Something went wrong')
    location.href = '/'
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}