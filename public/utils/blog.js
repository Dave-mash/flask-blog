const mainDiv = document.querySelector('.post_container');

const append = (parent, children) => {
    children.forEach(child => {
        parent.appendChild(child);
    })
}

// GET
fetch('http://127.0.0.1:5000/api/v1/posts')
    .then(res => {
            if (res.ok) {
                return res.json();
            }
            throw new Error('Request failed!')
        },
        networkError => console.log(networkError.message))
    .then(jsonResponse => {
        jsonResponse['posts'].reverse();
        mainDiv.innerHTML = '';
        jsonResponse['posts'].forEach(post => {
            let postDiv = document.createElement('div');
            let postTitle = document.createElement('h3');
            postTitle.style.cursor = 'pointer';
            postTitle.setAttribute('data-user-id', post['id'])
            let postBody = document.createElement('p');
            let anchorTag = document.createElement('a');
            anchorTag.setAttribute('href', 'post.html');
            anchorTag.setAttribute('href', 'post.html');
            anchorTag.id = 'topic_id';
            let postTime = document.createElement('b');
            let br = document.createElement('br');
            let postForm = document.createElement('form');
            // postForm.id = 'comment_form';
            // let commentSubmit = document.createElement('button');
            // commentSubmit.textContent = 'post';
            // let postComment = document.createElement('textarea');
            // append(postForm, [postComment, br, commentSubmit])
            // postComment.id = 'comment_area';
            // postComment.name = 'comment_area';
            postTime.innerHTML = post['createdAt'];
            anchorTag.textContent = post['title'];
            postTitle.appendChild(anchorTag);
            postBody.innerHTML = post['body'];
            postDiv.id = 'post_item';
            append(postDiv, [postTitle, postBody, postTime, br, postForm])
            mainDiv.appendChild(postDiv);
            console.log(mainDiv)
        }); 
        
        console.log(jsonResponse)
    });

const form = document.getElementById('post_form');


// POST
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const title = formData.get('title');
    const body = formData.get('textarea');
    
    let post = { title, body }

    /* grabbing items from the url */

    const urlParams = new URLSearchParams(window.location.search);
    const myParams = urlParams.get('username');
    let username = JSON.parse(localStorage.getItem(myParams)); // Local storage key

    // Send req
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
        let now = new Date().getHours();
        let diff = now - username.timestamp;
        if (diff >= 24) {
            localStorage.removeItem(`${jsonResponse.email}`);
            window.location.replace('http://127.0.0.1:3000/login.html');
        } else {
            console.log("It's not yet 24hrs")
        }
    });
});
