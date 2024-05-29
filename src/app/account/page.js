'use client'
import React, { useState, useEffect } from 'react'
import styles from './account.module.css'

const categories = {
  Mood: [
    'Chill',
    'Energetic',
    'Relaxed',
    'Vibrant',
    'Cozy',
    'Bohemian',
    'Sophisticated',
    'Fun',
    'Playful',
    'Mellow',
  ],
  //   Ambience: [
  //     'Intimate',
  //     'Inviting',
  //     'Electric',
  //     'Romantic',
  //     'Festive',
  //     'Laid-back',
  //     'Warm',
  //     'Modern',
  //     'Rustic',
  //     'Glamorous',
  //   ],
  //   PartyThemes: [
  //     'Tropical Luau',
  //     '1920s Gatsby',
  //     'Disco Fever',
  //     'Hollywood Red Carpet',
  //     'Masquerade Ball',
  //     'Carnival/Circus',
  //     'Beach Bash',
  //     'Winter Wonderland',
  //     'Casino Night',
  //     'Around the World',
  //   ],
}

export default function Account() {
  const [locationData, setLocationData] = useState(null)
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getLocationData()
        } else if (result.state === 'prompt') {
          showLocationPrompt()
        } else {
          setLocationPermissionDenied(true)
        }
      })
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const getLocationData = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        // Reverse geocode the coordinates to get location details
        const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`

        fetch(nominatimUrl)
          .then((response) => response.json())
          .then((data) => {
            if (data.address) {
              const { village, town, city, state, country } = data.address
              const displayName = data.display_name // New line to get display name
              const location = village || town || city || ''
              setLocationData({
                latitude,
                longitude,
                location,
                state: state || '',
                country: country || '',
                displayName: displayName || '', // Add displayName to locationData
              })
            } else {
              console.error('No location details found.')
            }
          })
          .catch((error) => {
            console.error('Error getting location details:', error)
          })
      },
      (error) => {
        console.error('Error getting location:', error)
      }
    )
  }

  const showLocationPrompt = () => {
    navigator.geolocation.getCurrentPosition(getLocationData, () =>
      setLocationPermissionDenied(true)
    )
  }

  return (
    <div className={styles.account}>
      <h2>Account Page</h2>
      <p>Welcome to your account!</p>
      {locationPermissionDenied ? (
        <p>Please enable location services to get your location.</p>
      ) : locationData ? (
        <div>
          <p>Location: {locationData.displayName || 'N/A'}</p>
          <p>State: {locationData.state}</p>
          <p>Country: {locationData.country}</p>
        </div>
      ) : (
        <p>Loading location...</p>
      )}

      <div className={styles.chipContainer}>
        {Object.entries(categories).map(([category, values]) => (
          <div key={category} className={styles.category}>
            <h3>{category}</h3>
            <div className={styles.chips}>
              {values.map((value, index) => (
                <button key={index} className={styles.chip}>
                  {value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
