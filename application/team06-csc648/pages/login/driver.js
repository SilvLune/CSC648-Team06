import {useState, useRef, useEffect} from "react";
import Link from 'next/link';
import NavBar from '../components/navBar';
import styles from '@/styles/Login.module.css'
import passwordUtils from '../utils/passwordUtils'
import axios from "axios";
import {useRouter} from 'next/router'

export default function DriverLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const emailInput = useRef();
    const emailMessage = useRef();
    const passwordInput = useRef();
    const passwordMessage = useRef();
    const router = useRouter()
    
    useEffect(() => {
        async function getSession(){
          try{
            let tempSession = await axios.get(`/api/get-user`)
            if(tempSession.data.user == undefined){
              return
            }
            //console.log(JSON.stringify(tempSession))
      
            if(tempSession.data.user.customer_id != undefined){
                window.location.href = `/`;
                return
            }
            if(tempSession.data.user.restaurant_id != undefined){
              window.location.href = `/home/restaurant/${tempSession.data.user.restaurant_id}`;
              return
            }
            if(tempSession.data.user.driver_id != undefined){
              window.location.href = `/home/driver/${tempSession.data.user.driver_id}`;
              return
            }
          }catch(err){
              console.log(err)
          }
        }
        
        getSession()
    }, [])

    const validateEmail = () =>{
        emailMessage.current.style.display = 'none';
        emailInput.current.style.border ='black 1px solid';
        setValidEmail(false);

        let emailPattern = /^([^\s])+@([^\s]+\.)*([^\s]+)\.([a-zA-Z]+)$/;

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
                const response = await axios.get(`/api/drivers_get_email?email=${email}`)
                const user = response.data[0]
                const valid = passwordUtils.validPassword(password, user.hash, user.salt)
                if(valid){
                    const response2 = await axios.get(`/api/drivers_login?driver_id=${user.driver_id}&email=${email}`)
                    console.log(response2)
                    router.push(`/home/driver/${user.driver_id}`)
                }
            }catch(err){
                console.log(err)
            }
        } else{
            validateEmail();
            validatePassword();
        }
    }
  
    return (
        <div>
            <NavBar/>
            <div className={styles.form}>
                <h1>Gateway Driver Login</h1>
                <div>
                    <input className={styles.floating}
                        id={styles.email}
                        value={email} placeholder='Email'
                        onChange={e => setEmail(e.target.value)}
                        onBlur={validateEmail}
                        ref={emailInput}
                        required/>
                    <div id={styles.emailMessage} ref={emailMessage}>Please enter a valid email</div>
                </div>
                <div>
                    <input className={styles.floating}
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
                    <button className={styles.signInUpButton} onClick={login}>Login</button>
                </div>
                <div>
                    <p>Don't have an account?</p>
                    <Link href='../../signup/driver'><button className={styles.signInUpButton}>Sign up</button></Link>
                </div>
            </div>
        </div>
    )
}