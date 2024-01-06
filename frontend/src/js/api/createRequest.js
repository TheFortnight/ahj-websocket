const createRequest = async (options, callback) => {
    const request = fetch('https://websocket-chat-3iqe.onrender.com/new-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options.data),
    });

    const result = await request;

    const json = await result.json();

    const status = json.status;

    console.log('STATUS: ', status);
    
    callback(json);
};

export default createRequest;