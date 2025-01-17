document.addEventListener("DOMContentLoaded", () => {
  const email = document.getElementById("email");
  document.getElementById("submitEmail").addEventListener("click", async () => {
    event.preventDefault();
    const data = {
      account: email.value,
    };
    // checkAccountExist
    await fetch("http://localhost:3000/checkEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    .then(response => {return response.json()})
    .then(result => console.log(result.id))
    .catch
     
    });
});
