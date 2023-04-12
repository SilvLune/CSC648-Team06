import React,{useState, useEffect, useRef} from 'react'
import styles from '@/styles/NavBar.module.css'
import axios from 'axios'
import {useRouter} from 'next/router'

const SearchBar = () => {
    const router = useRouter();
    const [search, setSearch] = useState('')
    const [restaurants, setRestaurants] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)
    const [showCategories, setShowCategories] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState('Category')
    const [selectedCategoryNumber, setSelectedCategoryNumber] = useState(0)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleOutsideClick = (event) =>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setShowCategories(false)
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
        setSearch(inputValue)
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
        const categoryText = event.target.textContent
        setSelectedCategoryNumber(categoryValue)
        setSelectedCategory(categoryText)
        setShowCategories(false)
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
      
      useEffect(()=>{
        async function fetchRestaurants(){
            const response = await axios.get(`/api/restaurants?search=${search}&category=${selectedCategoryNumber}`)
            setRestaurants(response.data)
        }
        fetchRestaurants()
    }, [search, selectedCategoryNumber])

    return(
        <div className={styles.search}>
            <button className={styles.categories} onClick = {handleCategoryButtonClick}>{selectedCategory}</button>
            {showCategories && (
                <div className={styles.dropdown} key="key1" ref={dropdownRef}>
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