const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 8081;

app.use(express.json());

const file = './user.json';

function readUserData() {
    const jsonData = fs.readFileSync(file);
    return JSON.parse(jsonData);
}

function writeUserData(userData) {
    const stringData = JSON.stringify(userData, null, 2);
    fs.writeFileSync(file, stringData);
}

// Get all user details
app.get('/users', (req, res) => {
    try {
        const userDetail = readUserData();
        res.status(200).json({
            message: "Users retrieved",
            success: true, userDetail
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get user by id
app.get("/users/:id", (req, res) => {
    try {
        const userId = req.params.id;
        const userDetail = readUserData();
        const userById = userDetail.users.find((user) => user.id === userId);

        if (!userById) {
            res.status(404).json({ message: 'User not found' });
        } else {
            res.status(200).json({ success: true, user: userById });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a new user
app.post('/add', (req, res) => {
    try {
        const newEmail = req.body.email;
        const newFirstName = req.body.firstName;
        const userDetail = readUserData();

        if (userDetail.users.some((user) => user.email === newEmail)) {
            return res.status(409).json({ message: "This email is already in use." });
        }

        const newUser = {
            email: newEmail,
            firstName: newFirstName,
            id: uuidv4().slice(0, 8)
        };
        userDetail.users.push(newUser);
        writeUserData(userDetail);

        res.status(201).json({
            message: 'User added',
            success: true,
            user: newUser
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user details
app.put('/update/:id', (req, res) => {
    try {
        const userId = req.params.id;
        const { email, firstName } = req.body;
        const userDetail = readUserData();
        const userIndex = userDetail.users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            userDetail.users[userIndex] = {
                ...userDetail.users[userIndex],
                email: email,
                firstName: firstName
            };
            writeUserData(userDetail);
        } else {
            return res.status(404).json({ message: "No user with this id found" });
        }

        res.status(200).json({
            message: 'User updated',
            success: true,
            user: userDetail.users[userIndex]
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

// Handle any other routes
app.all('*', (req, res) => {
    res.status(404).json({ message: 'route not found' });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
