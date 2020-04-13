const $signupForm = document.querySelector('#signup-form')
const $nameInput = $signupForm.querySelector('#name-input')
const $emailInput = $signupForm.querySelector('#email-input')
const $passwordInput = $signupForm.querySelector('#password-input')
const $statusPara = document.querySelector('#status')
$signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const name = $nameInput.value
    const email = $emailInput.value
    const password = $passwordInput.value
    const user = { name, email, password}
    postData('http://localhost:3000/users', user)
    .then((response) => {
        window.location.href = 'http://localhost:3000/users/me'
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