const signUpForm = document.querySelector('.khala-signupform')
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch('/sign-up/result', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authentication-Code': signUpForm.code.value,
        }
    })
    .then(res => {
        if(res.status !== 200) throw res;
        res.json().then(json => {
            console.log(json.result);
        });
    })
    .catch(err => {
        err.json().then(json => {
            alert(json.message);
        })
    })
})