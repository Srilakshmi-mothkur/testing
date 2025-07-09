import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { axiosInstance } from '../utils/axiosInstance';
import { addToQueue, getQueuedProgress, clearQueue } from '../utils/progressQueue';


const StudentUpdate = ({ student, goBack }) => {
    const [social, setSocial] = useState(5);
    const [creative, setCreative] = useState(5);
    const [moral, setMoral] = useState(5);
    const [note, setNote] = useState('');
    const [photo, setPhoto] = useState(null);
    const [suggestedActivity, setSuggestedActivity] = useState('');
    const [loading, setLoading] = useState(false);
    const [locationPermission, setLocationPermission] = useState(null);


    useEffect(() => {
        console.log("Checking geolocation availability...");

        // Handle geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    console.log("Location granted:", pos.coords);
                },
                (err) => {
                    console.warn("Location error:", err.message);
                }
            );
        } else {
            console.error("Geolocation not supported");
        }

        // Handle offline progress sync
        const syncOfflineProgress = async () => {
            if (!navigator.onLine) return;

            const queue = getQueuedProgress();
            if (queue.length === 0) return;

            const token = localStorage.getItem('token');
            for (let entry of queue) {
                try {
                    const formData = new FormData();
                    formData.append('social', entry.social);
                    formData.append('creative', entry.creative);
                    formData.append('moral', entry.moral);
                    formData.append('note', entry.note);
                    formData.append('lat', entry.lat);
                    formData.append('lng', entry.lng);
                    if (entry.photo) formData.append('photo', entry.photo);

                    await axiosInstance.post(
                        `/api/progress/${entry.studentId}/add`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
                } catch (err) {
                    console.warn("🔁 Sync failed for one entry:", err);
                    return; // Keep queue intact if one fails
                }
            }

            clearQueue();
            alert("✅ Offline progress synced successfully!");
        };

        window.addEventListener('online', syncOfflineProgress);

        // Also run it immediately on mount
        syncOfflineProgress();

        return () => {
            window.removeEventListener('online', syncOfflineProgress);
        };
    }, []);



    const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

    const getWeakestDimension = () => {
        const levels = { social, creative, moral };
        return Object.entries(levels).sort((a, b) => a[1] - b[1])[0][0];
    };

    const handleSuggestActivity = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axiosInstance.get(
                `/api/progress/suggest-activity/${student._id}`,
                {
                    params: { weakDimension: getWeakestDimension(), social, creative, moral, note },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSuggestedActivity(res.data?.suggestion?.activity || 'No suggestion available');
        } catch (err) {
            console.error(err);
            setSuggestedActivity('Error fetching activity suggestion.');
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('social', social);
        formData.append('creative', creative);
        formData.append('moral', moral);
        formData.append('note', note);
        if (photo) formData.append('photo', photo);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                formData.append('lat', position.coords.latitude);
                formData.append('lng', position.coords.longitude);

                const progressData = {
                    studentId: student._id,
                    social,
                    creative,
                    moral,
                    note,
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    timestamp: new Date().toISOString(),
                    photo, // optional
                };

                if (!navigator.onLine) {
                    addToQueue(progressData);
                    alert("📥 Offline: Progress saved locally. It will sync automatically when you're online.");
                    goBack();
                    return;
                }

                try {
                    const token = localStorage.getItem('token');
                    await axiosInstance.post(
                        `/api/progress/${student._id}/add`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data',
                            },
                        }
                    );
                    alert('✅ Progress updated!');
                    goBack();
                } catch (err) {
                    console.error(err);
                    alert('❌ Failed to submit progress');
                }
            },
            (error) => {
                console.error("GPS error:", error);
                alert("⚠️ Please enable location to submit progress.");
            }
        );
    };


    return (
        <div style={{
            maxWidth: '540px',
            margin: '1rem auto',
            backgroundColor: '#fff',
            borderRadius: '10px',
            padding: '1.5rem',
            boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
            fontFamily: 'sans-serif'
        }}>
            <button onClick={goBack} style={{
                background: 'none', border: 'none', color: '#555',
                fontSize: '0.9rem', marginBottom: '1rem', cursor: 'pointer'
            }}>← Back to Students</button>

            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>📘 Update Progress: {student.name}</h2>

            {locationPermission === 'denied' && (
                <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '0.8rem' }}>
                    ⚠️ Location access is blocked. Please enable it in your browser settings to continue.
                </p>
            )}

            {[{ icon: '🌱', label: 'Social', value: social, setter: setSocial },
            { icon: '🎨', label: 'Creative', value: creative, setter: setCreative },
            { icon: '🧠', label: 'Moral', value: moral, setter: setMoral }].map(({ icon, label, value, setter }) => (
                <div key={label} style={{ marginBottom: '0.7rem' }}>
                    <label style={{ fontWeight: 600 }}>{icon} {label}: {value}</label>
                    <input
                        type="range" min="1" max="10" value={value}
                        onChange={(e) => setter(Number(e.target.value))}
                        style={{ width: '100%', marginTop: '0.3rem' }}
                    />
                </div>
            ))}

            <div style={{ margin: '0.9rem 0' }}>
                <label style={{ fontWeight: 600 }}>📝 Notes</label>
                <textarea
                    rows="2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                        width: '100%', padding: '0.5rem',
                        borderRadius: '6px', border: '1px solid #ccc',
                        marginTop: '0.3rem', resize: 'vertical'
                    }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontWeight: 600 }}>📸 Upload Photo</label><br />
                <input type="file" accept="image/*" onChange={handlePhotoChange} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    onClick={handleSuggestActivity}
                    disabled={loading}
                    style={{
                        backgroundColor: '#facc15',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.4rem 0.8rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}>
                    💡 Suggest Activity
                </button>
                {loading && <p style={{ fontSize: '0.9rem', marginTop: '0.4rem' }}>🔄 Loading...</p>}
                {suggestedActivity && (
                    <div style={{
                        backgroundColor: '#ecfdf5',
                        borderLeft: '4px solid #22c55e',
                        padding: '0.7rem',
                        borderRadius: '6px',
                        marginTop: '0.5rem',
                        fontSize: '0.9rem'
                    }}>
                        <strong>📌 Suggested Activity:</strong> {suggestedActivity}
                    </div>
                )}
            </div>

            <button onClick={handleSubmit} style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.6rem',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                border: 'none',
                width: '100%',
                cursor: 'pointer'
            }}>
                ✅ Submit Progress
            </button>
        </div>
    );
};

export default StudentUpdate;
