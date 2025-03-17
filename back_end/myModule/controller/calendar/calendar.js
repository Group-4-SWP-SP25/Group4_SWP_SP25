const axios = require('axios')
const jwt = require("jsonwebtoken");
require('dotenv').config();

const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;

const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const CALENDAR_ID = "c_6695d86cea6af7aabb512aa19772ed324db3d93771b855826d31724fe5fc4ff8@group.calendar.google.com";

let accessToken = null;
let tokenExpirationTime = null;

async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);

    if (accessToken && now < tokenExpirationTime) {
        return accessToken;
    }

    const jwtClient = {
        iss: client_email,
        scope: SCOPES.join(" "),
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
    };

    const token = jwt.sign(jwtClient, private_key, { algorithm: "RS256" });

    const res = await axios.post("https://oauth2.googleapis.com/token",
        null,
        {
            params: {
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: token,
            },
        });

    accessToken = res.data.access_token;
    tokenExpirationTime = now + 3600;

    return accessToken;
}

async function addEvent(summary, start, end, description) {
    try {
        const accessToken = await getAccessToken();
        const event = {
            summary: summary,
            start: { dateTime: start, timeZone: "Asia/Ho_Chi_Minh" },
            end: { dateTime: end, timeZone: "Asia/Ho_Chi_Minh" },
            description: description,
        };

        const response = await axios.post(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
            event,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        return response.data;
    } catch (error) {
        console.error("Lỗi khi thêm sự kiện:", error);
        return null;
    }
}


async function getEvents(startDate, endDate) {
    try {
        const accessToken = await getAccessToken();

        const response = await axios.get(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    timeMin: startDate, // Ngày bắt đầu
                    timeMax: endDate,   // Ngày kết thúc
                    singleEvents: true, // Hiển thị từng sự kiện riêng lẻ
                    orderBy: "startTime", // Sắp xếp theo thời gian bắt đầu
                },
            }
        );

        return response.data.items
    } catch (error) {
        console.error("Lỗi khi lấy sự kiện:", error);
        return null;
    }
}

async function deleteEvent(eventId) {
    try {
        const accessToken = await getAccessToken();

        await axios.delete(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events/${eventId}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log(`Đã xóa sự kiện với ID: ${eventId}`);
    } catch (error) {
        console.error("Lỗi khi xóa sự kiện:", error.response.data);
    }
}

async function addEvent_apis(req, res) {
    const { employeeID, customerID, startTime, endTime, description } = req.body;
    const summary = `Employee-${employeeID}-Customer-${customerID}`;
    const event = await addEvent(summary, startTime, endTime, description);
    if (event == null) {
        res.status(500).json({ message: "Add event failed" });
    } else {
        res.status(200).json({ message: "Add event successfully", event: event });
    }
}

async function getEvents_api(req, res) {
    const { startDate, endDate } = req.body
    const events = await getEvents(startDate, endDate);
    let list = []
    if (events == null) {
        res.status(500)
    }
    else {
        for (let event of events) {
            list.push({
                id: event.id,
                start: event.start.dateTime,
                end: event.end.dateTime,
                summary: event.summary,
                link: event.htmlLink
            })
        }

        res.status(200).json({ events: list })
    }
}



module.exports = {
    getEvents_api,
    addEvent_apis
}