// === КОНСТАНТЫ ===
const TICKET_PRICE = 3200; // Цена за место
const DISCOUNT_RATE = 0.15; // Скидка 15%
const MAX_SELECTED_SEATS = 10;
const OCCUPANCY_CHANCE = 0.2;

// === ИНФОРМАЦИЯ О СОБЫТИИ ===
const EVENT_INFO = {
    title: 'ПРИЗРАК ОПЕРЫ 0+',
    date: '09.02.25 | 19:00',
    address: 'ул. Спасская, 12А', // Ульяновский драмтеатр им. И.А. Гончарова
};

// === СЛАЙДЕР ===
const slidesData = [
    { image: './assets/images/slider_img1.png', title: 'ПРИЗРАК ОПЕРЫ' },
    { image: './assets/images/slider_img2.png', title: 'ПРИЗРАК ОПЕРЫ' },
    { image: './assets/images/slider_img3.png', title: 'ПРИЗРАК ОПЕРЫ' },
    { image: './assets/images/slider_img4.png', title: 'ПРИЗРАК ОПЕРЫ' }
];

let currentSlide = 0;
let sliderInitialized = false;

function initSlider() {
    if (sliderInitialized) return;

    const mainSlider = document.getElementById('mainSlider');
    const thumbnails = document.getElementById('thumbnails');
    const fullscreenSlider = document.getElementById('fullscreenSliderContainer');
    const fullscreenThumbnails = document.getElementById('fullscreenThumbnails');

    if (!mainSlider || !thumbnails || !fullscreenSlider || !fullscreenThumbnails) {
        console.warn('Не все элементы слайдера найдены в DOM');
        return;
    }

    // Очистка на случай повторной инициализации
    mainSlider.innerHTML = '';
    thumbnails.innerHTML = '';
    fullscreenSlider.innerHTML = '';
    fullscreenThumbnails.innerHTML = '';

    slidesData.forEach((slideData, index) => {
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${slideData.image}" alt="Slide ${index + 1}">`;
        mainSlider.appendChild(slide);

        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${slideData.image}" alt="Thumbnail ${index + 1}">`;
        thumbnail.addEventListener('click', () => changeSlide(index));
        thumbnails.appendChild(thumbnail);

        const fullscreenSlide = document.createElement('div');
        fullscreenSlide.className = `fullscreen-slide ${index === 0 ? 'active' : ''}`;
        fullscreenSlide.innerHTML = `
            <img src="${slideData.image}" alt="Fullscreen Slide ${index + 1}">
            <div class="image-title">${slideData.title}</div>
        `;
        fullscreenSlider.appendChild(fullscreenSlide);

        const fullscreenThumbnail = document.createElement('div');
        fullscreenThumbnail.className = `fullscreen-thumbnail ${index === 0 ? 'active' : ''}`;
        fullscreenThumbnail.innerHTML = `<img src="${slideData.image}" alt="Fullscreen Thumbnail ${index + 1}">`;
        fullscreenThumbnail.addEventListener('click', () => changeFullscreenSlide(index));
        fullscreenThumbnails.appendChild(fullscreenThumbnail);
    });

    function safeAddListener(id, event, handler) {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    }

    mainSlider.addEventListener('click', openFullscreen);
    safeAddListener('prevBtn', 'click', () => navigate(-1));
    safeAddListener('nextBtn', 'click', () => navigate(1));

    safeAddListener('closeBtn', 'click', closeFullscreen);
    safeAddListener('fullscreenPrevBtn', 'click', () => navigateFullscreen(-1));
    safeAddListener('fullscreenNextBtn', 'click', () => navigateFullscreen(1));

    const fullscreenOverlay = document.getElementById('fullscreenSlider');
    if (fullscreenOverlay) {
        fullscreenOverlay.addEventListener('click', (e) => {
            if (e.target === fullscreenOverlay) closeFullscreen();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (fullscreenOverlay && fullscreenOverlay.classList.contains('active')) {
            if (e.key === 'Escape') closeFullscreen();
            else if (e.key === 'ArrowLeft') navigateFullscreen(-1);
            else if (e.key === 'ArrowRight') navigateFullscreen(1);
        }
    });

    sliderInitialized = true;
}

function changeSlide(index) {
    currentSlide = index;
    updateSlides();
}

function navigate(direction) {
    currentSlide = (currentSlide + direction + slidesData.length) % slidesData.length;
    updateSlides();
}

function updateSlides() {
    document.querySelectorAll('.slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentSlide);
    });

    document.querySelectorAll('.fullscreen-slide').forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    document.querySelectorAll('.fullscreen-thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentSlide);
    });

    updateFullscreenBackground();
}

function updateFullscreenBackground() {
    const bg = document.getElementById('fullscreenBg');
    if (bg) {
        bg.style.backgroundImage = `url('${slidesData[currentSlide].image}')`;
    }
}

function openFullscreen() {
    const overlay = document.getElementById('fullscreenSlider');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateFullscreenBackground();
    }
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreenSlider');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function navigateFullscreen(direction) {
    navigate(direction);
}

function changeFullscreenSlide(index) {
    changeSlide(index);
}

