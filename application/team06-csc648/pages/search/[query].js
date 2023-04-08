import axios from 'axios';
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import searchStyles from '@/styles/Search.module.css'
import NavBar from '../navBar'

export default function RestaurantSearchList(){
    const[rest, setRestaurants] = useState([])
    const router = useRouter()
    const{query} = router.query
    console.log(query)
    console.log(query.length)
    useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get('/api/restaurants')
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [])
    let restaurants = undefined
    if(query !== "none"){
        restaurants = rest.filter((restaurant) => jaroWinklerDistance(restaurant.name, query) > 0.5)

    }else{
        restaurants = rest

    }
    return (
        <div>
            <NavBar/>
            <p>Input is {router.query.input}</p>
            <p>{restaurants.length} results</p>

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

function jaroWinklerDistance(str1, str2) {
    const jaroSimilarity = jaroSimilarityCoefficient(str1, str2);
    const prefixLength = commonPrefixLength(str1, str2);
    const scalingFactor = 0.1;
    const jaroWinklerDistance = jaroSimilarity + prefixLength * scalingFactor * (1 - jaroSimilarity);
    console.log(str1 + " and " + str2 + " distance: " + jaroWinklerDistance)
    return jaroWinklerDistance;
}
  
function jaroSimilarityCoefficient(str1, str2) {
    const matchDistance = Math.floor(Math.max(str1.length, str2.length) / 2) - 1;
    const matches1 = Array(str1.length).fill(false);
    const matches2 = Array(str2.length).fill(false);
    let matches = 0;
    let transpositions = 0;

    // Count matches and transpositions
    for (let i = 0; i < str1.length; i++) {
        const start = Math.max(0, i - matchDistance);
        const end = Math.min(i + matchDistance + 1, str2.length);
        for (let j = start; j < end; j++) {
        if (!matches2[j] && str1[i] === str2[j]) {
            matches1[i] = true;
            matches2[j] = true;
            matches++;
            break;
        }
        }
    }

    if (matches === 0) {
        return 0;
    }

    // Count transpositions
    let k = 0;
    for (let i = 0; i < str1.length; i++) {
        if (matches1[i]) {
        while (!matches2[k]) {
            k++;
        }
        if (str1[i] !== str2[k]) {
            transpositions++;
        }
        k++;
        }
    }

    const jaroSimilarity = (matches / str1.length + matches / str2.length + (matches - transpositions / 2) / matches) / 3;
    return jaroSimilarity;
}
  
function commonPrefixLength(str1, str2) {
    let prefixLength = 0;
    const minLength = Math.min(str1.length, str2.length);
    for (let i = 0; i < minLength; i++) {
        if (str1[i] !== str2[i]) {
        break;
        }
        prefixLength++;
    }
    return prefixLength;
}