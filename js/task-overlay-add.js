let temporaryAssignedTo = [];
let newTaskPrio = "medium";
let temporarySubtasks = [];
let temporarySubtasksDone = [];
let temporaryTaskStatus = "";

/**
 * Loads contacts for the add overlay.
 * Renders the list of contacts available for assignment in the add overlay.
 */
function loadContactsForAddOverlay() {
  let contactList = document.getElementById("add-assigned-editors");
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let initials = contact.firstName.charAt(0) + contact.lastName.charAt(0);
    let userColor = contact.userColor;
    let firstName = contact.firstName;
    let lastName = contact.lastName;
    contactList.innerHTML += renderContacts(
      i,
      userColor,
      firstName,
      lastName,
      initials
    );
  }
  sortContacts();
}


/**
 * Opens the add task card overlay.
 * Displays the add task card overlay and loads contacts for assignment.
 * 
 * @param {string} taskStatus - The status of the task to be added.
 */
function openAddTaskCard(taskStatus) {
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  document.getElementById("add-task-overlay").style.display = "flex";
  temporaryTaskStatus = taskStatus;
  loadContactsForAddOverlay();
}


/**
 * Adds a new task.
 * Retrieves task details from the input fields and creates a new task object.
 * Saves the new task to the task array.
 */
function addNewTask() {
  let newTask = {
    title: document.getElementById("add-task-title-input").value,
    description: document.getElementById("add-task-description-input").value,
    assignedTo: checkedArray,
    dueDate: document.getElementById("add-task-date-input").value,
    prio: newTaskPrio,
    category: document.getElementById("add-new-task-category").value,
    status: temporaryTaskStatus,
    subtasks: temporarySubtasks,
    subTasksDone: temporarySubtasksDone,
  };
  createSubtasksDoneArray();
  saveNewAddedTask(newTask);
}


/**
 * Saves the newly added task to the task array.
 * @param {object} newTask - The new task object containing task details.
 */
function saveNewAddedTask(newTask) {
  tasks.push(newTask);
  temporaryAssignedTo = [];
  temporaryTaskStatus = "";
  newTaskPrio = "";
  showMessageOverlay('Task added to Board', 'board');
  setTimeout(() => {
    closeAddTaskCard();
  }, "2000");
  setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}


/**
 * Closes the add task card overlay and resets temporary data.
 */
function closeAddTaskCard() {
  temporarySubtasks = [];
  document.getElementById("add-task-subtasks-container").innerHTML = "";
  document.getElementById("add-assigned-editors").innerHTML = "";
  document.getElementById("add-task-overlay").style.display = "none";
  document.body.style.overflow = "auto";
  setNewTaskPrio("medium", "#FFA800")
  clearInputOverlay();
}


/**
 * Shows the dropdown list of contacts in the add task overlay.
 * Resets the checkedArray and clears the assigned contacts in the overlay.
 */
function showDropdownContactsAddOverlay() {
  let dropdown = document.getElementById("add-assigned-editors");
  let backgroundOverlay = document.getElementById('background-overlay');
  if (dropdown.style.display == "none") {
    let tooMuchEditors = document.getElementById('tooMuchEditors');
    if(tooMuchEditors.style.display !== 'none'){
      tooMuchEditors.style.display = 'none';
    }
    dropdown.style.display = "block";
    backgroundOverlay.style.display = 'block';
    checkedArray = [];
    clearAssignedToAddOverlay();
  } else {
    hideDropdownContacts();
  }
}


/**
 * Hides the dropdown list of contacts in the add task overlay.
 * Resets the checkedArray and adds the assigned contacts to the overlay.
 */
function hideDropdownContactsAdd(){
  let dropdown = document.getElementById("add-assigned-editors");
  let backgroundOverlay = document.getElementById('background-overlay');
  dropdown.style.display = "none";
  backgroundOverlay.style.display = 'none';
  addAssignedEditorsAddOverlay();
}


/**
 * Adds the assigned contacts to the add task overlay.
 */
function addAssignedEditorsAddOverlay() {
  for (let i = 0; i < contacts.length; i++) {
    const checkedEditor = contacts[i];
    checkIfContactCheckboxChecked(checkedEditor, i);
  }
}


/**
 * Checks if the contact checkbox is checked and adds the assigned editors to the add task overlay.
 * @param {object} checkedEditor - The contact object.
 * @param {number} i - The index of the contact in the contacts array.
 */
function checkIfContactCheckboxChecked(checkedEditor, i) {
  let checkbox = document.getElementById(`checkbox${i}`).checked;
  let showAssignedEditors = document.getElementById( "show-assigned-editors-container");
  let tooMuchEditors = document.getElementById('tooMuchEditors');
  let userColor = checkedEditor.userColor;
  let initials = checkedEditor.firstName.charAt(0) + checkedEditor.lastName.charAt(0);

  if (checkbox == true) {
    checkedArray.push(checkedEditor);
    if(checkedArray.length > 3){
      tooMuchEditors.style.display = 'flex';
      tooMuchEditors.innerHTML = `+${checkedArray.length - 3}`;
    }else {
      showAssignedEditors.innerHTML += `<div id="editor${i}" class="drop-initials" style="background-color: ${userColor}">${initials}</div>`;
    }
}
}


/**
 * Clears the assigned editors displayed in the add task overlay.
 */

function clearAssignedToAddOverlay() {
  document.getElementById("show-assigned-editors-container").innerHTML = "";
}


/**
 * Sets the priority of the new task and updates the UI accordingly.
 * @param {string} newPrio - The priority of the new task.
 * @param {string} buttonColor - The color of the priority button.
 */
