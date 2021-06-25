const express = require('express')
const app = express()
var fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000

app.post('/', function (req, res) {
    let day = new Date(new Date()).toString().slice(0, 16)

    let log = req.body.log || false

    if (log)
        fs.appendFile(`./log/${day}.txt`, log + '\n', { encoding: "utf-8", mode: 0o666, flag: "a" }, (err) => {
            if (err) throw err;
        });

    res.status(200).json(req.body)

})

app.listen(PORT, () => console.log('LISTENING IN PORT ' + PORT))