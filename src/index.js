const { io } = require("socket.io-client")
const mapboxgl = require("mapbox-gl")
// const { query } = require("express")
const turfDistance = require("@turf/distance")
const { v4: uuidv4 } = require("uuid")
const { Action: Action } = require("./action.js")
// const socket = io("ws://localhost:3001");
// const socket = io("ws://129.151.223.187:3001");
const socket = io("wss://action-log.cnuc.nu");

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
            'circle-radius': 6,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    socket.on("CLIENT_ACTION", (command) => {
        commandLog.push(command)
        render()
    })
    socket.on("TRANSFER_ACTION_LOG", (msg) => {
        console.log(msg)
    })
    socket.emit("CLIENT_CONNECTED", currentContext)

})

// Get query parameters
const url = new URL(window.location)
const queryColor = url.searchParams.get('color')
const queryId = url.searchParams.get('id')

// Set current Context
const currentContext = (queryId ? queryId : uuidv4())
url.searchParams.set('id', currentContext)
window.history.pushState({}, '', url)

// Set point color
let currentColor = "#" + (queryColor ? queryColor : "000000")

console.log(currentColor)

const createPointFeature = (command) => {
    return ({
        "type": "Feature",
        "properties": {
            "color": command.params.color,
            "id": command.params.id
        },
        "geometry": {
            "type": "Point",
            "coordinates": [command.params.lng, command.params.lat],
        }
    })
}

// render function is responsible for interpreting the commandLog
// and make sure that the map data is updated.
// This function should be called every time the commandLog has
// been changed.
const render = () => {
    let features = []
    for (const command of commandLog) {
        if (command.action === Action.ADD_POINT) {
            features.push(
                createPointFeature(command)
            )
        }
        else if (command.action === Action.REMOVE_POINT) {
            features = features.filter((feature) => {
                return feature.properties.id !== command.params.id
            })
        }
    }

    data.features = [...features];
    map.getSource('dots').setData(data)
}

const addPoint = () => {
    const position = marker.getLngLat()
    const uuid = uuidv4()

    // Create command and push it to command log
    const command = {
        "context": currentContext,
        "action": Action.ADD_POINT,
        "params": {
            "id": uuid,
            "lng": position.lng,
            "lat": position.lat,
            "color": currentColor,
        }
    }

    // Check if connection to server is still active
    if (!socket.connected) {
        console.log("Action made while not connected")
        return
    }
    console.log(command)
    commandLog.push(command)
    socket.emit("CLIENT_ACTION", command)
    render()

}

const removePoint = () => {
    // Find closest point among features to marker position.
    if (data.features.length === 0) {
        return
    }
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
        "context": currentContext,
        "action": Action.REMOVE_POINT,
        "params": {
            "id": id
        }
    }

    // Check if connection to server is still active
    if (!socket.connected) {
        console.log("Action made while not connected")
        return
    }
    commandLog.push(command)
    socket.emit("CLIENT_ACTION", command)
    render()
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