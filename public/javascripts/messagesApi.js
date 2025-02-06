import domHandler from "./domHandler.js";

const messagesApi = {
    fetchMessages: async (dataElement, loading, errorMessage, searchQuery = "") => {
        errorMessage.innerHTML = '';
        loading.classList.remove("d-none");

        try {
            let url = '/api/messages';
            if (searchQuery) {
                url += `/search?searchString=${encodeURIComponent(searchQuery)}`;
            }

            const response = await fetch(url);
            if (response.status === 401) {
                window.location.href = '/'; // Redirect if unauthorized
                return;
            }
            console.log("i was before !response.ok");

            if (!response.ok) throw new Error(response.statusText);

            const data = await response.json();
            dataElement.innerHTML = ''; // Clear old messages
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
                        dataElement,
                        item.id
                    )
                );
            } else {
                dataElement.innerHTML = '<p class="text-center text-danger">No messages found.</p>';
            }
        } catch (err) {
            errorMessage.innerHTML = `Error fetching messages: ${err.message}`;
            console.log("i was in catch");

        } finally {
            loading.classList.add("d-none");
        }
    },

    deleteMessage: async (messageId, loading, errorMessage, dataElement) => {
        errorMessage.innerHTML = '';
        loading.classList.remove("d-none");

        try {
            const response = await fetch(`/api/messages/${messageId}`, { method: 'DELETE' });
            if (response.status === 401) {
                window.location.href = '/'; // Redirect if unauthorized
                return;
            }
            if (!response.ok) throw new Error("Failed to delete message.");

            await messagesApi.fetchMessages(dataElement, loading, errorMessage); // Re-fetch updated list
        } catch (error) {
            errorMessage.innerHTML = `Error deleting message: ${error.message}`;
        } finally {
            loading.classList.add("d-none");
        }
    },

    editMessage: async (messageId, newContent, loading, errorMessage, dataElement) => {
        errorMessage.innerHTML = '';
        loading.classList.remove("d-none");

        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newContent })
            });

            if (response.status === 401) {
                window.location.href = '/'; // Redirect if unauthorized
                return;
            }
            if (!response.ok) throw new Error("Failed to update message.");

            await messagesApi.fetchMessages(dataElement, loading, errorMessage); // Re-fetch updated list
        } catch (error) {
            errorMessage.innerHTML = `Error updating message: ${error.message}`;
        } finally {
            loading.classList.add("d-none");
        }
    }
};

// Export the messagesApi object as a module
export default messagesApi;
