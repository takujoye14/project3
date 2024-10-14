const express = require("express")
const router = express.Router()
const db = require("../database")

router.get("/users", (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.json(rows);
        }
      });
})

//POST METHOD
router.post("/users", (req, res) => {
    const newfirstname= "jack";
    const newlastname= "jill";
    const newId = usersArray.length ? usersArray[usersArray.length - 1].id + 1 : 1;
    const newUser = {
        id: newId,
        fn:newfirstname,
        ln:newlastname
    };

    usersArray.push(newUser);

    res.status(201).json(newUser);
});


// PUT METHOD
router.put("/users/:id", (req, res) => {
	const { firstName, lastName } = req.body

	res.json({
		msg: "This the message from PUT ",
		firstName,
		lastName,
	})
})

// DELETE METHOD
router.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    const userIndex = usersArray.findIndex(user => user.id === parseInt(id));

    if (userIndex !== -1) {
        const deletedUser = usersArray.splice(userIndex, 1);
        res.json({
            message: "User deleted successfully",
            user: deletedUser[0]
        });
    } else {
        res.status(404).json({ message: "User not found" });
}
})



module.exports = router