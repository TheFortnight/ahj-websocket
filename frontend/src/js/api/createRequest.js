const createRequest = async (options, callback) => {
    const request = fetch('http://localhost:3000/new-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options.data),
    });

    const result = await request;

    if (!result.ok) {
        console.error('ERROR!');

        return;
    }

    const json = await result.json();

    const status = json.status;

    console.log('STATUS: ', status);
    
    callback(json);
};

export default createRequest;