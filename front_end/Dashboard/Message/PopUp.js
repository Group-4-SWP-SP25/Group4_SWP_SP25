const Popuplist = document.querySelector('.popup-list');
let PopupFirstIndex = 0;
let PopupCount = 30;
const PopupSearch = document.querySelector('#PopupsearchString');
let PopupSearchString = PopupSearch.value;
const PopupHeaderList = document.querySelector('.popup-header-list');
let ListHeader = [];

// new message to new user 
document.getElementById('message-head-action').addEventListener('click', togglePopup)

document.getElementById('overlay').addEventListener("click", togglePopup)

function togglePopup() {
    const popup = document.querySelector(".popup-container")
    if (!popup.classList.contains('active')) {
        // active
        popup.style.display = 'flex';
        overlay.style.display = 'flex';
        Popuplist.innerHTML = '';
        PopupHeaderList.innerHTML = '';
        PopupSearch.value = '';
        PopupSearchString = '';
        GetListPopupItem()
        setTimeout(() => {
            popup.classList.add('active');
            overlay.classList.add('active');
        }, 10); // Delay nhỏ để kích hoạt hiệu ứng
    } else {
        // hide
        popup.classList.remove('active');
        overlay.classList.remove('active');
        PopupFirstIndex = 0;
        PopupCount = 30;
        ListHeader = []
        setTimeout(() => {
            popup.style.display = 'none';
            overlay.style.display = 'none';
        }, 300); // Thời gian khớp với hiệu ứng transition
    }
}

// remove header item
const RemovePopupHeaderItem = (id) => {
    let item = Popuplist.querySelector(`div[item-id="${id}"]`);
    if (item != null)
        item.classList.remove('choose');
    item = PopupHeaderList.querySelector(`div[header-item-id="${id}"]`)
    item.remove();
    for (let value of ListHeader) {
        if (value[0] === id) {
            ListHeader.splice(ListHeader.indexOf(value), 1);
            break;
        }
    }
}

// add header item 
const AddPopupHeaderItem = (id, name) => {
    Popuplist.querySelector(`div[item-id="${id}"]`).classList.add('choose');
    let item = document.createElement('div');
    item.classList.add('popup-header-item');
    item.setAttribute('header-item-id', id)
    item.innerHTML = `
        <span class="popup-header-item-name">${name}</span>
        <button>
            <span class="material-icons">
                close
            </span>
        </button>     
    `;
    ListHeader.push([id, name]);
    item.querySelector('button').addEventListener('click', () => RemovePopupHeaderItem(id));
    PopupHeaderList.appendChild(item);
}

// toogle item
const ToggleItem = (id, name) => {
    for (let value of ListHeader) {
        if (value[0] == id) {
            RemovePopupHeaderItem(id)
            return
        }
    }
    AddPopupHeaderItem(id, name);

}

// add popup item
const AddPopupItem = (id, name) => {
    let item = document.createElement("div");
    item.classList.add('popup-list-item');
    for (let value of ListHeader) {
        if (value[0] == id) {
            item.classList.add('choose');
            break;
        }
    }
    item.setAttribute('item-id', id)
    item.innerHTML = `
        <img src="/resource/admin.jpg" alt="user avatar">
        <span>${name}</span>
    `
    item.addEventListener('click', () => {
        ToggleItem(id, name)
    })

    Popuplist.appendChild(item);
}


// get list popup item
const GetListPopupItem = async () => {
    try {
        const response = await fetch('http://localhost:3000/CustomerManager/getUserList', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ firstIndex: PopupFirstIndex, count: PopupCount, searchString: PopupSearchString })
        })

        const result = await response.json();
        let list = result.list;
        for (let item of list) {
            AddPopupItem(item.UserID, item.FirstName + ' ' + item.LastName)
        }
    } catch (err) {
        console.log(err)
    }
}

// search
PopupSearch.addEventListener('input', () => {
    PopupSearchString = PopupSearch.value;
    Popuplist.innerHTML = ''
    PopupFirstIndex = 0
    GetListPopupItem();
})

// scroll event 
Popuplist.addEventListener('scroll', () => {
    if (- Popuplist.scrollTop - Popuplist.clientHeight + Popuplist.scrollHeight <= 1) {
        PopupFirstIndex += PopupCount;
        let temp = Popuplist.scrollTop;
        GetListPopupItem();
        Popuplist.scrollTop = temp;
    }
})

// submit event 
const cancelButton = document.querySelector('.popup-btn-cancel')
const doneButton = document.querySelector('.popup-btn-done')

cancelButton.addEventListener('click', () => togglePopup());
doneButton.addEventListener('click', () => {
    if (ListHeader.length == 0) {
        // nothing choose
        togglePopup();
    } else if (ListHeader.length == 1) {
        let id = ListHeader[0][0]
        let name = ListHeader[0][1]
        let item = userList.querySelector(`div[message-item-id="${id}"]`)
        if (item == null) {
            // not exist
            AddUser(id, name, '')
            switchUser(id, name)
            togglePopup()
            MoveUserToTop(id, null);
        } else {
            // exist
            switchUser(id, name)
            MoveUserToTop(id, null);
            togglePopup()
        }
    } else {
        // mutil message
        let group = []
        for (let item of ListHeader) group.push(item[0])
        localStorage.setItem('group', JSON.stringify(group))
        switchGroup();
        togglePopup()
    }
})