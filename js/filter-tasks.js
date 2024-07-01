/**
 * Filters tasks based on the search input.
 */
function filterTasks() {
  let search = document.getElementById("search").value.toLowerCase();
  let searchSection = document.getElementById(`search-section`);
  let boardSection = document.getElementById("board-section");
  searchSection.innerHTML = "";
  refreshTasks();
  if (search == "") {
    boardSection.style.display = "flex";
    searchSection.innerHTML = "";
    renderTasks();
  } else {
    FilteredTasks(search);
    checkIfNoTasksFound(searchSection);
  }
}

/**
 * Filters tasks based on the search input and renders filtered tasks.
 * @param {string} search - The search query.
 */
function FilteredTasks(search) {
  refreshTasks();
  for (let i = 0; i < tasks.length; i++) {
    let title = tasks[i]["title"].toLowerCase();
    let description = tasks[i]["description"].toLowerCase();
    let boardSection = document.getElementById("board-section");
    let searchSection = document.getElementById(`search-section`);
    if (
      title.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    ) {
      boardSection.style.display = "none";
      renderFilteredTasks(i);
    }
  }
}

function checkIfNoTasksFound(searchSection) {
  if (searchSection.innerHTML == "") {
    searchSection.innerHTML = `<span>No tasks found</span>`;
  }
}

/**
 * Renders filtered tasks in the search section.
 * @param {number} i - The index of the task to render.
 */
function renderFilteredTasks(i) {
  document.getElementById(`search-section`).innerHTML += generateTask(i);
  setPrioImg(i);
  updateDoneSubs(i);
  generateSubtasks(i);
  checkCategory(i);
  renderAssignedTo(i);
}