// === ВЫБОР МЕСТ В ТЕАТРЕ ===
let selectedSeats = [];
let selectedPaymentMethod = null;
let currentSelectionType = null;
let modalHistory = [];

function generateSeats() {
    const container = document.getElementById('seatsContainer');
    if (!container) return;

    container.innerHTML = '';
    for (let row = 1; row <= 7; row++) {
        for (let seatNum = 1; seatNum <= 14; seatNum++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = seatNum;
            seat.dataset.row = row;
            seat.dataset.seat = seatNum;

            if (Math.random() < OCCUPANCY_CHANCE) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', toggleSeatSelection);
            }
            container.appendChild(seat);
        }
    }
}

function toggleSeatSelection(event) {
    const seat = event.target;
    if (seat.classList.contains('occupied')) return;

    const row = seat.dataset.row;
    const seatNum = seat.dataset.seat;
    const seatId = `R${row}S${seatNum}`;

    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
        if (selectedSeats.length >= MAX_SELECTED_SEATS) {
            alert(`Можно выбрать не более ${MAX_SELECTED_SEATS} мест`);
            return;
        }
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }

    updateSelectedSeatsInfo();
}

function parseSeatId(seatId) {
    const match = seatId.match(/R(\d+)S(\d+)/);
    return match ? { row: match[1], seat: match[2] } : null;
}

function updateSelectedSeatsInfo() {
    const selectedRow = document.getElementById('selectedRow');
    const selectedSeat = document.getElementById('selectedSeat');
    const totalPrice = document.getElementById('totalPrice');

    if (!selectedSeats.length) {
        if (selectedRow) selectedRow.textContent = '-';
        if (selectedSeat) selectedSeat.textContent = '-';
        if (totalPrice) totalPrice.textContent = '0';
        return;
    }

    const rows = [];
    const seats = [];
    selectedSeats.forEach(id => {
        const parsed = parseSeatId(id);
        if (parsed) {
            rows.push(parsed.row);
            seats.push(parsed.seat);
        }
    });

    if (selectedRow) selectedRow.textContent = rows.join(', ');
    if (selectedSeat) selectedSeat.textContent = seats.join(', ');
    if (totalPrice) totalPrice.textContent = TICKET_PRICE * selectedSeats.length;
}

function openSeatSelection() {
    closeAllModals();
    currentSelectionType = 'theater';
    modalHistory = ['seatSelectionModal'];

    const modal = document.getElementById('seatSelectionModal');
    if (modal) {
        modal.style.display = 'flex';

        // Обновляем информацию о событии в модалке
        document.querySelector('#seatSelectionModal .event-name h5').textContent = EVENT_INFO.title;
        document.querySelector('#seatSelectionModal .event-date p').textContent = EVENT_INFO.date;
    }
}

function goToPaymentMethod() {
    if (selectedSeats.length === 0) {
        alert('Пожалуйста, выберите хотя бы одно место');
        return;
    }

    const seatModal = document.getElementById('seatSelectionModal');
    const payModal = document.getElementById('paymentMethodModal');
    if (seatModal) seatModal.style.display = 'none';
    if (payModal) payModal.style.display = 'flex';

    const total = TICKET_PRICE * selectedSeats.length;
    const totalStr = total.toString();

    // Обновление всех элементов с ценой
    const paymentPriceEl = document.getElementById('paymentPrice');
    if (paymentPriceEl) paymentPriceEl.textContent = totalStr;

    document.querySelectorAll('.payment-amount').forEach(el => {
        el.textContent = totalStr;
    });

    // Обновление выбранных мест
    const rows = [], seats = [];
    selectedSeats.forEach(id => {
        const p = parseSeatId(id);
        if (p) {
            rows.push(p.row);
            seats.push(p.seat);
        }
    });

    const paymentRow = document.getElementById('paymentRow');
    const paymentSeat = document.getElementById('paymentSeat');
    if (paymentRow) paymentRow.textContent = rows.join(', ');
    if (paymentSeat) paymentSeat.textContent = seats.join(', ');

    // Обновляем информацию о событии в модалке оплаты
    document.querySelector('#paymentMethodModal .event-name h5').textContent = EVENT_INFO.title;
    document.querySelector('#paymentMethodModal .event-name_payment p').textContent = `Ряд: ${rows.join(', ')}, Место: ${seats.join(', ')}`;

    modalHistory.push('paymentMethodModal');
}

function goBackToPreviousSelection() {
    const payModal = document.getElementById('paymentMethodModal');
    if (payModal) payModal.style.display = 'none';

    if (currentSelectionType === 'theater') {
        const seatModal = document.getElementById('seatSelectionModal');
        if (seatModal) seatModal.style.display = 'flex';
        modalHistory.pop();
    }
}

