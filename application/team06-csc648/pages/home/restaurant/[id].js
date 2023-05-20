import{useRouter} from 'next/router'
import {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import NavBar from '../../components/navBar'
import styles from '@/styles/Restaurant.module.css'

export default function Restaurant() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState([])
  const [menu, setMenu] = useState([])

  const [dishInputs, setDishInputs] = useState([])
  const [dishInputCount, setDishInputCount] = useState(-1)
  const [dishNames, setDishNames] = useState([])
  const [dishPrices, setDishPrices] = useState([])
  const [dishPictures, setDishPictures] = useState([])
  const [dishDescriptions, setDishDescriptions] = useState([])

  const submitDish = useRef();

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
    let dishId = dishInputCount + 1;
    setDishInputCount(dishId)
    let inputs = dishInputs;

    let dishNameInput = (<input value={dishNames[dishId]} placeholder='Name of dish'
        onChange={e => setDishNames((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);
    let dishPriceInput = (<input type="number" min="0.00" step="0.01" value={dishPrices[dishId]} placeholder='Price of dish' 
        onChange={e => setDishPrices((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);
    let dishPictureInput = (<div><label for="dishPic">Upload a picture of the dish</label> <input type="file" accept="image/*"
        value={dishPictures[dishId]} name="dishPic" onChange={e => setDishPictures((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/></div>);
    let dishDescriptionInput = (<input value={dishDescriptions[dishId]} placeholder='Description of dish' 
    onChange={e => setDishDescriptions((prevArray) => {const newArr = [...prevArray]; newArr[dishId] = e.target.value; return newArr})}/>);

    inputs.push((<div>{dishNameInput}{dishPriceInput}{dishPictureInput}{dishDescriptionInput}</div>));
    
    setDishInputs(inputs);

    submitDish.current.style.display = 'block';
}

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
        <div className={styles.header}>
          <img src={`data:image/png;base64,${Buffer.from(restaurant[0].logo).toString('base64')}`} className={styles.logo} alt={`${restaurant.name} logo`} />
          <h1>{restaurant[0].name}</h1>
        </div>
        
        <button onClick={addDishInput}>Add a dish to your menu</button>
        <div>
            {dishInputs}
        </div>
        <button className={styles.submitDish} ref={submitDish}>Submit dish(s)</button>
        
        <div className={styles.menu}>
          {menu.map((dish) => (
                      <div key={"restaraunt"+restaurant.restaurant_id}>
                          <h1>{dish.name}</h1>
                          <h2>{dish.description}</h2>
                          <h2>${dish.price}</h2>
                          <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={`${restaurant.name} logo`} /> 
                      </div>))}
        </div>
      </div>
    )
  }
}