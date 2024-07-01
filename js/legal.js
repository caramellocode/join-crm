/**
 * Event listener that executes when the DOM content is loaded.
 * It asynchronously generates the sidebar and header.
 */
document.addEventListener('DOMContentLoaded', async function () {
    await userIsAllowed();
    await loadUserData();
    await generateSidebar();
    await generateHeader(userInitials);
});