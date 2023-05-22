import SearchBar from './searchBar.js';
import Link from 'next/link';
import styles from '@/styles/NavBar.module.css';
import {useState, useEffect, useRef} from 'react'
import axios from 'axios';

const NavBar = () => {
  const [isCustomer, setIsCustomer] = useState(false);
  const [isRestaurant, setIsRestaurant] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orderNum, setOrderNum] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDishes, setOrderDishes] = useState([]);
  const [session, setSession] = useState(undefined);
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) =>{
        if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
            setShowDropdown(false)
        }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () =>{
        document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [dropdownRef])

  const logOut = async() => {
    try{
      const response = await axios.get(`/api/logout`)
      window.location.href = "/";
    }catch(err){
      console.log(err)
    }
  }

  const showOrders = async() => {
    if(isCustomer){
      setShowDropdown(true)
      try{
        async function getOrders(){
          const response = await axios.post(`/api/get-customer-orders?customer_id=${session.data.user.customer_id}`)
          setOrders(response.data)
        }

        getOrders()
      }catch(err){
        console.log(err)
      }
    }
  }

  useEffect(() => {
    async function getOrderDishes(i, id){
      const response = await axios.post(`/api/get-customer-orderDish?order_id=${id}`)
      setOrderDishes((prevArray) => {const newArr = [...prevArray]; newArr[i] = response.data; return newArr})
    }

    for(let i = 0; i < orders.length; i++){
      getOrderDishes(i, orders[i].order_id)
    }
  }, [orders])

  useEffect(() => {
    for(let i = 0; i < orders.length; i++){
      setOrderNum((prevArray) => {const newArr = [...prevArray]; newArr[i] = i; return newArr})
    }
  }, [orderDishes])
  
  useEffect(() => {
    async function getSession(){
      try{
        let tempSession = await axios.get(`/api/get-user`)
        if(tempSession.data.user == undefined){
          return
        }
        //console.log(JSON.stringify(tempSession))
        setSession(tempSession)
  
        if(tempSession.data.user.customer_id != undefined){
          setIsCustomer(true)
          //console.log("customer?" + isCustomer)
        }
        if(tempSession.data.user.driver_id != undefined){
          setIsDriver(true)
        }
        if(tempSession.data.user.restaurant_id != undefined){
          setIsRestaurant(true)
        }
        if(tempSession.data.user != undefined){
          setIsLoggedIn(true)
          //console.log("logged in?" + isLoggedIn)
        }
      }catch(err){
          console.log(err)
      }
    }

    getSession()
  }, [])
  
  return(
      <div className={styles.navBar}key="key1">
        <div>
          {(!isLoggedIn || isCustomer) && <Link className={styles.logo} href='/'><h1>Gateway</h1></Link>}
          {(isDriver) && <Link className={styles.logo} href={`/home/driver/${session.data.user.driver_id}`}><h1>Gateway</h1></Link>}
          {(isRestaurant) && <Link className={styles.logo} href={`/home/restaurant/${session.data.user.restaurant_id}`}><h1>Gateway</h1></Link>}
        </div>

        <div className={styles.center}>
          <p className={styles.title}>CSC648/848 Spring 2023 Team06</p>
          {(!isLoggedIn || isCustomer) && <SearchBar/>}
        </div>

        {isLoggedIn ? <div>
            {isCustomer && <div>
              <button onClick={showOrders}>Orders</button>
              {showDropdown && <div className={styles.allOrders} key="orders" ref={dropdownRef}>
                {orderNum.map((index) => (
                  <div className={styles.customer_order} key={"order" + index}>
                    <p className={styles.customer_order_restaurant}>{orders[index].name}</p>
                    {(orderDishes[index] != undefined) && orderDishes[index].map((dish) => (
                      <div key={"order" + index + "dish" + dish.dish_id} className={styles.customer_orderDishes}>
                        <p className={styles.customer_orderDish_name}>{dish.name}</p>
                        <p>Quantity: {dish.quantity}</p>
                        <p>${dish.price}</p>
                      </div>
                    ))}
                    <p>Delivery fees: ${orders[index].delivery_fee}</p>
                    <p>Total price: ${parseFloat(orders[index].total) + parseFloat(orders[index].delivery_fee)}</p>
                  </div>
                ))}
              </div>}
            </div>}
          </div> :
          <div className={styles.links}>
            <Link href='/login/customer'>Login</Link>
          </div>
        }
        <div className={styles.links}>
          <Link href='/aboutHome'>About us</Link>
          <br></br>
          {isLoggedIn ? (
            <button onClick={logOut} className={styles.logout}>Log Out</button>
          ) :
            <div>
              <Link href='/login/driver'>Driver</Link>
              <br></br>
              <Link href='/login/restaurant'>Restaurant</Link>
            </div>
          }
        </div>
      </div>
  );
}

export default NavBar;