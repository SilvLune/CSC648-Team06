import axios from 'axios';
import {useState, useEffect} from 'react'
import NavBar from './navBar';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import searchStyles from '@/styles/Search.module.css';
import { useRouter } from 'next/router'

const api_key = 'AIzaSyCpUlDRUOo40careJjFVbu-wN05qq2NRjo';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'100%', height:'100%'};

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


export default function SearchResult(){
    const router = useRouter()
    console.log(router.query)

    const {isLoaded} = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: api_key
    })

    const[restaurants, setRestaurants] = useState([])
    useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get('/api/restaurants')
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [])

    return (
        <div>
            <NavBar/>
            <p>Input is {router.query.input}</p>

            {restaurants.map((restaurant) => (
                <div className={searchStyles.searchResult}>
                    <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} className={searchStyles.logo} alt={`${restaurant.name} logo`} />
                    <h1 className={searchStyles.name}>{restaurant.name}</h1>
                    <h2 className={searchStyles.time}>Expected delivery time: {restaurant.avg_delivery_time} minutes</h2>
                    <h2 className={searchStyles.address}>{restaurant.address}</h2>
                    <div className={searchStyles.map}>
                        {{isLoaded} && MyMap()}
                    </div>
                </div>))}
        </div>
      )
}
/*




            {restaurants.map((restaurant) => (
                <div key={restaurant.restaurant_id}>
                    <div className={searchStyles.searchResult}>
                    <h2 className={searchStyles.logo}>Logo</h2>
                    <h1 className={searchStyles.name}>Restaraunt name</h1>
                    <h2 className={searchStyles.rating}>Rating</h2>
                    <h2 className={searchStyles.address}>Address</h2>
                    <div className={searchStyles.map}>
                        {MyMap()}
                    </div>
                </div>
            </div>
            
          ))}




              <h1>{restaurant.name}</h1>
              <p>Restaurant id: {restaurant.restaurant_id}</p>
              <p>Average Delivery Time: {restaurant.avg_delivery_time} minutes</p>
              <p>Category: {restaurant.category_id}</p>
              <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} alt={`${restaurant.name} logo`} />
*/