const db = require("../database")

exports.getAllUsers = function (req, res) {
	db.all("SELECT * FROM users", [], (err, rows) => {
		if (err) {
			res.status(500).json({ error: err.message })
		} else {
			res.json(rows)
		}
	})
}


exports.createNewUser = (req, res) => {
    const {firstName, lastName}= req.body
    function isAlphanumeric(str) {
        const regex = /^[a-zA-Z0-9]+$/
        return regex.test(str)
    }
    if (typeof firstName !=="string")
        return res.status(400).json({ error: "That name is not allowed !" })
    if (!firstName || !lastName)
		return res
			.status(400)
			.json({ error: "The first name and last name are required !" })
    if (!isAlphanumeric(firstName))
		return res.status(400).json({ error: "That name is not allowed !" })
    if (!firstName) return res.status(400).json({error: "the first name is required"})
    

    db.run(
		"INSERT INTO users (firstName,lastName ) VALUES (?, ?)",
		[firstName, lastName],
		function (err) {
			if (err) {
				res.status(500).json({ error: err.message })
			} else {
				res.status(201).json({ id: this.lastID, firstName })
			}
		}
	)
}

// POST update a user based on its ID
exports.updateUser = (req, res) => {
	const { firstName, lastName } = req.body

	// get the id from the params
	const userId = req.params.id

	// check what fields are sent
	let updateFields = []
	let queryParams = []

	if (firstName) {
		updateFields.push("firstName = ?")
		queryParams.push(firstName)
	}

	if (lastName) {
		updateFields.push("lastName = ?")
		queryParams.push(lastName)
	}

	if (updateFields.length > 0) {
		// Add userId to the query parameters
		queryParams.push(userId)

		// Build the query dynamically
		const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`

		db.run(query, queryParams, function (err) {
			if (err) {
				res.status(500).json({ error: err.message })
			} else if (this.changes === 0) {
				res.status(404).json({ message: "User not found" })
			} else {
				res.json({ msg: "User updated", userId, firstName, lastName })
			}
		})
	} else {
		res.status(400).json({ message: "No fields to update" })
	}
}

exports.deleteUser = (req, res) => {
	// get the id from the params
	const { id } = req.params
	// run the query
	db.run("DELETE FROM users WHERE id = ?", [id], function (err) {
		if (err) {
			res.status(500).json({ error: err.message })
		} else if (this.changes === 0) {
			// if nothing found
			res.status(404).json({ message: "User not found" })
		} else {
			// is successful
			res.status(200).json({ message: "User deleted !" })
		}
	})
}