import Link from 'next/link'
import NavBar from "../navBar"
import React,{useState} from 'react'

export default function LoginPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [building, setBuilding] = useState('')
    const [room, setRoom] = useState('')

    const handleFormSubmit = (event) =>{
        event.preventDefault()
        console.log("Username: ", username)
        console.log("Password: ", password)
        console.log("Name: ", name)
        console.log("Email: ", email)
        console.log("Phone: ", phone)
        console.log("Building: ", building)
        console.log("Room: ", room)
    }

    return(
        <main>
            <NavBar/>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <label>Username</label>
                    <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <br/>

                    <label>Password</label>
                    <input type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <br/>

                    <label>Name</label>
                    <input type='text' value={name} onChange={(e)=>setName(e.target.value)}/>
                    <br/>

                    <label>Email</label>
                    <input type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <br/>

                    <label>Phone</label>
                    <input type='tel' value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                    <br/>

                    <label>Building</label>
                    <input type='text' value={building} onChange={(e)=>setBuilding(e.target.value)}/>
                    <br/>

                    <label>Room</label>
                    <input type='text' value={room} onChange={(e)=>setRoom(e.target.value)}/>
                    <br/>

                    <button type='submit'>Submit</button>
                </form>
                <Link href='/entrance/login'>Log In</Link>
            </div>
        </main>
    )
}