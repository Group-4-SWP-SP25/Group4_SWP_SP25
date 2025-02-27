const sql = require("mssql");

// update read status
const ReadMessage = async (userId, readId, messageID) => {
    try {
        const pool = global.pool;
        await pool
            .request()
            .input('UserID', sql.Int, userId)
            .input('ReadID', sql.Int, readId)
            .input('MessageID', sql.Int, messageID)
            .execute('UpsertMessageRead')
    } catch (err) {
        console.log(err);
        //read
    }
}

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
        SELECT SCOPE_IDENTITY() AS MessageID;
        `;
        const result = await pool
            .request()
            .input("SenderID", sql.Int, SenderID)
            .input("ReceiverID", sql.Int, ReceiverID)
            .input("content", sql.VarChar, content)
            .query(query);
        ReadMessage(SenderID, ReceiverID, result.recordset[0].MessageID)
        res.status(200).json({ id: result.recordset[0].MessageID });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// get message 
const GetMessage = async (req, res) => {
    // get data from request
    const { ReceiverID, firstIndex, count, isRead } = req.body;
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

        if (firstIndex == 0 && result.recordset[0] != null && isRead)
            ReadMessage(SenderID, ReceiverID, result.recordset[0].MessageID)
        res.status(200).json({ result: result.recordset });
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// get list user
const GetList = async (req, res) => {
    const id = req.user.id;
    const { searchString } = req.body;
    // const
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
                    MessageID,
                    ROW_NUMBER() OVER (PARTITION BY 
                        CASE
                            WHEN SenderID = @id THEN ReceiverID
                            ELSE SenderID
                        END
                        ORDER BY MessageID DESC) AS RowNum
                FROM Messages
                WHERE SenderID = @id OR ReceiverID = @id
            )

            SELECT
                U.UserID AS ContactID,
                (U.FirstName + ' ' + U.LastName)AS ContactName,
                LM.Content AS LastMessage,
                LM.MessageID AS LastMessageID
            FROM LastMessages LM
            JOIN [User] U ON LM.ContactID = U.UserID
            WHERE RowNum = 1 AND (U.FirstName LIKE @searchString OR U.LastName LIKE @searchString)
            ORDER BY LastMessageID DESC;

        `;
        const result = await pool
            .request()
            .input("id", sql.Int, id)
            .input('searchString', sql.VarChar, `%${searchString}%`)
            .query(query);

        res.status(200).json({ list: result.recordset })
    } catch (error) {
        console.log("Error: " + error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// check do have new message?
const CheckMessage = async (req, res) => {
    const userID = req.user.id;
    const { readID } = req.body;
    try {
        if (readID == 0) res.json({ list: null })
        // get last message 
        const pool = global.pool;
        let query = `
            select top 1 MessageID
            from Messages
            where (ReceiverID = @userID and SenderID = @readID) OR (ReceiverID = @readID and SenderID = @userID)
            order by MessageID desc
          `;
        let result = await pool
            .request()
            .input('userID', sql.Int, userID)
            .input('readID', sql.Int, readID)
            .query(query)
        const lastMessageID = (result.recordset[0] == null) ? 0 : result.recordset[0].MessageID;


        // get last read message
        query = `
            select MessageID
            from MessageReads
            where UserID = @userID and ReadID = @readID
        `
        result = await pool
            .request()
            .input('userID', sql.Int, userID)
            .input('readID', sql.Int, readID)
            .query(query)

        const lastMessageRead = (result.recordset[0] == null) ? 0 : result.recordset[0].MessageID;


        if (lastMessageID == lastMessageRead) {
            res.json({ list: null })
        } else {

            query = `
            SELECT *
            FROM Messages
            WHERE ReceiverID = @userID AND SenderID = @readID AND MessageID > @lastMessageRead
            order by MessageID ASC
            `

            result = await pool
                .request()
                .input('userID', sql.Int, userID)
                .input('readID', sql.Int, readID)
                .input('lastMessageRead', sql.Int, lastMessageRead)
                .query(query)

            if (result.recordset[0] != null) res.json({ list: result.recordset })
            else res.json({ list: null })
        }
    } catch (err) {
        res.json({ list: null })
        // console.log(err)
    }
}

module.exports = {
    SendMessage,
    GetMessage,
    GetList,
    CheckMessage,
}