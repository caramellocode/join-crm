document.addEventListener('DOMContentLoaded', function () {
    init();
  });


/**
 * Initializes the login process, loads the related event listeners, and checks the remote storage.
 */
function init() {
    generateLogin();
    loadLoginListeners();
    checkRemoteStorage();
}


/**
 * Generates the login interface within the main container of the webpage.
 */
function generateLogin() {
    let mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = loginHTML();
}


/**
 * Adds an event listener to the login form to handle the submit event and prevent its default action.
 */
function loadLoginListeners() {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        loginUser();
    });
}


/**
 * Attempts to log in a user using the provided credentials from the input fields.
 * If the user is found and the credentials match, it redirects to the summary page.
 * Otherwise, it displays an error message.
 */
async function loginUser() {
    let email = document.getElementById('email-input').value.trim();
    let password = document.getElementById('password-input').value.trim();
    let user = await findUser(email, password);
    if (user) {
        removeInputAlert('email-input');
        localStorage.setItem("userId", user.userId);
        showMessageOverlay('Login successful', 'check');
        setTimeout(() => {
            window.location.href = 'summary.html';
        }, "2000");
    } else {
        inputAlert('email-input', 'Unknown user or wrong password. Please try again.');
    }
}


/**
 * Asynchronously finds a user in the stored users data that matches the given email and password.
 * @param {string} email - The email address of the user to find.
 * @param {string} password - The password of the user to match.
 * @returns {Object|null} The user object if a match is found, or null if no match is found.
 */
async function findUser(email, password) {
    let usersJson = await getItem('users');
    let users = JSON.parse(usersJson);
    return users.find(user => user.email === email && user.password === password);
    
}


// CHECK REMOTE STORAGE
/**
 * Checks remote storage for users and tasks data asynchronously.
 */
async function checkRemoteStorage() {
    await checkRemoteStorageUsers();
    await checkRemoteStorageTasks();
}


/**
 * Asynchronously checks and validates the users data in remote storage, retrieving or initializing it if necessary.
 * @throws {Error} When the users array is empty or does not exist, it initializes the users array and logs the error.
 */
async function checkRemoteStorageUsers() {
    try {
        let usersJson = await getItem('users');
        if (usersJson && usersJson !== "undefined") {
            let users = JSON.parse(usersJson);
            if (!users || users.length < 1) {
                throw new Error("Users array is empty.");
            }
        } else {
            throw new Error("Users array did not exist. Creating new array. Please reload the page.");
        }
    } catch (error) {
        console.log(error.message);
        let users = JSON.stringify(rescueUserArray);
        await setItem('users', users);
    }
}


/**
 * Asynchronously checks and validates the tasks data in remote storage, retrieving or initializing it if necessary.
 * @throws {Error} When the tasks array is empty or does not exist, it initializes the tasks array and logs the error.
 */
async function checkRemoteStorageTasks() {
    try {
        let tasksJson = await getItem('tasks');
        if (tasksJson && tasksJson !== "undefined") {
            let tasks = JSON.parse(tasksJson);
            if (!tasks || tasks.length < 1) {
                throw new Error("Tasks array is empty.");
            }
        } else {
            throw new Error("Tasks array did not exist. Creating new array. Please reload the page.");
        }
    } catch (error) {
        console.log(error.message);
        let tasks = JSON.stringify(rescueTaskArray);
        await setItem('tasks', tasks);
    }
}


/**
 * Switches the user interface from the login view to the register view with animations and initializes the registration form.
 */

async function switchToRegister() {
    removeInitFadeIn();
    toggleFadeIn('login-container');
    toggleFadeOut('login-container');
    await new Promise(r => setTimeout(r, 500));
    generateRegister();
    toggleFadeIn('signup-container');
    loadRegisterListeners();
}


/**
 * Switches the user interface from the register view to the login view with animations and initializes the login form.
 */
async function switchToLogin() {
    toggleFadeIn('signup-container');
    toggleFadeOut('signup-container');
    await new Promise(r => setTimeout(r, 500));
    generateLogin();
    removeLogoTransition();
    toggleFadeIn('login-container');
    loadLoginListeners();
}


/**
 * Removes the logo animation class from the logo element.
 */
function removeLogoTransition() {
    logo = document.getElementById('logo');
    logo.classList.remove('logo-animation');
}


/**
 * Removes the fade-out class from the login container element.
 */
function removeInitFadeIn() {
    container = document.getElementById('login-container');
    container.classList.remove('fade-out');
}


