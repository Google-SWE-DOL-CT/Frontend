const express = require('express')
const path = require('path')

const app = express();

app.use(express.static(__dirname + '/dist/dol-swe-comp'))

app.get('/*', (req,res)=>{
    res.sendFile('index.html', {root:'dist/dol-swe-comp'})})

app.listen(process.env.PORT || 4300)