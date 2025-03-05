const { google } = require('googleapis')
const fs = require('fs')
const axios = require('axios')

const credentials = JSON.parse(fs.readFileSync('../../../service-account.json'))

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/calendar"],
})

const calendar = google.calendar({ version: 'v3', auth })

async function GetEvent() {
    try {
        const response = await calendar.events.list({
            calendarId: "primary",
            timeMin: new Date().toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: "startTime",
        })

        return response.data.items;
    } catch (err) {
        console.log(err)
    }
}

async function CreateEvent() {
    const event = {
        summary: "Họp với khách hàng",
        location: "Cửa hàng sửa chữa ô tô",
        description: "Tư vấn sửa chữa ô tô",
        start: {
            dateTime: "2025-03-10T10:00:00Z",
            timeZone: "Asia/Ho_Chi_Minh",
        },
        end: {
            dateTime: "2025-03-10T11:00:00Z",
            timeZone: "Asia/Ho_Chi_Minh",
        },
        //attendees: [{ email: "khachhang@example.com" }],
    }

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
        })

        console.log(response.data.htmlLink)
    } catch (err) {
        console.log(err)
    }
}

async function DeleteEvent(ID) {
    try {
        await calendar.events.delete({
            calendarId: "primary",
            eventId: ID, // ID của sự kiện muốn xóa
        });
        console.log(`🗑️ Đã xóa sự kiện: ${ID}`);
    } catch (error) {
        console.error("Lỗi khi xóa sự kiện:", error);
    }
}

async function main() {
    const list = await GetEvent();
    for (const event of list) {
        let ID = event.id
        console.log("id: ", ID)
        await DeleteEvent(ID)
    }
    // await CreateEvent()
    console.log(await GetEvent())
}

main()