function selectPaymentMethodNew(element, method) {
    document.querySelectorAll('.payment-top-block, .payment-side-block').forEach(el => {
        el.classList.remove('selected');
    });
    element.classList.add('selected');
    selectedPaymentMethod = method;

if (method === 'card') {
    setTimeout(() => {
        const payModal = document.getElementById('paymentMethodModal');
        const cardModal = document.getElementById('cardPaymentModal');
        if (payModal) payModal.style.display = 'none';
        if (cardModal) cardModal.style.display = 'flex';

        // Обновляем цену с надписью "Стоимость"
        const total = TICKET_PRICE * selectedSeats.length;

        // Находим элемент по классу .payment-amount
        const priceElement = document.querySelector('#cardPaymentModal .payment-amount');
        if (priceElement) {
            priceElement.innerHTML = `<span>Стоимость:</span> ${total} ₽`;
        }

        modalHistory.push('cardPaymentModal');
    }, 300);
}}

function processPayment() {
    const cardModal = document.getElementById('cardPaymentModal');
    const successModal = document.getElementById('successModal');
    if (cardModal) cardModal.style.display = 'none';
    if (successModal) successModal.style.display = 'flex';

    // Обновляем сумму в окне успеха
    const total = TICKET_PRICE * selectedSeats.length;
    const finalAmount = Math.round(total * (1 - DISCOUNT_RATE)); // Применяем скидку

    const amountElement = document.querySelector('#successModal .success-amount h2');
    if (amountElement) amountElement.textContent = `${finalAmount} ₽`;

    // Обновляем детали в окне успеха
    document.querySelector('#successModal .info-row span p').textContent = `#${Math.floor(Math.random() * 100000000) + 1}`; // Номер платежа

    modalHistory.push('successModal');
}

function showCancelConfirmation(modalId) {
    currentModal = modalId;
    const targetModal = document.getElementById(modalId);
    const confirmModal = document.getElementById('cancelConfirmationModal');
    if (targetModal) targetModal.style.display = 'none';
    if (confirmModal) confirmModal.style.display = 'flex';
}

function closeCancelConfirmation() {
    const confirmModal = document.getElementById('cancelConfirmationModal');
    if (confirmModal) confirmModal.style.display = 'none';
    if (currentModal) {
        const target = document.getElementById(currentModal);
        if (target) target.style.display = 'flex';
    }
}

function goBackToPaymentMethod() {
    const cardModal = document.getElementById('cardPaymentModal');
    const payModal = document.getElementById('paymentMethodModal');
    if (cardModal) cardModal.style.display = 'none';
    if (payModal) payModal.style.display = 'flex';
    modalHistory.pop();
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });

    selectedSeats = [];
    selectedPaymentMethod = null;
    currentSelectionType = null;
    modalHistory = [];

    document.querySelectorAll('.seat.selected').forEach(seat => {
        seat.classList.remove('selected');
    });

    updateSelectedSeatsInfo();
}

// === ФОРМА ОПЛАТЫ КАРТОЙ ===

// Форматирование номера карты
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, ''); // Убираем всё, кроме цифр
    if (value.length > 19) value = value.substring(0, 19); // Ограничение 19 символов (для МИР)
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = formatted;
}

// Форматирование срока действия (MM/YY)
function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);

    if (value.length >= 3) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    input.value = value;
}

// Форматирование CVC (3 символа)
function formatCvc(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 3) value = value.substring(0, 3);
    input.value = value;
}

// Валидация формы перед отправкой
function validateCardForm() {
    const cardNumberInput = document.querySelector('#cardPaymentModal input[placeholder="Введите номер карты"]');
    const expiryInput = document.querySelector('#cardPaymentModal input[placeholder="ММ/ГГ"]');
    const cvcInput = document.querySelector('#cardPaymentModal input[placeholder="CVC"]');

    const cardNumber = cardNumberInput.value.replace(/\s/g, '');
    const expiry = expiryInput.value;
    const cvc = cvcInput.value;

    if (cardNumber.length < 16) {
        alert('Введите корректный номер карты (минимум 16 цифр)');
        return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert('Введите срок действия в формате ММ/ГГ');
        return false;
    }

    const [month, year] = expiry.split('/').map(Number);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        alert('Срок действия карты истёк');
        return false;
    }

    if (cvc.length < 3) {
        alert('Введите CVC (3 цифры)');
        return false;
    }

    return true;
}

// === ПРИВЯЗКА ОБРАБОТЧИКОВ СОБЫТИЙ ===
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация слайдера и мест
    initSlider();
    generateSeats();

    // Обработчики для формы карты (только после загрузки DOM)
    const cardNumberInput = document.querySelector('#cardPaymentModal input[placeholder="Введите номер карты"]');
    const expiryInput = document.querySelector('#cardPaymentModal input[placeholder="ММ/ГГ"]');
    const cvcInput = document.querySelector('#cardPaymentModal input[placeholder="CVC"]');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => formatCardNumber(e.target));
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => formatExpiry(e.target));
    }

    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => formatCvc(e.target));
    }

    // Обработчик кнопки "Оплатить"
    const payButton = document.querySelector('#cardPaymentModal .confirm-btn');
    if (payButton) {
        payButton.addEventListener('click', (e) => {
            if (!validateCardForm()) {
                e.preventDefault(); // Останавливаем выполнение, если невалидно
            } else {
                // Здесь можно вызвать функцию оплаты
                processPayment(); // или ваша собственная функция
            }
        });
    }
});