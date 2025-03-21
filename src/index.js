import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
dotenv.config();
console.log(process.env.PORT);

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3000, ()=>{
        console.log("Listening on port " + process.env.PORT);
    })
    app.on("error", (err)=>{
        console.log(`Error connecting to MongoDB: ${err.message}`);
    })
})
.catch((err)=>{
    console.log("MongoDB connection error: ", err);
    process.exit(1);
})
// (async()=>{
//     try {
//         mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error", (err)=>{
//             console.log(`Error connecting to MongoDB: ${err.message}`);
//         })
//         app.listen(process.env.PORT, ()=>{
//             console.log("Listening on port " + process.env.PORT);

//         })
//     } catch (error) {
//         console.log(error.message);

//     }
// })()
