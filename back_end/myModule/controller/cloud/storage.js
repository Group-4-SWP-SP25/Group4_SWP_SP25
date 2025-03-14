const axios = require("axios");
const jwt = require("jsonwebtoken");
const FormData = require("form-data");
const { Readable } = require("stream");
require('dotenv').config();

const client_email = process.env.CLIENT_EMAIL;
const private_key = process.env.PRIVATE_KEY;

let accessToken = null;
let tokenExpirationTime = null;

// dictionary of folder
const folder = {
    'avatar': '16UEshfraddzpopcj2fw-ZYm4sc0lf1jQ'
}

function bufferToStream(buffer) {
    const stream = new Readable();
    stream._read = () => { };
    stream.push(buffer);
    stream.push(null);
    return stream;
}

// Tạo JWT để lấy Access Token từ Google OAuth2
async function getAccessToken() {
    const now = Math.floor(Date.now() / 1000);

    // Kiem tra xem token hien tai co hieu luc khong
    if (accessToken && now < tokenExpirationTime) {
        return accessToken;
    }

    const payload = {
        iss: client_email,
        scope: "https://www.googleapis.com/auth/drive.file",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
    };

    const token = jwt.sign(payload, private_key, { algorithm: "RS256", });

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


// upload file
async function uploadFile(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const { type, id } = req.body;
        const accessToken = await getAccessToken();

        deleteFile(id);

        const metadata = {
            name: id,
            parents: [folder[type]],
        };

        const formData = new FormData();
        formData.append("metadata", JSON.stringify(metadata), { contentType: "application/json" });

        // Chuyển Buffer thành Stream trước khi gửi
        const fileStream = bufferToStream(req.file.buffer);
        formData.append("file", fileStream, { filename: req.file.originalname, contentType: req.file.mimetype });

        const response = await axios.post(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, formData, {
            headers: {
                ...formData.getHeaders(), // Sử dụng trực tiếp formData.getHeaders()
                Authorization: `Bearer ${accessToken}`,
                maxBodyLength: Infinity,
            },

        });

        res.status(200).json(response.data.id);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// delete file
async function getFileIdByName(fileName) {
    try {
        const accessToken = await getAccessToken();
        const response = await axios.get(`https://www.googleapis.com/drive/v3/files`, {
            params: {
                q: `name='${fileName}' and trashed=false`, // Tìm file theo tên, không lấy file trong thùng rác
                fields: "files(id, name)", // Chỉ lấy fileId và tên
            },
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (response.data.files.length > 0) {
            return response.data.files[0].id; // Lấy ID file đầu tiên tìm thấy
        } else {
            return null;
        }
    } catch (error) {
        console.error("❌ Lỗi khi tìm file:", error.response?.data || error.message);
        return null;
    }
}
async function deleteFile(fileName) {
    const fileId = await getFileIdByName(fileName);
    if (!fileId) return;
    try {
        await axios.delete(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error("❌ Lỗi khi xóa file:", error.response?.data || error.message);
    }
}

async function getFileInfo(req, res) {
    try {
        const { name } = req.body;
        const fileId = await getFileIdByName(name);
        if (fileId === null) return res.json({ message: "File not found" });
        res.status(200).json({ avatar: fileId });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
module.exports = {
    uploadFile,
    getFileInfo
};