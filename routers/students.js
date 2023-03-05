const express = require('express');
const router = express.Router();
const { studentSchema, studentupdateSchema } = require('../models/student');
const fs = require('fs');

const studentsFile = 'students.json';

//router.use('/api/students', student_router);

function readJSONFile(filename, callback) {
    fs.readFile(filename, (err, data) => {
        if (err) {
            callback([]);
        } else {
            try {
                callback(JSON.parse(data));
            } catch (error) {
                callback([]);
            }
        }
    });
}

function writeJSONFile(filename, data, callback) {
    fs.writeFile(filename, JSON.stringify(data), callback);
}

router.get('/:nom', (req, res) => {
    readJSONFile(studentsFile, (data) => {
        res.send(data);
    });
});


router.get('/:nom', (req, res) => {
    const studentnom = req.params.nom;
    readJSONFile(studentsFile, (data) => {
        const student = data.find((std) => std.nom === studentnom);
        if (student) {
            res.send(student);
        } else {
            res.status(404).send(studentnom);
        }
    });
});


router.post('/add', (req, res) => {
    const existUsers = getUserData()
    const userData = req.body
    existUsers.push(userData)
    saveUserData(existUsers);
    res.send({ success: true, msg: 'User data added successfully' })
})



const getUserData = () => {
    const jsonData = fs.readFileSync('students.json')
    return JSON.parse(jsonData)
}

const saveUserData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync('students.json', stringifyData)
}

router.delete('/delete/:nom', (req, res) => {
    fs.readFile(dataPath, 'utf8', (err, data) => {
        var existAccounts = getUserData()
        const nom = req.params['nom'];
        delete existAccounts[nom];
        saveUserData(existAccounts);
        res.send(nom)
    }, true);
})


router.patch('/update/:nom', (req, res) => {
    const studentnom = req.params.studentnom
    const userData = req.body
    const existUsers = getUserData()
    const findExist = existUsers.find(user => user.studentnom === studentnom)
    if (!findExist) {
        return res.status(409).send({ error: true, msg: 'studentnom not exist' })
    }
    const updateUser = existUsers.filter(user => user.studentnom !== studentnom)
    updateUser.push(userData)
    saveUserData(updateUser)
    res.send({ success: true, msg: 'studentnom data updated successfully' })
})


function addModuleToStudent(student, module) {
    student.modules.push(module);
    let total = 0;
    student.modules.forEach((m) => {
        total += m.note;
    });
    student.average = total / student.modules.length;
}
router.get('/addmodule/:nom', addModuleToStudent);


function updateStudentAverage(req, res, next) {
    const studentnom = parseInt(req.params.nom);
    readJSONFile(studentsFile, (data) => {
        const student = data.find((s) => s.id === studentnom);
        if (student) {
            let total = 0;
            student.modules.forEach((m) => {
                total += m.grade;
            });
            student.average = total / student.modules.length;
            writeJSONFile(studentsFile, data, () => {
                next();
            });
        } else {
            res.status(404).send(student.nom);
        }
    });
}
router.get('/updateavg/:nom', updateStudentAverage);

function WorstBestGrades(req, res) {
    const students = getUserData();
    const nom = req.params.nom;
    for (let student of students) {
        if (student.nom === nom) {
            let bestGrade = 0;
            let worstGrade = 20;
            for (let module of student.modules) {
                if (module.note > bestGrade) {
                    bestGrade = module.note;
                }
                if (module.note < worstGrade) {
                    worstGrade = module.note;
                }
            }
            res.json({
                nom: student.nom,
                bestGrade: bestGrade,
                worstGrade: worstGrade
            });
            return;
        }
    }
    res.status(404).json({ message: 'Student not found' })
}
router.get('/note/:nom', WorstBestGrades);



router.get('/average/all', (req, res) => {
    const students = getUserData()
    total = 0;
    index = 0;
    for (let student of students) {

        total += student.moyenne
        index += 1;
    }

    res.json({
       
        total: total / index
    });

    return;
})


module.exports = router;