import{useRouter} from 'next/router'
import {useState, useEffect, useCallback} from 'react'
import axios from 'axios'
import NavBar from '../components/navBar'
import styles from '@/styles/Restaurant.module.css'
import { GoogleMap, MarkerF, useJsApiLoader, G } from '@react-google-maps/api';
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
    setShowMap(false)
    async function getRestaurant(){
      const response = await axios.get(`/api/restaurant-info?id=${id}`)
      if(restaurant.length == 0){
        setRestaurant(response.data)
      }
    }
    console.log("hi")
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

    let date = new Date()
    
    try{
      const res = await axios.post('/api/send-order', {
        restaurant_id: restaurant[0].restaurant_id,
        customer_id: 1, // PLACEHOLDER - CHANGE LATER 
        driver_id: 3000, // MAY NEED TO ADD ENTRY TO DATABASE 
        status: 0,
        total: total,
        delivery_fee: 10.00,
        order_date_time: date.toLocaleString(),
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
        <div className={styles.header}>
          <img src={`data:image/png;base64,${Buffer.from(restaurant[0].logo).toString('base64')}`} className={styles.logo} alt={`${restaurant.name} logo`} />
          <h1>{restaurant[0].name}</h1>
        </div>
        <div>
          <button onClick={() => setShowMap(false)}>Menu</button>
          <button onClick={MyMap}>Delivery</button>
        </div>
        {(showMap == false) && <div>
          <div className={styles.menu}>
            {menu.map((dish) => (
                        <div key={"dish"+dish.dish_id}>
                            <h1>{dish.name}</h1>
                            <h2>{dish.description}</h2>
                            <h2>${dish.price}</h2>
                            <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={`${restaurant.name} logo`} />
                            <div>
                              <label for={"dish" + dish.dish_id}>Add to cart</label>
                              <input type="checkbox" 
                                name={"dish" + dish.dish_id}
                                onClick={e => addToCart(dish.dish_id)}
                                required/>
                          </div>
                          <div>
                            <label for={"quantity" + dish.dish_id}>Quantity</label>
                            <input type='number' 
                              name={"quantity" + dish.dish_id}
                              placeholder='Quantity' 
                              onBlur={e => setQuantity(dish.dish_id, e)} 
                              min="0" 
                              step="1"/>
                          </div>
                        </div>))}
          </div>
          <button onClick={sendOrder}>Check out order</button>
          {message}
        </div>}
        {(showMap == true) && <div>
          <p>Average Delivery Time: {restaurant[0].avg_delivery_time} minutes</p>
          <div>
            {{isLoaded} && map}
          </div>
        </div>}
      </div> 

      :

      <div>
        <NavBar/>
        <p>Restaurant does not exist</p>
      </div>
    )
  }