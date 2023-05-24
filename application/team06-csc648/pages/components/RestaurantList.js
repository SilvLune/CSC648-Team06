/**
 * CSC 648 Spring 2023 - Team 6
 * File: RestaurantList.js
 * Author: Justin Shin
 * 
 * Description: Generates HTML for displaying all restaurants and their info
 */

import axios from 'axios';
import {useState, useEffect} from 'react'
import searchStyles from '@/styles/Search.module.css'

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
          <div className={searchStyles.searchResult} key={restaurant.restaurant_id}>
              <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} className={searchStyles.logo} alt={`${restaurant.name} logo`} />
              <h1 className={searchStyles.name}>{restaurant.name}</h1>
              <h2 className={searchStyles.time}>Expected delivery time: {restaurant.avg_delivery_time} minutes</h2>
              <h2 className={searchStyles.address}>{restaurant.address}</h2>
          </div>))}
      </div>
      )
}