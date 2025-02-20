const sql = require("mssql");

// send messages
const SendMessage = async (req, res) => {
    // get data from request
    const { content, ReceiverID } = req.body;
    const SenderID = req.user.id;

    try {
        // get the connection pool
        const pool = global.pool;
        const query = `
        INSERT INTO [Messages] (SenderID, ReceiverID, Content, SentAt)
        VALUES (@SenderID, @ReceiverID, @content, GETDATE())
        `;
        await pool
            .request()
            .input("SenderID", sql.Int, SenderID)
            .input("ReceiverID", sql.Int, ReceiverID)
            .input("content", sql.VarChar, content)
            .query(query);

        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }

}


// get message 
const GetMessage = async (req, res) => {
    // get data from request
    const { ReceiverID, firstIndex, count } = req.body;
    const SenderID = req.user.id;

    try {
        // get the connection pool
        const pool = global.pool;
        const query = `
        SELECT * FROM [Messages] 
        WHERE (SenderID = @SenderID AND ReceiverID = @ReceiverID) OR (SenderID = @ReceiverID AND ReceiverID = @SenderID)
        ORDER BY SentAt DESC
        OFFSET @firstIndex ROWS
        FETCH NEXT @count ROWS ONLY
        `;
        const result = await pool
            .request()
            .input("SenderID", sql.Int, SenderID)
            .input("ReceiverID", sql.Int, ReceiverID)
            .input("firstIndex", sql.Int, firstIndex)
            .input("count", sql.Int, count)
            .query(query);

        res.status(200).json({ result: result.recordset });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// get list user
const GetList = async (req, res) => {
    const id = req.user.id;

    try {
        const pool = global.pool;
        const query = `
            WITH LastMessages AS (
                SELECT 
                    CASE
                        WHEN SenderID = @id THEN ReceiverID
                        ELSE SenderID
                    END AS ContactID,
                    Content,
                    SentAt,
                    ROW_NUMBER() OVER (PARTITION BY 
                        CASE
                            WHEN SenderID = @id THEN ReceiverID
                            ELSE SenderID
                        END
                        ORDER BY SentAt DESC) AS RowNum
                FROM Messages
                WHERE SenderID = @id OR ReceiverID = @id
            )

            SELECT
                U.UserID AS ContactID,
                (U.FirstName + ' ' + U.LastName)AS ContactName,
                LM.Content AS LastMessage,
                LM.SentAt AS LastMessageTime
            FROM LastMessages LM
            JOIN [User] U ON LM.ContactID = U.UserID
            WHERE RowNum = 1
            ORDER BY LastMessageTime DESC;

        `;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .query(query);

        res.status(200).json({ list: result.recordset })
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = {
    SendMessage,
    GetMessage,
    GetList
}