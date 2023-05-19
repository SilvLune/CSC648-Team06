import {useState, useRef, useEffect} from "react";
import NavBar from '../components/navBar';
import styles from '@/styles/Signup.module.css'
import axios from 'axios';

export default function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [logo, setLogo] = useState('');
    const [signupMessage, setSignupMessage] = useState('');

    const [dishInputs, setDishInputs] = useState([])
    const [dishInputCount, setDishInputCount] = useState(-1)
    const [dishNames, setDishNames] = useState([])
    const [dishPrices, setDishPrices] = useState([])
    const [dishPictures, setDishPictures] = useState([])
    const [dishPicSizes, setDishPicSizes] = useState([])
    const [dishDescriptions, setDishDescriptions] = useState([])

    const [validName, setValidName] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validPassword2, setValidPassword2] = useState(false);
    const [validPhone, setValidPhone] = useState(false);
    const [validAddress, setValidAddress] = useState(false);
    const [validLogo, setValidLogo] = useState(false);
    
    const emailInput = useRef();
    const passwordInput = useRef();
    const password2Input = useRef();
    const nameInput = useRef();
    const phoneInput = useRef();
    const addressInput = useRef();

    const emailMessage = useRef();
    const passwordMessage = useRef();
    const password2Message = useRef();
    const nameMessage = useRef();
    const phoneMessage = useRef();
    const addressMessage = useRef();
    const agreementMessage = useRef();
    const logoMessage = useRef();
    

    const validateName = () =>{
        nameMessage.current.style.display = 'none';
        nameInput.current.style.border ='black 1px solid';
        setValidName(false);

        let namePattern = /^([^\s])+([\s][^\s]+)*$/;

        if (name.match(namePattern) == null){
            nameMessage.current.style.display = 'block';
            nameInput.current.style.border ='red 2px solid';
        } else{
            setValidName(true);
        }
    }
    
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

    const validatePhone = () =>{
        phoneMessage.current.style.display = 'none';
        phoneInput.current.style.border ='black 1px solid';
        setValidPhone(false);

        let phonePattern = /^(\+[0-9])?(([0-9]{3}(-)?)|(\([0-9]{3}\)))[0-9]{3}(-)?[0-9]{4}$/;

        if (phone.match(phonePattern) == null){
            phoneMessage.current.style.display = 'block';
            phoneInput.current.style.border ='red 2px solid';
        } else{
            setValidPhone(true);
        }
    }

    const validateAddress = () =>{
        addressMessage.current.style.display = 'none';
        addressInput.current.style.border ='black 1px solid';
        setValidAddress(false);

        let addressPattern = /^[0-9]{2,4}\s[a-zA-Z]+\s[a-zA-Z]+$/;

        if (address.match(addressPattern) == null){
            addressMessage.current.style.display = 'block';
            addressInput.current.style.border ='red 2px solid';
        } else{
            setValidAddress(true);
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

    const validatePassword2 = () => {
        password2Message.current.style.display = 'none';
        password2Input.current.style.border ='black 1px solid';
        setValidPassword2(false);

        if (password != password2){
        } else{
            setValidPassword2(true);
        }
    }

    const validateLogo = () => {
        logoMessage.current.style.display = 'none';
        setValidLogo(false);

        if (logo == ''){
            logoMessage.current.style.display = 'block';
        } else{
            setValidLogo(true);
        }
    }

    const addDishInput = () => {
        let dishId = dishInputCount + 1;
        setDishInputCount(dishId)
        let inputs = dishInputs;

        let dishNameInput = (<input value={dishNames[dishId]} placeholder='Name of dish'
            onChange={e => setDishNames((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);
        let dishPriceInput = (<input type="number" min="0.00" step="0.01" value={dishPrices[dishId]} placeholder='Price of dish' 
            onChange={e => setDishPrices((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);
        let dishPictureInput = (<div><label for="dishPic">Upload a picture of the dish</label> <input type="file" accept="image/*"
            name="dishPic" onChange={e => dishPicToBlob(e, dishId)}/></div>);
        let dishDescriptionInput = (<input value={dishDescriptions[dishId]} placeholder='Description of dish' 
        onChange={e => setDishDescriptions((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);

        inputs.push((<div>{dishNameInput}{dishPriceInput}{dishPictureInput}{dishDescriptionInput}</div>));
        
        setDishInputs(inputs);
    }

    const agree = () => {
        if(agreement == false){
            agreementMessage.current.style.display = 'none';
            setAgreement(true)
        } else{
            setAgreement(false)
        }
    }

    const signup = async () => {
        //console.log(validEmail, validPassword, validName, validPhone, agreement, validPassword2, validAddress, validLogo)
        if((validEmail == true) && (validPassword == true) && (validName == true) && (validPhone == true)
            && (agreement == true) && (validPassword2 == true) && (validAddress == true) && (validLogo == true)){
            for (let i = 0; i < dishNames.length; i++) {
                if(((dishNames[i] == undefined) || (dishPrices[i] == undefined)) && ((dishDescriptions[i] != undefined) || (dishPictures[i] != undefined) || (dishNames[i] != undefined) || (dishPrices[i] != undefined))){
                    setSignupMessage("Dish items need a name and a price or else leave all fields empty");
                    return
                }
            }
            let id
            try {
                const res = await axios.post('/api/restaurant-application', {
                name: name,
                email: email,
                phone: phone,
                address: address,
                logo: logo,
                logoSize: logo.length,
                password: password,
                });

                id = res.data.id

                setSignupMessage("Your restaurant application has been sent. Please wait up to 24 hours for it to be approved.");
            } catch (error) {
                console.log(error);
                setSignupMessage("An error occurred while creating your account");
            }

            try{
                for (let i = 0; i < dishNames.length; i++) {
                    console.log(id)
                    const res2 = await axios.post('/api/add-dish', {
                        name: dishNames[i],
                        price: dishPrices[i],
                        description: dishDescriptions[i],
                        picture: dishPictures[i],
                        pictureSize: dishPicSizes[i],
                        restaurant_id: id,
                        });
                }
            } catch (error){
                console.log(error);
                setSignupMessage("Your restaurant application has been sent but an error occurred while creating the menu");
            }
        } else{
            validateEmail();
            validatePassword();
            validateName();
            validatePhone();
            validateAddress();
            validateLogo();
            validatePassword2();
            if (password != password2){
                password2Input.current.style.border ='red 2px solid';
                password2Message.current.style.display = 'block';
            } else{
                setValidPassword2(true);
            }

            if(agreement == false){
                agreementMessage.current.style.display = 'block';
            }
        }
    }

    const fileToBlob = async (e) => {
        if(e.target.files[0] == undefined){
            return;
        }
        let file = e.target.files[0];
        const blob = await fetch(URL.createObjectURL(file)).then(r => r.blob());
        
        //console.log(blob)
        setLogo(new Uint8Array(await blob.arrayBuffer()))
    }

    const dishPicToBlob = async (e, dishId) => {
        if(e.target.files[0] == undefined){
            return;
        }
        let file = e.target.files[0];
        const blob = await fetch(URL.createObjectURL(file)).then(r => r.blob());
        let picArray = new Uint8Array(await blob.arrayBuffer())

        setDishPicSizes((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = picArray.length; return newArr})
        setDishPictures((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = picArray; return newArr})
    }

    useEffect(() => {
        validateLogo()
      }, [logo])
  
    return (
        <div>
            <NavBar/>
            <div className={styles.form}>
                <h1>Gateway Restaurant Signup</h1>
                <div>
                    <input className={styles.floating}
                        id={styles.name}
                        value={name} placeholder='Name'
                        onChange={e => setName(e.target.value)}
                        onBlur={validateName}
                        ref={nameInput}
                        required/>
                    <div id={styles.nameMessage} ref={nameMessage}>Please enter the restaurant's name</div>
                </div>
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
                        id={styles.phone}
                        value={phone} placeholder='Phone Number'
                        onChange={e => setPhone(e.target.value)}
                        onBlur={validatePhone}
                        ref={phoneInput}
                        required/>
                    <div id={styles.phoneMessage} ref={phoneMessage}>Please enter a valid phone number</div>
                </div>
                <div>
                    <input className={styles.floating}
                        id={styles.address}
                        value={address} placeholder='Address'
                        onChange={e => setAddress(e.target.value)}
                        onBlur={validateAddress}
                        ref={addressInput}
                        required/>
                    <div id={styles.addressMessage} ref={addressMessage}>Please enter a valid address</div>
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
                <div>
                    <input className={styles.floating}
                        id={styles.password2}
                        type="password" placeholder='Confirm password'
                        value={password2} 
                        onChange={e => setPassword2(e.target.value)}
                        onBlur={validatePassword2}
                        ref={password2Input}
                        required/>
                    <div id={styles.password2Message} ref={password2Message}>Confirm your password by entering it again</div>
                </div>
                <div>
                    <label for="logo">Upload your restaurant logo</label>
                    <input className={styles.button}
                        type="file" 
                        name="logo" 
                        onChange={e => fileToBlob(e)}
                        accept="image/*" 
                        required/>
                    <div id={styles.logoMessage} ref={logoMessage}>Please add a logo for your restaraunt</div>
                </div>
                <div>
                    <button className={styles.button} onClick={addDishInput}>Add a dish to your menu</button>
                    <div>
                        {dishInputs}
                    </div>
                </div>
                <div>
                    <input className={styles.button} type="checkbox" 
                    name="agreement" 
                    value={agreement}
                    onClick={agree}
                    required/>
                    <label for="agreement">I agree to the terms and services</label>
                    <div id={styles.agreementMessage} ref={agreementMessage}>Please agree to the terms and services</div>
                </div>
                <div>
                    <button className={styles.button} onClick={signup}>Sign up</button>
                </div>
                <div>
                  {signupMessage}
                </div>
            </div>
        </div>
    )
}