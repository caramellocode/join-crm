/**
 * Logs in as a guest user. If the guest user already exists, it sets the user ID and redirects to the summary page. Otherwise, it creates a new guest user and calls the init() function.
 */
async function guestLogin() {
    let usersJson = await getItem('users');
    try {
        let users = JSON.parse(usersJson);
        let user = users.find(user => user.userId === 123456);
        if (user) {
            localStorage.setItem('userId', user.userId);
            showMessageOverlay('Login successful', 'check');
            setTimeout(() => {
                window.location.href = 'summary.html';
            }, "2000");
        } else {
            await setGuestUser();
            init();
        }
    } catch (error) {
        console.error('Error parsing users JSON', error);
    }
}


/**
 * Sets up a guest user by adding it to the list of users. If the user already exists, it logs a message and does nothing.
 */
async function setGuestUser() {
    let usersJson = await getItem('users');
    let users = JSON.parse(usersJson);
    let guestUser = {
        email: 'GuestUser@test.com',
        phone: '0171-1234567',
        userColor: '#ff0000',
        userId: 123456,
        firstName: 'Guest',
        lastName: 'User',
        initials: 'GU',
        password: "guest",
        userContacts: rescueUserArray
        }
        users.push(guestUser);
        addUserToUserContacts(guestUser);
        await setItem('users', JSON.stringify(users));
        console.log('Guest user added. Please try again.');
};


/**
 * Retrieves user data from remote storage and logs it to the console.
 * If no user data is found, it logs a message indicating so.
 * Handles errors that occur during retrieval or parsing of user data.
 */
async function showUsersOnRemoteStorage() {
    try {
        let usersJson = await getItem('users');
        if (usersJson) {;
            console.log(usersJson);
            console.log(JSON.parse(usersJson));
        } else {
            console.log("Keine Nutzerdaten gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Abrufen oder Parsen der Nutzerdaten:", error);
    }
}


