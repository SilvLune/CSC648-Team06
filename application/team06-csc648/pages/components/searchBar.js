/**
 * CSC 648 Spring 2023 - Team 6
 * File: RestaurantList.js
 * Author: Justin Shin
 * 
 * Description: Generates HTML for search bar, and handles search submit and results
 */

import React,{useState, useEffect, useRef} from 'react'
import styles from '@/styles/NavBar.module.css'
import axios from 'axios'
import {useRouter} from 'next/router'

const SearchBar = () => {
    const router = useRouter();
    const [search, setSearch] = useState('')
    const [restaurants, setRestaurants] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedCategoryNumber, setSelectedCategoryNumber] = useState(0)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setShowDropdown(false)
            }
        }
        document.addEventListener('mousedown', handleOutsideClick)
        return () =>{
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [dropdownRef])
    const handleSearchInputChange = (event) =>{
        const inputValue = event.target.value
        if(inputValue.length > 40){
            return
        }
        setSearch(inputValue)
    }  
    const handleInputClick = () => {
        setShowDropdown(true)
    }
    const handleSearchClick = (event) => {
        const val = event.target.value
        router.push(`/restaurant/${val}`)
    }
    const handleFormSubmit = (event) => {
        event.preventDefault();
        let newUrl;
        if (search.length == 0) {
          newUrl = `/search/none?category=${selectedCategoryNumber}`
        } else {
          newUrl = `/search/${search}?category=${selectedCategoryNumber}`
        }
        router.push(newUrl)
      }
      const handleCategoryChange = (event) =>{
        console.log(event.target.value)
        setSelectedCategoryNumber(event.target.value)
      }
      
      useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get(`/api/restaurants?search=${search}&category=${selectedCategoryNumber}`)
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [search, selectedCategoryNumber])

    return(
        <div className={styles.search}>
            <select className={styles.dropdown_category} key="key1" value={selectedCategoryNumber} onChange={handleCategoryChange} ref={dropdownRef}>
                    <option value="0">All</option>
                    <option value="1">Fast Food</option>
                    <option value="2">Chinese</option>
                    <option value="3">Mexican</option>
                    <option value="4">Korean</option>
                    <option value="5">Thai</option>
                    <option value="6">French</option>
                    <option value="7">Japanese</option>
                    <option value="8">Italian</option>
                    <option value="9">Indian</option>
                    <option value="10">Other</option>
            </select>
            {/* <button className={styles.categories} onClick = {handleCategoryButtonClick}>{selectedCategory}</button>
            {showCategories && (
                
            )} */}
            <form onSubmit={handleFormSubmit} key="key2" className={styles.searchForm}>
                <input type='text' value={search} className={styles.searchBar} onChange={handleSearchInputChange} onClick = {handleInputClick}/>
                <button className={styles.searchButton} type='submit'>Search</button>
            </form>
            {showDropdown && (
                <div className={styles.dropdown} key="key3" ref={dropdownRef}>
                    <ul>
                        {restaurants.map((restaurant) => (
                            <li value={restaurant.restaurant_id} onClick={handleSearchClick} key={restaurant.restaurant_id}>{restaurant.name}</li>
                            // <Link href={`/components/${restaurant.id}`}>{restaurant.name}</Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchBar;