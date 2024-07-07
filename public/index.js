document.addEventListener("DOMContentLoaded", function() {
     // Select elements for login/register and dashboard sections
     const loginSection = document.getElementById('login-section');
     const dashboardSection = document.getElementById('profile-section');
     const discussionSection = document.getElementById('discussion-section');
     const pollsSection = document.getElementById('polls-section');
     const ctaDisplay = document.getElementById('cta-display');
     const announcementSection = document.getElementById('announcement-section');

    // Function to check if the user is logged in
    const isLoggedIn = () => {
        // Send a request to the server to check if the user is authenticated
        fetch('/isLoggedIn')
            .then(response => response.json())
            .then(data => {
                if (data.isLoggedIn) {
                    // User is logged in, display the dashboard section and hide the login section
                    loginSection.style.display = 'none';
                    dashboardSection.style.display = 'block';
                    discussionSection.style.display = 'block';
                    pollsSection.style.display = 'block';
                    ctaDisplay.style.display = 'none';
                    announcementSection.style.display = 'block';
                } else {
                    // User is not logged in, display the login section and hide the dashboard section
                    loginSection.style.display = 'block';
                    dashboardSection.style.display = 'none';
                    discussionSection.style.display = 'none';
                    pollsSection.style.display = 'none';
                    ctaDisplay.style.display = 'block';
                    announcementSection.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error checking authentication status:', error);
                // alert('An error occurred while checking authentication status.');
            });
    };

    // Call the isLoggedIn function to check authentication status when the page loads
    isLoggedIn();

    // Select the logout link
    var logoutLink = document.querySelector('#logout-link');

    // Event listener for logout link click
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default anchor behavior

        // Send a request to the server to logout the user
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Logout successful, redirect the user to the login page
                window.location.href = '/login';
            } else {
                // Handle logout failure
                console.error('Logout failed:', response.statusText);
                alert('Logout failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while logging out. Please try again later.');
        });
    });

});

