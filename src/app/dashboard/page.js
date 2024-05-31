'use client'
import React, { useState, useEffect } from 'react';
import styles from './dashboard.module.css';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const categories = {
  mood: [
    'chill', 'energetic', 'relaxed', 'vibrant', 'cozy', 'bohemian', 'sophisticated', 'fun', 'playful', 'mellow',
  ],
  ambience: [
    'intimate', 'inviting', 'electric', 'romantic', 'festive', 'laid-back', 'warm', 'modern', 'rustic', 'glamorous',
  ],
  partyThemes: [
    'tropical luau', '1920s gatsby', 'disco fever', 'hollywood red carpet', 'masquerade ball', 'carnival/circus', 'beach bash', 'winter wonderland', 'casino night', 'around the world',
  ],
};

export default function Dashboard() {
  const router = useRouter();
  const [locationData, setLocationData] = useState(null);
  const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
  const [event, setEvent] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [preferences, setPreferences] = useState([]);
  const [isNewUser, setIsNewUser] = useState(null);
  const [joinedEvents, setJoinedEvents] = useState([]);

  const handleChipClick = (category, value) => {
    const pref = `${category}:${value}`;
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((item) => item !== pref) : [...prev, pref]
    );
  };

  const handleFeed = () => {
    const token = localStorage.getItem('access_token');
    axios.get('http://13.50.187.28/api/v1/users/feed/', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setEvent(response?.data?.data?.Items);
      })
      .catch(error => {
        alert('Error fetching data:', error);
      });
  };

  const handlePreferencesSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem('access_token');
    axios.post('http://13.50.187.28/api/v1/users/preference/', { preferences }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response.data);
        handleFeed();
      })
      .catch((error) => {
        console.error('Error submitting preferences:', error);
        alert('Error submitting preferences. Please try again.');
      });
  };

  const joinEvent = (eventId) => {
    const token = localStorage.getItem('access_token');
    axios.post('http://13.50.187.28/api/v1/users/events/join/', { event: eventId }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        console.log(response.data);
        setJoinedEvents((prev) => [...prev, eventId]);
      })
      .catch((error) => {
        console.error('Error joining event:', error);
        alert('Error joining event. Please try again.');
      });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      const isNew = localStorage.getItem('is_new');
      setIsNewUser(isNew === 'true');
      setUserRole(role);
      if (!role) {
        router.push('/login');
      } else {
        if (isNew === 'false' && role === '2') {
          handleFeed();
        } else {
          if (navigator.geolocation) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
              if (result.state === 'granted') {
                getLocationData();
              } else if (result.state === 'prompt') {
                showLocationPrompt();
              } else {
                setLocationPermissionDenied(true);
              }
            });
          } else {
            console.error('Geolocation is not supported by this browser.');
          }
        }
      }
    }
  }, [router]);

  const getLocationData = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        fetch(nominatimUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data.address) {
              const { village, town, city, state, country } = data.address;
              const displayName = data.display_name;
              const location = village || town || city || '';
              setLocationData({
                latitude,
                longitude,
                location,
                state: state || '',
                country: country || '',
                displayName: displayName || '',
              });
            } else {
              console.error('No location details found.');
            }
          })
          .catch((error) => {
            console.error('Error getting location details:', error);
          });
      },
      (error) => {
        console.error('Error getting location:', error);
      }
    );
  };

  const showLocationPrompt = () => {
    navigator.geolocation.getCurrentPosition(getLocationData, () =>
      setLocationPermissionDenied(true)
    );
  };

  return (
    <section className='container'>
      {userRole === '2' ? (
        <div>
          {isNewUser ? (
            <>
              <div className={styles.chipContainer}>
                {Object.entries(categories).map(([category, values]) => (
                  <div key={category} className={styles.category}>
                    <h3>{category}</h3>
                    <div className={styles.chips}>
                      {values.map((value, index) => (
                        <button
                          key={index}
                          className={`${styles.chip} ${preferences.includes(`${category}:${value}`) ? styles.selected : ''}`}
                          onClick={() => handleChipClick(category, value)}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className={styles.submitButton} onClick={handlePreferencesSubmit}>Add Preferences</button>
            </>
          ) : (
            event.length > 0 ? (
              <div className={styles.event_cards}>
                {event.map((event, index) => (
                  <div className={styles.event_card} key={index}>
                    <h2>Name: {event.name}</h2>
                    <p>Address: {event.address}</p>
                    <button
                      className={styles.joinButton}
                      onClick={() => joinEvent(event.id)}
                      disabled={joinedEvents.includes(event.id)}
                    >
                      {joinedEvents.includes(event.id) ? 'Joined' : 'Join Event'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <h2 style={{
                display: 'flex', justifyContent: "center", alignItems: 'center', height: '80vh', maxHeight: '100%'
              }}>No Events found.</h2>
            )
          )}
        </div>
      ) : (
        <div className={styles.account}>
          <h1>Go To My Event</h1>
        </div>
      )}
    </section>
  );
}
