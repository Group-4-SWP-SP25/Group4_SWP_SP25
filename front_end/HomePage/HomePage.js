const MessagePanel = document.querySelector('.message-container');
const body = document.querySelector('.message-body');
const messageInput = document.getElementById('message-input');
const textarea = document.querySelector('.message-footer-input textarea');
const unread = document.querySelector('.unread-count');
let firstIndex = 0;
let count = 15;
let ReceiverID = 1;
let isFirstLoad = true;
let lastMessageID = 0;
const name = "AutoCare247";

textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight + 6}px`;
});

window.onload = async () => {


    if (localStorage.getItem('token') != null) {
        body.innerHTML = ''
        loadMessages()
        setInterval(async () => {
            await fetch('http://localhost:3000/Message/CheckMessage', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ readID: ReceiverID })
            })
                .then(responsse => responsse.json())
                .then(result => {
                    if (result.list === null) {
                        unread.classList.add('hide');
                    }
                    else {
                        unread.classList.remove('hide');
                        unread.innerHTML = result.list.length;
                        for (let element of result.list) {
                            if (element.MessageID > lastMessageID) {
                                addMessageLeft(element.MessageID, "AutoCare247", element.Content, element.SentAt, 'new')
                                lastMessageID = element.MessageID;
                                checkRead()
                            }
                        }
                    }
                })
        }, 2000)
    }

}

const checkRead = () => {
    if (MessagePanel.classList.contains('active')) {
        unread.classList.add('hide');
        fetch("http://localhost:3000/Message/GetMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ ReceiverID: ReceiverID, firstIndex: 0, count: 1 }),
        })
    }
}


// open chat panel
document.querySelector('.fixed-message-icon').addEventListener('click', () => {
    MessagePanel.classList.toggle('active');
    checkRead()
})
document.querySelector('.message-close').addEventListener('click', () => {
    MessagePanel.classList.toggle('active');
})


// send message 
document.querySelector('.message-footer-send').addEventListener('click', async () => {
    const content = textarea.value.trim();
    if (content === "") {
        alert("Message is empty");
        messageInput.value = "";
        return;
    }
    textarea.value = '';
    const date = new Date();
    let message = await addMessageRight(0, 'You', content, date.toLocaleString(), 'new');
    const id = await Send({ content: content, ReceiverID: ReceiverID });
    if (id != -1) {
        message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`;
    } else {
        message.querySelector(".status").innerHTML = `<span class="material-icons" style="color: orangered;">error</span>`;
    }

    message.setAttribute('msg-id', id);
})
messageInput.addEventListener("keyup", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.querySelector('.message-footer-send').click();
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight + 6}px`;
    }
});

// add right 
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
        if (body.childNodes.length == 0) {
            body.appendChild(message);
        }
        body.insertBefore(message, body.firstChild);
    } else {
        body.appendChild(message);
    }
}


// load history
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
            if (data.result == null) {
                lastMessageID = 0;
                console.log(lastMessageID);
            }
            if (firstIndex == 0) {
                lastMessageID = data.result[0].MessageID;
            }
            data.result.forEach((element) => {
                let name = "You";
                if (element.SenderID == ReceiverID) {
                    addMessageLeft(element.MessageID, name, element.Content, element.SentAt, 'old')
                } else {
                    addMessageRight(element.MessageID, name, element.Content, element.SentAt, 'old')
                        .then((message) => { message.querySelector(".status").innerHTML = `<span class="material-icons">check_circle</span>`; });
                }

            });
        });
    count = 5;
}

// check scroll
const checkScroll = () => {
    if (body.scrollTop - body.clientHeight + body.scrollHeight <= 5) {
        firstIndex += count;
        let temp = body.scrollTop;
        loadMessages();
        body.scrollTop = temp;
    }
}
// show more message
body.addEventListener('scroll', checkScroll);

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