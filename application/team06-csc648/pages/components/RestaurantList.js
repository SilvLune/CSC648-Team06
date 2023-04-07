import axios from 'axios';
import {useState, useEffect} from 'react'

export default function RestaurantList(){
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
          {restaurants.map((restaurant) => (
            <div key={restaurant.restaurant_id}>
              <h1>{restaurant.name}</h1>
              <p>Average Delivery Time: {restaurant.avg_delivery_time} minutes</p>
              <p>Category: {restaurant.category_id}</p>
              <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} alt={`${restaurant.name} logo`} />
            </div>
          ))}
        </div>
      )
}