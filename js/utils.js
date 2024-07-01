let contacts = [];
let tasks = [];
let userInitials = '';
let checkedArray = [];


/**
 * Toggles the display of the header-dropdown menu.
 */
function toggleDropdown() {
    var dropdown = document.getElementById("dropdownMenu");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}


/**
 * Generates a random 6-digit user ID.
 * @returns {Promise<number>} A promise that resolves to the generated 6-digit user ID.
 */
async function generateRandomId() {
    newUserId = Math.floor(100000 + Math.random() * 900000)
    if (!await checkIfUserIdAlreadyExists(newUserId)) {
        return newUserId;
    } else {
    }
}


/**
 * Checks if a user ID already exists in the user array.
 * @param {number} newUserId - The user ID to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the user ID already exists, otherwise false.
 */
async function checkIfUserIdAlreadyExists(newUserId) {
    let users = await getUserArray()
    let user = users.find(user => user.userId === newUserId);
    if (user) {
        return true;
    } else {
        return false;
    }
}


/**
 * Adds a click event listener to redirect to the summary page when the mobile logo is clicked.
 * @param {Event} e - The click event object.
 */
document.addEventListener('click', function(e) {
    if (e.target && e.target.id == 'mobile-logo') {
        // Weiterleitung zur 'summary.html'-Seite
        window.location.href = 'summary.html';
    }
});

/**
 * Clears the data stored in the local storage and reloads the page.
 */
function clearDataBase() {
    localStorage.clear();
    location.reload();
}



/**
 * Generates a random hexadecimal color code.
 * @returns {string} A random hexadecimal color code.
 */
async function generateRandomColor() {
    let randomColor = Math.floor(Math.random()*16777215).toString(16);
    while (randomColor.length < 6) {
        randomColor = "0" + randomColor;
    }
    return "#" + randomColor;
}


/**
 * Generates the header.
 * If the user is logged in, it displays the header with user initials.
 * If the user is not logged in, it displays the header for logged out state.
 * 
 * @param {string} userInitials - The initials of the logged-in user.
 */
async function generateHeader(userInitials) {
    let header = document.getElementById("header-container");
    if (await userIsLoggedIn()) {
        header.innerHTML = headerHTML(userInitials);
    } else {
        header.innerHTML = headerLoggedOutHTML();
    }
}


/**
 * Generates the sidebar.
 * If the user is logged in, it displays the sidebar with logged-in user options.
 * If the user is not logged in, it displays the sidebar for logged-out state.
 */
async function generateSidebar() {
    let sidebar = document.getElementById("sidebar-container");
    if (await userIsLoggedIn()){
        sidebar.innerHTML = sidebarHTML();
    } else {
        sidebar.innerHTML = sidebarLoggedOutHTML();
    }
}


/**
 * Checks if the user is logged in by verifying if the userId is stored in the localStorage.
 * Placeholder function for user authentication once we know how a Backend will handle user authentication.
 * @returns {boolean} True if the user is logged in, otherwise false.
 */
async function userIsLoggedIn() {
    if (await localStorage.getItem('userId') === null) {
        return false;
    } else {
        return true;
    }
}


/**
 * Checks if the user is allowed to access the current page by verifying if they are logged in.
 * If not logged in, redirects the user to the index page.
 */
async function userIsAllowed() {
    if (!await userIsLoggedIn()) {
        window.location.href = 'index.html';
    }
}


/**
 * Logs out the user by clearing local storage and redirecting them to the index page.
 */
function logout() {
    localStorage.clear();
    showMessageOverlay('Logout successful', 'check');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, "2000");

    
  }


/**
 * Redirects the user to the summary page if logged in, otherwise to the index page.
 */
async function goHome() {
    if (await userIsLoggedIn()) {
        window.location.href = 'summary.html';
    } else {
        window.location.href = 'index.html';
    }
}


/**
 * Displays a message overlay with the given message for a short period of time.
 * @param {string} message - The message to be displayed in the overlay.
 */
function showMessageOverlay(message, icon){
    let messageOverlay = document.getElementById("message");
    messageOverlay.style.display = "flex";
    messageOverlay.innerHTML = `
    <div class="message-style" >
        <span>${message} </span><img src="assets/img/sidebar_${icon}_icon.svg" alt="">
    </div>
    `;
    setTimeout(() => {
        messageOverlay.style.display = "none";
      }, "2000");
}


/**
 * Loads user data.
 */
async function loadUserData() {
    let userId = localStorage.getItem('userId');
    user = await findUserData(userId);
    if(user){
        userInitials = user.initials;
        contacts = user.userContacts;
    }
}


/**
 * Finds user with userId.
 * @param {number} userId 
 * @returns {json} - user data.
 */
async function findUserData(userId){
    let users = JSON.parse(await getItem("users"));
    return users.find(user => user.userId === parseInt(userId));
}


