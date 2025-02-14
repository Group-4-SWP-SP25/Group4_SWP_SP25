document.getElementById('loginButton').addEventListener('click', login);

async function login() {
  // get login infomation
  const account = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  console.log(account, ' ', password)

  // check null
  if (!account || !password) {
    alert("Invalid account or password!"); // thay bằng animation trực quan hơn 
    return;
  }

  try {
    // Send login request to server
    response = await fetch("http://localhost:3000/auth/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ account, password })
    })

    switch (response.status) {
      case 200:
        const result = await response.json();
        localStorage.setItem('token', result.token);
        window.location.href = window.location.href = 'http://127.0.0.1:5500/front_end/HomePage/HomePage.html'
        break;
      case 404:
        alert('Account not found');
        break;
      case 401:
        alert('Wrong password');
        break;
    }

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

    if (result.isExist) {
      localStorage.setItem('token', result.token);
      window.location.href = 'http://127.0.0.1:5500/front_end/HomePage/HomePage.html'
    } else {
      const email = result.email;
      window.location.href = `http://127.0.0.1:5500/front_end/Register/Register.html?email=${email}`
    }
  } else {
    // Lỗi: Hiển thị thông báo
    alert(result.message);
  }
}