import dns from 'dns'
import colors from "colors";
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1']) // ← fuerza DNS de Google/Cloudflare
        
        const {connection} = await mongoose.connect(process.env.DATABASE_URL, {
            family: 4
        })
        const { host, name } = connection

        const url = `${connection.host}:${connection.port}/${connection.name}`
        console.log(colors.yellow.bold(`Connected to the database: ${url}`))

    } catch (error) {
        console.log(colors.red.bold(`Error connecting to the database: ${error}`))
        process.exit(1)
    }
}