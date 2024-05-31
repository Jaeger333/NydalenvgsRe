const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit', login)

async function login(evt) {
        evt.preventDefault(); // Prevent the default form submissionzz
    
        try {
            let username = loginForm.username.value;
            let password = loginForm.password.value;
            
            const formData = {
                username: username,
                password: password
            }

            const response = await fetch('/login', {
                method: 'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });
            
            const user = await response.json();
    
            // Assuming the JSON response structure is { id: "someId", username: "someUsername" }
            // Adjust this according to your actual response structure
            if (user){ 
                console.log(user);
                if (user.role === "Admin") {
                    console.log("Admin logged in")
                    window.location.href = '/admin.html'
                } else if (user.role === "Elev") {
                    alert("Elever kan ikke logge inn her.")
                    console.log("Student logged in")
                } else if (user.role === "Inactive") {
                    alert("Brukeren din er ikke aktivert, kontakt administrator.")
                    console.log("Student logged in")
                } else if (user.role === "IT-medarbeider") {
                    window.location.href = '/it.html'
                    console.log("IT-medarbeider logged in")
                } else {
                    console.log("User logged in")
                    window.location.href = '/app.html'
                }
                // Possibly redirect the user or update UI to show a successful login
            } else {
                // Handle case where user data is not in the expected format
                throw new Error('Unsuccessful login. Please try again.');
            }
        } catch (error) {
            console.log('Failed to fetch thisUser:', error);
        }
    }
    
      