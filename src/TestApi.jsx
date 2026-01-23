import { useEffect, useState } from 'react';

function TestApi() {
    const [message, setMessage] = useState("...Loading...");

    async function fetchData() {
        try {
            // Ensure this port matches your running backend (3001 currently)
            const result = await fetch('http://localhost:3001/api/hello');
            const data = await result.json();
            setMessage(data.message);
        } catch (error) {
            console.error("Error fetching data:", error);
            setMessage("Error fetching data: " + error.message);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>
            <h2>API Test Result</h2>
            <p>
                Message: {message}
            </p>
        </div>
    )
}

export default TestApi;
