'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import styles from './myevent.module.css'
import Link from 'next/link';

export default function Dashboard() {
    const router = useRouter();
    const [locationData, setLocationData] = useState(null);
    const [locationPermissionDenied, setLocationPermissionDenied] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState('');
    const [event, setEvent] = useState('');
    const [eventData, setEventData] = useState({
        name: '',
        address: '',
        location_url: '',
        latitude: '',
        longitude: '',
        keywords: [],
    });
    const [keywordInput, setKeywordInput] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://13.50.187.28/api/v1/users/events/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                // Update state with the retrieved data
                setEvent(response?.data?.data?.Items);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    useEffect(() => {
        const userData = localStorage.getItem('role');
        if (!userData) {
            router.push('/login'); // Redirect to login if no userData is found
        } else {
            // Proceed with geolocation check if userData exists
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
    }, [router]);
    useEffect(() => {
        if (locationData) {
            setEventData((prevEventData) => ({
                ...prevEventData,
                address: locationData.displayName,
                location_url: `https://www.google.com/maps/search/?api=1&query=${locationData.latitude},${locationData.longitude}`,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
            }));
        }
    }, [locationData]);
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

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEventData((prevEventData) => ({
            ...prevEventData,
            name: '',
            keywords: [],
        }));
        setKeywordInput('');
    };

    const handleChange = (e) => {
        setEventData({
            ...eventData,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeywordChange = (e) => {
        setKeywordInput(e.target.value);
    };

    const handleAddKeyword = () => {
        if (keywordInput.trim()) {
            setEventData((prevEventData) => ({
                ...prevEventData,
                keywords: [...prevEventData.keywords, keywordInput.trim()],
            }));
            setKeywordInput('');
        }
    };

    const handleDeleteKeyword = (keywordToDelete) => {
        setEventData((prevEventData) => ({
            ...prevEventData,
            keywords: prevEventData.keywords.filter((keyword) => keyword !== keywordToDelete),
        }));
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('access_token');
        axios.post('http://13.50.187.28/api/v1/users/events/', eventData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                alert(response.data.message_code);
                setData(response.data.data)
                handleClose();
            })
            .catch(error => {
                alert('Error creating event:', error);
            });
    };

    return (
        <div className='container'>
            <div className={styles.main}>
                <h1>My Events</h1>
                <Button variant="contained" sx={{ backgroundColor: '#272727', color: '#fff' }} onClick={handleOpen}>
                    Create Event
                </Button>
            </div>
            <div className={styles.event_container}>
                {event.length > 0 ? (
                    <div className={styles.event_cards}>
                        {event.map((event, index) => (
                            <Link href={`/myevent/${event.id}`} key={index} passHref>
                                <div className={styles.event_card}>
                                    <h2>Name: {event.name}</h2>
                                    <p>Address: {event.address}</p>
                                    {/* Add more event details as needed */}
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p>No Events found.</p>
                )}
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create Event
                    </Typography>
                    <TextField
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={eventData.name}
                        onChange={handleChange}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                        <TextField
                            margin="dense"
                            name="keywords"
                            label="Keywords"
                            type="text"
                            fullWidth
                            variant="standard"
                            value={keywordInput}
                            onChange={handleKeywordChange}
                        />
                        <Button onClick={handleAddKeyword} variant="contained" sx={{ ml: 2, backgroundColor: '#272727', color: '#fff', height: '40px' }}>
                            Add
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                            {eventData.keywords.map((keyword, index) => (
                                <Chip
                                    key={index}
                                    label={keyword}
                                    onDelete={() => handleDeleteKeyword(keyword)}
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                    <Button onClick={handleSubmit} variant="contained" sx={{ mt: 2, backgroundColor: '#272727', color: '#fff' }}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}
