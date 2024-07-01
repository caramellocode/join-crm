/**
 * Adds an event listener to the "DOMContentLoaded" event of the document, triggering the initialization process when the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  init();
});


/**
 * Initializes the summary page.
 * Checks if the user is allowed to access the page, generates the sidebar and summary, loads user data, and generates the header with user initials.
 */
async function init() {
  await userIsAllowed();
  await generateSidebar();
  await generateSummary();
  await loadUserData();
  generateHeader(userInitials);
}


/**
 * Retrieves user data based on the stored user ID in localStorage.
 * Redirects to the index page if the user ID is not found.
 * @returns {Object|null} The user data object if found, otherwise null.
 */
async function getUserData() {
  let userId = Number(localStorage.getItem("userId"));

  if (!userId) {
    window.location.href = "index.html";
    return null;
  }
  let users = await getUserArray()
  const userWithSameId = users.find(user => user.userId === userId);
  return userWithSameId;
}


/**
 * Generates the summary page content based on various counters and user information.
 * @returns {void}
 */
async function generateSummary() {
    let main = document.getElementById("main-container");
    main.innerHTML = summaryHTML(await toDoCounter(), await doneCounter(), await urgentCounter(), await urgentDeadline(), await tibCounter(), await tipCounter(), await awaitingFeedbackCounter(), await greetingDaytime(), await userGreetingName());
}


/**
 * Counts the number of tasks that are in "Open" or "In Progress" status and assigned to the logged-in user.
 * @returns {Promise<number>} The count of tasks in "Open" or "In Progress" status assigned to the user.
 */
async function toDoCounter() {
  let tasks = await getTaskArray();
  let userId = parseInt(localStorage.getItem("userId"), 10);
  
  let tasksInOpenStatus = tasks.filter((task) => {
    return (
        task.assignedTo && task.assignedTo.some((user) => user.userId && parseInt(user.userId, 10) === userId) &&
        (task.status === "open" || task.status === "in-progress")
    );
  });

  tasksInOpenStatus.forEach(task => {
  });

  let count = tasksInOpenStatus.length;
  return count;
}


/**
 * Counts the number of tasks that are in "Done" status and assigned to the logged-in user.
 * @returns {Promise<number>} The count of tasks in "Done" status assigned to the user.
 */
async function doneCounter() {
    let tasks = await getTaskArray();
    let userId = parseInt(localStorage.getItem("userId"), 10);

    let tasksInProgressStatus = tasks.filter((task) => {
        return (
            task.assignedTo && task.assignedTo.some((user) => user && user.userId === userId) &&
            task.status === "done"
        );
    });
    
    let count = tasksInProgressStatus.length;
    return count;
}


/**
 * Counts the number of tasks that are marked as "urgent" and assigned to the logged-in user.
 * @returns {Promise<number>} The count of tasks marked as "urgent" assigned to the user.
 */
async function urgentCounter() {
    let tasks = await getTaskArray();
    let userId = parseInt(localStorage.getItem("userId"), 10);

    let tasksInUrgentStatus = tasks.filter((task) => {
        return (
            task.assignedTo && task.assignedTo.some((user) => user && user.userId === userId) &&
            task.prio === "urgent"
        );
    });
    
    let count = tasksInUrgentStatus.length;
    return count;
}


/**
 * Retrieves the due date of the nearest task marked as "urgent".
 * @returns {Promise<string>} The formatted due date of the nearest urgent task.
 */
async function urgentDeadline() {
    let tasks = await getTaskArray();
    let urgentTasks = tasks.filter(task => task.prio === "urgent");

    let nearestUrgentTask = urgentTasks.reduce((prev, current) => {
        return (new Date(prev.dueDate) < new Date(current.dueDate)) ? prev : current;
    }, urgentTasks[0]);

    let dueDateFormatted = formatDate(nearestUrgentTask.dueDate);

    return dueDateFormatted;
}


/**
 * Formats a given date string to a human-readable format.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string in the format "Month Day, Year".
 */
function formatDate(dateString) {
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let date = new Date(dateString);
    return date.toLocaleDateString('en-EN', options);
}


/**
 * Counts the total number of tasks in the backlog.
 * @returns {number} The total number of tasks in the backlog.
 */
async function tibCounter() {
    let tasks = await getTaskArray();
    let count = tasks.length;
    return count;
}


/**
 * Counts the total number of tasks currently in progress.
 * @returns {number} The total number of tasks in progress.
 */
async function tipCounter() {
    let tasks = await getTaskArray();
    let allTasksInProgressStatus = tasks.filter(task => task.status === "in-progress");
    let count = allTasksInProgressStatus.length;
    return count;
}


/**
 * Counts the total number of tasks awaiting feedback.
 * @returns {number} The total number of tasks awaiting feedback.
 */
async function awaitingFeedbackCounter() {
    let tasks = await getTaskArray();
    let allTasksInProgressStatus = tasks.filter(task => task.status === "await-feedback");
    let count = allTasksInProgressStatus.length;
    return count;
}


/**
 * Determines the appropriate greeting based on the current time of the day.
 * @returns {string} The greeting message for the current time of the day.
 */
function greetingDaytime() {
    let today = new Date();
    let hour = today.getHours();
  
    let greetingText;
    if (hour >= 5 && hour < 12) {
      greetingText = "Good morning";
    } else if (hour >= 12 && hour < 17) {
      greetingText = "Good day";
    } else {
      greetingText = "Good evening";
    }
    return greetingText;
}


/**
 * Retrieves the user's greeting name based on their first and last name.
 * @returns {string} The user's greeting name.
 */
async function userGreetingName() {
  let user = await getUserData();
  if (!user) {
    return "User not found";
  }
  if (user.firstName && !user.lastName) {
      return user.firstName;
  } else if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
  }
}


/**
 * Changes the image source of the given element.
 * @param {HTMLElement} element - The HTML element whose image source will be changed.
 */
function changeImage(element) {
  element.querySelector(".icon").src = "assets/img/todo_white_icon.png";
}


/**
 * Resets the image source of the given element.
 * @param {HTMLElement} element - The HTML element whose image source will be reset.
 */
function resetImage(element) {
  element.querySelector(".icon").src = "assets/img/todo_black_icon.png";
}


/**
 * Changes the image source of the given element to a white "done" icon.
 * @param {HTMLElement} element - The HTML element whose image source will be changed.
 */
function changeImageDoneRight(element) {
  element.querySelector(".icon").src = "assets/img/done_white_icon.png";
}


/**
 * Resets the image source of the given element to a black "done" icon.
 * @param {HTMLElement} element - The HTML element whose image source will be reset.
 */
function resetImageDoneRight(element) {
  element.querySelector(".icon").src = "assets/img/done_black_icon.png";
}
