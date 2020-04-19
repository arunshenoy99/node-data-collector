const $form = document.querySelector('#login')
const $email = $form.querySelector('#email')
const $password = $form.querySelector('#password')

$form.addEventListener('submit', (e) => {
    e.preventDefault()
    const email = $email.value.trim()
    const password = $password.value.trim()
    const data = { email, password }
    postData(`${window.location.href}`, data)
    .then((status) => {
        if (status === 200) {
            const parts = location.href.split('//')
            console.log(parts[1])
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