(() => {
    document.addEventListener('DOMContentLoaded', () => {

        const registerForm = document.getElementById('registerForm');
        const passwordForm = document.getElementById('registerPasswordForm');
        const messageForm = document.getElementById('customForm');
        const messageInput = document.getElementById('messageText');


        // Validation for first register Form
        if (registerForm) {
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
        }

        // Validation for password Form
        if (passwordForm) {
            passwordForm.addEventListener('submit', function (event) {
                const password = document.getElementById('floatingPassword');
                const confirmPassword = document.getElementById('floatingConfirmPassword');
                let isValid = true;

                // Reset custom validity
                confirmPassword.setCustomValidity('');

                // Check if passwords match (case-insensitive)
                if (password.value.toLowerCase() !== confirmPassword.value.toLowerCase()) {
                    confirmPassword.setCustomValidity('Passwords do not match.');
                    isValid = false;
                }

                // If the form is invalid, prevent submission
                if (!passwordForm.checkValidity() || !isValid) {
                    event.preventDefault();
                    event.stopPropagation();

                    // Add Bootstrap validation styles
                    passwordForm.classList.add('was-validated');
                }
            });
        }

        // Validation for add message Form
        if (messageForm) {
            messageForm.addEventListener('submit', function (event) {
                const messageError = document.getElementById('messageError');
                if (messageInput.value.trim() === '') {
                    event.preventDefault();
                    event.stopPropagation();
                    messageError.textContent = 'Message cannot be empty!';
                    messageError.style.display = 'block';
                } else {
                    messageError.style.display = 'none';
                }
            });
        }

    });

})();
