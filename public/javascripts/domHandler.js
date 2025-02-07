const domHandler = (() => {
    const addMessage = (title, content, firstName, lastName, createdAt, updatedAt, approved, container, messageId) => {
        const col = document.createElement('div');
        col.classList.add('col');
        col.dataset.id = messageId;

        const card = document.createElement('div');
        card.classList.add('card', 'border-dark', 'rounded', 'shadow-lg');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Generate title: first two words of content
        const titleWords = content.trim() ? content.split(/\s+/).slice(0, 2).join(' ') : "Untitled";
        title = approved ? `"${titleWords}..." - by You` : `"${titleWords}..."`;

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'text-center');
        cardTitle.textContent = title;

        const cardContent = document.createElement('p');
        cardContent.classList.add('card-text', 'text-center');
        cardContent.textContent = content;
        cardContent.dataset.id = messageId;

        const detailsList = document.createElement('ul');
        detailsList.classList.add('list-group', 'list-group-flush');

        const createListItem = (label, value) => {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `<strong>${label}: </strong>${value}`;
            return li;
        };

        const btnsContainer = document.createElement('div');
        btnsContainer.classList.add('mt-3', 'text-center');

        if (approved) {
            const deleteIcon = document.createElement('img');
            deleteIcon.src = '/images/delete.png';
            deleteIcon.alt = 'delete';
            deleteIcon.width = 70;
            deleteIcon.classList.add('btn', 'delete', 'me-2');
            deleteIcon.dataset.id = messageId;

            const editIcon = document.createElement('img');
            editIcon.src = '/images/edit.png';
            editIcon.alt = 'edit';
            editIcon.width = 70;
            editIcon.classList.add('btn', 'edit', 'me-2');
            editIcon.dataset.id = messageId;

            btnsContainer.appendChild(deleteIcon);
            btnsContainer.appendChild(editIcon);
        }

        detailsList.appendChild(createListItem('Name', firstName ? `${firstName} ${lastName}` : 'N/A'));
        detailsList.appendChild(createListItem('Posted At', createdAt));
        detailsList.appendChild(createListItem('Last Modified', updatedAt));

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardContent);
        cardBody.appendChild(detailsList);
        if (approved) cardBody.appendChild(btnsContainer);
        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    };

    const editMessage = (messageElement) => {
        const contentElement = messageElement.querySelector('.card-text');
        const originalContent = contentElement.textContent;
        const cardBody = messageElement.querySelector('.card-body');

        // Hide the edit button
        const editIcon = messageElement.querySelector('.edit');
        if (editIcon) editIcon.style.display = 'none';

        // Create an input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = originalContent;
        inputField.classList.add('form-control', 'mb-2');

        // Create a container for buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('d-flex', 'justify-content-start', 'gap-2', 'mt-2');

        // Create Save and Cancel buttons
        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save';
        saveBtn.classList.add('btn', 'btn-success');

        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        cancelBtn.classList.add('btn', 'btn-secondary');

        // Append buttons to the container
        buttonContainer.appendChild(saveBtn);
        buttonContainer.appendChild(cancelBtn);

        // Replace content with input field and insert buttons
        contentElement.replaceWith(inputField);
        inputField.insertAdjacentElement('afterend', buttonContainer);

        return { inputField, saveBtn, cancelBtn, originalContent, contentElement, buttonContainer, editIcon };
    };

    const resetEditState = (inputField, contentElement, buttonContainer, editIcon) => {
        inputField.replaceWith(contentElement);
        buttonContainer.remove();
        if (editIcon) editIcon.style.display = 'inline-block'; // Show the edit button again
    };

    return { addMessage, editMessage, resetEditState };
})();

export default domHandler;
