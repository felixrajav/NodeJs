const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose")

const app = express();

const PORT =3000

app.use(bodyparser.json())

const DB_URL = "mongodb+srv://felixraja:felix123@cluster0.d30qt0o.mongodb.net/?retryWrites=true&w=majority";

// connection to mongoDB

mongoose.connect(DB_URL, {})
.then(()=>console.log("connected to mongoDB"))
.catch((err)=>console.log("server could not be connected",err))

// const rooms = [];
const Room = mongoose.model("Room", {
  name: String,
  seatsAvailable: Number,
  amenities: [String],
  pricePerHour: Number,
});

const Booking = mongoose.model("Booking", {
  customerName: String,
  date: Date,
  startTime: String,
  endTime: String,
  roomId: mongoose.Types.ObjectId,
  status: String,
});

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// const bookings = [];

app.get('/',(req,res)=>{ 
    res.json(rooms)  
})

app.get('/booked',(req,res)=>{
    res.json(bookings)
})

/// 1. Create a room
app.post('/rooms', async (req, res) => {
  try {
    const { name, seatsAvailable, amenities, pricePerHour } = req.body;
    
    // Create a new room instance
    const room = new Room({
      name,
      seatsAvailable,
      amenities,
      pricePerHour,
    });

    // Save the room to MongoDB
    await room.save();

    res.status(201).send(`Room added with name: ${name}`);
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
// 2. book a room
app.post('/bookings', async (req, res) => {
  try {
    const { customerName, date, startTime, endTime, roomId } = req.body;

    // Check if the room is available for the given date and time
    const conflictingBooking = await Booking.findOne({
      roomId,
      date,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime },
        },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({ error: 'Room is already booked for this time' });
    }

    // Create a new booking instance
    const booking = new Booking({
      customerName,
      date,
      startTime,
      endTime,
      roomId,
      status: 'Booked',
    });
    await booking.save();

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/rooms', async (req, res) => {
  try {
    // Find all rooms
    const rooms = await Room.find();

    // Map rooms and check if they are booked
    const roomData = await Promise.all(
      rooms.map(async (room) => {
        const booking = await Booking.findOne({ roomId: room._id });
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
      })
    );

    res.status(200).json(roomData);
  } catch (error) {
    console.error('Error fetching rooms with booked data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 4. List all Customers with Booked Dates
app.get('/customers', async (req, res) => {
  try {
    // Find all bookings
    const customerData = await Booking.find({}, {
      customerName: 1,
      date: 1,
      startTime: 1,
      endTime: 1,
      _id: 0
    });

    res.status(200).json(customerData);
  } catch (error) {
    console.error('Error fetching customer data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 5. List Booking Details for a Customer
app.get('/bookings/:customerName', async (req, res) => {
  try {
    const customerName = req.params.customerName;

    // Find all bookings for the specified customer
    const customerBookings = await Booking.find({ customerName });

    res.status(200).json(customerBookings);
  } catch (error) {
    console.error('Error fetching booking details for a customer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT,function(error){
    if(error){
        console.log("somthing wants wrong:",error)
    }else{
        console.log("The Server is listening on port :",PORT)
    }
})