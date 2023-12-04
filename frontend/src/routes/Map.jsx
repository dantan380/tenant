import React, { useEffect, useState } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';

// DO NOT REMOVE THIS CSS FILE.
// IF YOU MOVE IT MAKE SURE THE MARKERS AND THE MAP CAN REFERENCE THIS
// BECAUSE THERE IS BLACK MAGIC HAPPENING WITH THE CSS THAT IS ESSENTIAL
import 'mapbox-gl/dist/mapbox-gl.css';

// VITE Automatically looks into ENV files.  Anything prefixed with VITE_ can be used like this:
const MAPBOX_TOKEN = import.meta.env.VITE_MAP_BOX_API_KEY;
const GEONAME_USERNAME = import.meta.env.VITE_GEONAME_API_USERNAME;

const Map = () => {

  const [postalCode, setPostalCode] = useState('');
  const [viewport, setViewport] = useState({
    longitude: -123.12374,
    latitude: 49.188362,
    zoom: 16,

  });

  const handlePostalCode = function(e) {
    const newPostalCode = e.target.value;
    setPostalCode(newPostalCode);
    console.log("postalCode", newPostalCode);
    axios.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${newPostalCode}&maxRows=1&username=${GEONAME_USERNAME}`)
      .then(response => {

        if (response.data.postalCodes[0]) {
          const lng = response.data.postalCodes[0].lng;
          const lat = response.data.postalCodes[0].lat;
          // console.log("lng", lng, "lat", lat);
          setViewport(prevViewPort => ({
            ...prevViewPort,
            latitude: lat,
            longitude: lng
          }));
        }
      }).catch(error => {
        console.log(error);
      });


  };


  // make api call to fetch properties
  // use state to update the list of properties
  // in render,  {markers.map((marker) => (...) where markers is the useState state
  useEffect(() => {

    const response = axios.get('/api/getAllProperties')
      .then(response => {
        console.log('all properties', response.data);

        // create a new array  will contain UNIQUE properties
        // each property will have UNIQUE postal code
        //    a long lang coord
        //    street name, street number, landlord first last name
        // [{'v6x1p2':{streetName:..}}]

        const markerInfo = convertTomarkerInfo(response.data);
      });


    axios.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=V6X1P2&maxRows=1&username=${GEONAME_USERNAME}`)
      .then(response => {

        const lng = response.data.postalCodes[0].lng;
        const lat = response.data.postalCodes[0].lat;
        // console.log("lng", lng, "lat", lat);


      }).catch(error => {
        console.log(error);
      });
  }, []);



  return (
    <div>

      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={evt => setViewport(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: "100%", height: 500 }}

      >

        <Marker
          latitude={49.188362}
          longitude={-123.12374}
          offsetLeft={10}
          offsetTop={10}>
          <div
            onClick={() => console.log("marker clicked")}
            className="marker">3
          </div>
        </Marker>
      </ReactMapGL>
      <input
        className="pl-4 bg-transparent border-solid border-2 border-white rounded-full h-11"
        placeholder="Enter a Postal Code"
        required
        value={postalCode}
        onChange={(e) => handlePostalCode(e)}
      />
    </div>
  );
};

// We want an array that looks like this:
// [
//   {
//     'v6x1p2': {
//       streetName: 'charm',
//       streetNumber: '42',
//       landlordFirstName: 'Bossman',
//       landlordLastName: 'Boss',
//       long: 42.2,
//       lat: -123.4
//     },
//     'v4b1q4': {
//       streetName: '...',
//     },
//   },
// ];
const convertTomarkerInfo = async function(data) {

  // data looks like this:
  // [
  //   {
  //     landlordId: { ...landlordRelatedFields },
  //     postalCode: 'V6X1p5',
  //     streetName: 'Charm St',
  //     streetnum: 42
  //   }
  // ];
  if (data) {
    const markers = [];

    // if it doesn't exist
    const postalCode = data.postalCode;
    if (!markers[postalCode]) {

      await axios.get(`http://api.geonames.org/postalCodeSearchJSON?postalcode=${postalCode}&maxRows=1&username=shumbum`);

      markers.push({
        postalCode: {
          streetName: data.streetName,
          streetNumber: data.streetNumber,

        }
      });
    }
  }
};

export default Map;