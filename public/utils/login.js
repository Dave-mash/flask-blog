// user log in event

const form = document.getElementById('login-form')
const loginUrl = 'http://127.0.0.1:5000/api/v1/auth/login';

let span = document.getElementById('error_span')
let b = document.createElement('b')

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');

    let span = document.getElementById('error_span');
    let b = document.createElement('b');
    span.style.width = '100%';
    span.style.marginTop = '10px';
    span.style.textAlign = 'center';

    const user = { email, password };
    
    // highlights empty fields
    
    fetch(loginUrl, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
        return response.json();          
    }, networkError => console.log(networkError.message)
      ).then(jsonResponse => {
            console.log(jsonResponse)
            span.innerHTML = '';
            let emailInput = document.getElementById(`email`)
            let passwordInput = document.getElementById(`password`)
        
            if (!email) {
                b.textContent = 'Email is required!'
                b.style.color = 'red'
                b.className = 'error_message'
                span.appendChild(b)
                emailInput.style.border = '1.8px solid red'
            } else if (!password) {
                b.textContent = 'Password is required!'
                b.style.color = 'red'
                b.className = 'error_message'
                span.appendChild(b)
                passwordInput.style.border = '1.8px solid red'
            } else {
                span.innerHTML = '';
                passwordInput.style.border = 'none'
                emailInput.style.border = 'none'
            }

            if (span.children.length == 0) {

                if (jsonResponse.error) {
                    b.textContent = `${jsonResponse.error}`;
                    b.style.color = 'red';
                    b.className = 'error_message';
                    document.getElementById('error_span').appendChild(b);
                } else {
                    document.getElementById('error_span').innerHTML = ''
                }
            console.log(jsonResponse.error)
            }
            if (!jsonResponse.error) {
                let details = {
                    id: jsonResponse.id,
                    auth_token: jsonResponse.auth_token,
                    username: jsonResponse.username,
                    timestamp: new Date().getHours()
                }
                localStorage.setItem(jsonResponse.username, JSON.stringify(details));
                window.location.replace('http://127.0.0.1:3000/index.html?username=' + jsonResponse.username)
            }
      });
});

