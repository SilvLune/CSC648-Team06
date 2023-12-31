/**
 * CSC 648 Spring 2023 - Team 6
 * File: [id].js
 * Author: Justin Shin, Konnor Nishimura
 * 
 * Description: Generates HTML for resuaturant page by ID. Pulls data from database
 *  Also handles order form and submit
 */

import{useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import NavBar from '../components/navBar'
import styles from '@/styles/Restaurant.module.css'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import Geocode from "react-geocode";

const api_key = 'AIzaSyDXZy1wPNmoinJbzlCWnOBLqehpwXXGkPw';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'100vh', height:'100vh'};

Geocode.setApiKey(api_key);
Geocode.setLocationType("ROOFTOP");

export default function RestaurantDetails() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState([])
  const [menu, setMenu] = useState([])
  const [showMap, setShowMap] = useState(false)
  const [coordinates, setCoordinates] = useState("")
  const [map, setMap] = useState(null)
  const{id} = router.query
  const [cartInfo, setCartInfo] = useState([])
  const [message, setMessage] = useState('');
  const [session, setSession] = useState(undefined);
  const [address, setAddress] = useState('');

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })
  
  const MyMap = () => {
    setShowMap(true)

    Geocode.fromAddress(restaurant[0].address).then(
      (response) => {
        setCoordinates(response.results[0].geometry.location);
      },
      (error) => {
        console.error(error);
      }
    );

    setMap((
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <MarkerF position={center}></MarkerF>
        <MarkerF position={coordinates}></MarkerF>
      </GoogleMap>
    ))
  }

  useEffect(() => {
    async function getSession(){
      try{
        let tempSession = await axios.get(`/api/get-user`)
        if(tempSession.data.user == undefined){
          return
        }
        //console.log(JSON.stringify(tempSession))
        setSession(tempSession)
  
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

  useEffect(() => {
    setShowMap(false)
    async function getRestaurant(){
      const response = await axios.get(`/api/restaurant-info?id=${id}`)
      if(restaurant.length == 0){
        setRestaurant(response.data)
      }
    }
    
    getRestaurant()
  }, [id, restaurant])

  useEffect(() => {
    async function getMenu(){
      const response = await axios.get(`/api/restaurant-menu?id=${id}`)
      setMenu(response.data)
    }

    getMenu()
  }, [restaurant])

  useEffect(() => {
    for(let i = 0; i < menu.length; i++){
      setCartInfo((prevArray) => {const newArr = [...prevArray]; newArr[i] = {id: menu[i].dish_id, quantity: 0, inCart: false}; return newArr})
    }
  }, [menu])

  useEffect(() => {
    setMap((
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <MarkerF position={center}></MarkerF>
        <MarkerF position={coordinates}></MarkerF>
      </GoogleMap>
    ))
  }, [coordinates])

  const addToCart = (id) => {
    for(let i = 0; i < menu.length; i++){
      if((cartInfo[i].id == id) && (cartInfo[i].inCart == false)){
        setCartInfo((prevArray) => {const newArr = [...prevArray]; newArr[i].inCart = true; return newArr})
        return
      }
      if((cartInfo[i].id == id) && (cartInfo[i].inCart == true)){
        setCartInfo((prevArray) => {const newArr = [...prevArray]; newArr[i].inCart = false; return newArr})
        return
      }
    }
  }

  const setQuantity = (id, e) => {
    let num = e.target.value
    if(num == ''){
      e.target.value = 0
      num = e.target.value
    }
    if(num < 0){
      e.target.value = 0
      num = e.target.value
    }
    if(!(Number.isInteger(num))){
      e.target.value = Math.round(e.target.value)
      num = e.target.value
    }

    for(let i = 0; i < menu.length; i++){
      if(cartInfo[i].id == id){
        setCartInfo((prevArray) => {const newArr = [...prevArray]; newArr[i].quantity = parseInt(num); return newArr})
        return
      }
    }
  }

  const sendOrder = async () => {
    if(session == undefined){
      window.location.href = "/signup/customer";
      return
    }

    if(address == ''){
      setMessage("Enter a location to be delivered to")
      return
    }

    let orderExists = false
    for(let i = 0; i < menu.length; i++){
      if((cartInfo[i].inCart == true) && (cartInfo[i].quantity > 0)){
        orderExists = true
      }
    }
    console.log(orderExists)
    if(orderExists == false){
      setMessage("No order has been made")
      return
    }

    let total = 0.00
    for(let i = 0; i < menu.length; i++){
      total += (menu[i].price * cartInfo[i].quantity)
    }
    let fee = (Math.round(total * 10) / 100.00)

    let date = new Date()
    
    try{
      const res = await axios.post('/api/send-order', {
        restaurant_id: restaurant[0].restaurant_id,
        customer_id: session.data.user.customer_id,
        driver_id: 3000, 
        status: 0,
        total: total,
        delivery_fee: fee,
        order_date_time: date,
        address: address
      });

      let order_id = res.data.id

      for(let i = 0; i < menu.length; i++){
        if((cartInfo[i].inCart == true) && (cartInfo[i].quantity > 0)){
          const res2 = await axios.post('/api/send-order-dish', {
            order_id: order_id,
            dish_id: cartInfo[i].id,
            quantity: cartInfo[i].quantity,
            });
        }
      }
    }catch(error) {
      console.log(error.response.data);
      setMessage("An error occurred sending your order");
    }

    window.location.href = "/";
  }

  return (
    (restaurant.length > 0) ?
      <div key="key1">
        <NavBar/>
        <img src={`data:image/png;base64,${Buffer.from(restaurant[0].logo).toString('base64')}`} className={styles.logo} alt={`${restaurant.name} logo`} />
        <div className={styles.restaurantContainer}>
          <h1 className={styles.name}>{restaurant[0].name}</h1>
          <div>
            <button onClick={() => setShowMap(false)}>Menu</button>
            <button onClick={MyMap}>Delivery</button>
          </div>
          <br></br>
          {(showMap == false) && <div>
            <div className={styles.menu}>
              {menu.map((dish) => (
                <div key={"dish"+dish.dish_id}>
                  <h1>{dish.name}</h1>
                  <h2>{dish.description}</h2>
                  <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={`${dish.name}`} />
                  <h2>${dish.price}</h2>
                  <div>
                    <label for={"dish" + dish.dish_id}>Add to cart </label>
                    <input type="checkbox" 
                      name={"dish" + dish.dish_id}
                      onClick={e => addToCart(dish.dish_id)}
                      required/>
                  </div>
                  <div>
                    <label for={"quantity" + dish.dish_id}>Quantity: </label>
                    <input type='number' 
                      name={"quantity" + dish.dish_id}
                      placeholder='Quantity' 
                      onChange={e => setQuantity(dish.dish_id, e)} 
                      min="0" 
                      step="1"/>
                  </div>
                </div>))}
            </div>
            <div className={styles.checkout}>
              <label for="address">Campus location to be delivered to: </label>
              <input type="text" 
                name="address" 
                placeholder="Address" 
                onChange={e => setAddress(e.target.value)}/>
              <br></br>
              {message}
              <button onClick={sendOrder} name="address">Check out order</button>
            </div>
          </div>}
          {(showMap == true) && <div>
            <p>Average Delivery Time: {restaurant[0].avg_delivery_time} minutes</p>
            <div>
              {{isLoaded} && map}
            </div>
          </div>}
        </div> 
      </div>

      :

      <div>
        <NavBar/>
        <p>Restaurant does not exist</p>
      </div>
    )
  }