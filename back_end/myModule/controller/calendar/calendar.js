const axios = require('axios')
const jwt = require("jsonwebtoken");

const client_email = "car-care-247@gen-lang-client-0667635865.iam.gserviceaccount.com"
const private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC0A2SL89PkNdq2\nzx28K16U79tOKBUNKFZyg+RLOxtiZZi3ndOZlg5uYYZcJUaRIOZzQEmAScb3w0oX\n3uU5kWaIbEchoaj4WA3O6fzjyiwPH53IMJxrPcusn/ZV9k/omA9cybqoS5PsyQFv\n0ub/2KDPFt2bSwi9IexLCqHbqT6oFI26UbMk0hN2vkhUCn9Sme3IIsWgAMN8y8Rq\nc+TW0HpX/611MugZLd1nfq6jGu4D4MA0x1+uaEl7hSF4WYehe9REeUZduLyJYagK\nvRZDNLDzLOWqo1YbTqz8Q3+QMDHUCUyaXt0LKqffOKrI1ce4xiReny0OsUvOte6h\n77FIuEYLAgMBAAECggEABSLBpOoA+2/qTY6PX4Sbgm4XsioKyZRHeLZ0h1GbjU03\neFzS3gWGY895fTofKMh+WIefYCWDPTQqUClu2YHp9yFN1ygpvQ6CmleeDXdn64Zn\nwqHhvrNBaF6SfgrjqouDzPSrOoj2RL+oSN7AadD2nuHp0rfnJcGzYExPdSGZGDKt\npJ6QF1iRf6HIgGVJa1G55JzsyMFt7agWBWUV/DgzlVyVgSKlA65M+L+rRhTQX+ma\n2pGpF0T9QZvB+7rF5aIyNrxT1WIIlcjSPeud3WBdPjyxUW702y858etC/+y9VIo3\nO3ZDIcwaAKosROlic2IQP1U5LOoMlsFR4sEJCWSJgQKBgQDl5/vLx8fy8MxO4ypb\nk5wRGOK58BfWtt06B1vWvevmEq1OgcyMfUII+U72oIR3h/qg922vqDYkOpWT+KQL\nFEZ7iWM2MGtECypYAbuBf6c4eo5LRjqgZEMhkkyFM8qrMnJO8oO55nZHa16XRLEE\nbhX21jrxq8wOxAY5wOiys4X+iwKBgQDIccAAr+EDrNKUYvGW+lVvopnuWUzBuWua\nK+cCliLHi85FNmwg/fgJFNNBtnpliOd0aMJ8+l59Ka+CZZGQvbyafdRAjDsKqoVj\nKmtSridAWpkkSQ1e0FAd8HE1gEpaticcpIjGOXFUS2RiNCCdao48phQtJYIhJHBf\ne9y2L+tGgQKBgQDPA0Lrq9kzvHUK92tViCU4E+NbL4AXmxK6RJQCWYLG6Lxae2+2\ndLb4I5xhYAnHI46eUAzY5SrTFllHItR7EWehpwTJb3G2lCMtmWm/4jStG1VzHCp/\n76eu2+/A5PCxlDvvMFlCE+0ew+QpavXFmmZ2m1H5+ApGpWVBrZ0aA6I8nwKBgBuI\nVGFDx1qj4ID1Xk3osNeWtCIjLgHmIDubEC4wxTI3p+ul4BBgEjPdIm+CSymrNm+s\n/BoCofv7P9pfbTE+fquR4RfEq095wLywVPGUblvOlf5/8lA1uOuD3WkF6DCxmIm8\np/TiawizGmTK2DgHLOZzwY25+zfmM3FKKDT2PBEBAoGBAJbWGWukqq0m2DInJNyK\nOFN6rVi6U0OzgL9o4eEpgTNLBj+Vj4FEA7tQaofdI9mXOSvWg+y977d6kBD/O/P1\nLD2SY8h2OnZb8rUghsZfg2NFGEMJEQd+zGHdis0eM/hrKjp1dpTSrGLcw9IqAbuQ\nu0JEBR/Ng66ApS1bR5pWj4jp\n-----END PRIVATE KEY-----\n"
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

async function addEvent() {
    try {
        const accessToken = await getAccessToken();

        const event = {
            summary: "Cuộc họp quan trọng",
            start: { dateTime: "2025-03-10T10:00:00Z", timeZone: "Asia/Ho_Chi_Minh" },
            end: { dateTime: "2025-03-10T11:00:00Z", timeZone: "Asia/Ho_Chi_Minh" },
        };

        const response = await axios.post(
            `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events`,
            event,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        console.log("Sự kiện đã được thêm:", response.data);
    } catch (error) {
        console.error("Lỗi khi thêm sự kiện:", error.response.data);
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
        console.error("Lỗi khi lấy sự kiện:", error.response.data);
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
    getEvents_api
}