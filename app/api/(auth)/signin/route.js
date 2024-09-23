import {connect} from '@/utils/db'
import {User} from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

connect()

export async function POST(request) {
    try {
        const req = await request.json()
        const {email, password, role} = req
        console.log(req)

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User Already exists"}, {status: 400})
        }

        const newUser = new User({
            email,
            password,
            role,
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        return NextResponse.json({message: "New User created successfully", success: true})
    } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}