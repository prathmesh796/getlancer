import { connect } from '@/utils/db'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'

export async function POST(request) {
    try {
        let conn = await connect()
        const req = await request.json()
        const {Name: name, email, password, role} = req
        //console.log(role)

        const user = await User.findOne({email})
        if(user){
            return NextResponse.json({error: "User Already exists"}, {status: 400})
        }

        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
        })

        //console.log(newUser)

        const savedUser = await User.create(newUser)
        //console.log(savedUser)

        return NextResponse.json({message: "New User created successfully", success: true}, {status: 200})
    } catch (error) {
        console.error(error )
        return NextResponse.json({error: error.message}, {status: 500})
    }
}