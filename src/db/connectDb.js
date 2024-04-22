import Mongoose from "mongoose";


export default async function(){
    try {
        const connectin = await Mongoose.connect(`${process.env.MONGODB_URI}/habit`)
        console.log("host: " ,connectin.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}