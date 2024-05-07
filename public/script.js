const studentsDiv = document.getElementById('students')
const usersDiv = document.getElementById('users')
const usersPcsDiv = document.getElementById('usersPcs')

const studentsTable = document.getElementById('studentsTable')
const usersTable = document.getElementById('usersTable')


async function main() {
    console.log("main")
    await fetchData()
}

async function fetchData() {
    console.log ("fetchData")

    await fetchStudents()
    await fetchUsers()
    await fetchUsersPcs()
}

document.addEventListener('DOMContentLoaded', main)

async function fetchUsersPcs() {
    try {
        console.log("fetchUsersPcs")
        const response = await fetch('/users-pcs')
        const response2 = await fetch('/pcs')

        users = await response.json()
        pcs = await response2.json()
        populateUsersPcs(users)
        populateUsersPcsTable(users, pcs)
    } catch (error) {
        console.log("fetchUsersPcs error: " + error)
    }
}

function populateUsersPcs(users) {
    usersPcsDiv.innerHTML = ''
    for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option')
        option.value = users[i].id
        option.textContent = users[i].username
        usersPcsDiv.appendChild(option)
    }
}

function populateUsersPcsTable(students, pcs) {
    const sortedStudents = students.slice().sort((a, b) => a.username.localeCompare(b.username));
    const tableBody = document.getElementById('usersPcstbody');
    tableBody.innerHTML = ""; // Clear existing rows
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.username}</td>
            <td>${user.roleName}</td>
            <td>${user.computerName}: ${user.model} - ${user.built} (${currentYear - user.built} år gammel)</td>
        `;

        newRow.addEventListener('click', () => {
            const editForm = document.getElementById('editFormUsersPcs');
            editForm.pc.innerHTML = "";
            editForm.role.innerHTML = "";


            editForm.userID.value = user.id;
            editForm.firstname.value = user.firstname;
            editForm.lastname.value = user.lastname;
            editForm.username.value = user.username;


            const selectedOption = document.createElement("option");
            selectedOption.value = user.pcId;
            selectedOption.textContent = user.computerName;
            editForm.pc.appendChild(selectedOption);
            
            const selectedOption2 = document.createElement("option");
            selectedOption2.value = user.roleId;
            selectedOption2.textContent = user.roleName;
            editForm.role.appendChild(selectedOption2);

            pcs.forEach(pcItem => {
                if (pcItem.id !== user.pcId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = pcItem.id;
                    option.textContent = pcItem.name;
                    editForm.pc.appendChild(option);
                }
            });

        });
        tableBody.appendChild(newRow);
    }
}

async function fetchUsers() {
    try {
        console.log("fetchUsers")
        const response = await fetch('/users')
        const response2 = await fetch('/pcs')
        const response3 = await fetch('/roles')

        users = await response.json()
        pcs = await response2.json()
        roles = await response3.json()
        console.log("users" + users)
        populateUsers(users)
        populateUsersTable(users, pcs, roles)
    } catch (error) {
        console.log("fetchUsers error: " + error)
    }
}

function populateUsers(users) {
    usersDiv.innerHTML = ''
    for (let i = 0; i < users.length; i++) {
        const option = document.createElement('option')
        option.value = users[i].id
        option.textContent = users[i].username
        usersDiv.appendChild(option)
    }
}

function populateUsersTable(students, pcs, roles) {
    const sortedStudents = students.slice().sort((a, b) => a.username.localeCompare(b.username));
    const tableBody = document.getElementById('userstbody');
    tableBody.innerHTML = ""; // Clear existing rows
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.username}</td>
            <td>${user.street}, ${user.zip_code} ${user.city} </td>
            <td>${user.mobile}</td>
            <td>${user.roleName}</td>
            <td>${user.computerName}: ${user.model} - ${user.built} (${currentYear - user.built} år gammel)</td>
        `;

        newRow.addEventListener('click', () => {
            const editForm = document.getElementById('editForm');
            editForm.pc.innerHTML = "";
            editForm.role.innerHTML = "";


            editForm.userID.value = user.id;
            editForm.firstname.value = user.firstname;
            editForm.lastname.value = user.lastname;
            editForm.username.value = user.username;
            editForm.address.value = user.street;
            editForm.mobile.value = user.mobile;


            const selectedOption = document.createElement("option");
            selectedOption.value = user.pcId;
            selectedOption.textContent = user.computerName;
            editForm.pc.appendChild(selectedOption);
            
            const selectedOption2 = document.createElement("option");
            selectedOption2.value = user.roleId;
            selectedOption2.textContent = user.roleName;
            editForm.role.appendChild(selectedOption2);

            pcs.forEach(pcItem => {
                if (pcItem.id !== user.pcId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = pcItem.id;
                    option.textContent = pcItem.name;
                    editForm.pc.appendChild(option);
                }
            });

            roles.forEach(roleItem => {
                if (roleItem.id !== user.roleId) { // Exclude the current class
                    const option = document.createElement("option");
                    option.value = roleItem.id;
                    option.textContent = roleItem.name;
                    editForm.role.appendChild(option);
                }
            });
        });
        tableBody.appendChild(newRow);
    }
}


async function fetchStudents() {
    try {
        console.log("fetchStudents")
        const response = await fetch('/students')

        students = await response.json()
        console.log("students" + students)
        populateStudents(students)
        populateStudentsTable(students)
    } catch (error) {
        console.log("fetchStudents error: " + error)
    }
}

function populateStudents(students) {
    studentsDiv.innerHTML = ''
    for (let i = 0; i < students.length; i++) {
        const option = document.createElement('option')
        option.value = students[i].id
        option.textContent = students[i].username
        studentsDiv.appendChild(option)
    }
}

function populateStudentsTable(students) {
    const sortedStudents = students.slice().sort((a, b) => a.username.localeCompare(b.username));
    const tableBody = document.getElementById('studentstbody');
    tableBody.innerHTML = ""; // Clear existing rows

    for (let i = 0; i < sortedStudents.length; i++) {
        const user = sortedStudents[i];
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${user.firstname}</td>
            <td>${user.lastname}</td>
            <td>${user.username}</td>
            <td>${user.street}, ${user.zip_code} ${user.city} </td>
            <td>${user.mobile}</td>
        `;
        tableBody.appendChild(newRow);
    }
}

