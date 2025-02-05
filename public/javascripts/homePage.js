(() => {
    document.addEventListener('DOMContentLoaded', async () => {
        const loading = document.getElementById('loading');
        const errorMessage = document.getElementById('errorMessage');
        const dataElement = document.getElementById('data');
        const searchByTextButton = document.getElementById('searchByText');
        const searchByTextInput = document.getElementById('searchByTitleInput');
        const clearSearch = document.getElementById('clearSearch');

        searchByTextButton.addEventListener("click", (event) => {
            event.preventDefault();
            //searchByText(event, searchByTextInput, clearSearch, errorMessage, loading);
        });
        clearSearch.addEventListener('click', () => domHandler.cleanSearchClick(clearSearch));

        // Fetch and display messages
        try {
            loading.classList.remove("d-none");
            errorMessage.innerHTML = '';

            const response = await fetch('/api/messages');
            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            if (data.length > 0) {
                data.forEach((item) =>
                    domHandler.addMessage(
                        "Message",
                        item.content,
                        item.User?.firstName || "Anonymous",
                        item.User?.lastName || "",
                        item.createdAt,
                        item.updatedAt,
                        item.approved,
                        dataElement
                    )
                );
            }
            else {
                dataElement.innerHTML = '<p class="text-center text-danger">No messages found.</p>';
            }
        } catch (err) {
            errorMessage.innerHTML = `Error fetching messages: ${err.message}`;
        } finally {
            loading.classList.add("d-none");
        }
    });
})();
