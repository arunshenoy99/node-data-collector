const $signupForm = document.querySelector('#signup')
const $fnameInput = $signupForm.querySelector('#firstname')
const $initInput = $signupForm.querySelector('#initname')
const $lnameInput = $signupForm.querySelector('#lastname')
const $emailInput = $signupForm.querySelector('#email')
const $passwordInput = $signupForm.querySelector('#password')
const $statusPara = document.querySelector('#status')
$signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const fname = $fnameInput.value.trim()
    const init = $initInput.value.trim()
    const lname = $lnameInput.value.trim()
    const name = `${fname} ${init} ${lname}`
    const email = $emailInput.value
    const password = $passwordInput.value
    const user = { name, email, password}
    postData(`${location.href}users`, user)
    .then((status) => {
        if (status === 201) {
            const parts = location.href.split('//')
            const parts2 = parts[1].split('/')
            const host = parts2[0]
            window.location.href = `http://${host}/forms`
        }
    })
    .catch((e) => {
        console.log(e)
    })
})

postData = async (url = '', user = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/JSON'
        },
        body: JSON.stringify(user)
    })
    return response.status
}