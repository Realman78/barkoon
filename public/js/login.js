const user_or_email_input = document.getElementById('user_or_email_input')
const passInput = document.getElementById('passInput')
const loginForm = document.getElementById('loginForm')


loginForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const username_or_email = user_or_email_input.value
    const password = passInput.value
    if (!username_or_email || !password) return
    const bodyData = JSON.stringify({
        loginTerm: username_or_email, 
        password
    })
    userLogin(bodyData)
})
async function userLogin(bodyData){
    const res = await fetch('/login', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: bodyData
    }).catch(e=>alert('something went wrong'))
    if (res.status !== 200) return alert('Incorrect credentials')
    location.href = '/'
}
