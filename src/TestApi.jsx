import { useEffect, useState } from 'react';

function TestApi() {
    const [data, setData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await fetch('http://localhost:3000/api/hello');
                const json = await result.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    if (!data) return <div>Loading...</div>;

    return (
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    )
}

export default TestApi;
