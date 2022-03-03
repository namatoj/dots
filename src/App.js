// const { io } = require("socket.io-client")
// const mapboxgl = require("mapbox-gl")

// require('mapbox-gl/dist/mapbox-gl.css')

// console.log("hello")

// const mapElement = document.createElement('div');
// mapElement.setAttribute("id", "map");
// mapElement.setAttribute("height", "300");
// mapElement.setAttribute("width", "300");
// document.body.appendChild(mapElement)

// const startPosition = [13.00, 55.59]
// mapboxgl.accessToken = 'pk.eyJ1IjoibmFtYXRvaiIsImEiOiJjaWk0bW0zYXcwMDQ1dmNtMnhzb21vOXVjIn0.KUflnrb58f71M-j3INmVKQ';
// const map = new mapboxgl.Map({
//     container: 'map', // container ID
//     style: 'mapbox://styles/mapbox/streets-v11', // style URL
//     center: startPosition, // starting position [lng, lat]
//     zoom: 11 // starting zoom
// });

// const markerElement = document.createElement('div')
// markerElement.className = 'marker'

// const marker = new mapboxgl.Marker(markerElement, {
//     draggable: true
// }).setLngLat(startPosition)

// const onMapMove = (e) => {
//     marker.setLngLat(map.getCenter())

// }
// const onMapClick = (e) => {
//     map.flyTo({ center: e.lngLat })
// }

// map.on('load', () => {
//     map.addControl(new mapboxgl.NavigationControl());


//     marker.addTo(map)

//     map.on('move', onMapMove)
//     map.on('click', onMapClick)

// })


//const socket = io("http://localhost:3000");
// import React, { Component } from "react";
// import "./App.css";

// class App extends Component {
//     render() {
//         return (
//             <>
//                 <div className="App">
//                     <h1> Hello, World! </h1>
//                 </div>
//                 <div id="map" ></div>
//             </>
//         );
//     }
// }

// export default App;