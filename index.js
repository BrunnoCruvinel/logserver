const express = require('express')
const app = express()
var fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

app.post('/:project', function (req, res) {

    let date = formatDate(new Date())
    let project = req.params.project
    let log = req.body.log || false

    if (log)
        fs.appendFile(`./log/${project}/${date}.txt`, `[${(new Date()).toLocaleString()}] ${log}\n`, { encoding: "utf-8", mode: 0o666, flag: "a" }, (err) => {
            if (err) throw err;
        });

    res.status(200).json(req.body)

})


app.get('/:project/:date', function (req, res) {

    let date = req.params.date || false
    let project = req.params.project

    if (date) {
        date = date.split("-").reverse().join("-")
        try {
            const file = fs.readFileSync(`./log/${project}/${date}.txt`, 'utf8')
            res.status(200).send(file)
        } catch (err) {
            res.status(400).send()
        }
    }

})

app.listen(PORT, () => console.log('LISTENING IN PORT ' + PORT))