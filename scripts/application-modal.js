class ApplicationModal {
    constructor() {
        this.modal = document.getElementById('applicationModal');
        this.form = document.getElementById('applicationForm');
        this.submitBtn = document.getElementById('submitBtn');
        this.openBtns = document.querySelectorAll('.header__contact-us-link, .application'); // Добавляем оба селектора

        // URL API (для разработки)
        this.API_URL = 'http://192.168.1.103:5000/api/send-to-telegram';

        // Состояние отправки
        this.isSending = false;

        // Инициализация
        if (this.checkElements()) {
            this.initEventListeners();
        } else {
            console.error('Не найдены необходимые элементы формы');
        }
    }

    checkElements() {
        return !!this.modal && !!this.form && !!this.submitBtn && this.openBtns.length > 0; // Проверяем, что есть хотя бы одна кнопка
    }

    initEventListeners() {
        // Открытие модального окна для всех кнопок
        this.openBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Закрытие модального окна
        document.querySelector('.close-modal').addEventListener('click', () => this.close());

        // Закрытие по клику вне окна
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.close();
        });

        // Обработка отправки формы
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Валидация телефона (только цифры и +)
        const phoneInput = this.form.querySelector('#userPhone');
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^\d+]/g, '');
        });
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Защита от повторной отправки
        if (this.isSending) return;

        // Блокируем кнопку
        this.isSending = true;
        this.submitBtn.disabled = true;
        const originalText = this.submitBtn.textContent;
        this.submitBtn.textContent = 'Отправка...';

        try {
            // Получаем данные формы
            const formData = {
                name: this.form.userName.value.trim(),
                phone: this.form.userPhone.value.trim(),
                question: this.form.userQuestion.value.trim()
            };

            // Валидация на клиенте
            if (!formData.name || !formData.phone) {
                throw new Error('Заполните имя и телефон');
            }

            // Отправка на сервер
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Ошибка при отправке');
            }

            // Успешная отправка
            this.showSuccess('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            this.form.reset();
            this.close();
        } catch (error) {
            this.showError(error.message || 'Произошла ошибка при отправке');
            console.error('Ошибка:', error);
        } finally {
            // Восстанавливаем кнопку
            this.isSending = false;
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = originalText;
        }
    }

    showSuccess(message) {
        // Можно заменить на красивый toast-уведомление
        alert(message);
    }

    showError(message) {
        alert(`Ошибка: ${message}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ApplicationModal();
});