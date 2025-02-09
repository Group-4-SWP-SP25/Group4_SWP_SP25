window.onload = function () {
    if (localStorage.getItem('loggedIn') !== 'true') {
        document.getElementById('MyProfile').classList.add('hide');
        document.getElementById('Mycars').classList.add('hide');
        document.getElementById('Dashboard').classList.add('hide');
        document.getElementById('SignOut').classList.add('hide');
        document.getElementById('MyOrders').classList.add('hide');
    } else {
        document.getElementById('SignIn').classList.add('hide');
        document.getElementById('SignUp').classList.add('hide');
        switch (localStorage.getItem('role')) {
            case 'Admin':
                document.getElementById('Mycars').classList.add('hide');
                document.getElementById('MyOrders').classList.add('hide');
                break;
            case 'User':
                document.getElementById('Dashboard').classList.add('hide');
        }
    }

    document.getElementById('MyProfile').addEventListener('click', function () {
        alert('MyProfile');
    });

    document.getElementById('Mycars').addEventListener('click', function () {
        alert('Mycars');
    });

    document.getElementById('MyOrders').addEventListener('click', function () {
        alert('MyOrders');
    });

    document.getElementById('Dashboard').addEventListener('click', function () {
        window.location.href = "../Dashboard/DashBoard/dashboard.html"
    });

    document.getElementById('SignIn').addEventListener('click', function () {
        window.location.href = '../Login/Login.html'
    });

    document.getElementById('SignOut').addEventListener('click', function () {
        localStorage.setItem('loggedIn', 'false');
        window.location.href = './HomePage.html'
    });

    document.getElementById('SignUp').addEventListener('click', function () {
        window.location.href = '../Register/Register.html'
    });

};

