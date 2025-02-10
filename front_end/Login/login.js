//client

document.getElementById('loginButton').addEventListener('click', login);

async function login() {
  // get information form login form
  const account = document.getElementById("username").value; // mail or userName
  const password = document.getElementById("password").value;
  console.log("acc:", account);
  console.log("pass:", password);

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

async function handleCredentialResponse(response) {
  // Nhận token từ Google
  const token = response.credential;
  console.log("token: ", token)
  // Gửi token lên server qua API
  const res = await fetch('http://localhost:3000/auth/google/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  const result = await res.json();
  if (result.success) {
    // Thành công: Chuyển đến trang dashboard
    console.log(result)
    document.getElementById('user').innerHTML = result.user
  } else {
    // Lỗi: Hiển thị thông báo
    alert(result.message);
  }
}