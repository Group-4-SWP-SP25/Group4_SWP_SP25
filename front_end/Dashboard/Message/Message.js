const body = document.getElementById('message-right-body');
const messageInput = document.getElementById('message-input');
const userList = document.getElementById('message-item-list');
const eaderUsername = document.getElementById('header-username');

let ReceiverID = 0;
let firstIndex = 0;
let count = 15;

window.onload = function () {
    // left 
    GetList();

    // right
    body.innerHTML = "";
    firstIndex = 0;
    autoResize(messageInput);

    loadMessages();
}

// click send message
document.getElementById("send-message").addEventListener("click", async function () {
    const content = document.getElementById("message-input").value.trim();
    if (content === "") {
        alert("Message is empty");
        messageInput.value = "";
        autoResize(messageInput);
        return;
    }
    const name = "You";
    const date = new Date();

    messageInput.value = "";
    autoResize(messageInput);
    let message = await addMessageRight(name, content, date.toLocaleString(), 'new');
    MoveUserToTop(content);

    const status = await Send({ content: content, ReceiverID: ReceiverID });
    if (status == 200) {
        message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`;
    } else {
        message.querySelector(".status").innerHTML = `<span class="material-icons" style="color: orangered;">error</span>`;
    }
});
document.getElementById("message-input").addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById("send-message").click();
    }
});

// show history message
async function loadMessages() {
    // get messages from server
    fetch("http://localhost:3000/Message/GetMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ReceiverID: ReceiverID, firstIndex: firstIndex, count: count }),
    })
        .then((response) => { return response.json(); })
        .then((data) => {
            data.result.forEach((element) => {
                let name = "You";
                if (element.SenderID == ReceiverID) {
                    name = "Admin";
                    addMessageLeft(name, element.Content, element.SentAt, 'old')

                } else {
                    addMessageRight(name, element.Content, element.SentAt, 'old')
                        .then((message) => { message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`; });
                }

            });
        });
    count = 5;
}

// scroll event
const checkScroll = () => {
    let scrollableDiv = document.getElementById('message-right-body');
    if (scrollableDiv.scrollTop - scrollableDiv.clientHeight + scrollableDiv.scrollHeight <= 5) {
        firstIndex += count;
        let temp = scrollableDiv.scrollTop;
        loadMessages();
        scrollableDiv.scrollTop = temp;
    }
}
// show more message
document.getElementById('message-right-body').addEventListener('scroll', checkScroll);



// add right message to chat box
async function addMessageRight(name, content, time, option) {
    let message = document.createElement("div");
    message.classList.add("msg");
    message.classList.add("right-msg");
    message.innerHTML = `
        <div class="msg-bubble">
            <div class="msg-text">
                ${content}
                <div class="msg-info-right">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${time}</div>
                </div>
            </div>
        </div>
        <div class="status">
            <div class="loader"></div>
        </div>
    `;

    if (option === 'new') {
        body.insertBefore(message, body.firstChild);
    } else {
        body.appendChild(message);
    }
    return message;
}

// add left message to chat box
async function addMessageLeft(name, content, time, option) {
    let message = document.createElement("div");
    message.classList.add("msg");
    message.classList.add("left-msg");
    message.innerHTML = `
        <div class="msg-img">
            <img src="../../../resource/admin.jpg" alt="Admin">
        </div>
        <div class="msg-bubble">
            <div class="msg-text">
                ${content}
                <div class="msg-info-left">
                    <div class="msg-info-name">${name}</div>
                    <div class="msg-info-time">${time}</div>
                </div>
            </div>
        </div>
    `;

    if (option === 'new') {
        body.insertBefore(message, body.firstChild);
    } else {
        body.appendChild(message);
    }
}

// request to server
const Send = async (data) => {
    try {
        const status = await fetch("http://localhost:3000/Message/SendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        })
            .then((response) => { return response.status; })
            .then((status) => {
                return status;
            });
        await (async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        })(1000);
        return status;
    } catch (error) {
        return 500;
    }

}

// auto resize textarea 
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    if (textarea.scrollHeight > 100) {
        textarea.style.overflow = 'auto';
    } else {
        textarea.style.overflow = 'hidden';
    }
}

// get list user 
const GetList = async () => {
    try {
        const response = await fetch("http://localhost:3000/Message/GetList", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
        const result = await response.json();
        const list = result.list;

        //show list
        for (let user of list) {
            AddUser(user.ContactID, user.ContactName, user.LastMessage)
        }
    } catch (error) {
        console.log('Error: ', error)
    }
}

// add user 
async function AddUser(id, name, lastMessage) {
    // add
    let user = document.createElement("div");
    user.classList.add("message-item");
    user.setAttribute('message-item-id', id);
    user.innerHTML = `
        <div class="message-item-info">
            <img src="../../../resource/admin.jpg" alt="User">
            <div class="message-item-info-detail">
                <span class="message-item-username">${name}</span>
                <span class="last-message">${lastMessage}</span>
            </div>
        </div>
        <div class="message-item-action">
            <button class="message-item-action-btn">
                <span class="material-icons">
                    menu
                </span>
            </button>
        </div>
    `;

    user.addEventListener('click', () => {
        ReceiverID = id;
        count = 15;
        body.innerHTML = "";
        firstIndex = 0;
        headerUsername.innerHTML = name;
        loadMessages();
    })
    user.querySelector('.message-item-action-btn').addEventListener('click', () => {
        alert('click action button of ' + name);
        event.stopPropagation();
    })
    userList.appendChild(user);
}

// move user to top 
async function MoveUserToTop(content) {
    const item = userList.querySelector(`[message-item-id="${ReceiverID}"]`);
    const user = item.cloneNode(true);
    user.querySelector('.last-message').innerHTML = content;
    user.addEventListener('click', () => {
        ReceiverID = item.getAttribute('message-item-id');
        count = 15;
        body.innerHTML = "";
        firstIndex = 0;
        loadMessages();
    })
    item.remove();
    userList.prepend(user);
}

// new message to new user 
document.getElementById('message-head-action').addEventListener('click', togglePopup)

document.getElementById('overlay').addEventListener("click", togglePopup)

function togglePopup() {
    const popup = document.querySelector(".popup-container")
    if (!popup.classList.contains('active')) {
        popup.style.display = 'flex';
        overlay.style.display = 'flex';
        setTimeout(() => {
            popup.classList.add('active');
            overlay.classList.add('active');
        }, 10); // Delay nhỏ để kích hoạt hiệu ứng
    } else {
        popup.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300); // Thời gian khớp với hiệu ứng transition
    }
}