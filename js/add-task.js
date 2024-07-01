newTaskPrio = "medium";
subtaskTempArray = [];
subtaskDoneTempArray = [];
contacts = [];
assignedToTempArray = [];


/**
 * Adds an event listener that triggers when the DOM is fully loaded and sequentially
 * executes a series of functions related to user validation, user data loading,
 * header and sidebar generation, and contacts and tasks loading.
 */
async function initAddTask() {
  await userIsAllowed();
  await loadUserData();
  await generateHeader(userInitials);  
  await generateSidebar();
  loadUserContacts();
  loadTasksfromStorageAdd();
};


/**
 * Asynchronously loads tasks from storage and parses them into the `tasks` variable.
 * It tries to retrieve and parse the 'tasks' item from storage. If successful, it logs the loaded tasks.
 * In case of an error, it catches and logs the error as a warning. Finally, it calls `renderTasks` to update the UI.
 */
async function loadTasksfromStorageAdd(){
  try{
    tasks = JSON.parse(await getItem('tasks'));
  }catch(e){
    console.warn('loading error:', e)
  }
}


/**
 * Adds an event listener to the window object that intercepts 'Enter' keydown events.
 * If the 'Enter' key is pressed while focusing on an input element of type 'text',
 * the event's default action is prevented.
 */
window.addEventListener('keydown',function(e) {
  if (e.keyIdentifier=='U+000A' || e.keyIdentifier=='Enter' || e.keyCode==13) {
      if (e.target.nodeName=='INPUT' && e.target.type=='text') {
          e.preventDefault();

          return false;
      }
  }
}, true);


/**
 * Adds a task based on user input from form elements.
 * This function prevents the default form submission behavior, gathers the task data from various input fields and predefined variables,
 * then logs and saves the task.
 *
 * @param {Event} event - The event object associated with the form submission.
 */
function addTask(event) {
  event.preventDefault();
  let taskData = {
    title: document.getElementById('add-task-title-input').value,
    description: document.getElementById('add-task-description-input').value,
    assignedTo: checkedArray,
    dueDate: document.getElementById('add-task-date-input').value,
    prio: newTaskPrio,
    category: getCategoryValue(),
    subtasks: subtaskTempArray,
    subTasksDone: getSubTasksDone(),
    status: "open",
  };
  tasks.push(taskData);
  saveTask();
  clearInput();
}


/**
 * Retrieves the selected value from the category dropdown in the task form.
 * If the dropdown is present and an option is selected, it returns the value of the selected option.
 * Otherwise, it returns null.
 *
 * @returns {string|null} The value of the selected option in the category dropdown, or null if no option is selected.
 */
function getCategoryValue() {
  var categoryDropdown = document.querySelector('.add-task-form-dropdown');
  if (categoryDropdown && categoryDropdown.selectedIndex >= 0) {
    return categoryDropdown.options[categoryDropdown.selectedIndex].value;
  } else {
    return null;
  }
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
  document.getElementById(`${newPrio}-img-add`).src = `/assets/img/prio_${newPrio}_white_icon.png`;
}


/**
 * Resets the color and styles of all priority buttons to their default state.
 */
function resetPrioColors() {
  ["urgent", "medium", "low"].forEach((priority) => {
    document.getElementById(priority).style.backgroundColor = "";
    document.getElementById(`${priority}-text-add`).style.color = "";
    document.getElementById(`${priority}-img-add`).src = `/assets/img/prio_${priority}_icon.png`;
  });
}


/**
 * Generates an array of subtasks with their completion status set to false.
 * It iterates over the `subtaskTempArray`, creating a new object for each subtask with a name and a checked property.
 *
 * @returns {Array<Object>} An array of objects where each object represents a subtask with its name and checked status.
 */
function getSubTasksDone() {
  returnArray = [];
  subtaskTempArray.forEach(subtask => {
    subname = subtask;
    checked = false;
    temp = { subname, checked };
    returnArray.push(temp);
  });
  return returnArray;
};


/**
 * Saves the current tasks array to storage.
 * The tasks array is stringified and stored using `setItem` function
 * and shows a user-friendly message indicating the task was added successfully.
 */
function saveTask() {
  setItem('tasks', JSON.stringify(tasks));
  showMessageOverlay('Task added to Board', 'board');
}


