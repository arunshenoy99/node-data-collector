const $form = document.querySelector('#login')
const $email = $form.querySelector('#email')
const $password = $form.querySelector('#password')

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = $email.value.trim()
    const password = $password.value.trim()
    const data = { email, password }
    postData('http://localhost:3000/users/login', data)
    .then((status) => {
        if (status === 200) {
            window.location.href = 'http://localhost:3000/forms'
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