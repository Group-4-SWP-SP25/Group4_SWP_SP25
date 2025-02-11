const email = document.getElementById("email");
const code = document.getElementById('code');
const password = document.getElementById('Password');

const first = document.querySelector('.first-step');
const second = document.querySelector('.second-step');
const third = document.querySelector('.third-step');
let ID = -1

document.getElementById("submitEmail").addEventListener("click", async () => {
    event.preventDefault();
    let data = {
        account: email.value,
    };
    // checkAccountExist
    await fetch("http://localhost:3000/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => { return response.status })
        .then(result => {
            if (result == 404) {
                alert('account not found');
            } else {

                second.classList.remove('hidden');
            }
        })
});

document.getElementById('veryfiCode').addEventListener('click', async () => {
    event.preventDefault();
    let data = {
        username: email.value,
        code: code.value
    }
    await fetch("http://localhost:3000/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => { return response.status })
        .then(result => {
            if (result == 400) {
                alert('Incorect code!!')
            } else {
                first.classList.add('hidden');
                second.classList.add('hidden');
                third.classList.remove('hidden');
            }
        })
})

document.getElementById('newPassword').addEventListener('click', async () => {
    event.preventDefault();
    let data = {
        account: email.value,
        newPassword: password.value,
        oldPassword: null
    }
    await fetch("http://localhost:3000/changePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => { return response.status })
        .then(result => {
            console.log(result)
            switch (result) {
                case 300: alert('Cannot same to old password'); break;
                case 200: alert('Success'); window.location.href = "../HomePage/HomePage.html"; break;
                case 400: alert('Error'); break;
            }
        })
})