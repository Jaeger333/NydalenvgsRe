const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const sqlite3 = require('better-sqlite3')
const db = sqlite3('./users.db', {verbose: console.log})
const session = require('express-session')
const dotenv = require('dotenv'); 
const { create } = require("domain");

dotenv.config()


const saltRounds = 10
const app = express()
const staticPath = path.join(__dirname, 'public')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))



// Define your middleware and routes here


app.use(express.static(staticPath));


app.post('/login', (req, res) => {
    console.log('req.body:', req.body)
    let user = checkUserPassword(req.body.username, req.body.password) 
    if ( user != null) {
        req.session.loggedIn = true
        req.session.username = req.body.username
        req.session.userrole = user.role
        req.session.userid = user.userid
        if (user.role === "Admin") {
            req.session.isAdmin = true
        } else {
            req.session.isAdmin = false
        }

    //res.redirect('/');
    // Pseudocode - Adjust according to your actual frontend framework or vanilla JS

    } 

    if (user == null || !req.session.loggedIn) {
        res.json(null);
    }
    else {res.json(user)}


})

app.get('/users-pcs', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, user.firstname, user.lastname, role.name as roleName, roleId, pcId, computer.id AS computerid, computer.name AS computerName, computer.model, computer.built FROM user INNER JOIN role ON user.roleId = role.id INNER JOIN computer ON user.pcId = computer.id")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/users', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, user.firstname, user.lastname, user.mobile, address.city, address.street, address.zip_code, user.roleId, user.pcId, role.name AS roleName, computer.name AS computerName, computer.built, computer.model FROM user INNER JOIN address ON user.addressId = address.id INNER JOIN role ON user.roleId = role.id INNER JOIN computer ON user.pcId = computer.id")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/students', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT user.id, user.username, user.firstname, user.lastname, user.mobile, address.city, address.street, address.zip_code FROM user INNER JOIN address ON user.addressId = address.id INNER JOIN role ON user.roleId = role.id WHERE role.name = 'Elev'")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/pcs', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT id, name, built, model FROM computer")
    let rows = sql.all()
    
    res.send(rows)
})

app.get('/roles', checkLoggedIn, (req, res) => {
    const sql = db.prepare("SELECT id, name FROM role")
    let rows = sql.all()
    
    res.send(rows)
})

app.post('/register', checkLoggedIn, checkIsAdmin, (req, res) => {
    console.log("registerUser", req.body);
    const reguser = req.body;
    reguser.username = createUsername(reguser.firstname, reguser.lastname)
    const user = addUser(reguser.username, reguser.firstname, reguser.lastname, reguser.password, 1, 1, 1, 1, reguser.mobile)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});

app.post('/selfRegister', (req, res) => {
    console.log("selfRegisterUser", req.body);
    const reguser = req.body;
    reguser.username = createUsername(reguser.firstname, reguser.lastname)
    const user = selfAddUser(reguser.username, reguser.firstname, reguser.lastname, reguser.password, reguser.mobile)
    // Redirect to user list or confirmation page after adding user
    res.redirect('/');
});


app.post("/updateUser", checkLoggedIn, (req, res) => {
    console.log(req.body)
    const user = req.body
    if (user.password != "") {
        updateUserDB2(user.userID, user.username, user.firstname, user.lastname, user.mobile, user.password, user.pc, user.role)
    } else {
        updateUserDB(user.userID, user.username, user.firstname, user.lastname, user.mobile, user.pc, user.role)
    }
    res.redirect('/');
})

function updateUserDB(id, username, firstname, lastname, mobile, pc, role) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), mobile=(?), pcId=(?), roleId=(?) WHERE id=(?)")
    const info = sql.run(username, firstname, lastname, mobile, pc, role, id)
}

