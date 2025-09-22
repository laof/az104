

Array.from(document.querySelectorAll('.question-discussion-header')).forEach(header => header.remove());
fetch('http://localhost:3000/create', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: location.pathname.replace('/', ''), text: document.querySelector('html').outerHTML })
})
    .then(response => response.json())
    .then((res) => {
        console.info(res.message);
    }).catch((error) => {
        console.error('Error:', error);
    });