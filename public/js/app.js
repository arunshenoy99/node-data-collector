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
    postData('http://localhost:3000/users', user)
    .then((response) => {
        window.location.href = 'http://localhost:3000/forms'
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
    return response.json()
}