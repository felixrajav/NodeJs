const express = require("express");
const bodyparser = require("body-parser");

const app = express();

const PORT =8080

app.use(bodyparser.json())

const rooms = [];

const bookings = [];

app.get('/',(req,res)=>{
    res.json(rooms) 
})

app.get('/booked',(req,res)=>{
    res.json(bookings)
})

// 1. creat a rooms

app.post('/rooms',(req, res)=>{
    const {name, seatsAvailable, amenties, pricePerHour } = req.body;
    const room ={
        id:rooms.length+1,
        name,
        seatsAvailable,
        amenties,
        pricePerHour
    };
    rooms.push(room)
    res.status(201).send(`Item added with :${name}`);
    console.log(rooms);
})

// 2. book a room

app.post('/bookings',(req,res)=>{
    const { customerName, date, startTime, endTime, roomId } = req.body;
    // Check if the room is available for the given date and time

    const conflictingBooking = bookings.find(
        (booking) =>
          booking.roomId === roomId &&
          booking.date === date &&
          ((startTime >= booking.startTime && startTime < booking.endTime) ||
            (endTime > booking.startTime && endTime <= booking.endTime))
      );
    
      if (conflictingBooking) {
        return res.status(400).json({ error: 'Room is already booked for this time' });
      }
      const booking = {
        id: bookings.length + 1,
        customerName,
        date,
        startTime,
        endTime,
        roomId,
        status: 'Booked',
      };
      bookings.push(booking);
      res.status(201).json(booking)

})

// 3. List all Rooms with Booked Data
app.get('/rooms', (req, res) => {
  const roomData = rooms.map((room) => {
    const booking = bookings.find((booking) => booking.roomId === room.id);
    const bookedStatus = booking ? 'Booked' : 'Available';
    const customerName = booking ? booking.customerName : null;
    const date = booking ? booking.date : null;
    const startTime = booking ? booking.startTime : null;
    const endTime = booking ? booking.endTime : null;

    return {
      RoomName: room.name,
      BookedStatus: bookedStatus,
      CustomerName: customerName,
      Date: date,
      StartTime: startTime,
      EndTime: endTime,
    };
  });

  res.status(200).json(roomData);
});

// 4. List all Customers with Booked Dates
app.get('/customers', (req, res) => {
    const customerData = bookings.map((booking) => ({
      CustomerName: booking.customerName,
      Date: booking.date,
      StartTime: booking.startTime,
      EndTime: booking.endTime,
    }));
  
    res.status(200).json(customerData);
  });

  // 5. List Booking Details for a Customer
app.get('/bookings/:customerName', (req, res) => {
    const customerName = req.params.customerName;
    const customerBookings = bookings.filter(
      (booking) => booking.customerName === customerName
    );
  
    res.status(200).json(customerBookings);
  });

app.listen(PORT,function(error){
    if(error){
        console.log("somthing wants wrong:",error)
    }else{
        console.log("The Server is listening on port :",PORT)
    }
})