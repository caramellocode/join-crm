// let contacts = []; <--- Moved to arrays.js
let contactList = [];
let contactLetterGroup = [];


/**
 * Initializes the contact page by loading user data, generating header and sidebar, sorting contacts, and loading contacts.
 */
async function init() {
  await loadUserData();
  await generateHeader(userInitials);
  await generateSidebar();  
  sortContacts();
  loadContacts();
}


/**
 * Loads contacts by initializing the contact list, grouping names, and rendering the contact list.
 */
function loadContacts() {
  contactList = [];
  groupNames();
  renderContactList();
}


/**
 * Renders the contact list by populating the contact list container with categorized contacts.
 */
function renderContactList() {
  let contactListComplete = document.getElementById("contact-list-container");
  contactListComplete.innerHTML = "";
  for (let i = 0; i < contactList.length; i++) {
    const letter = contactList[i]["letter"];
    contactListComplete.innerHTML += `
    <div class="category-letter"><span>${letter}</span></div>
    <div class="contacts-splitter"></div>
    <div id="contacts${i}" class="contacts-list"></div>
    `;
    renderContact(i);
  }
}


/**
 * Renders contacts within a specific category.
 * @param {number} i - The index of the category.
 */
function renderContact(i) {
  let newContactList = document.getElementById(`contacts${i}`);
  newContactList.innerHTML = "";
  for (let j = 0; j < contactList[i]["contacts"].length; j++) {
    const contact = contactList[i]["contacts"][j];
    const initials = contact.firstName[0] + contact.lastName[0];
    const firstName = contact.firstName;
    const lastName = contact.lastName;
    const email = contact.email;
    const userColor = contact.userColor;
    newContactList.innerHTML += generateContact(i,j,initials,firstName,lastName,email,userColor);
  }
}


/**
 * Groups contacts by their first name initials.
 */
