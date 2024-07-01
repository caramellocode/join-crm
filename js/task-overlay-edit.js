/**
 * Opens the edit overlay for the task at the specified index.
 * @param {number} i - The index of the task to edit.
 */
function openEditOverlay(i) {
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
  loadTaskData(i);
  loadContactList();
}


/**
 * Loads task data into the edit overlay.
 * @param {number} i - The index of the task.
 */
function loadTaskData(i) {
  let title = tasks[i]["title"];
  let description = tasks[i]["description"];
  let dueDate = tasks[i]["dueDate"];
  document.getElementById("overlay").innerHTML = generateEditTaskOverlay(
    i,
    title,
    description,
    dueDate
  );
  showEditPrio(i);
  renderAssignedToEdit(i);
  renderEditSubtasks(i);
}


/**
 * Checks if a checkbox is checked and calls corresponding functions to update its state.
 * @param {number} i - The index number of the checkbox.
 */
function checkIfAssigned(i){
  let checkbox = document.getElementById(`checkbox${i}`).checked;
  if(checkbox == false){
    setUnAssigned(i); 
  }

  if(checkbox == true){
    setAssigned(i);
  }
}


/**
 * Sets the assigned state for a given element identified by index.
 * @param {number} i - The index number of the element.
 */
function setAssigned(i){
  document.getElementById(`assigned-contact${i}`).style = "background-color: #2A3647; color: white";
  document.getElementById(`checked${i}`).src ="assets/img/check_checked.png";
}


/**
 * Sets the unassigned state for a given element identified by index.
 * @param {number} i - The index number of the element.
 */
function setUnAssigned(i){
  document.getElementById(`assigned-contact${i}`).style = "color: black";;
  document.getElementById(`checked${i}`).src ="assets/img/check_unchecked.png";
}


/**
 * Displays a dropdown list of contacts and shows a overlay.
 * @param {number} index - The index of the dropdown.
 */
function showDropdownContacts(index){
  let dropdown = document.getElementById('assigned-editors');
  let backgroundOverlay = document.getElementById('background-overlay');
  let tooMuchEditors = document.getElementById(`tooMuchEditorsEdit${index}`);
  if(dropdown.style.display == 'none'){
    dropdown.style.display = 'block';
    backgroundOverlay.style.display = 'block';
    checkedArray = [];
    clearAssignedTo(index);
    document.getElementById(`tooMuchEditorsEdit${index}`).style.display = 'none';
    if(tooMuchEditors.style.display !== 'none'){
      tooMuchEditors.style.display = 'none';
    }
  }else{
    hideDropdownContacts(index);
  } 
}


/**
 * Hides the dropdown list of contacts and removes the background overlay.
 * @param {number} index - The index of the dropdown.
 */
function hideDropdownContacts(index){
  let dropdown = document.getElementById('assigned-editors');
  let backgroundOverlay = document.getElementById('background-overlay');
  dropdown.style.display = "none";
  backgroundOverlay.style.display = 'none';
  addAssignedEditors(index);
}



/**
 * Adds assigned editors to the display and updates associated data.
 * @param {number} index - The index associated with the dropdown.
 */
function addAssignedEditors(index){
  let showAssignedEditors = document.getElementById('show-assigned-editors-edit-container');
  let tooMuchEditors = document.getElementById(`tooMuchEditorsEdit${index}`);
  for (let i = 0; i < contacts.length; i++) {
    const checkedEditor = contacts[i];
    let userColor = checkedEditor.userColor;
    let initials = checkedEditor.firstName.charAt(0) + checkedEditor.lastName.charAt(0);
    let checkbox = document.getElementById(`checkbox${i}`).checked;
    if(checkbox == true){
      checkedArray.push(checkedEditor);
      if(checkedArray.length > 3){
        tooMuchEditors.style.display = 'flex';
        tooMuchEditors.innerHTML = `+${checkedArray.length - 3}`;
      }else {
      showAssignedEditors.innerHTML += `
      <div id="editor${i}" class="drop-initials" style="background-color: ${userColor}">${initials}</div>
      `;
    }
  }
  }
}


/**
 * Clears the assigned editors section in the edit overlay.
 * @param {number} index - The index of the task.
 */
function clearAssignedTo(index) {
  document.getElementById("show-assigned-editors-edit-container").innerHTML ="";
  tasks[index]["assignedTo"].splice(0, tasks[index]["assignedTo"].length);
}


