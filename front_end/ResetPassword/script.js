document.addEventListener('DOMContentLoaded', () => {   

    const email = document.getElementById('email')
    document.getElementById('submitEmail').addEventListener('click', async () => {
        event.preventDefault()
        const data = {
            username: email.value,
            code: '180204'
        }
        console.log('click, email: ', email.value);
        try {
            const response = await fetch('http://localhost:3000/sendMail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.error("Error: ", error);
        }
    })

})