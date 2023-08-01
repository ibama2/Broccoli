import axios from 'axios';
const endpoint = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth';

export async function register(name: String, email: String) {
    const response = await axios.post(endpoint, {
        name,
        email
    });
    return response;
}