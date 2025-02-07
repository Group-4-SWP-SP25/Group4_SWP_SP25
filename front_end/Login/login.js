//client

document.getElementById('loginButton').addEventListener('click', login);


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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ account, password })
        })
        .then(response => {return response.json()})
        .then(result => {

            if(result.id===-1){
                alert("Invalid account or password")
            }else{
             
                window.location.href="../HomePage/HomePage.html";
            }
        })


    } catch (error) {
        
        console.error("Error for login requestrequest:", error);
        alert("Error, try again.");
    }
}
