import messagesApi from "./messagesApi.js";
import domHandler from "./domHandler.js";

document.addEventListener('DOMContentLoaded', async () => {
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const dataElement = document.getElementById('data');
    const clearSearch = document.getElementById('clearSearch');
    const searchByText = document.getElementById('searchByText');
    const searchByTextInput = document.getElementById('searchByTextInput');


    clearSearch.addEventListener('click', () => window.location.href = '/');

    await messagesApi.fetchMessages(dataElement, loading, errorMessage);

    dataElement.addEventListener('click', async (event) => {
        const messageElement = event.target.closest('.col'); // Find the closest message container
        const messageId = event.target.dataset.id;

        if (event.target.classList.contains('delete')) {
            await messagesApi.deleteMessage(messageId, loading, errorMessage, dataElement);
        }

        if (event.target.classList.contains('edit')) {
            const { inputField, saveBtn, cancelBtn, originalContent, contentElement, buttonContainer, editIcon } = domHandler.editMessage(messageElement);

            // Handle Save
            saveBtn.addEventListener('click', async () => {
                const newContent = inputField.value;
                if (newContent.trim() && newContent !== originalContent) {
                    await messagesApi.editMessage(messageId, newContent, loading, errorMessage, dataElement);
                }
                domHandler.resetEditState(inputField, contentElement, buttonContainer, editIcon);
            });

            // Handle Cancel
            cancelBtn.addEventListener('click', () => {
                domHandler.resetEditState(inputField, contentElement, buttonContainer, editIcon);
            });
        }
    });

    // Handle Search
    searchByText.addEventListener('click', async (event) => {
        event.preventDefault();
        const query = searchByTextInput.value.trim();
        if (query) {
            clearSearch.classList.remove('d-none');
        }
        await messagesApi.fetchMessages(dataElement, loading, errorMessage, query);
    });

    // Handle Clear Search
    clearSearch.addEventListener('click', async (event) => {
        event.preventDefault();
        searchByTextInput.value = "";
        clearSearch.classList.add('d-none');
        await messagesApi.fetchMessages(dataElement, loading, errorMessage);
    });

});