/**
 * Toggles the 'fade-out' class on the specified element, adding the class if it's not present and removing it if it is.
 * @param {string} target - The ID of the target element to toggle the 'fade-out' effect on.
 */
function toggleFadeOut(target) {
    registerContainer = document.getElementById(target);
    if (container.classList.contains('fade-out')) {
        container.classList.remove('fade-out');
    } else {
        container.classList.add('fade-out');
    }
}


/**
 * Toggles the 'fade-in' class on the specified element, causing it to either begin or end fading in.
 * @param {string} target - The ID of the target element to toggle the 'fade-in' effect on.
 */
function toggleFadeIn(target) {
    container = document.getElementById(target);
    if (container.classList.contains('fade-in')) {
        container.classList.remove('fade-in');
    } else {
        container.classList.add('fade-in');
    }
}


/**
 * Generates the register interface within the main container of the webpage.
 */
function generateRegister() {
    let mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = registerHTML();
}


/**
 * Adds event listeners to the registration form to handle the submit event and input events.
 */
function loadRegisterListeners() {
    document.getElementById('registration-Form').addEventListener('submit', function(event) {
        event.preventDefault();

        if (validateForm()) {
            registerUser();
        }
    });

    document.getElementById('registration-Form').addEventListener('input', function(event) {
        checkForm();
    });
    
}


/**
 * Checks the registration form for valid input and enables or disables the submit button accordingly.
 */
function checkForm() {
    if (checkName() && checkEmail() && checkPasswords() && checkPrivacyCheckbox()) {
        document.getElementById('register-button').disabled = false;    
    } else {
        document.getElementById('register-button').disabled = true;
    }
}


/**
 * Checks if the 'name' field in the form is not empty.
 * @returns {boolean} True if the 'name' field is filled, false otherwise.
 */


function checkName() {
    let name = document.getElementById('name');
    if (name.value !== "") {
        return true;
    } else {
        return false;
    }
}


/**
 * Checks if the 'email' field in the form is not empty.
 * @returns {boolean} True if the 'email' field is filled, false otherwise.
 */
function checkEmail() {
    let email = document.getElementById('email');
    if (email.value !== "") {
        return true;
    } else {
        return false;
    }
}


/**
 * Checks if the 'password' and 'confirmPassword' fields in the form are not empty.
 * @returns {boolean} True if the 'password' and 'confirmPassword' fields are filled, false otherwise.
 */
function checkPasswords() {
    let password = document.getElementById('password');
    let confirmPassword = document.getElementById('confirmPassword');
    if (password.value !== "" && confirmPassword.value !== "") {
        return true;
    } else {
        return false;
    }
}


/**
 * Checks if the privacy policy checkbox is checked.
 * @returns {boolean} True if the checkbox is checked, false otherwise.
 */
function checkPrivacyCheckbox() {
    let privacyCheckbox = document.getElementById('privacy-checkbox');
    if (privacyCheckbox.checked) {
        return true;
    } else {
        return false;
    }
}


// REGISTER FORM VALIDATION
/**
 * Validates the entire form by checking each field: name, email, password, and privacy checkbox.
 * @returns {boolean} True if all form fields are valid, false otherwise.
 */

function validateForm() {
    return validateName() && validateEmail() && validatePassword() && validatePrivacyCheckbox();
}


/**
 * Validates the name input field against specific criteria: must be two words with at least three letters each.
 * @returns {boolean} True if the name input matches the criteria, false otherwise, displaying an input alert if invalid.
 */
function validateName() {
    let name = document.getElementById('name').value.trim();
    if (!/^[A-Za-z]{3,}\s[A-Za-z]{3,}$/.test(name)) {
        inputAlert('name', 'Two words (Firstname Lastname), minimum 3 letters each.');
        return false;
    }
    removeInputAlert('name');
    return true;
}


/**
 * Validates the email input field against a standard email format.
 * @returns {boolean} True if the email input matches the standard email format, false otherwise, displaying an input alert if invalid.
 */
function validateEmail() {
    let email = document.getElementById('email').value.trim();
    if (!/\S+@\S+\.\S+/.test(email)) {
        inputAlert('email', 'Please enter a valid email address.');
        return false;
    }
    removeInputAlert('email');
    return true;
}


/**
 * Validates the password and confirm password fields, checking length and match criteria.
 * @returns {boolean} True if the password meets the length requirement and both passwords match, false otherwise, displaying an input alert if invalid.
 */
