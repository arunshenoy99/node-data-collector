window.addEventListener('submit', (e) => {
    e.preventDefault()
    const $form = document.querySelector(`#${e.target.id}`)
    const $formStatus = document.querySelector(`#${e.target.id}-status`)
    console.log($form)
    const formData = new FormData($form)
    console.log(formData)
    let data = {}
    formData.forEach((value, key) => {
        data[key] = value
    })
    const object = { name:e.target.id, data }
    postData(`${location.href}/submit`, object)
    .then((status) => {
        if(status === 200) {
            $formStatus.textContent = "Submitted"
            $form.style.display = 'none'
        }
    })
    .catch((e) => {
        console.log(e)
    })
})

const postData = async (url, object) => {
    const response = await fetch(url, {
        method:'POST',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(object) 
    })
    return response.status
}