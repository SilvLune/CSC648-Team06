/**
 * CSC 648 Spring 2023 - Team 6
 * File: [id].js
 * Author: Konnor Nishimura
 * 
 * Description: Generates HTML for restaurant home page, pulling info from DB
 *  Handles restaurant functions such as submitting dish info
 */

import{useRouter} from 'next/router'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import NavBar from '../../components/navBar'
import styles from '@/styles/Restaurant.module.css'

export default function Restaurant() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState([])
  const [menu, setMenu] = useState([])
  const [message, setMessage] = useState('');

  const [dishInputExists, setDishInputExists] = useState(false)
  const [dishInputs, setDishInputs] = useState(undefined)
  const [dishName, setDishName] = useState(undefined)
  const [dishPrice, setDishPrice] = useState(undefined)
  const [dishPicture, setDishPicture] = useState(undefined)
  const [dishPicSize, setDishPicSize] = useState(0)

  const [dishDescription, setDishDescription] = useState(undefined)
  const [showOrders, setShowOrders] = useState(false)
  const [orderNum, setOrderNum] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDishes, setOrderDishes] = useState([]);

  const submitDish = useRef();
  const dishPicInput = useRef();

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
    async function getRestaurant(){
      const response = await axios.get(`/api/restaurant-info?id=${id}`)
      setRestaurant(response.data)
    }
    async function getMenu(){
      const response = await axios.get(`/api/restaurant-menu?id=${id}`)
      setMenu(response.data)
    }
    getRestaurant()
    getMenu()
  }, [id, restaurant])

  const addDishInput = () => {
    if(dishInputExists){
      return
    }
    let dishNameInput = (<input value={dishName} placeholder='Name of dish' onChange={e => setDishName(e.target.value)}/>);
    let dishPriceInput = (<input type="number" min="0.00" step="0.01" value={dishPrice} placeholder='Price of dish' 
      onChange={e => setDishPrice(e.target.value)}/>);
    let dishPictureInput = (<div><label for="dishPic">Upload a picture of the dish</label> <input type="file" accept="image/*"
        name="dishPic" onChange={e => dishPicToBlob(e)} ref={dishPicInput}/></div>);
    let dishDescriptionInput = (<input value={dishDescription} placeholder='Description of dish' 
    onChange={e => setDishDescription(e.target.value)}/>);
    
    setDishInputs((<div>{dishNameInput}{dishPriceInput}{dishPictureInput}{dishDescriptionInput}</div>));

    submitDish.current.style.display = 'block';
    setDishInputExists(true)
  }

  const dishPicToBlob = async (e) => {
    if(e.target.files[0] == undefined){
      setDishPicSize(0)
      setDishPicture(undefined)
      return;
    }
    let file = e.target.files[0];
    const blob = await fetch(URL.createObjectURL(file)).then(r => r.blob());
    let picArray = new Uint8Array(await blob.arrayBuffer())

    setDishPicSize(picArray.length)
    setDishPicture(picArray)
  }

  const sendDish = async (e) => {
    console.log(dishName, dishPrice, dishDescription, dishPicture, dishPicSize)
    if(((dishName == undefined) || (dishPrice == undefined)) && ((dishDescription != undefined) || (dishPicture != undefined) || (dishName != undefined) || (dishPrice != undefined))){
      setMessage("Dish needs a name and a price")
      return
    }
    if(((dishDescription == undefined) && (dishPicture == undefined) && (dishName == undefined) && (dishPrice == undefined))){
      setMessage("Dish needs a name and a price")
      return
    }
    if(dishPicSize > 65535){
        setMessage("Dish picture cannot be larger than 64kB")
        return
    }

    let description = ''
    if(dishDescription != undefined){
      description = dishDescription
    }
    
    try{
      if(dishPicSize > 0){
        const res = await axios.post('/api/add-dish', {
          name: dishName,
          price: dishPrice,
          description: description,
          picture: dishPicture,
          pictureSize: dishPicSize,
          restaurant_id: id,
        });
        location.reload()
      } else {
        const res = await axios.post('/api/add-dish', {
          name: dishName,
          price: dishPrice,
          description: description,
          picture: new Uint8Array(),
          pictureSize: dishPicSize,
          restaurant_id: id,
        });
        location.reload()
      }
    } catch (error){
      console.log(error)
    }
  }

  useEffect(() => {
    if(dishName == ''){
      setDishName(undefined)
    }
  }, [dishName])

  useEffect(() => {
    if(dishPrice == ''){
      setDishPrice(undefined)
    }
  }, [dishPrice])

  useEffect(() => {
    if(dishDescription == ''){
      setDishDescription(undefined)
    }
  }, [dishDescription])

  useEffect(() => {
    try{
      async function getOrders(){
        const response = await axios.post(`/api/get-restaurant-orders?restaurant_id=${id}`)
        if(orders.length == 0){
          setOrders(response.data)
        }
      }
      getOrders()
    }catch(err){
      console.log(err)
    }
  }, [orders])

  useEffect(() => {
    async function getOrderDishes(i, order_id){
      const response = await axios.post(`/api/get-customer-orderDish?order_id=${order_id}`)
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

  if(restaurant.length == 0){
    return(
      <div>
        <NavBar/>
        <p>Restaurant does not exist</p>
      </div>
    )
  }else{
    return (
      <div key="key1">
        <NavBar/>
        <img src={`data:image/png;base64,${Buffer.from(restaurant[0].logo).toString('base64')}`} className={styles.logo} alt={`${restaurant.name} logo`} />
        <div className={styles.restaurantContainer}>
          <h1>{restaurant[0].name}</h1>
          <button onClick={e => setShowOrders(false)}>Show Dishes</button>
          <button onClick={e => setShowOrders(true)}>Show Orders</button>
          <br></br>
          <br></br>

          {(showOrders) && <div>
            {orderNum.map((index) => (
              <div key={"order" + index} className={styles.order}>
                <h1>Order {index}</h1>
                {(orderDishes[index] != undefined) && orderDishes[index].map((dish) => (
                  <div key={"order" + index + "dish" + dish.dish_id}>
                    <p>{dish.name} - Quantity: {dish.quantity}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>}

          {!(showOrders) && <div>
            <button onClick={addDishInput}>Add a dish to your menu</button>
            <div className={styles.dishInput}>
                {dishInputs}
            </div>
            <button className={styles.submitDish} onClick={sendDish} ref={submitDish}>Submit dish</button>
            {dishInputExists && <p>{message}</p>}
            
            <div className={styles.menu}>
              {menu.map((dish) => (
                <div key={"restaraunt"+dish.dish_id}>
                    <h1>{dish.name}</h1>
                    <h2>{dish.description}</h2>
                    <h2>${dish.price}</h2>
                    <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={`${dish.name}`} /> 
                </div>))}
            </div>
          </div>}
        </div>
      </div>
    )
  }
}