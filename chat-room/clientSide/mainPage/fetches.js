const GET_MESSAGES_API_LINK = 'http://localhost:3000/msgs';
const SEND_MESSAGES_API_LINK = 'http://localhost:3000/send';

export async function getMessages() {
    let res = await fetch(GET_MESSAGES_API_LINK);
    return res.json();
}

export async function uploadMessage(name, content) {
    fetch(SEND_MESSAGES_API_LINK, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name": name,
          "content": content
        })
    })
}