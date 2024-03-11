const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const PORT = 8080;

app.use(express.json());

let userDetail = {
    message: 'Users retrieved',
    success: true,
    users: [{
        email: 'abc@abc.ca',
        firstName: 'ABC',
        id: '5abf6783'
    },
    {
        email: 'xyz@xyz.ca',
        firstName: 'XYZ',
        id: '5abf674563'
    }]
}


//get user all detail
app.get('/users', (req, res) => {

    try {
        res.status(200).json(userDetail);

    } catch (err) {
        res.status(400).json({ err })
    }

})


//get user by id

app.get("/users/:id", (req, res) => {

    try {
        let userId = req.params.id;

        const userByid = userDetail.users.find((user) => user.id === userId);

        if (!userByid) {
            res.status(401).json({ message: 'User not found' });
        } else {
            res.status(200).json({ success: true, user: userByid });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }


})


//post
app.post('/add', (req, res) => {


    try {
        const newEmail = req.body.email
        const newfirstName = req.body.firstName

        if (userDetail.users.find((user) => user.email === newEmail)) {
            return res.status(409).json({ message: "This email is already in use." })
        } else {

            userDetail.users.push({
                email: newEmail,
                firstName: newfirstName,
                id: uuidv4().slice(0, 8)
            })
        }
        res.status(200).send({
            message: 'User added',
            success: true,
        })
    } catch (error) {
        res.status(500).json({ error: error })
    }

})


//put
app.put('/update/:id', (req, res) => {

    try {

        const userId = req.params.id
        const newEmail = req.body.email
        const newFirstName = req.body.firstName

        const userIndex = userDetail.users.findIndex(user => user.id === userId);

        if (userIndex !== -1) {
            userDetail.users[userIndex] = {
                ...userDetail.users[userIndex],
                email: newEmail,
                firstName: newFirstName
            };
         
        } else {
            return res.status(404).json({ message: "No user with this id found" });
        }

        res.status(200).json({
            message: 'User updated',
            success: true
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
})


//for anyother route
app.all('*', (req, res) => {
    res.status(404).json({  
        message: 'Not found' 
    })
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});