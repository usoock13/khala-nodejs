const signUpForm = document.querySelector('.khala-signupform')
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    fetch('/sign-up', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Id': signUpForm.id.value,
            'User-Nickname': signUpForm.nickname.value,
            'User-Password': signUpForm.password.value,
        }
    })
    .then(res => {
        if(res.status !== 200) throw res;
        res.json().then(json => {
            console.log(json.redirection);
            location.href = json.redirection;
        });
    })
    .catch(err => {
        err.json().then(json => {
            alert(json.message);
        })
    })
})