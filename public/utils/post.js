// const topic = document.getElementById('topic_id');

// topic.addEventListener('click', (e) => {
//     e.preventDefault();


// });

































const commentForm = document.getElementById('comment_form');

// commentForm.addEventListener('submit', (e) => {
//     e.preventDefault();
    
//     const formData = new FormData(commentForm);
//     const comment = formData.get('comment_area');
    
//     let post = { comment }

//     let token = JSON.parse(localStorage.getItem('items')).auth_token;
//     let id = JSON.parse(localStorage.getItem('items')).id;

//     fetch(`http://127.0.0.1:5000/api/v1/${id}/${id}/comments`, {
//         method: 'POST',
//         body: JSON.stringify(post),
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         }
//     }).then(res => {
//             return res.json();
//         },
//         networkError => console.log(networkError.message)
//     ).then(jsonResponse => {
//         if (jsonResponse.error == 'Signature expired. Please log in again.') {
//             localStorage.removeItem(`${jsonResponse.email}`);
//             window.location.replace('http://127.0.0.1:3000/login.html')
//             console.log(jsonResponse.error)
//         } else {
//             console.log(jsonResponse)
//         }
//     });
// });