function validatePassword() {
    let password = document.getElementById('password').value.trim();
    let confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (password.length < 6) {
        inputAlert('password', 'Password must be at least 6 characters long.');
        return false;
    }
    if (password !== confirmPassword) {
        inputAlert('confirmPassword', 'Passwords do not match.');
        return false;
    }
    removeInputAlert('password');
    removeInputAlert('confirmPassword');
    return true;
}


/**
 * Validates if the privacy policy checkbox is checked.
 * @returns {boolean} True if the privacy checkbox is checked, false otherwise, displaying an alert if not checked.
 */
function validatePrivacyCheckbox() {
    let privacyCheckbox = document.getElementById('privacy-checkbox');
    if (!privacyCheckbox.checked) {
        checkboxAlert('You must accept the Privacy Policy.');
        return false;
    }
    removeInputAlert('privacy-checkbox');
    return true;
}


// VALIDATION ALERTS
/**
 * Displays an error message directly after a specified input field.
 * @param {string} inputId - The ID of the input element where the error message should be displayed.
 * @param {string} message - The error message to display.
 */
function inputAlert(inputId, message) {
    let inputElement = document.getElementById(inputId);
    let errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    let existingError = inputElement.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
        inputElement.parentNode.removeChild(existingError);
    }
    inputElement.insertAdjacentElement('afterend', errorElement);
}


/**
 * Displays an error message near the checkbox group in the registration form.
 * @param {string} message - The error message to display near the checkbox group.
 */
function checkboxAlert(message) {
    let checkboxGroup = document.getElementById('register-checkbox-group');
    let errorElement = document.createElement('p');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;

    let existingError = checkboxGroup.querySelector('.error-message');
    if (existingError) {
        checkboxGroup.removeChild(existingError);
    }

    checkboxGroup.appendChild(errorElement);
}


/**
 * Removes the error message associated with the specified input field, if it exists.
 * @param {string} inputId - The ID of the input element whose error message should be removed.
 */
function removeInputAlert(inputId) {
    let inputElement = document.getElementById(inputId);
    let parentElement = inputElement.parentNode
    let errorElement = parentElement.querySelector('.error-message')
    if (errorElement) {
        parentElement.removeChild(errorElement);
    }
}


/**
 * Removes all error messages displayed in the form.
 */
function removeAllAlerts() {
    let errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.parentNode.removeChild(element);
    });
}


// REGISTER LOGIC
/**
 * Registers a new user with the provided form data, generates a random color and ID for the user,
 * and adds the user to the database before switching to the login view.
 * Ensures that the passwords match before proceeding with the registration.
 */
async function registerUser() {
    let [firstName, lastName = ''] = document.getElementById('name').value.trim().split(" ");
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    let userData = {email: email, firstName: firstName, initials: `${firstName[0]}${lastName[0]}`, lastName: lastName, password: password, phone: null, userColor: await generateRandomColor(), userContacts: rescueUserArray, userId: await generateRandomId(),
    };
    addUserToDatabase(userData);
    switchToLogin();
}


/**
 * Adds a new user to the database if the user does not already exist.
 * @param {Object} userData - The data of the user to be added.
 */
async function addUserToDatabase(userData) {
    let users = await getUserArray()
    if (!checkIfUserAlreadyExists(users, userData.email)) {
        addUserToUserContacts(userData);
        users.push(userData);
        await setItem('users', JSON.stringify(users));
        console.log('User successfully registered.');
    }
}


/**
 * Checks if a user with the given email already exists in the user array.
 * @param {Array<Object>} users - The array of user objects to search through.
 * @param {string} email - The email address to check against the user array.
 * @returns {boolean} True if the user exists, false otherwise.
 */
function checkIfUserAlreadyExists(users, email) {
    for (let user of users) {
        if (user.email === email.trim()) {
            inputAlert('email', 'This email is already registered. Please log in.');
            return true;
        }
    }
    removeInputAlert('email');
    return false;
}


/**
 * Adds a contact card for the user to their own user contacts list.
 * @param {Object} userData - The data of the user to whom the contact card will be added.
 */
function addUserToUserContacts(userData){
    let userContactCard = {
    firstName: userData.firstName,
    lastName: userData.lastName+'(Me)',
    initials: userData.initials,
    email: userData.email,
    phone: userData.phone,
    userColor: userData.userColor,
    userId: userData.userId,
    }
    userData.userContacts.push(userContactCard);
}