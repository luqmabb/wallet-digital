import express from "express";
import * as dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express() 
dotenv.config()

app.get('/', (req, res) => {
    res.send('success')
})

app.get('/wallet/:id', async(req, res) => {
    try {
        const data = await prisma.users.findUnique({
            where: {id: Number(req.params.id)}
        })
        res.json(data)
    } catch (error) {
        res.json(error)
    }
})

app.get('/decrease', (req, res) => {

})

app.listen(process.env.PORT, () => {
    console.log('server running on port ' + process.env.PORT)
})