/**
 * Toggles the visibility of the contacts dropdown and the background overlay.
 * Shows the contacts dropdown and the background overlay if they are not already visible,
 * and hides them otherwise. Also, resets the `checkedArray` and clears the assigned overlay
 * when showing the dropdown. If the `tooMuchEditors` warning is visible, it will be hidden.
 */
function showDropdownContacts() {
  let dropdown = document.getElementById('assigned-editors');
  let backgroundOverlay = document.getElementById('background-overlay');
  let tooMuchEditors = document.getElementById(`tooMuchEditors`);
  if (dropdown.style.display == 'none') {
    dropdown.style.display = 'block';
    backgroundOverlay.style.display = 'block';
    checkedArray = [];
    clearAssignedToAddOverlay();
    if(tooMuchEditors.style.display !== 'none'){
      tooMuchEditors.style.display = 'none';
    }
  } else {
    hideDropdownContacts();
  }
}


/**
 * Hides the contacts dropdown and the background overlay.
 * Sets the display style of both elements to 'none' and calls `addAssignedEditors`
 * to update the list of assigned editors based on the current selection.
 */
function hideDropdownContacts(){
  let dropdown = document.getElementById('assigned-editors');
  let backgroundOverlay = document.getElementById('background-overlay');
  dropdown.style.display = 'none';
  backgroundOverlay.style.display = 'none';
  addAssignedEditors();
}


/**
 * Adds the selected editors to the assigned editors list and updates the UI accordingly.
 * Iterates through the `contacts` array to check which editors are selected and adds them to `checkedArray`.
 * If more than three editors are selected, it displays a warning message. Otherwise, it adds the selected editors
 * to the displayed list with their initials and background color. The list is limited to showing a maximum of three editors.
 */
