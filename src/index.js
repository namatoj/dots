const { io } = require("socket.io-client")
const mapboxgl = require("mapbox-gl")
// const { query } = require("express")
const turfDistance = require("@turf/distance")
const { v4: uuidv4 } = require("uuid")

require('mapbox-gl/dist/mapbox-gl.css')
require('./style.css')

// Set up map

const startPosition = [13.00, 55.59]
mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/namatoj/cl077js2e004h15p2sk4j2viu', // style URL
    center: startPosition, // starting position [lng, lat]
    zoom: 11 // starting zoom
});

const markerElement = document.createElement('div')
markerElement.className = 'marker'

const marker = new mapboxgl.Marker(markerElement, {
    draggable: true
}).setLngLat(startPosition)

const onMapMove = (e) => {
    marker.setLngLat(map.getCenter())

}
const onMapClick = (e) => {
    map.flyTo({ center: e.lngLat })
}

let data = {
    "type": "FeatureCollection",
    "features": []
}

map.on('load', () => {
    map.addControl(new mapboxgl.NavigationControl());


    marker.addTo(map)

    map.on('move', onMapMove)
    map.on('click', onMapClick)
    map.addSource('dots', {
        type: 'geojson',
        data: data,
    });
    // Add a layer showing the places.
    map.addLayer({
        'id': 'dots-layer',
        'type': 'circle',
        'source': 'dots',
        'paint': {
            'circle-color': ["get", "color"],
            // 'circle-color': "#ff0000",
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });
})

// Set point color
const params = new URLSearchParams(window.location.search)
const queryColor = params.get('color')
let currentColor = "#" + (queryColor ? queryColor : "000000")

console.log(currentColor)

const addPoint = () => {
    const position = marker.getLngLat()
    const uuid = uuidv4()
    data.features.push(
        {
            "type": "Feature",
            "properties": {
                "color": currentColor,
                "id": uuid
            },
            "geometry": {
                "type": "Point",
                "coordinates": [position.lng, position.lat],
            }
        }
    )
    map.getSource('dots').setData(data)
    console.log(data)

    // Create command and push it to command log
    const command = {
        "action": "ADD_POINT",
        "params": {
            "id": uuid,
            "lng": position.lng,
            "lat": position.lat,
            "color": currentColor,
        }
    }
    commandLog.push(command)
    console.log(commandLog)
}
const removePoint = () => {

    console.log("remove")
    // Find closest point among features to marker position.
    const markerPos = marker.getLngLat()
    for (const point of data.features) {
        point.properties.distance = turfDistance.default(
            point.geometry, [markerPos.lng, markerPos.lat]
        )
    }

    data.features.sort((a, b) => {
        if (a.properties.distance > b.properties.distance) {
            return 1;
        }
        if (a.properties.distance < b.properties.distance) {
            return -1;
        }
        return 0; // a must be equal to b
    });

    // Create command and push it to command log
    const id = data.features[0].properties.id
    const command = {
        "action": "REMOVE_POINT",
        "params": {
            "id": id
        }
    }
    commandLog.push(command)
    console.log(commandLog)

    // This removes the first element of the features array.

    data.features.shift()

    map.getSource('dots').setData(data)
}

// Set up buttons
const addButton = document.getElementById('addButton')
addButton.onclick = addPoint


const removeButton = document.getElementById('removeButton')
removeButton.onclick = removePoint

// Set up event listener
document.body.addEventListener('keypress', function (e) {
    if (e.key === ' ') {
        addPoint()
    }
});

// Set up command log
let commandLog = []