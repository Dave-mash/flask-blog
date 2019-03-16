let commentParams = new URLSearchParams(window.location.search);
const post = commentParams.get('post');
const bodyText = commentParams.get('body');
const id = commentParams.get('id')

console.log(post)

if (post) {

    fetch(`http://127.0.0.1:5000/api/v1/${id}/comments`)
        .then(res => {
                return res.json();
            },
            networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            const title = document.getElementById('post_title');
            const body = document.getElementById('post_body');
            title.textContent = post;
            body.textContent = bodyText;

            let commentDiv = document.querySelector('.comments_list');

            if (jsonResponse.comments) {
                jsonResponse.comments.forEach(comment => {
                    let contentDiv = document.createElement('div');
                    contentDiv.className = 'comment_item';
                    let b = document.createElement('b');
                    b.textContent = comment.username;
                    let p = document.createElement('p');
                    p.className = 'comment_text';
                    p.textContent = comment.comment;
                    contentDiv.appendChild(b)
                    contentDiv.appendChild(p)
                    commentDiv.appendChild(contentDiv)
                });
            }
            console.log(jsonResponse)
        });
}

console.log('running comment.js')


const commentForm = document.getElementById('comment_form');
console.log(commentForm)
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(commentForm);
    let span = document.getElementById('span');

    if (formData.get('comment')) {

        span.innerHTML = ''

        const comment = {
            "comment": formData.get('comment')
        };
        const commentUrl = window.location.href; // url

        if (commentUrl.includes('username')) {
            const params = new URLSearchParams(window.location.search);
            let username = params.get('username')
            let user = JSON.parse(localStorage.getItem(username)); // Local storage key

            fetch(`http://127.0.0.1:5000/api/v1/${user.id}/${id}/comments`, {
                method: 'POST',
                body: JSON.stringify(comment),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.auth_token}`,
                    'Access-Control-Allow-Credentials': true
                }
            }).then(res => {
                    return res.json()
                },
                networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                let now = new Date().getHours();
                let diff = now - user.timestamp;
                if (diff >= 24) {
                    localStorage.removeItem(`${jsonResponse.email}`);
                    window.location.href('http://127.0.0.1:3000/login.html');
                } else {
                    console.log('Token is valid!')
                    console.log(jsonResponse)
                }
            });
        } else {
            window.location.href = "http://127.0.0.1:3000/login.html"
        }
    } else {
        let b = document.createElement('b');
    
        b.textContent = 'Please add a comment!'
        b.style.color = 'red';
        span.innerHTML = '';
        span.appendChild(b)
    }
});
