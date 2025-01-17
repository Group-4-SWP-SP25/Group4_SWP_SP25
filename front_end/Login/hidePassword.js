function hidePassword() {
    const passwordInput = document.querySelector(".Box1");
    const toggleIcon = document.querySelector(".hide-password");
    console.log("hdha")
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleIcon.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        toggleIcon.textContent = "👁️";
    }
}



const name = document.querySelector(".Box2");
const password = document.querySelector(".Box1");
const form = document.querySelector(".login1");
const button = document.getElementById('loginButton');
const warning= document.getElementById('warning');
const warning1= document.getElementById('warning1');
button.addEventListener('click', () => {
    console.log('click');
    let messages = '';
    if (name.value === '' || name.value == null) {
        messages='Please fill out this blank';
        warning.innerText=messages;
        
    }
        if (password.value === '' || password.value == null) {
        messages='Please fill out this blank';
        warning1.innerHTML=messages;
    }
   
     else {
        console.log("Form submitted successfully!");
    }
})





