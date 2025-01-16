const express = require('express')
const PORT = 3000

const app = express()

app.get('/', (req, res))

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`)
})