/**
 * Renders the assigned editors section in the edit overlay.
 * @param {number} index - The index of the task.
 */
function renderAssignedToEdit(index){
  let assignedTo = document.getElementById(`show-assigned-editors-edit-container`);
  assignedTo.innerHTML = '';
    if(tasks[index]['assignedTo'].length > 3){
      checkIfToMuchEditorsEdit(assignedTo, index);
    }else {
      notToMuchEditorsEdit(assignedTo, index);
    }
  }


  /**
 * Checks if there are more than 3 assigned editors and renders them accordingly in the edit overlay.
 * @param {HTMLElement} assignedTo - The container element to render the assigned editors.
 * @param {number} index - The index of the task.
 */
  function checkIfToMuchEditorsEdit(assignedTo, index){
    for (let i = 0; i < 3; i++) {
      const checkedEditor = tasks[index]['assignedTo'][i];
      let initials = checkedEditor.initials;
      let userColor = checkedEditor.userColor;
      let tooMuchEditors = document.getElementById(`tooMuchEditorsEdit${index}`);
      tooMuchEditors.style.display = 'flex';
      tooMuchEditors.innerHTML = `+${tasks[index]['assignedTo'].length - 3}`;
      assignedTo.innerHTML += renderAssignedToInitials(i, userColor, initials);
    }
  }


  /**
 * Renders the assigned editors in the edit overlay when there are less than or equal to 3 assigned editors.
 * @param {HTMLElement} assignedTo - The container element to render the assigned editors.
 * @param {number} index - The index of the task.
 */
  function notToMuchEditorsEdit(assignedTo, index){
    for (let i = 0; i < tasks[index]['assignedTo'].length; i++) {
      const checkedEditor = tasks[index]['assignedTo'][i];
      let initials = checkedEditor.initials;
      let userColor = checkedEditor.userColor;
      assignedTo.innerHTML += renderAssignedToInitials(i, userColor, initials);
    }
  }


  /**
 * Saves the edited task details to the task array and updates the storage.
 * @param {number} i - The index of the task to be edited.
 */
async function saveTask(i) {
  tasks[i]["title"] = document.getElementById("edit-task-title-input").value;
  tasks[i]["description"] = document.getElementById("edit-task-description-input").value;
  tasks[i]["dueDate"] = document.getElementById("edit-task-form-input").value;
  tasks[i]["prio"];
  tasks[i].assignedTo = checkedArray;
  tasks[i]["subtasks"];
  createSubtasksDoneArrayEditOverlay(i);
  tasks.push();
  setItem("tasks", JSON.stringify(tasks));
  loadTasksfromStorage();
  closeEditOverlay();
  init();
  openTaskDetails(i);
}


/**
 * Closes the edit task overlay.
 */
async function closeEditOverlay() {
  document.getElementById("overlay").style.display = "none";
  document.body.style.overflow = "auto";
}


/**
 * Displays the priority of the task in the edit overlay.
 * @param {number} i - The index of the task.
 */
function showEditPrio(i) {
  const prio = tasks[i]["prio"];
  const colorMap = {
    "urgent": "#FF3D00",
    "medium": "#FFA800",
    "low": "#7AE229"
  };
  document.getElementById(prio).style.backgroundColor = colorMap[prio];
  document.getElementById(`${prio}-text`).style.color = "#FFFFFF";
  document.getElementById(`${prio}-img-edit`).src = `/assets/img/prio_${prio}_white_icon.png`;
}


/**
 * Sets the priority of the task and updates the UI accordingly.
 * @param {number} i - The index of the task.
 * @param {string} newPrio - The new priority value ('urgent', 'medium', or 'low').
 * @param {string} buttonColor - The background color for the priority button.
 */
function setPrio(i, newPrio, buttonColor) {
  resetColors();
  tasks[i]["prio"] = newPrio;
  document.getElementById(newPrio).style.backgroundColor = buttonColor;
  document.getElementById(`${newPrio}-text`).style.color = "#FFFFFF";
  document.getElementById(`${newPrio}-img-edit`).src = `/assets/img/prio_${newPrio}_white_icon.png`;
}


/**
 * Resets the color and icon of priority buttons to their default state.
 */
function resetColors() {
  ["urgent", "medium", "low"].forEach((priority) => {
    document.getElementById(priority).style.backgroundColor = "";
    document.getElementById(`${priority}-text`).style.color = "";
    document.getElementById(`${priority}-img-edit`).src = `/assets/img/prio_${priority}_icon.png`;
  });
}


