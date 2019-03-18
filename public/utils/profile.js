const socket = io();

const userDetails = document.querySelector('.user_details');

let profileUrlParams = new URLSearchParams(window.location.search);
let username = profileUrlParams.get('username');
let store = JSON.parse(localStorage.getItem(username));

socket.on('removePost', (postDiv) => {
    postDiv.innerHtml = '';
});

// user's posts
fetch(`http://127.0.0.1:5000/api/v1/profile/${store.id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${store.auth_token}`
        }
    })
    .then(res => {
            return res.json()
        },
        networkError => console.log(networkError)
    ).then(jsonResponse => {
        let h3 = document.createElement('h3');
        h3.textContent = jsonResponse.user.username;
        let home = document.getElementById('home_id');
        home.style.cursor = 'pointer';
        home.addEventListener('click', () => {
            window.location.href = `http://127.0.0.1:3000/index.html?username=` + username;
        });
        userDetails.appendChild(h3);
        let image = document.createElement('img');
        image.style.width = '100px';
        image.style.length = '100px';
        image.setAttribute('src', `../images/${jsonResponse.user.image}`)
        userDetails.appendChild(image);

        // posts

        let posts = document.querySelector('.posts');
        jsonResponse.posts.forEach(post => {
            let postDiv = document.createElement('div');
            let postTitle = document.createElement('b');
            postTitle.textContent = post.title;
            postTitle.style.cursor = 'pointer';
            let postTime = document.createElement('i');
            postTime.textContent = post.createdAt;
            postDiv.appendChild(postTitle);
            postDiv.appendChild(postTime);
            let del = document.createElement('button');
            del.className = 'delete_btn';
            del.textContent = 'delete';
            postDiv.appendChild(del);
            posts.appendChild(postDiv);

            const user = {
                first_name,
                last_name,
                email,
                username,
                password,
                image
            };

            postTitle.addEventListener('click', () => {
                fetch(`http://127.0.0.1:5000/api/v1/profile/${store.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(post),
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${store.auth_token}`
                    }
                })
                .then(res => {
                    console.log(store.auth_token)
                    console.log(res)
                    return res.json();
                },
                networkError => console.log(networkError)
                ).then(jsonResponse => {
                    console.log(jsonResponse);
                });
            });

            del.addEventListener('click', () => {
                fetch(`http://127.0.0.1:5000/api/v1/${store.id}/posts/${post.id}`, {
                        method: 'DELETE',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${store.auth_token}`
                        }
                    })
                    .then(res => {
                            console.log(store.auth_token)
                            console.log(res)
                            return res.json();
                        },
                        networkError => console.log(networkError)
                    ).then(jsonResponse => {
                        console.log(postDiv);
                        socket.emit('deletePost', postDiv);
                    });
            });
        });
        console.log(jsonResponse);
    });

// fetch user's posts


// fetch user's comments


// delete a post
socket.on('connect', () => {
    console.log('Profile page connected to Node server!');
})