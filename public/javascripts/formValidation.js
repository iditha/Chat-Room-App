(() => {
    document.addEventListener('DOMContentLoaded', () => {

        const registerForm = document.getElementById('registerForm');

        registerForm.addEventListener('submit', function (event) {
            const form = event.target;

            // Check form validity
            if (!form.checkValidity()) {
                event.preventDefault(); // Prevent form submission
                event.stopPropagation(); // Stop further propagation
            }

            // Add Bootstrap validation styles
            form.classList.add('was-validated');
        });
    });

})();
