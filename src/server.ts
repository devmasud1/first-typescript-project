import app from './app'
import config from './app/config'
import mongoose from 'mongoose'
import { Server } from 'http'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.database_url as string)

    server = app.listen(config.port, () => {
      console.log(`ph university running on port ${config.port}`)
    })
  } catch (err) {
    console.log('server error', err)
    process.exit(1)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log(`unhandledRejection - shutting down the server.....`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  } else {
    process.exit(1)
  }
})

process.on('uncaughtException', () => {
  console.log(`uncaughtException is detected - shutting down the server.....`)
  process.exit()
})
