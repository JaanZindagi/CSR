const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

let bookings = []; 



app.post("/bookings", async (req, res) => {
    const { userId, carId } = req.body;

    
    const userResponse = await axios.get(`http://localhost:3001/users/${userId}`).catch(() => null);
    if (!userResponse) return res.status(404).json({ message: "User not found" });
    
    const user = userResponse.data;
    if (user.activeBookings >= user.maxBookings)
         return res.status(400).json({ message: "Booking limit reached" });


    const carResponse = await axios.get(`http://localhost:3002/cars/${carId}`).catch(() => null);
    if (!carResponse) 
        return res.status(404).json({ message: "Car not found" });

    const car = carResponse.data;
    if (!car.available) 
        return res.status(400).json({ message: "Car not available" });


    await axios.put(`http://localhost:3002/cars/${carId}`, { available: false });

   
    await axios.put(`http://localhost:3001/users/${userId}`, { activeBookings: user.activeBookings + 1 });

   
    const bookingId = bookings.length + 1;
    const newBooking = { bookingId, userId, carId };
    bookings.push(newBooking);

    res.status(201).json(newBooking);
});


app.delete("/bookings/:bookingId", async (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.bookingId == req.params.bookingId);
    if (bookingIndex === -1) return res.status(404).json({ message: "Booking not found" });

    const { userId, carId } = bookings[bookingIndex];

    await axios.put(`http://localhost:3002/cars/${carId}`, { available: true });

    const userResponse = await axios.get(`http://localhost:3001/users/${userId}`).catch(() => null);
    if (userResponse) {
        const user = userResponse.data;
        await axios.put(`http://localhost:3001/users/${userId}`, { activeBookings: Math.max(0, user.activeBookings - 1) });
    }

   
    bookings.splice(bookingIndex, 1);
    res.json({ message: "Booking canceled" });
});


app.listen(3003, () => console.log("Booking Service running on port 3003"));
