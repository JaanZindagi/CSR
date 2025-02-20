const express = require("express");
const app = express();
app.use(express.json());

let cars = []; 


app.post("/cars", (req, res) => {
    const { model, brand, available } = req.body;
   const carId = cars.length + 1;
    const newCar = { carId, model, brand, available: true };
    cars.push(newCar);
    res.status(201).json(newCar);
});


app.get("/cars/:carId", (req, res) => {
    const car = cars.find(c => c.carId == req.params.carId);
    if (!car) 
        return res.status(404).json({ message: "Car is not found" });
    res.json(car);
});


app.put("/cars/:carId", (req, res) => {
    const car = cars.find(c => c.carId == req.params.carId);
    if (!car) 
        return res.status(404).json({ message: "Car not found" });

    const { available } = req.body;
    car.available = available;
    res.json({ message: "Car availability updated", car });
});

app.listen(3002, () => console.log("Car Service running on port 3002"));
