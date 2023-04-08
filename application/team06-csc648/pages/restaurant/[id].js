import{useRouter} from 'next/router'
import React,{useState, useEffect} from 'react'
import axios from 'axios'
import Link from 'next/link'

export default function RestaurantDetails() {
    const router = useRouter()
    const [restaurants, setRestaurants] = useState([])
    const{id} = router.query
    useEffect(() => {
      async function fetchRestaurants(){
        const response = await axios.get('/api/restaurants')
        setRestaurants(response.data)
      }
      fetchRestaurants()
    }, [])
    const restaurant = restaurants.find((restaurant) => restaurant.restaurant_id == id)
    return (
      <div key="key1">
        <Link href='/'>home</Link>
        <h1>{restaurant.name}</h1>
        <p>Restaurant id: {restaurant.restaurant_id}</p>
        <p>Average Delivery Time: {restaurant.avg_delivery_time} minutes</p>
        <p>Category: {restaurant.category_id}</p>
        <Image src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} alt={`${restaurant.name} logo`} />
      </div>
    )
  }