/**
 * CSC 648 Spring 2023 - Team 6
 * File: driver.js
 * Author: Justin Shin, Konnor Nishimura, Jack Lee, Ryan Scott
 * 
 * Description: Generates HTML for index page. Pulls restaurants data to populate
 */

import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import Link from 'next/link';
import NavBar from './components/navBar';
import React from 'react'
import {useState, useEffect} from 'react'
import axios from 'axios'

export default function Home() {
  const [restaurants, setRestaurants] = useState([])

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

  useEffect(() => {
    async function getRestaurants(){
      const response = await axios.get(`/api/restaurants?search=${''}&category=${0}`)
      setRestaurants(response.data)
    }
    getRestaurants()
  }, [])

  /*
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar/>

        <div className={styles.allDishes}>
            {menu.map((dish) => (
                        <div key={"menu"+dish.dish_id} className={styles.dish}>
                          <Link target="_blank" rel="noopener noreferrer" href={"/restaurant/" + dish.restaurant_id}>
                            <img src={`data:image/png;base64,${Buffer.from(dish.picture).toString('base64')}`} className={styles.picture} alt={dish.name}/>
                            <p className={styles.dishText}>${dish.price} - {dish.name}</p>
                          </Link>
                        </div>))}
        </div>
      </main>
    </>
  )

  */

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <NavBar/>

        <div className={styles.allDishes}>
            {restaurants.map((restaurant) => (
                        <div key={"menu"+restaurant.restaurant_id} className={styles.dish}>
                          <Link target="_blank" rel="noopener noreferrer" href={"/restaurant/" + restaurant.restaurant_id}>
                            <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} className={styles.picture} alt={restaurant.name}/>
                            <p className={styles.dishText}>{restaurant.name}</p>
                          </Link>
                        </div>))}
        </div>
      </main>
    </>
  )
}

/*
const api_key = 'AIzaSyDXZy1wPNmoinJbzlCWnOBLqehpwXXGkPw';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'100%', height:'100%'};

function MyMap() {
  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
      >
      <MarkerF position={center}></MarkerF>
      </GoogleMap>
  ) : <></>
}
<div className={searchStyles.searchResult}>
          <h2 className={searchStyles.logo}>Logo</h2>
          <h1 className={searchStyles.name}>Restaraunt name</h1>
          <h2 className={searchStyles.rating}>Rating</h2>
          <h2 className={searchStyles.address}>Address</h2>
          <div className={searchStyles.map}>
            {MyMap()}
          </div>
        </div>
      <RestaurantList/>
*/