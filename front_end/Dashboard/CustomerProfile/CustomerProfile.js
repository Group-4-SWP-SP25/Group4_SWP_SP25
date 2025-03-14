const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("ID");

(async () => {
  await fetch("http://localhost:3000/CustomerManager/getUserInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then(async (result) => {
      document.getElementById("currentpath").innerHTML =
        result.FirstName + " " + result.LastName;
      document.getElementById("user-name").innerHTML =
        result.FirstName + " " + result.LastName;
      document.getElementById("user-email").innerHTML = result.Email;
      document.getElementById("user-phone").innerHTML = result.Phone;
      document.getElementById("user-dob").innerHTML = result.DOB.split("T")[0];
      document.getElementById("user-address").innerHTML = result.Address;
      document.getElementById("user-datecreated").innerHTML = result.DateCreated.split("T")[0];

      // avatar
      let linkAvatar = null;
      try {
        const response = await fetch('http://localhost:3000/getFileInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ name: id })
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

      document.getElementById("user-avatar").src = linkAvatar;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
})();