function setNewTaskPrio(newPrio, buttonColor) {
  if(newPrio == ''){
    newTaskPrio = "medium";
  }else{
    newTaskPrio = newPrio;
  }
  
  resetPrioColors();
  document.getElementById(newPrio).style.backgroundColor = buttonColor;
  document.getElementById(`${newPrio}-text-add`).style.color = "#FFFFFF";
  document.getElementById(
    `${newPrio}-img-add`
  ).src = `/assets/img/prio_${newPrio}_white_icon.png`;
}


/**
 * Resets the color and styles of all priority buttons to their default state.
 */
function resetPrioColors() {
  ["urgent", "medium", "low"].forEach((priority) => {
    document.getElementById(priority).style.backgroundColor = "";
    document.getElementById(`${priority}-text-add`).style.color = "";
    document.getElementById(
      `${priority}-img-add`
    ).src = `/assets/img/prio_${priority}_icon.png`;
  });
}


/**
 * Activates the check and cancel buttons for adding a subtask.
 */
function activateCheckCancelButtons() {
  document
    .getElementById("add-task-active-subtask-icon-box")
    .classList.remove("d-none");
  document
    .getElementById("add-task-create-subtask-icon-box")
    .classList.add("d-none");
}


/**
 * Clears the input field for adding a subtask and hides the check button while showing the create button.
 */
function clearSubtaskInput() {
  document.getElementById("add-task-subtask-input").value = "";
  document
    .getElementById("add-task-active-subtask-icon-box")
    .classList.add("d-none");
  document
    .getElementById("add-task-create-subtask-icon-box")
    .classList.remove("d-none");
}


/**
 * Adds a new subtask to the temporarySubtasks array and renders the updated list of subtasks.
 */
function addSubtask() {
  let subtask = document.getElementById("add-task-subtask-input").value;
  if(subtask !== ''){
    temporarySubtasks.push(subtask);
    renderSubtasks();
    clearSubtaskInput();
  }
}


/**
 * Renders the list of subtasks in the add task overlay.
 */
function renderSubtasks() {
  let subtasksContainer = document.getElementById(
    "add-task-subtasks-container"
  );
  subtasksContainer.innerHTML = "";
  for (let i = 0; i < temporarySubtasks.length; i++) {
    const subtask = temporarySubtasks[i];
    subtasksContainer.innerHTML += `
    <div class="edit-subtask">
        
    <div onclick="editSubtask(${i})" class="subtask-list-item" id="editable-subtask${i}" onMouseOver="showIcons(${i})" onMouseOut="hideIcons(${i})">
        <span>• ${subtask}</span>            
        <div id="edit-task-active-subtask-icon-box${i}" class="edit-task-active-subtask-icon-box" style="opacity:0;" >                
        <img src="assets/img/subtask_edit_icon.png" alt="Check" onclick="editSubtask(${i})" />
        <div class="sub-divider"></div>
        <img src="assets/img/subtask_delete_icon.png" alt="Delete" onclick="deleteSubtask(${i})" />
    </div>


</div>
    <div id="editSubtaskContainer${i}"  style="display: none" class="edit-task-subtask-input-container">
      <input id="editSubtaskInput${i}" value="${subtask}" class="edit-subtask-input">    
        <div class="edit-task-active-subtask-icon-box">                
            <img src="assets/img/subtask_delete_icon.png" alt="Delete" onclick="deleteSubtask(${i})" />
            <div class="sub-divider"></div>
            <img src="assets/img/subtask_check_icon.png" alt="Check" onclick="changeSubtask(${i})" />
        </div>
    </div>
</div>
  `;
  }
}


/**
 * Allows editing of a subtask in the add task overlay.
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
  if (!temporarySubtasks.length == 0) {
    document.getElementById(`editable-subtask${i}`).style.display = "none";
    document.getElementById(`editSubtaskContainer${i}`).style.display = "flex";
  }
}


/**
 * Deletes a subtask from the temporary subtasks array and re-renders the subtasks in the add task overlay.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
  temporarySubtasks.splice(i, 1);
  renderSubtasks();
  clearSubtaskInput();
}


/**
 * Updates the value of a subtask in the temporary subtasks array and re-renders the subtasks in the add task overlay.
 * @param {number} i - The index of the subtask to change.
 */
function changeSubtask(i) {
  let subtask = document.getElementById(`editSubtaskInput${i}`).value;
  if(subtask !== ''){
    temporarySubtasks[i] = document.getElementById(`editSubtaskInput${i}`).value;
    renderSubtasks();
    clearSubtaskInput();
  }
}


/**
 * Creates an array of subtasks with initial checked status as false based on the temporarySubtasks array.
 */
function createSubtasksDoneArray() {
  for (let i = 0; i < temporarySubtasks.length; i++) {
    const subtask = temporarySubtasks[i];
    let subtaskDoneJson = {
      subname: subtask,
      checked: false,
    };
    temporarySubtasksDone.push(subtaskDoneJson);
  }
}


/**
 * Shows the edit and delete icons for a specific subtask when hovered over.
 * @param {number} i - The index of the subtask to show icons for.
 */
function showIcons(i) {
  document.getElementById(
    `edit-task-active-subtask-icon-box${i}`
  ).style.opacity = 1;
}


/**
 * Hides the edit and delete icons for a specific subtask when mouse is moved out.
 * @param {number} i - The index of the subtask to hide icons for.
 */
function hideIcons(i) {
  document.getElementById(
    `edit-task-active-subtask-icon-box${i}`
  ).style.opacity = 0;
}
