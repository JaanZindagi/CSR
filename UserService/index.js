const express = require("express");
const app = express();
app.use(express.json());

let users = []; 


app.post("/users", (req, res) => {
    const { name, email } = req.body;
    const userId = users.length + 1;
    const newUser = { userId, name, email, maxBookings: 3, activeBookings: 0 };
    users.push(newUser);
    return res.status(200).json({ message: "User Successfully Created! Below are Details" });
    res.status(201).json(newUser);
});


app.get("/users/:userId", (req, res) => {
    const user = users.findbyid(u => u.userId == req.params.userId);
    if (!user) 
        return res.status(404).json({ message: "User not found" });
    res.json(user);
});


app.put("/users/:userId", (req, res) => {
    const user = users.find(u => u.userId == req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { activeBookings } = req.body;
    if (activeBookings > user.maxBookings) return res.status(400).json({ message: "Booking limit exceeded" });

    user.activeBookings = activeBookings;
    res.json({ message: "Booking count updated", user });
});


app.listen(3001, () => console.log("User Service running on port 3001"));
