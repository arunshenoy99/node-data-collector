$('#logout').click(function () {
    fetch(`${window.location.protocol}//${window.location.hostname}:${window.location.port}/users/logout`, {
        method: 'POST',
        credentials: 'same-origin'
    })
    .then((response) => {
        if (response.status == 200)
        {
            deleteAllCookies()
            window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
        }
        else {
            console.log(response.status)
        }
    })
    .catch((error) => {
        console.log(error)
    })
})

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}