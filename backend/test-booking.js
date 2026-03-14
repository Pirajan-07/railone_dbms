async function test() {
    try {
        // 1. Login
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Logged in:", loginData);

        // 2. Search for train
        console.log("Getting trains...");
        const trainsRes = await fetch('http://localhost:5000/api/trains');
        const trainsData = await trainsRes.json();
        const trainId = trainsData[0].train_id || trainsData[0]._id;
        console.log("Selected Train ID:", trainId);

        // 3. Book
        console.log("Booking...");
        const bookRes = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                trainId: trainId,
                travelDate: '2026-03-24',
                numberOfTickets: 2
            })
        });
        
        const bookData = await bookRes.json();
        if (bookRes.ok) {
            console.log("Booking SUCCESS:", bookData);
        } else {
            console.error("Booking ERRORED:", bookData);
        }
    } catch(err) {
        console.error("Booking ERRORED (network):", err);
    }
}

test();
