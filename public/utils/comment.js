const urlParams = new URLSearchParams(window.location.search);
const post = urlParams.get('post');
const bodyText = urlParams.get('body');
const id = urlParams.get('id')

if (post) {
    console.log(post)

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


const form = document.getElementById('comment_form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const comment = formData.get('comment');
    const username = urlParams.get('username');

    if (username) {
        let details = JSON.parse(localStorage.getItem(username)); // Local storage key

        fetch(`http://127.0.0.1:5000/api/v1/${details.id}/${id}/comments`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true
            }
        }).then()
        .then();
    }
});

// postForm.id = 'comment_form';
// let commentSubmit = document.createElement('button');
// commentSubmit.textContent = 'post';
// let postComment = document.createElement('textarea');
// append(postForm, [postComment, br, commentSubmit])
// postComment.id = 'comment_area';
// postComment.name = 'comment_area';


// const topics = document.querySelectorAll('.topic_id')
// console.log(topics)

// topics.forEach(topic => {
//     topic.addEventListener('click', (e) => {
//         e.preventDefault();

//         // window.location.replace('http://127.0.0.1:3000/index.html?username=' + jsonResponse.username)

//     });
// });

// const commentForm = document.getElementById('comment_form');

// commentForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     const formData = new FormData(commentForm);
//     const comment = formData.get('comment_area');

//     let post = { comment }

//     let token = JSON.parse(localStorage.getItem('items')).auth_token;
//     let id = JSON.parse(localStorage.getItem('items')).id;


// });