function updateUserDB2(id, username, firstname, lastname, mobile, password, pc, role) {
    const sql = db.prepare("update user set username=(?), firstname=(?), lastname=(?), mobile=(?), password=(?), pcId=(?), roleId=(?) WHERE id=(?)")

    const hash = bcrypt.hashSync(password, saltRounds);

    const info = sql.run(username, firstname, lastname, mobile, hash, pc, role, id)
}

app.post("/updateUsersPcs", checkLoggedIn, (req, res) => {
    console.log(req.body)
    const user = req.body
    updateUserPcDB(user.userID, user.pc)
    res.redirect('/it.html');
})

function updateUserPcDB(id, pc) {
    const sql = db.prepare("update user set pcId=(?) WHERE id=(?)")
    const info = sql.run(pc, id)
}


function addUser(username, firstname, lastname, password, addressId, roleId, pcId, permissionId, mobile) {
    //Denne funksjonen må endres slik at man hasher passordet før man lagrer til databasen
    //rolle skal heller ikke være hardkodet.
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username, firstname, lastname, password, addressId, roleId, pcId, permissionId, mobile) " + 
                         " values (?, ?, ?, ?, ?, ?, ?, ?, ?)")
    const info = sql.run(username, firstname, lastname, hash, addressId, roleId, pcId, permissionId, mobile)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userId, user.username, role.name AS role FROM user INNER JOIN role on user.roleId = role.id WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  

    return rows[0]
}

function selfAddUser(username, firstname, lastname, password, mobile) {
    //Denne funksjonen må endres slik at man hasher passordet før man lagrer til databasen
    //rolle skal heller ikke være hardkodet.
    const saltRounds = 10
    const hash = bcrypt.hashSync(password, saltRounds)
    let sql = db.prepare("INSERT INTO user (username, firstname, lastname, password, roleId, mobile) " + 
                         " values (?, ?, ?, ?, ?, ?)")
    const info = sql.run(username, firstname, lastname, hash, 6, mobile)
    
    //sql=db.prepare('select user.id as userid, username, task.id as taskid, timedone, task.name as task, task.points from done inner join task on done.idtask = task.id where iduser = ?)')
    sql = db.prepare('SELECT user.id as userId, user.username, role.name AS role FROM user INNER JOIN role on user.roleId = role.id WHERE user.id  = ?');
    let rows = sql.all(info.lastInsertRowid)  

    return rows[0]
}

function createUsername(firstname, lastname) {
    const firstPart = firstname.substring(0, 3).toLowerCase()
    const secondPart = lastname.substring(0, 3).toLowerCase()
    const username = firstPart + secondPart
    return username
}


function checkUserPassword(username, password){
    console.log(username, password)
    const sql = db.prepare('SELECT user.id as userid, user.username, role.name as role, password FROM user inner join role on user.roleId = role.id WHERE username  = ?');
    let user = sql.get(username);
    if (user && bcrypt.compareSync(password, user.password)) {
        return user 
    } else {
        null;
    }
    /*if (user && bcrypt.compareSync(password, user.password)) {
        return user 
    } else {
        null;
    }*/
}

function checkLoggedIn(req, res, next) {
    console.log('CheckLoggedIn')
    if (!req.session.loggedIn) {
        res.sendFile(path.join(__dirname, "./public/login.html"));
    } else {
        next();
    }

}

function checkIsAdmin(req, res, next) {
    console.log('checkIsAdmin')
    if (!req.session.isAdmin) {
        res.sendFile(path.join(__dirname, "/public/app.html"));
    } else {
        next();
    }

}



app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

app.get('/', checkLoggedIn,(req, res) => {
    if (req.session.userrole == 'Admin') {
        res.sendFile(path.join(__dirname, "public/admin.html"));
    } else {
        res.sendFile(path.join(__dirname, "public/app.html"));
    }
});

  


//denne må defineres etter middleware. 
//Jeg prøvde å flytte den opp, for å rydde i koden og da fungerte det ikke
app.use(express.static(staticPath));


app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});





