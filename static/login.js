let loginForm = document.querySelector('#khala-loginform');
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'appalication/json',
            'User-Id': loginForm.id.value,
            'User-Password': loginForm.password.value,
        },
    })
    .then(res => {
        if(res.status !== 200) throw res;
        res.json().then(json => console.log(json));
    })
    .catch(err => {
        err.json().then(json => {
            alert(json.message);
        })
    })
})