/**
 * Opens the task details overlay for a specific task.
 * @param {number} i - The index of the task to open details for.
 */
function openTaskDetails(i){
    document.getElementById('overlay').style.display = "flex"; 
    document.getElementById('overlay').innerHTML = generateDetailOverlay(i);
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
    setPrioDetailImg(i);
    checkOverlayCategory(i);
    renderDetailSubtasks(i);
    checkIfSubsDone(i);
    renderAssignedToDetail(i);
    slideOutOverlay(i);
}


/**
 * Closes the task details overlay.
 */
function closeDetailCard(){
    document.getElementById('overlay').style.display = "none";
    document.body.style.overflow = "auto";
}


/**
 * Checks the category of the task at index i and updates the overlay accordingly.
 * @param {number} i - The index of the task.
 */
function checkOverlayCategory(i){
    let category = tasks[i]["category"];
    if(category == 'User Story'){
      document.getElementById(`overlay-category${i}`).style.backgroundColor = "rgb(0,56,255)";
    }
    if(category == 'Technical Task'){
      document.getElementById(`overlay-category${i}`).style.backgroundColor = "rgb(31,215,193)";
    }
}


/**
 * Sets the priority image for the task at index i in the detail overlay.
 * @param {number} i - The index of the task.
 */
function setPrioDetailImg(i){
    let prioDetailImg = document.getElementById(`prioDetailImg${i}`);
    let prio = tasks[i]['prio'];
    prioDetailImg.src = `/assets/img/prio_${prio}_icon.png`;
}


/**
 * Renders the assigned editors for the task at the specified index in the detail overlay.
 * @param {number} index - The index of the task.
 */
function renderAssignedToDetail(index){
  let assignedTo = document.getElementById('detailAssignedTo');
  assignedTo.innerHTML = '';
    if(tasks[index]['assignedTo'].length > 3){
      checkIfToMuchEditorsDetail(assignedTo, index);
    
    }else {
      notToMuchEditorsDetail(assignedTo, index);
    }
}


/**
 * Renders the assigned editors for the task at the specified index in the detail overlay when there are more than three assigned editors.
 * @param {HTMLElement} assignedTo - The element to render the assigned editors into.
 * @param {number} index - The index of the task.
 */
function checkIfToMuchEditorsDetail(assignedTo, index){
  for (let i = 0; i < 3; i++) {
    const checkedEditor = tasks[index]['assignedTo'][i];
    let initials = checkedEditor.initials;
    let userColor = checkedEditor.userColor;
    let tooMuchEditors = document.getElementById(`toMuchEditors${index}`);
    tooMuchEditors.style.display = 'flex';
    tooMuchEditors.innerHTML = `+${tasks[index]['assignedTo'].length - 3}`;
  
    assignedTo.innerHTML += `
    <div id="mini-logo${i}" style="background-color: ${userColor}" class="mini-logo">${initials}</div>
    `;
  }
}


/**
 * Renders the assigned editors for the task at the specified index in the detail overlay when there are three or fewer assigned editors.
 * @param {HTMLElement} assignedTo - The element to render the assigned editors into.
 * @param {number} index - The index of the task.
 */
function notToMuchEditorsDetail(assignedTo, index){
  for (let i = 0; i < tasks[index]['assignedTo'].length; i++) {
    const checkedEditor = tasks[index]['assignedTo'][i];
    let initials = checkedEditor.initials;
    let userColor = checkedEditor.userColor;
    assignedTo.innerHTML += `
    <div id="mini-logo${i}" style="background-color: ${userColor}" class="mini-logo">${initials}</div>
    `;
  }
}


/**
 * Renders the subtasks for the task at the specified index in the detail overlay.
 * @param {number} i - The index of the task.
 */
function renderDetailSubtasks(i){
    let detailSub = document.getElementById(`checklistSubDetail`);
    detailSub.innerHTML = '';
  
      for (let j = 0; j < tasks[i]["subtasks"].length; j++) {
        let subtask = tasks[i]["subtasks"][j];
        detailSub.innerHTML += generateDetailSubtasks(i, j, subtask);
      } // j = subtask index & i = task index
}


/**
 * Checks if the subtask at the specified index for the task is checked or not, then updates the subtask's status accordingly.
 * @param {number} j - The index of the subtask.
 * @param {number} i - The index of the task.
 */
function checkIfSubChecked(j, i){
    let subtask = tasks[i]['subtasks'][j];
    let subTasksDone = tasks[i]['subTasksDone'][j];
    if(subTasksDone.checked == false){
      setChecked(j, i, subTasksDone)
    }else{
      setUnChecked(j, i, subTasksDone)
    }
    
    generateSubtasks(i, j);
    updateDoneSubs(i);
    setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
    renderTasks();
}


/**
 * Sets the subtask at the specified index for the task as checked.
 * @param {number} j - The index of the subtask.
 * @param {number} i - The index of the task.
 * @param {Object} subTasksDone - The subtask object containing information about its status.
 */
function setChecked(j, i, subTasksDone){
    subTasksDone.checked = true;
    document.getElementById(`detailSub${j}`).src = 'assets/img/check_checked_black.png';
}
  

/**
 * Sets the subtask at the specified index for the task as unchecked.
 * @param {number} j - The index of the subtask.
 * @param {number} i - The index of the task.
 * @param {Object} subTasksDone - The subtask object containing information about its status.
 */
function setUnChecked(j, i, subTasksDone){
    subTasksDone.checked = false;
    document.getElementById(`detailSub${j}`).src = 'assets/img/check_unchecked.png';
}


/**
 * Checks if the subtasks for the specified task are marked as done and updates their display accordingly.
 * @param {number} i - The index of the task.
 */
function checkIfSubsDone(i){
    for (let j = 0; j < tasks[i]['subTasksDone'].length; j++) {
      const checkedSub = tasks[i]['subTasksDone'][j].checked;
      if(checkedSub == true){
        document.getElementById(`detailSub${j}`).src = 'assets/img/check_checked_black.png'
      }
    }
}


/**
 * Deletes the task at the specified index.
 * @param {number} i - The index of the task to delete.
 */
function deleteTask(i){
    tasks.splice(i, 1);
    closeDetailCard();
    setItem('tasks', JSON.stringify(tasks));
    refreshTasks();
    renderTasks();
  }


  /**
 * Slides out the overlay for a todo card detail.
 * @param {number} i - The index of the todo card detail.
 */
function slideOutOverlay(i){

  var $slider = document.getElementById(`todo-card-detail${i}`);
  var $toggle = document.getElementById(`slide-out-toggle${i}`);
  
  $toggle.addEventListener('click', function() {
      var isOpen = $slider.classList.contains('slide-in');
  
      $slider.setAttribute('class', isOpen ? 'slide-out' +' '+ 'detail-todo-card' +' '+ 'slider'  : 'slide-in');
     setTimeout(()=>{closeDetailCard()},170); 
  });
}

  