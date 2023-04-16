import axios from 'axios';
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import searchStyles from '@/styles/Search.module.css'
import NavBar from '../components/navBar'

export default function RestaurantSearchList(){
    const[rest, setRestaurants] = useState([])
    const router = useRouter()
    const{query, category} = router.query
    useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get(`/api/restaurants?search=${query}&category=${category}`)
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [query, category])

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
                <p>Input is {query}</p>
                <p>Category is {category}</p>
                <p>{rest.length} results</p>

                {rest.map((restaurant) => (
                    <div className={searchStyles.searchResult} key={restaurant.restaurant_id}>
                        <img src={`data:image/png;base64,${Buffer.from(restaurant.logo).toString('base64')}`} className={searchStyles.logo} alt={`${restaurant.name} logo`} />
                        <h1 className={searchStyles.name}>{restaurant.name}</h1>
                        <h2 className={searchStyles.time}>Expected delivery time: {restaurant.avg_delivery_time} minutes</h2>
                        <h2 className={searchStyles.address}>{restaurant.address}</h2>
                    </div>))}
            </div>
        )
    }
}
