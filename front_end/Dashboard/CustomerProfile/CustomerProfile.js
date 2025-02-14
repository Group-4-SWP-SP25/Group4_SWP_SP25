
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('ID');

(async () => {
    await fetch('http://localhost:3000/CustomerManager/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ id: id })
    })
        .then(response => response.json())
        .then(result => {
            document.getElementById('currentpath').innerHTML = result.FirstName + ' ' + result.LastName;
            document.getElementById('user-name').innerHTML = result.FirstName + ' ' + result.LastName;
            document.getElementById('user-email').innerHTML = result.Email;
            document.getElementById('user-phone').innerHTML = result.Phone;
            document.getElementById('user-dob').innerHTML = result.DOB;
            document.getElementById('user-address').innerHTML = result.Address;
            document.getElementById('user-datecreated').innerHTML = result.DateCreated;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})();

