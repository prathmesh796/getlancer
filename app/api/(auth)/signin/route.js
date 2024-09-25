import {connect} from '@/utils/db'
import {User} from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs/dist/bcrypt'

connect()

export async function POST(request) {
    try {
        //await 
        const req = await request.json()
        const {name, email, password, role} = req
        console.log(req)

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User Already exists"}, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 5)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        return NextResponse.json({message: "New User created successfully", success: true}, {status: 200})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}