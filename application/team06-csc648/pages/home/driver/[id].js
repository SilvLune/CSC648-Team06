import{useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import NavBar from '../../components/navBar'

export default function Restaurant() {
  const router = useRouter()
  const [orders, setOrders] = useState([])

  const{id} = router.query

  useEffect(() => {
    async function getOrders(){
      const response = await axios.get(`/api/orders`)
      setOrders(response.data)
    }
    getOrders()
    /*async function getRestaurants(){
      const response = await axios.get(`/api/restaurant-info?id=${id}`)
      setRestaurant(response.data)
    }
    getRestaurants()*/
  }, [orders])

  if(orders.length == 0){
    return(
        <div>
          <NavBar/>
          <p>There are no orders available to deliver</p>
        </div>
    )
  }else{
    return (
      <div key="key1">
        <NavBar/>
        <div>
            {orders.map((order) => (
                      <div key={"order"+order.order_id}>
                          <h1>{order.total}</h1>
                      </div>))}
        </div>
      </div>
    )
  }
}