function addAssignedEditors() {
  let showAssignedEditors = document.getElementById('show-assigned-editors-container');
  let tooMuchEditors = document.getElementById('tooMuchEditors');
  for (let i = 0; i < contacts.length; i++) {
    const checkedEditor = contacts[i];
    let userColor = checkedEditor.userColor;
    let initials = checkedEditor.firstName.charAt(0) + checkedEditor.lastName.charAt(0);
    let checkbox = document.getElementById(`checkbox${i}`).checked;
    if (checkbox == true) {
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
 * Checks the assignment status of a contact based on the checkbox state and updates the assignment accordingly.
 * If the checkbox is unchecked, it triggers the unassignment function, and if checked, it triggers the assignment function.
 *
 * @param {number} i - The index of the contact to check the assignment status for.
 */
function checkIfAssigned(i) {
  let checkbox = document.getElementById(`checkbox${i}`).checked;
  if (checkbox == false) {
    setUnAssigned(i);
  }
  if (checkbox == true) {
    setAssigned(i);
  }
}


/**
 * Clears the content of the assigned editors display container.
 * This function removes all child elements of the container, effectively resetting the display of assigned editors.
 */
function clearAssignedToAddOverlay() {
  document.getElementById("show-assigned-editors-container").innerHTML = "";
}


/**
 * Sets the visual state of a contact to "assigned" by changing the background color and the checkmark icon.
 * It updates the contact's style to indicate that it has been assigned and changes the checkmark icon to a checked state.
 *
 * @param {number} i - The index of the contact to be marked as assigned.
 */
function setAssigned(i){
  document.getElementById(`assigned-contact${i}`).style = "background-color: #2A3647; color: white";
  document.getElementById(`checked${i}`).src ="assets/img/check_checked.png";
}


/**
 * Sets the visual state of a contact to "unassigned" by changing the text color and the checkmark icon.
 * It updates the contact's style to indicate that it has been unassigned and changes the checkmark icon to an unchecked state.
 *
 * @param {number} i - The index of the contact to be marked as unassigned.
 */
function setUnAssigned(i){
  document.getElementById(`assigned-contact${i}`).style = "color: black";;
  document.getElementById(`checked${i}`).src ="assets/img/check_unchecked.png";
}


/**
 * Activates the check and cancel buttons while hiding the create subtask button.
 * It removes the 'd-none' class from the check cancel button container to make it visible
 * and adds the 'd-none' class to the create subtask button container to hide it.
 */
function activateCheckCancelButtons(){
  document.getElementById('add-task-active-subtask-icon-box').classList.remove('d-none');
  document.getElementById('add-task-create-subtask-icon-box').classList.add('d-none');
}


/**
 * Clears the subtask input field and toggles the visibility of the subtask action icons.
 * It sets the subtask input field to an empty string, hides the active subtask icon box,
 * and shows the create subtask icon box by manipulating their 'd-none' class.
 */
function clearSubtaskInput(){
  document.getElementById('add-task-subtask-input').value = '';
  document.getElementById('add-task-active-subtask-icon-box').classList.add('d-none');
  document.getElementById('add-task-create-subtask-icon-box').classList.remove('d-none');
}


/**
 * Adds the input value as a subtask to the temporary subtask array if it is not empty.
 * It retrieves the subtask input value, checks if it is not empty, and then adds it to the `subtaskTempArray`.
 * After adding, it logs the updated array, calls `renderSubtasks` to update the UI, and clears the subtask input field.
 */
function addSubtask(){
  let subtask = document.getElementById('add-task-subtask-input').value;
  if(subtask !== ''){
    subtaskTempArray.push(subtask);
    renderSubtasks();
    clearSubtaskInput();
  }
}


/**
 * Renders the subtasks in the UI from the temporary subtask array.
 * It clears the current subtasks list in the container and iterates over the `subtaskTempArray`,
 * appending the HTML representation of each subtask using `subtaskHTML` function.
 */
function renderSubtasks(){
  let subtasksContainer = document.getElementById('add-task-subtasks-container');
  subtasksContainer.innerHTML = '';
  for (let i = 0; i < subtaskTempArray.length; i++) {
    const subtask = subtaskTempArray[i];
    subtasksContainer.innerHTML += subtaskHTML(subtask, i)
  }
}


/**
 * Initiates the edit mode for a specified subtask.
 * If there are subtasks in the array, it hides the display element of the subtask and
 * shows the edit container to allow modification of the subtask content.
 *
 * @param {number} i - The index of the subtask in the `subtaskTempArray` to be edited.
 */
function editSubtask(i){
  if(!subtaskTempArray.length == 0){
    document.getElementById(`editable-subtask${i}`).style.display = "none";
    document.getElementById(`editSubtaskContainer${i}`).style.display ="flex";
  }
}


/**
 * Deletes a subtask from the temporary subtask array and updates the UI.
 * It removes the subtask at the specified index using `splice`, then re-renders the subtask list
 * and clears the subtask input field.
 *
 * @param {number} i - The index of the subtask in the `subtaskTempArray` to be deleted.
 */
function deleteSubtask(i){
  subtaskTempArray.splice(i, 1)
  renderSubtasks();
  clearSubtaskInput();
}


/**
 * Updates the content of an existing subtask in the temporary array and refreshes the UI.
 * It checks if the new subtask content is not empty, then replaces the subtask at the given index
 * with the new content, re-renders the subtask list, and clears the subtask input field.
 *
 * @param {number} i - The index of the subtask in the `subtaskTempArray` to be updated.
 */
function changeSubtask(i){
  let subtask = document.getElementById(`editSubtaskInput${i}`).value;
  if(subtask !== ''){
  subtaskTempArray[i] = document.getElementById(`editSubtaskInput${i}`).value;
  renderSubtasks();
  clearSubtaskInput();
  }
}


/**
 * Creates an array of subtasks with a 'checked' status, initializing all as not done.
 * Iterates through the `subtaskTempArray`, creating an object for each subtask with its name and a false 'checked' status,
 * then pushes this object to `subtaskDoneTempArray` and logs it to the console.
 */
function createSubtasksDoneArray(){
  for (let i = 0; i < subtaskTempArray.length; i++) {
    const subtask = subtaskTempArray[i];
    let subtaskDoneJson = {
      subname: subtask, 
      checked: false
    }
    subtaskDoneTempArray.push(subtaskDoneJson);
  }
}


/**
 * Increases the opacity of the active subtask icon box to make it fully visible.
 * Targets the specific active subtask icon box by its index and sets its opacity to 1.
 *
 * @param {number} i - The index of the subtask icon box to be modified.
 */
function showIcons(i){
  document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 1;
 }
 

 /**
 * Reduces the opacity of the active subtask icon box to make it fully transparent.
 * Targets the specific active subtask icon box by its index and sets its opacity to 0.
 *
 * @param {number} i - The index of the subtask icon box to be modified.
 */
 function hideIcons(i){
     document.getElementById(`edit-task-active-subtask-icon-box${i}`).style.opacity = 0;
 }