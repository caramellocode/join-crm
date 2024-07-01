const STORAGE_TOKEN = 'VVK5TYGSJS813NXSTN714MP63U73J2HXR3TBFM5M';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';


/**
 * Sets an item with the given key and value in the remote storage.
 * @param {string} key - The key of the item.
 * @param {string} value - The value of the item.
 * @returns {Promise} A promise that resolves with the result of the operation.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    }).then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
    });
}


/**
 * Retrieves an item from the remote storage with the given key.
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise} A promise that resolves with the value of the retrieved item.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        return res.data.value;
    });
}


/**
 * Retrieves the array of user data from the remote storage.
 * @returns {Promise<Array>} A promise that resolves with the array of user data.
 */
async function getUserArray() {
    const responseJson = await getItem('users');
    return JSON.parse(responseJson);
}


/**
 * Retrieves the array of task data from the remote storage.
 * @returns {Promise<Array>} A promise that resolves with the array of task data.
 */
async function getTaskArray() {
    let responseJson = await getItem("tasks");
    return JSON.parse(responseJson);
  }


  /**
 * Retrieves the data associated with a given key from the remote storage and logs it to the console.
 * @param {string} key - The key associated with the data to be retrieved.
 * @returns {Promise<void>} A promise that resolves once the data is retrieved and logged to the console.
 */
async function logoutRemoteArray(key) {
    const responseJson = await getItem(key);
    const response = JSON.parse(responseJson);
    console.log(response)
}


/**
 * Resets the user array in the remote storage to a predefined rescue user array and logs the action.
 * @returns {Promise<void>} A promise that resolves once the user array is reset and logged to the console.
 */
async function resetUserArray() {
    let users = rescueUserArray;
    await setItem('users', JSON.stringify(users));
    console.log('User array reset.');
    logoutRemoteArray('users');
}


/**
 * Resets the task array in the remote storage to a predefined rescue task array and logs the action.
 * @returns {Promise<void>} A promise that resolves once the task array is reset and logged to the console.
 */
async function resetTaskArray() {
    let tasks = rescueTaskArray;
    await setItem('tasks', JSON.stringify(tasks));
    console.log('Task array reset.');
    logoutRemoteArray('tasks');
}