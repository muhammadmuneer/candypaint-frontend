'use client'
import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import axios from 'axios';

export default function EventPage() {
    const [data, setData] = useState(null);
    // const router = useRouter();
    // if (!router.query || !router.query.id) return;
    // const { id } = router.query;

    // useEffect(() => {
    //         const token = localStorage.getItem('access_token')
    //         axios.get('http://13.50.187.28/api/v1/users/events/${id}', {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //             .then(response => {
    //                 setData(response?.data?.data?.Items)
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching data:', error)
    //             });
    // }, [])

    return (
        <div className='container'>
            <h2>Event Details</h2>
            {data ? (
                <div>
                    <p>Name: {data.name}</p>
                    <p>Address: {data.address}</p>
                    <p>Latitude: {data.latitude}</p>
                    <p>Longitude: {data.longitude}</p>
                    <p>Host: {data.host}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
