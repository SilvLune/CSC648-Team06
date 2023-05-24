/**
 * CSC 648 Spring 2023 - Team 6
 * File: [query].js
 * Author: Justin Shin, Konnor Nishimura, Ryan Scott
 * 
 * Description: Generates HTML for search. Pulls search results to populate
 */

import axios from 'axios';
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import searchStyles from '@/styles/Search.module.css'
import NavBar from '../components/navBar'

export default function RestaurantSearchList(){
    const[rest, setRestaurants] = useState([])
    const[categoryNames, setCategoryNames] = useState([])
    const router = useRouter()
    const{query, category} = router.query

    useEffect(() => {
        async function getSession(){
          try{
            let tempSession = await axios.get(`/api/get-user`)
            if(tempSession.data.user == undefined){
              return
            }
            //console.log(JSON.stringify(tempSession))
            
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

    useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get(`/api/restaurants?search=${query}&category=${category}`)
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [query, category])

    useEffect(()=>{
        async function fetchCategories(){
            const response = await axios.get(`/api/get-categories`)
            setCategoryNames(response.data)
        }
        if(categoryNames.length == 0){
            fetchCategories()
        }
    }, [categoryNames])

    if(rest === undefined){
        return(
            <div>
                broken
            </div>
        )
    }else{
        return (
            <div>
                <NavBar/>
                <div className={searchStyles.resultInfo}>
                    <p>Input is {query}</p>
                    {categoryNames.map((categoryName) => (
                        <div>
                            {(categoryName.category_id == category) && <p>Category is {categoryName.name}</p>}
                        </div>
                    ))}
                    <p>{rest.length} results</p>
                </div>

                {rest.map((restaurant) => (
                    <a className={searchStyles.searchResult} key={restaurant.restaurant_id} href={"/restaurant/" + restaurant.restaurant_id}>
                        <div className={searchStyles.logoContainer}>
                            <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} className={searchStyles.logo} alt={`${restaurant.name} logo`} />
                        </div>
                        <h1 className={searchStyles.name}>{restaurant.name}</h1>
                        <h2 className={searchStyles.time}>Expected delivery time: {restaurant.avg_delivery_time} minutes</h2>
                        <h2 className={searchStyles.address}>{restaurant.address}</h2>
                    </a>))}
            </div>
        )
    }
}
