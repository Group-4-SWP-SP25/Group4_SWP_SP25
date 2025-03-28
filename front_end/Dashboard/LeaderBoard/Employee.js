const employee_container = document.querySelector('.employee-container');

async function AddEmployeeCard(employee, linkAvatar) {
    let item = document.createElement('div');
    item.classList.add('employee-info');
    item.setAttribute('employee-id', employee.UserID);
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

document.getElementById('add-employee').addEventListener('click', async () => {
    window.location.href = `../../Register/Register.html?role=employee&branchID=${branchID}`;
});