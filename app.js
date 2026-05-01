const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
    name: (val) => val.trim().length < 2 ? "Ім'я занадто коротке" : null,
    email: (val) => !EMAIL_REGEX.test(val) ? "Невірний формат email" : null,
    password: (val) => val.length < 8 ? "Мінімум 8 символів" : null,
    confirm: (val, pass) => val !== pass ? "Паролі не збігаються" : null,
    role: (val) => val === "" ? "Оберіть роль" : null,
    terms: (val, checked) => !checked ? "Потрібна згода" : null
};
function showError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errorSpan = document.getElementById(`${fieldId}Error`);
    group.classList.remove('valid');
    group.classList.add('invalid');
    errorSpan.textContent = message;
}

function clearError(fieldId) {
    const group = document.getElementById(fieldId).closest('.form-group');
    const errorSpan = document.getElementById(`${fieldId}Error`);
    group.classList.remove('invalid');
    group.classList.add('valid');
    errorSpan.textContent = "";
}
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');

// Функція перевірки всього відразу
function validateAll() {
    let isValid = true;
    const pass = document.getElementById('password').value;
    
    // Перевірка кожного поля (спрощено для розуміння)
    const fields = ['name', 'email', 'password', 'role'];
    fields.forEach(id => {
        const val = document.getElementById(id).value;
        const err = validators[id](val);
        err ? (showError(id, err), isValid = false) : clearError(id);
    });

    // Окремо для confirm та terms
    const confirmVal = document.getElementById('confirm').value;
    const confirmErr = validators.confirm(confirmVal, pass);
    confirmErr ? (showError('confirm', confirmErr), isValid = false) : clearError('confirm');

    const termsChecked = document.getElementById('terms').checked;
    const termsErr = validators.terms(null, termsChecked);
    termsErr ? (showError('terms', termsErr), isValid = false) : clearError('terms');

    return isValid;
}

// Обробка натискання кнопки
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    // Імітація завантаження
    submitBtn.disabled = true;
    submitBtn.textContent = "Надсилання...";

    await new Promise(res => setTimeout(res, 2000));

    // Збір даних
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("JSON Дані форми:", JSON.stringify(data, null, 2));

    // Успішне завершення
    form.style.display = "none";
    const successBox = document.getElementById('successMessage');
    successBox.style.display = "block";
    document.getElementById('welcomeUser').textContent = `Вітаємо, ${data.name}!`;
});

// Жива валідація при введенні
document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => {
        // Тут можна викликати validateAll() для миттєвого оновлення
        validateAll(); 
    });
});
const resetBtn = document.getElementById('resetBtn');

resetBtn.addEventListener('click', () => {
    form.reset(); 

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
    });

    const errorMessages = form.querySelectorAll('.error-msg');
    errorMessages.forEach(msg => {
        msg.textContent = '';
    });
    
    console.log('Форму скинуто');
});