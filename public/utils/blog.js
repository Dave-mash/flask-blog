const mainDiv = document.querySelector('.post_container');
const socket = io();

const append = (parent, children) => {
    children.forEach(child => {
        parent.appendChild(child);
    })
}

const postsHandler = (post) => {
    let postDiv = document.createElement('div');
    let postTitle = document.createElement('h3');
    postTitle.style.cursor = 'pointer';
    let postBody = document.createElement('p');
    let title = document.createElement('b');
    title.textContent = post['title'];
    let author = document.createElement('i');
    author.textContent = post['author'] + ': ';
    author.style.color = 'blue';
    console.log(title)
    postTitle.className = 'topic_id';
    postTitle.appendChild(author);
    postTitle.appendChild(title);
    let postTime = document.createElement('b');
    let span = document.createElement('span');
    let b = document.createElement('b');
    b.textContent = post.author
    span.appendChild(postTitle);
    span.appendChild(b);
    let br = document.createElement('br');
    postTime.textContent = new Date(post.createdOn).toString().split(' G')[0];
    postBody.textContent = post['body'];
    postDiv.id = 'post_item';
    append(postDiv, [postTitle, postBody, postTime, br])
    mainDiv.insertBefore(postDiv, mainDiv.childNodes[0]);
    title.addEventListener('click', (e) => {
        console.log('clicked')
        let urlSearch = new URLSearchParams(window.location.search);
        let username = urlSearch.get('username');
        if (username) {
            let user = JSON.parse(localStorage.getItem(username));
            user['post'] = post['id'];
            // user['post'][postTitle.textContent] = ;
            localStorage.setItem(username, JSON.stringify(user));
            window.location.href = 'http://127.0.0.1:3000/comment.html' + '?username=' + username + '&post=' + title.textContent + '&body=' + postBody.textContent;
        } else {
            window.location.href = 'http://127.0.0.1:3000/comment.html' + '?post=' + title.textContent + '&body=' + postBody.textContent + '&id=' + post['id']
        }
    });
}

socket.on('disconnect', () => {
    console.log('Disconnected from server!')
});

// Incoming posts

socket.on('newPost', (post) => {
    postsHandler(post);
    console.log('New post!', post)
});

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
        mainDiv.innerHTML = '';
        jsonResponse['posts'].forEach(post => {
            postsHandler(post);
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
        span.style.color = 'red';
    }
});


const home = document.getElementById('home_anchor_tag');
home.addEventListener('click', () => {
    let profileParams = new URLSearchParams(window.location.search);
    let myParams = profileParams.get('username');
    let span = document.getElementById('login_prompt');
    if (myParams) {
        span.innerHTML = '';
        window.location.href = 'http://127.0.0.1:3000/index.html?username=' + myParams;
    } else {
        window.location.href = 'http://127.0.0.1:3000/index.html';
    }
});


const log = document.getElementById('log_state');

log.addEventListener('click', (e) => {
    if (log.textContent == 'logout') {
        console.log(log)
        let blogParams = new URLSearchParams(window.location.search);
        let myParams = blogParams.get('username');
        let storedUser = JSON.parse(localStorage.getItem(myParams));
        
        console.log(storedUser)

        fetch(`http://127.0.0.1:5000/api/v1/auth/${storedUser.id}/logout`, {
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${storedUser.auth_token}`
                }
            })
            .then(res => {
                    console.log(res)
                    return res.json()
                },
                networkError => console.log(networkError.message))
            .then(jsonResponse => {
                console.log(jsonResponse);
                // window.location.replace('http://127.0.0.1:3000/index.html');
                localStorage.removeItem(storedUser);
            });
    } else if (log.textContent == 'login') {
        window.location.href = 'http://127.0.0.1:3000/login.html';
    }
});

const form = document.getElementById('post_form');


socket.on('connect', () => {
    console.log('Blog page connected to Node server!')
    
    // POST blog
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const title = formData.get('title');
        const body = formData.get('textarea');
        let span = document.getElementById('span');

        if (title && body) {

            span.innerHTML = ''
            /* grabbing items from the url */

            let urlParams = new URLSearchParams(window.location.search);
            let myParams = urlParams.get('username');
            let username = JSON.parse(localStorage.getItem(myParams)); // Local storage key

            let post = {
                author: myParams,
                title,
                body,
                createdOn: new Date().toString().split(' G')[0]
            }
            form.reset()

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
                        socket.emit('createPost', post)
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

});