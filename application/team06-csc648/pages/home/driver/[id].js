import{useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import axios from 'axios'
import NavBar from '../../components/navBar'
import styles from '@/styles/Driver.module.css'
import { GoogleMap, MarkerF, useJsApiLoader, G } from '@react-google-maps/api';
import Geocode from "react-geocode";

const api_key = 'AIzaSyDXZy1wPNmoinJbzlCWnOBLqehpwXXGkPw';
const center = {lat:37.724286006635296,lng:-122.48000341090525};
const containerStyle = {width:'100vh', height:'100vh'};

Geocode.setApiKey(api_key);
Geocode.setLocationType("ROOFTOP");

export default function Restaurant() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [orderShown, setOrderShown] = useState(null)
  const [map, setMap] = useState(null)
  const [coordinates, setCoordinates] = useState("")
  const [address, setAddress] = useState("")
  
  const{id} = router.query

  const {isLoaded} = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: api_key
  })

  const ShowOrder = (order_id, order_address) => {
    console.log(order_id)
    console.log(order_address)
    setOrderShown(order_id)
    setAddress(order_address)
  }

  useEffect(() => {
    Geocode.fromAddress(address).then(
      (response) => {
        setCoordinates(response.results[0].geometry.location);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [orderShown])

  useEffect(() => {
    setMap((
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
      >
        <MarkerF position={center}></MarkerF>
        <MarkerF position={coordinates}></MarkerF>
      </GoogleMap>
    ))
  }, [coordinates])

  useEffect(() => {
    async function getOrders(){
      const response = await axios.get(`/api/get-driver-orders`)
      setOrders(response.data)
    }
    getOrders()
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
                      <div key={"order" + order.order_id} className={styles.order} onClick={() => ShowOrder(order.order_id, order.address)}>
                          <h1>{"Order " + order.order_id}</h1>
                          <h1>{order.name}</h1>
                          {(orderShown == order.order_id) && <div>
                            {{isLoaded} && map}
                          </div>}
                      </div>))}
        </div>
      </div>
    )
  }
}