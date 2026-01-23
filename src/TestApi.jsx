import { useEffect, useState } from 'react';

function TestApi() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Set body background to black for this page
        document.body.style.backgroundColor = "black";
        document.body.style.margin = "0";

        async function fetchData() {
            try {
                const result = await fetch('http://localhost:3001/api/hello');
                const json = await result.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();

        // Cleanup styles when unmounting
        return () => {
            document.body.style.backgroundColor = "";
            document.body.style.margin = "";
        };
    }, []);

    if (!data) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

    return (
        <pre style={{
            color: 'white',
            fontFamily: 'monospace',
            fontSize: '20px',
            padding: '20px',
            margin: 0
        }}>
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

export default TestApi;