/**
 * Saves user data to users array.
 * @param {json} users 
 */
async function saveUserData(users){
    let userId = user.userId;
    await findUserData(userId);
        if (user){
                const pos = users.findIndex(user => user.userId === userId);
                users[pos].userContacts = user.userContacts;
                users.push();
                await setItem('users', JSON.stringify(users));
    }
}


/**
 * Populates the contact list in the UI with contacts data.
 * Iterates through the `contacts` array, creating an HTML representation for each contact that includes their
 * initials, name, and user color. This representation is then appended to the contact list element in the UI.
 * After populating the list, it calls `sortContacts` to order the contacts.
 */
function loadContactList(){
    let contactList = document.getElementById('assigned-editors');
    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let initials = contact.firstName.charAt(0) + contact.lastName.charAt(0);
        let userColor = contact.userColor;
        let firstName = contact.firstName;
        let lastName = contact.lastName;
        let userId = contact.userId;
        contactList.innerHTML += renderContacts(i, userColor, firstName, lastName, initials);
    }
      sortContacts();
  }


  /**
 * Sorts contacts alphabetically by first name.
 */
function sortContacts() {
    contacts.sort((a, b) => {
      if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
        return -1;
      } else if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }


  /**
 * Prevents the event from propagating further in the event hierarchy.
 * This function can be used to stop the event from bubbling up and triggering parent event listeners.
 *
 * @param {Event} event - The event object to stop propagation for.
 */
function doNotClose(event) {
    event.stopPropagation();
  }


  /**
 * Checks if the Enter key is pressed and triggers the addition of a subtask.
 *
 * @param {Event} e - The event object associated with the key press.
 */
function checkForEnter(e){
    if(e.keyCode == 13 || e.which == 13){
      addSubtask();
    }
  }


/**
 * Asynchronously loads tasks from storage and parses them into the `tasks` variable.
 * It tries to retrieve and parse the 'tasks' item from storage. If successful, it logs the loaded tasks.
 * In case of an error, it catches and logs the error as a warning. Finally, it calls `renderTasks` to update the UI.
 */
async function loadTasksfromStorage(){
    try{
      tasks = JSON.parse(await getItem('tasks'));
    }catch(e){
      console.warn('loading error:', e)
    }
    renderTasks();
  }


  /**
 * Pushes assigned editor details to a task.
 * @param {number} index - The index of the task.
 * @param {string} initials - The initials of the assigned editor.
 * @param {string} userColor - The color associated with the assigned editor.
 * @param {string} firstName - The first name of the assigned editor.
 * @param {string} lastName - The last name of the assigned editor.
 * @param {string} userId - The ID of the assigned editor.
 */
function pushAssignedTo(index, initials, userColor, firstName, lastName, userId){
    let assignedToTask = {
      firstName: firstName,
      lastName: lastName,
      initials: initials,
      userColor: userColor,
      userId: userId
    };
    tasks[index]['assignedTo'].push(assignedToTask);
    renderAssignedToCards(index);
  }


/**
 * Asynchronously loads user contacts. It first sorts the contacts and then loads the contact list.
 */
async function loadUserContacts(){
    sortContacts();
    loadContactList();
  }


function locateTo(mainContainer, container){
  document.getElementById(mainContainer).classList.add('d-none');
  document.getElementById(container).classList.remove('d-none');
}

function back(mainContainer, container){
  document.getElementById(mainContainer).classList.remove('d-none');
  document.getElementById(container).classList.add('d-none');
}

function clearInput(){
  document.getElementById("add-task-form").reset();
  document.getElementById("show-assigned-editors-container").innerHTML = '';
  document.getElementById("add-task-subtasks-container").innerHTML = '';
  subtaskTempArray = [];
  checkedArray = [];
  document.getElementById("assigned-editors").innerHTML = '';
  loadUserContacts();
}

function clearInputOverlay(){
    document.getElementById("add-task-form").reset();
    document.getElementById("show-assigned-editors-container").innerHTML = '';
    document.getElementById("add-task-subtasks-container").innerHTML = '';
    subtaskTempArray = [];
    checkedArray = [];
    //document.getElementById("assigned-editors").innerHTML = '';
    //loadUserContacts();
  }

/**
 * Changes the image source to the hover version when hovering over an element.
 * @param {string} img - The identifier of the element being hovered over.
 */
function hover(img) {
    document
      .getElementById(img+"-img")
      .setAttribute("src", "assets/img/"+img+"_hover_icon.png");
}


/**
 * Changes the image source back to the original version when hovering out of an element.
 * @param {string} img - The identifier of the element being hovered out of.
 */
function unhover(img) {
    document
      .getElementById(img +"-img")
      .setAttribute("src", "assets/img/"+img+"_icon.png");
}