const express = require('express')
const app = express()
var fs = require('fs');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = process.env.PORT || 3000

function formatDate(date) {

    month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;

    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

app.post('/:project', function (req, res) {
    let date = (new Date()).toLocaleDateString('pt-BR')
    let project = req.params.project
    let log = req.body.log || false

    if (log)
        fs.appendFile(`./log/${project}/${date.replace(/\//g, '-')}.txt`, `[${date}] ${log}\n`, (err) => {
            if (err) throw err;
            return
        });

    res.status(200).json(req.body)

})


app.get('/:project/:date', function (req, res) {

    let date = req.params.date || false
    let project = req.params.project

    if (project && date) {
        try {
            const file = fs.readFileSync(`./log/${project}/${date}.txt`, 'utf8')
            res.status(200).send(file)
        } catch (err) {
            res.status(200).send({ msg: 'no file' })
        }
    }

})

app.delete('/:project/:date', function (req, res) {

    let date = req.params.date || false
    let project = req.params.project

    if (project && date) {
        try {
            fs.unlink(`./log/${project}/${date}.txt`, () => res.status(200).send())
        } catch (err) {
            res.status(400).send()
        }
    }

})

app.listen(PORT, () => console.log('LISTENING IN PORT ' + PORT))
