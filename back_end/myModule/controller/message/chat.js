const { SessionsClient } = require("@google-cloud/dialogflow");
const { DateTime } = require("mssql");
// process.env.GOOGLE_APPLICATION_CREDENTIALS = "../../../service-account.json"


const projectID = "gen-lang-client-0667635865";
const sessionID = "1"
const sessionClient = new SessionsClient();

async function SendMessageToDialogflow(message) {
    try {
        const sessionPath = sessionClient.projectAgentSessionPath(projectID, sessionID)

        const repuest = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'vi'
                }
            }
        }
        const responses = await sessionClient.detectIntent(repuest)
        console.log('message: ', message)
        return responses[0].queryResult;
    } catch (error) {
        console.error("Lỗi khi gửi tin nhắn đến Dialogflow:", error);
        return "Có lỗi xảy ra khi kết nối với Dialogflow."; // Xử lý lỗi
    }
}

SendMessageToDialogflow("Tôi muốn đặt lịch hẹn vào thứ 7")
    .then(result => {
        console.log('intent: ', result.intent.displayName)
        console.log('response: ', result.parameters.fields)
        const dateTime = result.parameters.fields['date-time'].stringValue
        const date = dateTime.split('T')[0]
        const time = dateTime.split('T')[1].split('+')[0]

        console.log(`Ngày: ${date}`);
        console.log(`Thời gian: ${time}`);
    })