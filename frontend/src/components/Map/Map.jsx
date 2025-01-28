import React, { useEffect, useState } from 'react';
import Map, { NavigationControl, Marker, Popup, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
import { useAuthStore } from "../../store/authStore";

import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CrisisAlertOutlinedIcon from '@mui/icons-material/CrisisAlertOutlined';
import EmergencyShareOutlinedIcon from '@mui/icons-material/EmergencyShareOutlined';
import PriorityHighOutlinedIcon from '@mui/icons-material/PriorityHighOutlined';
import axios from 'axios';
import { format } from 'timeago.js';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';
import { useChatStore } from '@/store/chatStore';
import {ServerUrl} from '@/utils/constants';




const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2FsZW1tb2hhbWVkIiwiYSI6ImNtMHdoaHlwYTAxdnkybHM1Y2djdHVidnAifQ.BFxnRx6AF4vGKAOyUcjbFQ'; // Replace with your token

const MapBox = () => {

  const { user } = useAuthStore();
  const { t } = useTranslation();
  const currentUser = user.email;
  const currentUserName = user.name;

  const checkIfCurrentUser = (storedInDB, pinCreator) => {
    return  storedInDB === pinCreator? true : false;
  };

  const [pins, setPins] = useState([]);
  const [userCountry, setUserCountry] = useState(null);
  const [services, setServices] = useState([]);

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [dangerRating, setDangerRating] = useState(1);
  const [type, setType] = useState("report");
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [viewState, setViewState] = useState({
    longitude: 30,
    latitude: 31.184,
    zoom: 11,
    bearing: 0,
    pitch: 0
  });
  const [userLocation, setUserLocation] = useState(null);
  const [hoveredPin, setHoveredPin] = useState(null);




  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/pins`);
        console.log("frontend connected to backend");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewState({
      ...viewState,
      latitude: lat,
      longitude: long,
    });
  };

  const handleAddClick = (e) => {
    const { lng, lat } = e.lngLat;
    setNewPlace({
      lat: lat,
      long: lng
    });
  };
  const handleLocationClick = (inType) => {
    if (userLocation) {
      const { longitude, latitude } = userLocation;
      setNewPlace({
        lat: latitude,
        long: longitude,
        type: inType,
      });
      setType(inType)
    } else {
      console.error("User location is not set.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {      
      const createdRoom = await axios.post(`${ServerUrl}/api/room/create-room`, {
        name: title,
        members: [],
        userID: user._id
    }, { withCredentials: true })

    const newPin = {
      userName: currentUserName,
      userEmail: user.email,
      title,
      description,
      dangerRate: dangerRating,
      type,
      lat: newPlace.lat,
      long: newPlace.long,
    };
      const res = await axios.post(`${ServerUrl}/api/pins`, newPin)

      setPins([...pins, res.data])
      console.log(createdRoom);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDangerRatingChange = (event) => {
    setDangerRating(parseInt(event.target.value));
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);

  }

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { longitude, latitude } = position.coords;

        setViewState((prevState) => ({
          ...prevState,
          longitude,
          latitude,
        }));
        setUserLocation({ longitude, latitude });
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          if (data.address && data.address.country) {
            setUserCountry(data.address.country);

          }
        } catch (error) {
          console.error("Error fetching country:", error);
        }
      },
      (error) => {
        console.error("Error getting live location:", error);
      }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    if (userCountry) {
      console.log("User's country:", userCountry);
      Cookies.set('LocationCountry', userCountry);

    }
  }, [userCountry]);


  const [selectedServices, setselectedServices] = useState(null);


  const [bounds, setBounds] = useState([]);
  const [ServicesClicked, setServicesClicked] = useState(false);
  const handleServicesClick = () => {
    setServicesClicked(true)
    try {
      fetchServices(bounds);
      console.log("Get Services");
    } catch (err) {

      console.log('Error in fetch services', { massage: err.message });
    }
  }
  useEffect(() => {
    if (viewState && viewState.zoom >= 10) {
      setBounds([
        viewState.longitude - 0.3, // min longitude
        viewState.latitude - 0.3,  // min latitude
        viewState.longitude + 0.3, // max longitude
        viewState.latitude + 0.3   // max latitude
      ]);
      console.log(bounds);
    }
  }, [viewState]);
  const [minLon, minLat, maxLon, maxLat] = bounds;
  const [servicesType, setServicesType] = useState("hospital");
  const fetchServices = async () => {

    try {
      const response = await axios.get(
        `https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"=${servicesType}](${minLat},${minLon},${maxLat},${maxLon});out body;`,
        { withCredentials: false }
      );
      setServices(response.data.elements);
      console.log(response.data.elements);
    } catch (error) {
      console.error("Error fetching services data:", error);
    }
  };
  const amenityIcons = {
    hospital: "/hospital.png",
    clinic: "/clinic.png",
    fuel: "/fuel.png",
    police: "/police.png",
    fire_station: "/fire_station.png",
    telephone: "/telephone.png",
    vehicle_inspection: "/vehicle_inspection.png",
    pharmacy: "/pharmacy.png",
  };
    const handleOpenGoogleMaps = (objLat, objLng, destinationName) => {
    const userLat = userLocation.latitude
    const userLng = userLocation.longitude
    const destLat = objLat;
    const destLng = objLng;
    const encodedDestination = encodeURIComponent(destinationName);


    const openGoogleMaps = () => {
      if (!destinationName) {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${destLat},${destLng}`;
        // const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=$My+Location&destination=${destLat},${destLng}`;
        window.open(googleMapsUrl, "_blank");
      } else {
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${encodedDestination}`;
        // const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${encodedDestination}`;
        window.open(googleMapsUrl, "_blank");
      }

    };
    openGoogleMaps();
  }
  const [hoveredServices, setHoveredServices] = useState(null);
  return (
    <>
      <div>
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          style={{ width: '100vw', height: '100vh' }}
          mapStyle="mapbox://styles/salemmohamed/cm1b66oxs02cm01pi68mw1xwi"
          onDblClick={handleAddClick}

        >
          <NavigationControl className="custom-navigation" />
          {userLocation && (
            <Marker
              longitude={userLocation.longitude}
              latitude={userLocation.latitude}
              anchor="center"
            >
              <div className="green-marker"></div>
            </Marker>
          )}
          {services.map((service) => (
            <Marker
              key={service.id}
              latitude={service.lat}
              longitude={service.lon}
              onClick={() => {
                setselectedServices(service);
                console.log("Selected Service:", service);
              }}
              style={{ cursor: 'pointer' }}
            >
              <img src={amenityIcons[service.tags.amenity]} alt={`${service.tags.amenity} Marker`}
                onMouseEnter={() => setHoveredServices(service)}
                onMouseLeave={() => setHoveredServices(null)}
                style={
                  viewState.zoom < 7 ? { width: '13px', height: '13px' } :
                    viewState.zoom < 10 ? { width: '18px', height: '18px' } :
                      viewState.zoom < 12 ? { width: '21px', height: '21px' } :
                        viewState.zoom < 13 ? { width: '22px', height: '22px' } :
                          viewState.zoom < 15 ? { width: '25px', height: '25px' } :
                            { width: '32px', height: '32px' }

                } />
            </Marker>

          ))}

          {hoveredServices && (hoveredServices != selectedServices) && (
            <Popup
              latitude={hoveredServices.lat}
              longitude={hoveredServices.lon}
              closeButton={false}
              closeOnClick={false}
              offset={25}
            >
              <div>
                <h4 style={{ fontWeight: 'bolder', fontSize: '16px', textAlign: 'center' }}>{hoveredServices.tags.name || hoveredServices.tags.amenity}</h4>
              </div>
            </Popup>
          )}


          {selectedServices && (
            <Popup
              latitude={selectedServices.lat}
              longitude={selectedServices.lon}
              onClose={() => setselectedServices(null)}
              closeOnClick={false}
              anchor="top"
            >
              <div>
              </div>
              <div className="card" style={{ textAlign: 'center' }}>
                {selectedServices.tags.amenity && (
                  <label>{(selectedServices.tags.amenity == 'fire_station') ? 'Fire Station' : selectedServices.tags.amenity.charAt(0).toUpperCase() + selectedServices.tags.amenity.slice(1)}</label>
                )}
                {selectedServices.tags.name && (
                  <>
                    <label>{t("Name")}</label>
                    <h4 className="place">{selectedServices.tags.name}</h4>
                    {selectedServices.tags["name:en"] && selectedServices.tags["name:en"] != selectedServices.tags.name && (
                      <h4 className="place">{selectedServices.tags["name:en"]}</h4>
                    )}
                    {selectedServices.tags.phone && (
                      <h4 className="place">{selectedServices.tags.phone}</h4>
                    )}
                    {selectedServices.tags.opening_hours && (
                      <h4 className="place" style={{ color: 'green' }}>{selectedServices.tags.opening_hours}</h4>
                    )}
                  </>
                )}
                <button className="submitButton"
                  onClick={() => {handleOpenGoogleMaps(selectedServices.lat, selectedServices.lon, selectedServices.tags.name)}}
                >Go there</button>

              </div>
            </Popup>
          )}


          {pins.map((p, index) => (
            p && p.lat && p.long ? (
              <React.Fragment key={index}>
                <Marker
                  className='marker'
                  latitude={p.lat}
                  longitude={p.long}
                  anchor="center"
                >
                  <LocationOnIcon
                    onMouseEnter={() => setHoveredPin(p)}
                    onMouseLeave={() => setHoveredPin(null)}
                    onClick={() => handleMarkerClick(p.id, p.lat, p.long)}
                  />
                </Marker>

                {/* hovered pin */}
                {hoveredPin && (hoveredPin._id === p._id && hoveredPin._id !== currentPlaceId) && (
                  <Popup
                    latitude={p.lat}
                    longitude={p.long}
                    closeButton={false}
                    closeOnClick={false}
                    offset={25}
                  >
                    <div>
                      <h4 style={{ fontWeight: 'bolder', fontSize: '16px' }}>{p.title}</h4>
                    </div>
                  </Popup>
                )}
              </React.Fragment>
            ) : null
          ))}

          {/* Closed Marker */}
          {pins.map((p, index) => (
            p.lat && p.long ? (
              <React.Fragment key={index}>
                <Marker
                  className='marker'
                  latitude={p.lat}
                  longitude={p.long}
                  anchor="center"

                >
                  <LocationOnIcon
                    onMouseEnter={() => setHoveredPin(p)}
                    onMouseLeave={() => setHoveredPin(null)}

                    onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                    style={{
                      fontSize: 30,
                      color: checkIfCurrentUser(user.email , p.userEmail) ? 'green'
                        : p.type === "report"
                          ? 'red'
                          : p.type === "request"
                            ? "blue"
                            : "black"
                    }}
                  />
                </Marker>


                {p._id === currentPlaceId && (
                  <Popup
                    latitude={p.lat}
                    longitude={p.long}
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setCurrentPlaceId(null)}
                    offset={15}
                  >
                    {/* Popup Card */}
                    <div className="card">
                      {p.title && (<><label>{t("Title")}</label><h4 className="place">{p.title}</h4></>)}
                      {p.description && (<><label>{t("Description")}</label><p className="desc">{p.description}</p></>)}
                      {p.type && (<><label>{t("Type")}</label><p className="type">{p.type}</p></>)}
                      {p.dangerRate && (<><label>{t("Danger Rate")}</label><div className="danger-scale">{Array(p.dangerRate).fill(<PriorityHighOutlinedIcon className="danger" />)}</div></>)}
                      {p.userName && (<><br /><span className="username">{t("Created by")} <b>{p.userName}</b></span></>)}<span className="date">{format(p.createdAt)}</span>
                      {!checkIfCurrentUser(currentUser, p.userEmail) && p.type === "request" && (
                        <button className="submitButton" style={{width: 'fit-content'}}
                          onClick={() => handleOpenGoogleMaps(p.lat, p.long, null)}
                        >On the Way to U</button>
                      )}
                      </div>
                  </Popup>
                )}
              </React.Fragment>
            ) : null
          ))}

          {/* NEW PIN */}
          {newPlace && (
            <Popup
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
            >
              <div className='newpin'>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say something about this place."
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                  <div className="radio-inputs">
                    <label>
                      <input className="radio-input" type="radio" name="engine"
                        value={"report"}
                        checked={type === "report"}
                        onChange={handleTypeChange}
                      />
                      <span className="radio-tile">
                        <span className="radio-icon">
                          <ReportOutlinedIcon />
                        </span>
                        <span className="radio-label">Report</span>
                      </span>
                    </label>
                    <label>
                      <input className="radio-input" type="radio" name="engine"
                        value={"request"}
                        checked={type === "request"}
                        onChange={handleTypeChange}

                      />
                      <span className="radio-tile">
                        <span className="radio-icon">
                          <ReportProblemOutlinedIcon />
                        </span>
                        <span className="radio-label">Help</span>
                      </span>
                    </label>
                  </div>

                  <label>Danger rate</label>
                  <div className="danger-rating">
                    <input
                      type="radio"
                      id="danger5"
                      name="dangerRate"
                      value="5"
                      checked={dangerRating === 5}
                      onChange={handleDangerRatingChange}
                    />
                    <label htmlFor="danger5" title="Very High Danger"></label>

                    <input
                      type="radio"
                      id="danger4"
                      name="dangerRate"
                      value="4"
                      checked={dangerRating === 4}
                      onChange={handleDangerRatingChange}
                    />
                    <label htmlFor="danger4" title="High Danger"></label>

                    <input
                      type="radio"
                      id="danger3"
                      name="dangerRate"
                      value="3"
                      checked={dangerRating === 3}
                      onChange={handleDangerRatingChange}
                    />
                    <label htmlFor="danger3" title="Moderate Danger"></label>

                    <input
                      type="radio"
                      id="danger2"
                      name="dangerRate"
                      value="2"
                      checked={dangerRating === 2}
                      onChange={handleDangerRatingChange}
                    />
                    <label htmlFor="danger2" title="Low Danger"></label>

                    <input
                      type="radio"
                      id="danger1"
                      name="dangerRate"
                      value="1"
                      checked={dangerRating === 1}
                      onChange={handleDangerRatingChange}
                    />
                    <label htmlFor="danger1" title="Very Low Danger"></label>
                  </div>

                  <button type="submit" className="submitButton">Add Pin</button>
                </form>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Action bar */}
      <div className="action-bar flex justify-around gap-4 items-center px-4 py-1 bg-black rounded-[15px] ring-1 ring-white absolute z-10 bottom-2 left-1/2 transform -translate-x-1/2">
        {/* Report */}
        <div className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
          onClick={() => handleLocationClick("report")}

        >
          <ReportOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
            {t('Report')}
          </div>
        </div>
        {/* Request in live location */}
        <div className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
          onClick={() => handleLocationClick("request")}
        >
          <EmergencyShareOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
            {t('Request Help in Live Location')}
          </div>
        </div>
        {/* On Road */}
        <div className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500"
          onClick={() => handleLocationClick("report")}

        >
          <ReportProblemOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
            {t('On Road Terrible')}
          </div>
        </div>
        {/* Find */}
        <div onClick={handleServicesClick} className="relative group hover:cursor-pointer hover:bg-slate-800 p-2 rounded-full transition-all duration-500">
          <CrisisAlertOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-max px-2 py-1 text-white bg-black rounded-md opacity-0 scale-50 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100">
            {t('Find nearby Emergency Services')}
          </div>
        </div>
      </div>
      {/* Services Options */}
      {ServicesClicked &&
        <div className='Services_Options'>
          <div className="radio-wrapper">
            <div className="radio-container">
              <input onClick={() => 
                setServicesType('hospital')
              
              } defaultChecked id="radio-hospital" name="radio" type="radio" />
              <label htmlFor="radio-hospital">{t('Hospital')}</label>

              <input onClick={() => 
                setServicesType('clinic')
              
              } id="radio-clinic" name="radio" type="radio" />
              <label htmlFor="radio-clinic">{t('Clinic')}</label>

              <input onClick={() => 
                setServicesType('fuel')
              
              } id="radio-fuel" name="radio" type="radio" />
              <label htmlFor="radio-fuel">{t('Fuel Station')}</label>

              <input onClick={() => 
                setServicesType('police')
              
              } id="radio-police" name="radio" type="radio" />
              <label htmlFor="radio-police">{t('Police Station')}</label>

              <input onClick={() => 
                setServicesType('fire_station')
              
              } id="radio-fire_station" name="radio" type="radio" />
              <label htmlFor="radio-fire_station">{t('Fire Station')}</label>

              <input onClick={() => 
                setServicesType('telephone')
              
              } id="radio-telephone" name="radio" type="radio" />
              <label htmlFor="radio-telephone">{t('Public Telephone')}</label>

              <input onClick={() => 
                setServicesType('vehicle_inspection')
              
              } id="radio-vehicle_inspection" name="radio" type="radio" />
              <label htmlFor="radio-vehicle_inspection">{t('Vehicle Repair')}</label>

              <input onClick={() => 
                setServicesType('pharmacy')
              
              } id="radio-pharmacy" name="radio" type="radio" />
              <label htmlFor="radio-pharmacy">{t('Pharmacy')}</label>

              <div className="glider-container">
                <div className="glider" />
              </div>
            </div>
          </div>
        </div>
      }

    </>
  );
};

export default MapBox;