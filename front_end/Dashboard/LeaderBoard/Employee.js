const employee_container = document.querySelector('.employee-container');

async function AddEmployeeCard(employee) {
    let item = document.createElement('div');
    item.classList.add('employee-info');
    item.setAttribute('employee-id', employee.UserID);

    // avatar
    let linkAvatar = null;
    try {
        const response = await fetch('http://localhost:3000/getFileInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ name: employee.UserID })
        })
        const status = response.status;
        if (status == 200) {
            const result = await response.json();
            linkAvatar = result.avatar;
        }
    } catch (error) {
        console.log(error);
    }

    if (linkAvatar != null) {
        linkAvatar = `https://drive.google.com/thumbnail?id=${linkAvatar}`;
    } else {
        linkAvatar = "/resource/admin.jpg";
    }


    item.innerHTML = `
        <div class="employee-avatar">
            <img src="${linkAvatar}" alt="">
        </div>
        <div class="employee-subtitle">
            <h2 class="employee-name">${employee.FirstName + ' ' + employee.LastName}</h2>
            <h3 class="employee-email">${employee.Email}</h3>
            <h3 class="employee-phone">${employee.Phone}</h3>
        </div>
    `;
    employee_container.appendChild(item);
}