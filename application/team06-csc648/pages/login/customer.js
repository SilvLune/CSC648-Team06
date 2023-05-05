import {useState, useRef} from "react";
import Link from 'next/link';
import NavBar from '../components/navBar';
import styles from '@/styles/Login.module.css'
import passwordUtil from '../utils/passwordUtils'
import axios from "axios";

export default function CustomerLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const emailInput = useRef();
    const emailMessage = useRef();
    const passwordInput = useRef();
    const passwordMessage = useRef();

    const validateEmail = () =>{
        emailMessage.current.style.display = 'none';
        emailInput.current.style.border ='black 1px solid';
        setValidEmail(false);

        let emailPattern = /^([^\s])+@([^\s]+\.)*sfsu\.edu$/;

        if (email.match(emailPattern) == null){
            emailMessage.current.style.display = 'block';
            emailInput.current.style.border ='red 2px solid';
        } else{
            setValidEmail(true);
        }
    }

    const validatePassword = () => {
        passwordMessage.current.style.display = 'none';
        passwordInput.current.style.border ='black 1px solid';
        setValidPassword(false);

        let passwordPattern = /^\S{4,20}$/;

        if (password.match(passwordPattern) == null){
            passwordInput.current.style.border ='red 2px solid';
            passwordMessage.current.style.display = 'block';
        } else{
            setValidPassword(true);
        }
    }

    const login = async () => {
        if((validEmail == true) && (validPassword == true)){
            // Handle login
            try{
                const response = await axios.get(`/api/customers_get_email?email=${email}`)
                const user = response.data[0]
                const valid = passwordUtil.validPassword(password, user.hash, user.salt)
                if(valid){
                    try{
                        const response = await axios.get(`/api/login?customer_id=${user.customer_id}?email=${user.email}`)
                        console.log(response)
                        //reroute the user NOT DONE
                    }catch(error){
                        console.log(error)
                    }
                }else{
                    console.log('*login* not valid')
                }
            }catch(error){
                console.log(error)
            }

        } else{
            validateEmail();
            validatePassword();
        }
    }
  
    return (
        <div>
            <NavBar/>
            <div>
                <h1>Gateway Login</h1>
                <div>
                    <input 
                        id={styles.email}
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid SFSU email</div>
                </div>
                <div>
                    <input 
                        id={styles.password}
                        type="password" placeholder='Password'
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        onBlur={validatePassword}
                        ref={passwordInput}
                        required/>
                    <div id={styles.passwordMessage} ref={passwordMessage}>Password must be 4-20 characters</div>
                </div>
                <Link href=''><p>Forgot Password?</p></Link>
                <div>
                    <button onClick={login}>Login</button>
                    <Link href='../../signup/customer'><button>Sign up</button></Link>
                </div>
            </div>
        </div>
    )
}