/**
 * Renders the subtasks in the edit task overlay.
 * @param {number} index - The index of the task in the tasks array.
 */
function renderEditSubtasks(index) {
  let subtasksContainer = document.getElementById("edit-task-subtasks-container");
  subtasksContainer.innerHTML = "";
  for (let i = 0; i < tasks[index]["subtasks"].length; i++) {
    const subtask = tasks[index]["subtasks"][i];
    subtasksContainer.innerHTML += generateEditSubtasks(i, index, subtask);
  }
}


/**
 * Adds a new subtask to the task in the edit task overlay.
 * @param {number} i - The index of the task in the tasks array.
 */
function addSubtaskEditOverlay(i) {
  let subtask = document.getElementById("add-task-subtask-input").value;
  if(subtask  !== ''){
    tasks[i]["subtasks"].push(subtask);
    setItem("tasks", JSON.stringify(tasks));
    renderEditSubtasks(i);
    clearSubtaskInput(i);
  }
}


/**
 * Displays the input field for editing a subtask in the edit task overlay.
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtaskEditOverlay(i, index) {
  if (!tasks[index]['subtasks'].length == 0) {
    document.getElementById(`editable-subtask${i}`).style.display = "none";
    document.getElementById(`editSubtaskContainer${i}`).style.display = "flex";
  }
}


/**
 * Deletes a subtask from the task being edited in the edit task overlay.
 * @param {number} i - The index of the subtask to delete.
 * @param {number} index - The index of the task being edited.
 */
function deleteSubtaskEditOverlay(i, index) {
  tasks[index]["subtasks"].splice(i, 1);
  tasks[index]["subTasksDone"].splice(i, 1);
  setItem("tasks", JSON.stringify(tasks));
  renderEditSubtasks(index);
  clearSubtaskInput();
  refreshTasks();
}


function changeSubtaskEditOverlay(i, index) {
  let subtask = document.getElementById(`editSubtaskInput${i}`).value;
  if(subtask !== ''){
  tasks[index]["subtasks"][i] = document.getElementById(`editSubtaskInput${i}`).value;
  tasks[index]["subTasksDone"][i] = document.getElementById(`editSubtaskInput${i}`).value;
  setItem("tasks", JSON.stringify(tasks));
  renderEditSubtasks(index);
  clearSubtaskInput();
  }
}


/**
 * Changes the content of a subtask in the task being edited in the edit task overlay.
 * @param {number} i - The index of the subtask to change.
 * @param {number} index - The index of the task being edited.
 */
function createSubtasksDoneArrayEditOverlay(index) {
  tasks[index]["subTasksDone"].splice(0, tasks[index]["subTasksDone"].length);
  for (let i = 0; i < tasks[index]["subtasks"].length; i++) {
    const subtask = tasks[index]["subtasks"][i];
    let subtaskDoneJson = {
      subname: subtask,
      checked: false,
    };
    tasks[index]["subTasksDone"].push(subtaskDoneJson);
  }
}


/**
 * Displays the icons for editing and deleting a subtask when hovering over the subtask item.
 * @param {number} i - The index of the subtask item.
 */
function showIcons(i) {
  document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 1;
}


/**
 * Hides the icons for editing and deleting a subtask when not hovering over the subtask item.
 * @param {number} i - The index of the subtask item.
 */
function hideIcons(i) {
  document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 0;
}


/**
 * Opens the change task status popup with options to change the task status.
 * If the popup is already open, it closes it.
 * @param {number} i - The index of the task.
 */
function openChangeTaskPopup(i) {
  let changeTaskButtons = document.getElementById("change-task-buttons");
  if (changeTaskButtons.innerHTML == "") {
    changeTaskButtons.innerHTML = renderChangeTaskButtons(i);
  } else {
    changeTaskButtons.innerHTML = "";
  }
}


/**
 * Changes the status of the task at the specified index to the new status provided.
 * Closes the change task status popup after changing the status.
 * @param {number} i - The index of the task.
 * @param {string} newStatus - The new status to set for the task.
 */
function changeTask(i, newStatus) {
  let changeTaskButtons = document.getElementById("change-task-buttons");
  changeTaskButtons.innerHTML = "";
  tasks[i]["status"] = newStatus;
  setItem("tasks", JSON.stringify(tasks));
  refreshTasks();
  renderTasks();
}