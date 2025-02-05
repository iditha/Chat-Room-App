const domHandler = (() => {

    const addMessage = (title, content, firstName, lastName, createdAt, updatedAt, approved, container) => {
        const col = document.createElement('div');
        col.classList.add('col');

        const card = document.createElement('div');
        card.classList.add('card', 'border-dark', 'rounded', 'shadow-lg');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title', 'text-center');
        cardTitle.textContent = title;

        const cardContent = document.createElement('p');
        cardContent.classList.add('card-text', 'text-center');
        cardContent.textContent = content;

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

            const editIcon = document.createElement('img');
            editIcon.src = '/images/edit.png';
            editIcon.alt = 'edit';
            editIcon.width = 70;
            editIcon.classList.add('btn', 'edit', 'me-2');

            btnsContainer.appendChild(deleteIcon);
            btnsContainer.appendChild(editIcon);
        }

        detailsList.appendChild(createListItem('Name', firstName ? `${firstName} ${lastName}` : 'N/A'));
        detailsList.appendChild(createListItem('Posted At', new Date(createdAt).toLocaleDateString()));
        detailsList.appendChild(createListItem('Last Modified', new Date(updatedAt).toLocaleDateString()));

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardContent);
        cardBody.appendChild(detailsList);
        if (approved) cardBody.appendChild(btnsContainer);
        card.appendChild(cardBody);
        col.appendChild(card);
        container.appendChild(col);
    };


    /**
     * Clears search results and reloads the page.
     * @param {HTMLElement} clearSearch - The clear search button.
     */
    const cleanSearchClick = (clearSearch) => {
        clearSearch.classList.add('d-none');
        window.location.href = '/';
    };

    return {
        addMessage,
        cleanSearchClick,
    };
})();