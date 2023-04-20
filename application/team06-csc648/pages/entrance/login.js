import Link from 'next/link'
import React,{useState, useEffect} from 'react'
import NavBar from '../navBar'

export default function LoginPage(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const handleFormSubmit = (event) =>{
        event.preventDefault()
        console.log('Username: ' + username)
        console.log('Password: ' + password)
    }
    return (
        <main>
            <NavBar/>
            <div>
                <form onSubmit={handleFormSubmit}>
                    <label>Username</label>
                    <input type='text' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <br/>
                    <label>Password</label>
                    <input type='text' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <br/>
                    <button type='submit'>Submit</button>
                </form>
                <Link href='/entrance/register'>Register</Link>
            </div>
        </main>   
    )
}