import{useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import NavBar from '../components/navBar'
import styles from '@/styles/Restaurant.module.css'
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';

const api_key = 'AIzaSyDXZy1wPNmoinJbzlCWnOBLqehpwXXGkPw';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'100vh', height:'100vh'};

function MyMap() {
  return(
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
      <MarkerF position={center}></MarkerF>
      </GoogleMap>
  )
}

export default function RestaurantDetails() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState([])
  const [menu, setMenu] = useState([])
  const [showMap, setShowMap] = useState(false)
  const{id} = router.query

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

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

  if(restaurant.length == 0){
    return(
      <div></div>
    )
  }else{
    return (
      <div key="key1">
        <NavBar/>
        <div className={styles.header}>
          <img src={`data:image/png;base64,${Buffer.from(restaurant[0].logo).toString('base64')}`} className={styles.logo} alt={`${restaurant.name} logo`} />
          <h1>{restaurant[0].name}</h1>
        </div>
        <div>
          <button onClick={() => setShowMap(false)}>Menu</button>
          <button onClick={() => setShowMap(true)}>Delivery</button>
        </div>
        {(showMap == false) && <div className={styles.menu}>
          <div>
            {menu.map((dish) => (
                        <div key={"restaraunt"+restaurant.restaurant_id}>
                            <h1>{dish.name}</h1>
                            <h2>{dish.description}</h2>
                            <h2>${dish.price}</h2>
                            <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={`${restaurant.name} logo`} />
                            <button>Add to cart</button> 
                        </div>))}
          </div>
        </div>}
        {(showMap == true) && <div>
          <p>Average Delivery Time: {restaurant[0].avg_delivery_time} minutes</p>
          <div>
            {{isLoaded} && MyMap()}
          </div>
        </div>}
      </div>
    )
  }
}