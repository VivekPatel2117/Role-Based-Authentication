const express = require('express');
const app = express();
const port = process.env.port || 8000;
const path = require('path');
const mongoose = require('mongoose');
require('./model/user')
const userDB=mongoose.model("userDB");
app.use(express.json());
app.use(express.urlencoded({extended:true}))


mongoose.connect("mongodb+srv://v1374:Viveksam2113@cluster0.uj4htru.mongodb.net/register");
mongoose.connection.on("connected", () => {
    console.log("Connected");
});
mongoose.connection.on("error", () => {
    console.log("Not Connected");
});
app.use(express.static(path.join(__dirname, "./frontend/")));

app.get("/", (req, res) => {
    res.sendFile(
        path.join(__dirname, "./frontend/index.html"),
        function (err) {
            res.status(500).send(err);
        }
    );
});

app.listen(port, () => {
    console.log("Server is running on " + port);
});
app.post("/USER", async (req, res) => {
    try {
        const { UserId, Password } = req.body;
    
        // Check if a user with the same UserId already exists
        const existingUser = await userDB.findOne({ UserId });
        
        if (existingUser) {
            if (existingUser.Password === Password) {
                // User exists, redirect to user.html
                return res.status(200).json({success:"User Logged in",user:existingUser.UserId});
            } else {
                return res.status(422).json({ error: "Invalid Credentials" });
            }
        } else {
            // User doesn't exist, save the new user
            // const newUser = new userDB({
            //     UserId,
            //     Password
            // });
    
            // const savedUser = await newUser.save();
            // console.log("New User:", savedUser);
    
            // Send a success response
            return res.status(200).json({ error: "User not Found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/Admin-USER", async (req, res) => {
    try {
        const { UserId, Password ,Name,Approval} = req.body;
    
        // Check if a user with the same UserId already exists
        const existingUser = await userDB.findOne({ UserId });
        
        if (existingUser) {
            if (existingUser.Password === Password) {
                // User exists, redirect to user.html
                return res.status(200).json({error:"User Already Exists",user:existingUser.UserId});
            } else {
                return res.status(422).json({ error: "UserId already Exists" });
            }
        } else {
            // User doesn't exist, save the new user
            const newUser = new userDB({
                UserId,
                Password,
                Name,
                Approval,
            });
    
            const savedUser = await newUser.save();
            console.log("New User:", savedUser);
    
            // Send a success response
            return res.status(200).json({ success: "User created successfully",user:savedUser.UserId });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post('/update-photo/:userId',async (req, res) => {
    try {
      const UserId = req.params.userId;
      const { Name, Photo } = req.body;

       // Find the user by userId
    const user = await userDB.findOne({ UserId });
    console.log(req.body)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's Name and Photo
    user.Name = Name;
    user.Photo = Photo;

    // Save the updated user to the database
    await user.save();

    // Send a success response with the updated user data
    res.status(200).json({ success: 'Photo and Name Uploaded successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/update-Approval/:userId',async (req, res) => {
    try {
      const UserId = req.params.userId;
      const { Approval } = req.body;

       // Find the user by userId
    const user = await userDB.findOne({ UserId });
    console.log(req.body)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's Name and Photo
    user.Approval=Approval;

    // Save the updated user to the database
    await user.save();

    // Send a success response with the updated user data
    res.status(200).json({ success: 'Approval Updated successfully', user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// app.post('/Admin-approval/:USER_ID',async (req, res) => {
//     try {
//       const UserId = req.params.userId;
//       const { Approval} = req.body;

//        // Find the user by userId
//     const user = await userDB.findOne({ UserId });
//     console.log(req.body)
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     user.Approval=Approval;

//     // Save the updated user to the database
//     await user.save();

//     // Send a success response with the updated user data
//     res.status(200).json({ success: 'Approval Status Approved successfully', user });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get('/user/:userId',async (req, res) => {
    try {
        const UserId = req.params.userId;
        // const { Name, Photo } = req.body;
  
         // Find the user by userId
      const user = await userDB.findOne({ UserId });
      console.log(UserId+"\n"+"\n"+req.params.userId+"\n"+user)
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
 
      // Send a success response with the updated user data
      res.status(200).json({ success: ' successfully', user });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/Admin-delete/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find and delete the user by UserId
      const deletedUser = await userDB.findOneAndDelete({ UserId: userId });
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

app.get("/Allusers",(req,res)=>{
    try {
        const users=userDB.find().sort({ timestamp: -1 });
        console.log(users);
        return res.status(200).json({success:"All users:",user:users})
    } catch (error) {
        return res.status(404).json({error:error})
        
    }
})
// app.set('view engine', 'ejs');
app.get("/Admin/Allusers", async (req, res) => {
    try {
        const users = await userDB.find().sort({ timestamp: -1 }); // Add lean() to convert MongoDB documents to plain JavaScript objects
        // console.log(users);
        return res.status(500).json({ success: "All users:", user: users });
    } catch (error) {
        return res.status(404).json({ error: error });
    }
});

