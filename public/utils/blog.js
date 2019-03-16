const mainDiv = document.querySelector('.post_container');

const append = (parent, children) => {
    children.forEach(child => {
        parent.appendChild(child);
    })
}

// GET blog posts

fetch('http://127.0.0.1:5000/api/v1/posts')
    .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Request failed!')
        },
        networkError => console.log(networkError.message))
    .then(jsonResponse => {
        let a = document.getElementById('log_state');
        a.textContent = window.location.search ? 'logout' : 'login';
        a.style.cursor = 'pointer';
        jsonResponse['posts'].reverse();
        mainDiv.innerHTML = '';
        jsonResponse['posts'].forEach(post => {
            let postDiv = document.createElement('div');
            let postTitle = document.createElement('h3');
            postTitle.style.cursor = 'pointer';
            postTitle.setAttribute('data-post-id', post['id'])
            let postBody = document.createElement('p');
            postTitle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('clicked')
                let urlSearch = new URLSearchParams(window.location.search);
                let username = urlSearch.get('username');
                if (username) {
                    window.location.href = 'http://127.0.0.1:3000/comment.html' + '?username=' + username + '&post=' + postTitle.textContent + '&body=' + postBody.textContent + '&id=' + post['id']
                } else {
                    window.location.href = 'http://127.0.0.1:3000/comment.html' + '?post=' + postTitle.textContent + '&body=' + postBody.textContent + '&id=' + post['id']
                }
            });
            postTitle.className = 'topic_id';
            let postTime = document.createElement('b');
            let br = document.createElement('br');
            let postForm = document.createElement('form');
            postTime.innerHTML = post['createdAt'];
            postTitle.textContent = post['title'];
            postBody.innerHTML = post['body'];
            postDiv.id = 'post_item';
            append(postDiv, [postTitle, postBody, postTime, br, postForm])
            mainDiv.appendChild(postDiv);
            console.log(mainDiv)
        });

        console.log(jsonResponse)
    });


const profile = document.getElementById('profile_anchor_tag');
profile.addEventListener('click', () => {
    let profileParams = new URLSearchParams(window.location.search);
    let myParams = profileParams.get('username');
    let span = document.getElementById('login_prompt');
    if (myParams) {
        span.innerHTML = '';
        window.location.href = 'http://127.0.0.1:3000/profile.html?username=' + myParams;
    } else {
        span.textContent = 'Please log in first to access your profile page!';
    }
});


const log = document.getElementById('log_state');
log.addEventListener('click', (e) => {
    if (log.textContent == 'logout') {
        console.log(log)
        let blogParams = new URLSearchParams(window.location.search);
        let myParams = blogParams.get('username');
        let storedUser = JSON.parse(localStorage.getItem(myParams));
        console.log(storedUser.id);
        fetch(`http://127.0.0.1:5000/api/v1/auth/${storedUser.id}/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${storedUser.auth_token}`
                }
            })
            .then(res => {
                    return res.json()
                },
                networkError => console.log(networkError.message))
            .then(jsonResponse => {
                console.log(jsonResponse);
                window.location.replace('http://127.0.0.1:3000/index.html');
                console.log(storedUser)
                localStorage.removeItem(storedUser);
            });
    } else if (log.textContent == 'login') {
        window.location.href = 'http://127.0.0.1:3000/login.html';
    }
});

const form = document.getElementById('post_form');

// POST blog
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title');
    const body = formData.get('textarea');
    let span = document.getElementById('span');

    if (title && body) {

        span.innerHTML = ''
        let post = {
            title,
            body
        }

        /* grabbing items from the url */

        let urlParams = new URLSearchParams(window.location.search);
        let myParams = urlParams.get('username');
        let username = JSON.parse(localStorage.getItem(myParams)); // Local storage key

        // Send req
        if (username) {
            fetch(`http://127.0.0.1:5000/api/v1/${username.id}/posts`, {
                method: 'POST',
                body: JSON.stringify(post),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${username.auth_token}`
                }
            }).then(res => {
                    return res.json()
                },
                networkError => console.log(networkError.message)
            ).then(jsonResponse => {
                if (jsonResponse.error) {
                    let b = document.createElement('b');
                    b.style.color = 'red';
                    b.textContent = jsonResponse.error;
                }

                let now = new Date().getHours();
                let diff = now - username.timestamp;
                if (diff >= 24) {
                    localStorage.removeItem(`${jsonResponse.email}`);
                    window.location.href('http://127.0.0.1:3000/login.html');
                } else {
                    console.log('Not yet 24hrs')
                    console.log(jsonResponse)
                }
            });
        }
    } else {

        const error = (text) => {
            let b = document.createElement('b');
            b.style.color = 'red';
            b.textContent = text;
            span.innerHTML = '';
            span.appendChild(b)
        }

        if (!title && body) {
            error('Please provide a title!');
        } else if (title && !body) {
            error('Please provide a body!');
        } else if (!title && !body) {
            error('Please provide a title and a body!');
        }
    }

});