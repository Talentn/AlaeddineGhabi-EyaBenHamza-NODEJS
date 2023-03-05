const express = require('express');
const Joi = require('joi');
const fs = require('fs');
const port = 3000
const student_router = require('./routers/students')
const appDebugger = require('debug')('app:students:Debug')
const config = require('config')
const morgan = require('morgan')

const app = express();
app.use(express.json());

appDebugger('Node Env:',app.get('env'));
appDebugger('Application name:',config.get('app.name'));
appDebugger('Application version :',config.get('app.version'))

if(app.get('env')==='development')
    app.use(morgan('dev'))
app.use(morgan('dev'))
app.use('/api/students/',student_router);
app.listen(port, () => appDebugger(`Student app listening on port ${port}!`))



module.exports=student_router;



  


