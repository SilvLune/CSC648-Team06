/**
 * CSC 648 Spring 2023 - Team 6
 * File: [id].js
 * Author: Konnor Nishimura
 * 
 * Description: Generates HTML for driver page, pulling info by ID and orders to populate
 *  Handles driver functions such as accepting orders
 */


import{useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import NavBar from '../../components/navBar'
import styles from '@/styles/Driver.module.css'
import { GoogleMap, MarkerF, useJsApiLoader, G } from '@react-google-maps/api';
import Geocode from "react-geocode";

const api_key = 'AIzaSyDXZy1wPNmoinJbzlCWnOBLqehpwXXGkPw';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'50vh', height:'50vh'};

Geocode.setApiKey(api_key);
Geocode.setLocationType("ROOFTOP");

export default function Restaurant() {
  const router = useRouter()
  const [takenOrders, setTakenOrders] = useState([])
  const [availableOrders, setAvailableOrders] = useState([])
  const [orderShown, setOrderShown] = useState(null)
  const [map, setMap] = useState(null)
  const [coordinates, setCoordinates] = useState("")
  const [restaurantAddress, setRestaurantAddress] = useState("")
  const [availableOrderNum, setAvailableOrderNum] = useState([]);
  const [availableOrderDishes, setAvailableOrderDishes] = useState([]);
  const [takenOrderNum, setTakenOrderNum] = useState([]);
  const [takenOrderDishes, setTakenOrderDishes] = useState([]);
  
  const{id} = router.query

  useEffect(() => {
    async function getSession(){
      try{
        let tempSession = await axios.get(`/api/get-user`)
        if(tempSession.data.user == undefined){
          window.location.href = `/`;
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
      }catch(err){
          console.log(err)
      }
    }
    
    getSession()
  }, [])

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

  const ShowOrder = (order_id, restaurant_address) => {
    console.log(order_id)
    console.log(restaurant_address)
    setOrderShown(order_id)
    setRestaurantAddress(restaurant_address)
  }

  const acceptOrder = async(order_id) => {
    try{
      const response = await axios.post(`/api/order-accept?order_id=${order_id}&driver_id=${id}`)
      window.location.href = `/home/driver/${id}`;
    } catch(error){
      console.log(error)
    }
  }

  const completeOrder = async(order_id) => {
    try{
      const response = await axios.post(`/api/orderDish-complete?order_id=${order_id}`)
      const response2 = await axios.post(`/api/order-complete?order_id=${order_id}`)
      window.location.href = `/home/driver/${id}`;
    } catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(orderShown == null){
      return
    }
    Geocode.fromAddress(restaurantAddress).then(
      (response) => {
        setCoordinates(response.results[0].geometry.location);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [orderShown])

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

  useEffect(() => {
    async function getTakenOrders(){
      const response = await axios.get(`/api/get-driver-orders?driver_id=${id}`)
      if(takenOrders.length == 0){
        setTakenOrders(response.data)
      }
    }

    getTakenOrders()
  }, [takenOrders])

  useEffect(() => {
    async function getOrderDishes(i, id){
      const response = await axios.post(`/api/get-customer-orderDish?order_id=${id}`)
      setTakenOrderDishes((prevArray) => {const newArr = [...prevArray]; newArr[i] = response.data; return newArr})
    }

    for(let i = 0; i < takenOrders.length; i++){
      getOrderDishes(i, takenOrders[i].order_id)
    }
  }, [takenOrders])

  useEffect(() => {
    for(let i = 0; i < takenOrders.length; i++){
      setTakenOrderNum((prevArray) => {const newArr = [...prevArray]; newArr[i] = i; return newArr})
    }
  }, [takenOrderDishes])

  useEffect(() => {
    async function getAvailableOrders(){
      const response = await axios.get(`/api/get-driver-orders?driver_id=3000`)
      if(availableOrders.length == 0){
        setAvailableOrders(response.data)
      }
    }

    getAvailableOrders()
  }, [availableOrders])
  
  useEffect(() => {
    async function getOrderDishes(i, id){
      const response = await axios.post(`/api/get-customer-orderDish?order_id=${id}`)
      setAvailableOrderDishes((prevArray) => {const newArr = [...prevArray]; newArr[i] = response.data; return newArr})
    }

    for(let i = 0; i < availableOrders.length; i++){
      getOrderDishes(i, availableOrders[i].order_id)
    }
  }, [availableOrders])

  useEffect(() => {
    for(let i = 0; i < availableOrders.length; i++){
      setAvailableOrderNum((prevArray) => {const newArr = [...prevArray]; newArr[i] = i; return newArr})
    }
  }, [availableOrderDishes])

  if((takenOrders.length == 0) && (availableOrders.length == 0)){
    return(
        <div>
          <NavBar/>
          <p>There are no orders available to deliver</p>
        </div>
    )
  }else{
    return (
      <div key="key1">
        <NavBar/>
        <div>
          <h1 className={styles.header}>Taken orders</h1>
            {takenOrders.map((order) => (
              <div key={"order" + order.order_id} className={styles.order} onClick={() => ShowOrder(order.order_id, order.restaurant_address)}>
              <h1>{"Order " + order.order_id}</h1>
              <h1>{order.name}</h1>
              {(orderShown == order.order_id) && <div>
                {{isLoaded} && map}
                {takenOrderNum.map((index) => (
                  <div key={"taken" + index}>
                    {(takenOrderDishes[index] != undefined) && takenOrderDishes[index].map((dish) => (
                      <div key={"order" + index + "dish" + dish.dish_id}>
                        {(dish.order_id == order.order_id) && <p>{dish.name} - Quantity: {dish.quantity}</p>}
                      </div>
                    ))}
                  </div>
                ))}
              <br></br>
              <p>Restaurant Address: {order.restaurant_address}</p>
              <p>Campus Delivery Address: {order.order_address}</p>
              <p>Payment: ${parseFloat(order.total) + parseFloat(order.delivery_fee)}</p>
              <button onClick={e => {completeOrder(order.order_id)}}>Complete order</button>
                </div>}
              </div>))}
          <h1 className={styles.header}>Available orders</h1>
            {availableOrders.map((order) => (
              <div key={"order" + order.order_id} className={styles.order} onClick={() => ShowOrder(order.order_id, order.restaurant_address)}>
                  <h1>{"Order " + order.order_id}</h1>
                  <h1>{order.name}</h1>
                  {(orderShown == order.order_id) && <div>
                    {{isLoaded} && map}
                    {availableOrderNum.map((index) => (
                      <div key={"available" + index}>
                        {(availableOrderDishes[index] != undefined) && availableOrderDishes[index].map((dish) => (
                          <div key={"order" + index + "dish" + dish.dish_id}>
                            {(dish.order_id == order.order_id) && <p>{dish.name} - Quantity: {dish.quantity}</p>}
                          </div>
                        ))}
                      </div>
                    ))}
                    <br></br>
                    <p>Restaurant Address: {order.restaurant_address}</p>
                    <p>Campus Delivery Address: {order.order_address}</p>
                    <p>Payment: ${parseFloat(order.total) + parseFloat(order.delivery_fee)}</p>
                    <button onClick={e => {acceptOrder(order.order_id)}}>Accept order</button>
                  </div>}
              </div>))}
        </div>
      </div>
    )
  }
}