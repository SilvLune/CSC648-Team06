import React,{useState, useEffect} from 'react';
import styles from '@/styles/NavBar.module.css';
import axios from 'axios'
import {useRouter} from 'next/router'

const SearchBar = () => {
    const router = useRouter();
    let [search, setSearch] = useState('')
    let [restaurants, setRestaurants] = useState([])
    const [filteredRestaurants, setFilteredRestaraunts] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    let categoryPicked = 0
    const handleSearchInputChange = (event) =>{
        const inputValue = event.target.value
        console.log(inputValue)
        setSearch(inputValue)
        if(categoryPicked > 0){
            restaurants = restaurants.filter((restaurant) => restaurant.categories === selectedCategory)
        }
        const sim = similarities(search, restaurants.map((restaurant) => restaurant.name)).slice(0,3)
        setFilteredRestaraunts(restaurants.filter((restaurant) => sim.includes(restaurant.name)))
    }  
    const handleInputClick = () => {
        setShowCategories(false)
        setShowDropdown(true)
    }
    const handleCategoryButtonClick = () =>{
        setShowDropdown(false)
        setShowCategories(true)
    }
    const handleCategoryClick = (event) =>{
        const categoryValue = event.target.value
        console.log(categoryValue)
        categoryPicked = categoryValue
        setShowCategories(false)
    }
    const handleSearchClick = (event) => {
        const val = event.target.value
        
        router.push(`/restaurant/${val}`)
    }
    const handleFormSubmit = (event) => {
        event.preventDefault()
        if(search.length == 0){
            search = "none"
        }
        router.replace(`search/${search}`)
    }   
    useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get('/api/restaurants')
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [])
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if(showDropdown){
    //             setShowDropdown(false)
    //         }
    //     }
    //     document.addEventListener("click", handleClickOutside)
    //     return () =>{
    //         document.removeEventListener("click", handleClickOutside)
    //     }
    // },[showDropdown])
    return(
        <div className={styles.search}>
            <button className={styles.categories} onClick = {handleCategoryButtonClick}>Categories</button>
            {showCategories && (
                <div className={styles.dropdown} key="key1">
                    <ul>
                        <li value = "0" onClick={handleCategoryClick}>All</li>
                        <li value = "1" onClick={handleCategoryClick}>Fast Food</li>
                        <li value = "2" onClick={handleCategoryClick}>Chinese</li>
                        <li value = "3" onClick={handleCategoryClick}>Mexican</li>
                        <li value = "4" onClick={handleCategoryClick}>Korean</li>
                        <li value = "5" onClick={handleCategoryClick}>Thai</li>
                    </ul>
                </div>
            )}
            <form onSubmit={handleFormSubmit} key="key2">
                <input type='text' value={search} className={styles.searchBar} onChange={handleSearchInputChange} onClick = {handleInputClick}/>
                <button className={styles.searchButton} type='submit'>Search</button>
            </form>
            {showDropdown && (
                <div className={styles.dropdown}key="key3">
                    <ul>
                        {filteredRestaurants.map((restaurant) => (
                            <li value={restaurant.restaurant_id} onClick={handleSearchClick}>{restaurant.name}</li>
                            // <Link href={`/components/${restaurant.id}`}>{restaurant.name}</Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
function similarities(name, names){
    const distances = []
    for(let i=0; i<names.length; i++){
        const distance = jaroWinklerDistance(name, names[i])
        distances.push({name: names[i], distance: distance})
    }
    distances.sort((a,b) => b.distance - a.distance)
    return distances.map((distanceObj) => distanceObj.name)
}

function jaroWinklerDistance(str1, str2) {
    const jaroSimilarity = jaroSimilarityCoefficient(str1, str2);
    const prefixLength = commonPrefixLength(str1, str2);
    const scalingFactor = 0.1;
    const jaroWinklerDistance = jaroSimilarity + prefixLength * scalingFactor * (1 - jaroSimilarity);
    // console.log(str1 + " and " + str2 + " distance: " + jaroWinklerDistance)
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

export default SearchBar;