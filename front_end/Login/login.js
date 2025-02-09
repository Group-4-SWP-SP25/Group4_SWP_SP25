//client

document.getElementById('loginButton').addEventListener('click', login);
document.getElementById("auth-google").addEventListener('click', loginGoogle)

async function login() {
    // get information form login form
    const account = document.getElementById('username').value; // mail or userName
    const password = document.getElementById('password').value;
    console.log('acc:', account)
    console.log('pass:', password)

    if (!account || !password) {
        alert("Invalid account or password!");
        return;
    }

    try {
        // Send login request to server
        await fetch("http://localhost:3000/checkAccountExist", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ account, password })
        })
            .then(response => { return response.json() })
            .then(result => {

                if (result.id === -1) {
                    alert("Invalid account or password")
                } else {
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.setItem('userID', result.id);
                    localStorage.setItem('role', result.role);
                    window.location.href = "../HomePage/HomePage.html";
                }
            })


    } catch (error) {

        console.error("Error for login requestrequest:", error);
        alert("Error, try again.");
    }
}

// login with google

function loginGoogle() {
    window.location.href = 'http://localhost:3000/auth/google/login';
}

function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get('name'),
        email: params.get('email'),
        id: params.get('id'),
    };
}

const userInfo = getQueryParams();
console.log('User Info:', userInfo);
if (userInfo.id !== null) window.location.href = 'http://localhost:5500/front_end/HomePage/HomePage.html'
