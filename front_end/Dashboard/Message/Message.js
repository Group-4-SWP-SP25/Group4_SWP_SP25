const urlParams = new URLSearchParams(window.location.search);
const url_id = urlParams.get("ID");

const body = document.getElementById('message-right-body');
const messageInput = document.getElementById('message-input');
const userList = document.getElementById('message-item-list');
const headerUsername = document.getElementById('header-username');
const searchUser = document.querySelector('#searchString');
let searchString = searchUser.value;
let ReceiverID = 0;
let firstIndex = 0;
let count = 15;
const intervals = []
let group = [];

window.onload = async () => {
    // left 
    await GetList();

    // right
    body.innerHTML = "";
    firstIndex = 0;
    autoResize(messageInput);

    if (url_id != null) {
        if (url_id == 0) {
            if (localStorage.getItem('group') != null)
                await switchGroup();
        }
        else {
            let item = userList.querySelector(`div[message-item-id="${url_id}"]`)
            let url_name = await fetch('http://localhost:3000/CustomerManager/getUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ id: url_id })
            })
                .then(response => response.json())
                .then(result => { return result.FirstName + ' ' + result.LastName })
            if (item == null) {
                // not exist
                AddUser(url_id, url_name, '')
                switchUser(url_id, url_name)
                MoveUserToTop(url_id, null);
            } else {
                // exist
                switchUser(url_id, url_name)
                MoveUserToTop(url_id, null);
            }
        }
    }
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
    let message = await addMessageRight(0, name, content, date.toLocaleString(), 'new');

    if (ReceiverID == 0) {
        for (let userid of group) {
            const id = await Send({ content: content, ReceiverID: userid });
            let item = userList.querySelector(`div[message-item-id="${userid}"]`)
            if (item == null) {
                // not exist
                let user_name = await fetch('http://localhost:3000/CustomerManager/getUserInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ id: userid })
                })
                    .then(response => response.json())
                    .then(result => { return result.FirstName + ' ' + result.LastName })
                AddUser(userid, user_name, content, id)
                MoveUserToTop(userid, content, id);
            } else {
                // exist
                MoveUserToTop(userid, content, id);
            }
        }
        message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`;
    } else {
        MoveUserToTop(ReceiverID, content);

        const id = await Send({ content: content, ReceiverID: ReceiverID });
        if (id != -1) {
            message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`;
        } else {
            message.querySelector(".status").innerHTML = `<span class="material-icons" style="color: orangered;">error</span>`;
        }

        message.setAttribute('msg-id', id);
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
        body: JSON.stringify({ ReceiverID: ReceiverID, firstIndex: firstIndex, count: count, isRead: true }),
    })
        .then((response) => { return response.json(); })
        .then((data) => {
            data.result.forEach((element) => {
                let name = "You";
                if (element.SenderID == ReceiverID) {
                    name = "Admin";
                    addMessageLeft(element.MessageID, name, element.Content, element.SentAt, 'old')

                } else {
                    addMessageRight(element.MessageID, name, element.Content, element.SentAt, 'old')
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
async function addMessageRight(id, name, content, time, option) {
    let message = document.createElement("div");
    message.classList.add("msg");
    message.classList.add("right-msg");
    message.setAttribute('msg-id', id);
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
async function addMessageLeft(id, name, content, time, option) {
    let message = document.createElement("div");
    message.classList.add("msg");
    message.classList.add("left-msg");
    message.setAttribute('msg-id', id);
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
        const response = await fetch("http://localhost:3000/Message/SendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();
        await (async (ms) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        })(1000);
        return result.id;
    } catch (error) {
        return -1;
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
            body: JSON.stringify({ searchString }),
        })
        const result = await response.json();
        const list = result.list;

        //show list
        userList.innerHTML = ''
        intervals.forEach(intervalID => clearInterval(intervalID));
        for (let user of list) {
            AddUser(user.ContactID, user.ContactName, user.LastMessage, user.LastMessageID)
            if (ReceiverID == 0) {
                ReceiverID = user.ContactID
                switchUser(ReceiverID, user.ContactName)
            }
            intervals.push(setInterval(async () => { check(user.ContactID); }, 2000))
        }
    } catch (error) {
        console.log('Error: ', error)
    }
}

// switch user
const switchUser = (id, name) => {
    ReceiverID = id;
    const item = userList.querySelector(`[message-item-id="${id}"]`);
    item.classList.remove('unread');
    count = 15;
    body.innerHTML = "";
    firstIndex = 0;
    headerUsername.innerHTML = name;
    loadMessages();
}

// switch group
const switchGroup = async () => {
    ReceiverID = 0;
    group = JSON.parse(localStorage.getItem('group'));
    localStorage.removeItem('group');
    let name = await fetch('http://localhost:3000/CustomerManager/getUserInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ id: group[0] })
    })
        .then(response => response.json())
        .then(result => { return result.FirstName })
    headerUsername.innerHTML = name + ' và ' + (group.length - 1) + ' người khác';
    body.innerHTML = "";
}

// add user 
async function AddUser(id, name, lastMessage, lastMessageID) {
    // add
    const user = document.createElement("div");
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

    user.querySelector('.last-message').setAttribute('last-message-id', lastMessageID)
    user.addEventListener('click', () => {
        switchUser(id, name)
    })
    user.querySelector('.message-item-action-btn').addEventListener('click', () => {
        alert('click action button of ' + name);
        event.stopPropagation();
    })
    userList.appendChild(user);
}

// move user to top 
function MoveUserToTop(id, content, msgid) {
    const item = userList.querySelector(`[message-item-id="${id}"]`);
    const user = item.cloneNode(true);
    if (content == null) {
        user.querySelector('.last-message').innerHTML = item.querySelector('.last-message').innerHTML;
        user.querySelector('.last-message').setAttribute('last-message-id', item.querySelector('.last-message').getAttribute('last-message-id'))
    } else {
        user.querySelector('.last-message').innerHTML = content;
        user.querySelector('.last-message').setAttribute('last-message-id', msgid)
    }
    user.addEventListener('click', () => {
        let id = item.getAttribute('message-item-id');
        let name = item.querySelector('.message-item-username').innerHTML;
        switchUser(id, name)
    })
    item.remove();
    userList.prepend(user);
}

// search 
searchUser.addEventListener('input', () => {
    searchString = searchUser.value;
    GetList();
})

// auto check new message
const check = async (id) => {
    await fetch('http://localhost:3000/Message/CheckMessage', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ readID: id })
    })
        .then(responsse => responsse.json())
        .then(result => {
            if (result.list == null) return
            else if (id == ReceiverID) {
                for (let element of result.list) {
                    addMessageLeft(element.MessageID, "AutoCare247", element.Content, element.SentAt, 'new')
                    fetch("http://localhost:3000/Message/GetMessage", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ ReceiverID: id, firstIndex: 0, count: 1, isRead: true }),
                    })
                    MoveUserToTop(element.SenderID, element.Content)
                }
            } else {
                let element = result.list[result.list.length - 1];
                const item = userList.querySelector(`[message-item-id="${id}"]`);
                item.classList.add('unread');
                const lastMessageID = item.querySelector('.last-message');
                if (lastMessageID.getAttribute('last-message-id') == element.MessageID) return
                MoveUserToTop(element.SenderID, element.Content, element.MessageID)
            }
        })
}

document.getElementById('message-right-header-action-btn').addEventListener('click', () => {
    if (ReceiverID == 0) return
    window.location.href = `/front_end/Dashboard/CustomerProfile/CustomerProfile.html?ID=${ReceiverID}`;
})