function groupNames() {
  for (let i = 0; i < contacts.length; i++) {
    const letter = contacts[i].firstName[0].toUpperCase();
    const initials = contacts[i].initials;
    const firstName = contacts[i].firstName;
    const lastName = contacts[i].lastName;
    const email = contacts[i].email;
    const phone = contacts[i].phone;
    const userColor = contacts[i].userColor;
    const id = contacts[i].userId;
    let contact = {
      id: id,
      initials: initials,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      userColor: userColor,
    };

    contactLetterGroup = contactList.filter(function (list) {
      return list.letter == firstName[0].toUpperCase();
    });

    if (contactLetterGroup.length > 0) {
      contactLetterGroup[0].contacts.push(contact);
    } else {
      contactList.push({
        letter: letter,
        contacts: [
          { id: id,
            initials: initials,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            userColor: userColor,
          },
        ],
      });
    }
  }
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
 * Opens the contact information for a specific contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function openContactInfo(i, j) {
  let contactDetail = document.getElementById("contact-detail");
  if (
    document.getElementById(`contact${i},${j}`).style.backgroundColor !=="rgb(42, 54, 71)") {
    renderContactList();
    loadContactData(i, j, contactDetail);
    changeContactBackgroundColor(i, j);
  } else {
    contactDetail.innerHTML = "";
    renderContactList();
  }
}


/**
 * Loads contact data and renders contact information.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @param {HTMLElement} contactDetail - The container element for contact details.
 */
function loadContactData(i, j, contactDetail) {
  contactDetail.innerHTML = "";
  const contact = contactList[i]["contacts"][j];
  const initials = contact.initials;
  const firstName = contact.firstName;
  const lastName = contact.lastName;
  const email = contact.email;
  const phone = contact.phone;
  const userColor = contact.userColor;
  const id = contact.userId;
  contactDetail.innerHTML = renderContactInfo(i,j,initials,firstName,lastName,email,phone,userColor);
}


/**
 * Adds a new contact to the user's contacts.
 * @returns {Promise<void>} A promise that resolves after the contact is added.
 */
async function addNewContact() {
  let users = JSON.parse(await getItem("users"));
  let fullName = contactname.value.split(' ');
  let firstName = fullName[0];
  let lastName = fullName[fullName.length -1];
  let userColor = await generateRandomColor();
  let newUserId = await generateRandomId();
  user.userContacts.push({
    firstName: firstName,
    lastName: lastName,
    initials: firstName[0] + lastName[0],
    email: email.value,
    phone: phone.value,
    userColor: userColor,
    password: null,
    userId: newUserId,
    userContacts: null
  })
  await saveUserData(users);
  document.getElementById("overlay").style.display = "none";
  showMessageOverlay('Contact saved ', 'contacts')
  init();
}


/**
 * Deletes a contact from the user's contacts.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @returns {Promise<void>} A promise that resolves after the contact is deleted.
 */
async function deleteContact(i, j) {
  let users = JSON.parse(await getItem("users"));
  let contactForDelete = contactList[i]["contacts"][j].id;
  findContactForDelete(contactForDelete);
  document.getElementById("contact-detail").innerHTML = "";
  document.getElementById("overlay").style.display = "none";
  await saveUserData(users);
  init();
}


/**
 * Finds the contact to be deleted from the user's contacts.
 * @param {string} contactForDelete - The ID of the contact to be deleted.
 */
function findContactForDelete(contactForDelete){
    for (let x = 0; x < user.userContacts.length; x++) {
      const contact = user.userContacts[x];
      if(contact.userId == contactForDelete){
        user.userContacts.splice(x, 1);
      }
    }
}


/**
 * Opens an overlay for editing a contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function EditContact(i, j) {
  document.getElementById("overlay").style.display = "flex";
  const contact = contactList[i]["contacts"][j];
  let fullName = contact.firstName+' '+contact.lastName;
  const initials = contact.initials;
  const email = contact.email;
  const phone = contact.phone;
  const userColor = contact.userColor;
  const id = contact.userId;
  document.getElementById("overlay").innerHTML = generateEditOverlay(i,j,initials,fullName,email,phone,userColor);
}


/**
 * Finds the contact to be updated in the user's contacts and updates its information.
 * @param {Object} updatingContact - The contact object containing updated information.
 */
function findUpdatingContact(updatingContact){
  for (let x = 0; x < user.userContacts.length; x++) {
    const contact = user.userContacts[x];
    if(contact.userId == updatingContact.id){
      let fullName = document.getElementById("editName").value.split(' ');
      updatingContact.firstName = fullName[0];
      updatingContact.lastName = fullName[fullName.length-1];
      updatingContact.email = document.getElementById("editEmail").value;
      updatingContact.phone = document.getElementById("editPhone").value;
      user.userContacts.splice(x, 1);
      user.userContacts.push(updatingContact);
    }
  }
}


/**
 * Saves the updated contact information.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 * @returns {Promise<void>} A promise that resolves after the contact information is saved.
 */
async function saveContact(i, j) {
  let users = JSON.parse(await getItem("users"));
  let updatingContact = contactList[i]["contacts"][j];
  findUpdatingContact(updatingContact);
  await saveUserData(users);
  init();
  document.getElementById("overlay").style.display = "none";
  openContactInfo(i, j);
}


/**
 * Opens the contact information for a specific contact.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function openContactInfo(i, j) {
  if (window.innerWidth <= 1049) {
    // Kontaktinformationen laden für kleinere Bildschirme im Popup
    const contactDetail = document.getElementById("popup-contact-detail");
    loadContactData(i, j, contactDetail); // Annahme, dass diese Funktion die Kontaktinformationen lädt

    // Popup anzeigen
    document.getElementById("contact-info-popup").style.display = "block";
  } else {
    // Für größere Bildschirme die Kontaktinformationen im Detailbereich laden
    const contactDetail = document.getElementById("contact-detail");
    loadContactData(i, j, contactDetail); // Lädt die Kontaktinformationen in den Detailbereich
  }
}


/**
 * Closes the contact information popup.
 */
function closePopup() {
  document.getElementById("contact-info-popup").style.display = "none";
}


/**
 * Prevents the default behavior of an event to stop propagation.
 * @param {Event} event - The event object.
 */
function doNotClose(event) {
  event.stopPropagation();
}


/**
 * Changes the background color of a contact element and removes hover effect.
 * @param {number} i - The index of the category.
 * @param {number} j - The index of the contact within the category.
 */
function changeContactBackgroundColor(i, j) {
  let contact = document.getElementById(`contact${i},${j}`);
  contact.style.backgroundColor = "#2A3647";
  contact.classList.remove("contact-hover");
  document.getElementById(`contact${i},${j}-name`).style.color = "#FFFFFF";
}


/**
 * Opens the overlay to add a new contact.
 */
function openAddNewContact() {
  //const windowWidth =
  //  window.innerWidth ||
  //  document.documentElement.clientWidth ||
  //  document.body.clientWidth;
  //if (windowWidth <= 1050) {
  //  document.querySelector(".add-contact-button").style.display = "none";
  //}
  document.getElementById("overlay").style.display = "flex";
  document.getElementById("overlay").innerHTML = generateAddNewOverlay();
}


/**
 * Closes the overlay for adding a new contact.
 */
function closeAddContact() {
  document.getElementById("overlay").style.display = "none";

  const windowWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  if (windowWidth <= 1050) {
    document.querySelector(".add-contact-button").style.display = "block";
  }
}