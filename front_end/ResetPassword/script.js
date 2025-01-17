const email = document.getElementById("email");
const code = document.getElementById('veryfiCode');
const password = document.getElementById('newPassword');
const first = document.querySelector('.first-step');
const second = document.querySelector('.second-step');
const third = document.querySelector('.third-step');


document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submitEmail").addEventListener("click", async () => {
        event.preventDefault();
        let data = {
            account: email.value,
        };
        // checkAccountExist
        await fetch("http://localhost:3000/checkEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(response => { return response.json() })
            .then(result => {
                console.log(result.id);
                if (result.id == -1) {
                    alert('account not found');
                } else {
                    first.classList.add('hidden');
                    second.classList.remove('hidden');
                    verifycode(result.id, code.value);
                }
            })

    });
});

async function verifycode(id, code) {
    data = {
        id: result.id,
        code: code.value
    }
    await fetch('http://localhost:3000/resetPassword', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
        .then(response => { return response.status() })
        .then(result => {
            if (result == 400) {
                alert('code not valid');
            } else {
                second.classList.add('hidden');
                third.classList.remove('hidden');

            }
        })
}

async function changePassword(id) {
    data = {
        id: id,
        newPassword: password.value,
        oldPassword: null
    }
}
