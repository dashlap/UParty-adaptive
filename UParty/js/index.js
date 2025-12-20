// Данные для слайдера - изображения из папки assets/img и заголовки
const slidesData = [
    {
        image: './assets/images/slider_img1.png',
        title: 'ПРИЗРАК ОПЕРЫ'
    },
    {
        image: './assets/images/slider_img2.png', 
        title: 'ПРИЗРАК ОПЕРЫ'
    },
    {
        image: './assets/images/slider_img3.png',
        title: 'ПРИЗРАК ОПЕРЫ'
    },
    {
        image: './assets/images/slider_img4.png',
        title: 'ПРИЗРАК ОПЕРЫ'
    }
];

// Текущий активный слайд
let currentSlide = 0;

// Инициализация слайдера
function initSlider() {
    const mainSlider = document.getElementById('mainSlider');
    const thumbnails = document.getElementById('thumbnails');
    const fullscreenSlider = document.getElementById('fullscreenSliderContainer');
    const fullscreenThumbnails = document.getElementById('fullscreenThumbnails');

    // Создание слайдов и миниатюр
    slidesData.forEach((slideData, index) => {
        // Основной слайдер
        const slide = document.createElement('div');
        slide.className = `slide ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${slideData.image}" alt="Slide ${index + 1}">`;
        mainSlider.appendChild(slide);

        // Миниатюры для основного слайдера
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${slideData.image}" alt="Thumbnail ${index + 1}">`;
        thumbnail.addEventListener('click', () => changeSlide(index));
        thumbnails.appendChild(thumbnail);

        // Слайды для полноэкранного режима
        const fullscreenSlide = document.createElement('div');
        fullscreenSlide.className = `fullscreen-slide ${index === 0 ? 'active' : ''}`;
        fullscreenSlide.innerHTML = `
            <img src="${slideData.image}" alt="Fullscreen Slide ${index + 1}">
            <div class="image-title">${slideData.title}</div>
        `;
        fullscreenSlider.appendChild(fullscreenSlide);

        // Миниатюры для полноэкранного режима
        const fullscreenThumbnail = document.createElement('div');
        fullscreenThumbnail.className = `fullscreen-thumbnail ${index === 0 ? 'active' : ''}`;
        fullscreenThumbnail.innerHTML = `<img src="${slideData.image}" alt="Fullscreen Thumbnail ${index + 1}">`;
        fullscreenThumbnail.addEventListener('click', () => changeFullscreenSlide(index));
        fullscreenThumbnails.appendChild(fullscreenThumbnail);
    });

    // Обработчики событий для основного слайдера
    mainSlider.addEventListener('click', openFullscreen);
    document.getElementById('prevBtn').addEventListener('click', () => navigate(-1));
    document.getElementById('nextBtn').addEventListener('click', () => navigate(1));

    // Обработчики событий для полноэкранного режима
    document.getElementById('closeBtn').addEventListener('click', closeFullscreen);
    document.getElementById('fullscreenPrevBtn').addEventListener('click', () => navigateFullscreen(-1));
    document.getElementById('fullscreenNextBtn').addEventListener('click', () => navigateFullscreen(1));

    // Закрытие полноэкранного режима по клику на затемненную область
    document.getElementById('fullscreenSlider').addEventListener('click', (e) => {
        if (e.target.id === 'fullscreenSlider') {
            closeFullscreen();
        }
    });

    // Обработка клавиш для навигации в полноэкранном режиме
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('fullscreenSlider').classList.contains('active')) {
            if (e.key === 'Escape') {
                closeFullscreen();
            } else if (e.key === 'ArrowLeft') {
                navigateFullscreen(-1);
            } else if (e.key === 'ArrowRight') {
                navigateFullscreen(1);
            }
        }
    });
}

// Смена слайда в основном слайдере
function changeSlide(index) {
    currentSlide = index;
    updateSlides();
}

// Навигация в основном слайдере
function navigate(direction) {
    currentSlide = (currentSlide + direction + slidesData.length) % slidesData.length;
    updateSlides();
}

// Обновление отображения слайдов
function updateSlides() {
    // Основной слайдер
    const slides = document.querySelectorAll('.slide');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === currentSlide);
    });

    // Полноэкранный режим
    const fullscreenSlides = document.querySelectorAll('.fullscreen-slide');
    const fullscreenThumbnails = document.querySelectorAll('.fullscreen-thumbnail');
    
    fullscreenSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    fullscreenThumbnails.forEach((thumbnail, index) => {
        thumbnail.classList.toggle('active', index === currentSlide);
    });

    // Обновление фона в полноэкранном режиме
    updateFullscreenBackground();
}

// Обновление фона в полноэкранном режиме
function updateFullscreenBackground() {
    const fullscreenBg = document.getElementById('fullscreenBg');
    fullscreenBg.style.backgroundImage = `url('${slidesData[currentSlide].image}')`;
}

// Открытие полноэкранного режима
function openFullscreen() {
    document.getElementById('fullscreenSlider').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateFullscreenBackground();
}

// Закрытие полноэкранного режима
function closeFullscreen() {
    document.getElementById('fullscreenSlider').classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Навигация в полноэкранном режиме
function navigateFullscreen(direction) {
    currentSlide = (currentSlide + direction + slidesData.length) % slidesData.length;
    updateSlides();
}

// Смена слайда в полноэкранном режиме
function changeFullscreenSlide(index) {
    currentSlide = index;
    updateSlides();
}

// Инициализация слайдера после загрузки DOM
document.addEventListener('DOMContentLoaded', initSlider); 



// Переменные для хранения состояния
let selectedSeats = [];
let currentPrice = 3200;
let selectedPaymentMethod = null;
let currentModal = null;
let modalHistory = [];
let currentSelectionType = null;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    generateSeats();
});




// Генерация мест в театре
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
            
            if (Math.random() < 0.2) {
                seat.classList.add('occupied');
            } else {
                seat.addEventListener('click', toggleSeatSelection);
            }
            
            container.appendChild(seat);
        }
    }
}

// Выбор/отмена выбора места в театре
function toggleSeatSelection(event) {
    const seat = event.target;
    const row = seat.dataset.row;
    const seatNum = seat.dataset.seat;
    const seatId = `R${row}S${seatNum}`;
    
    if (seat.classList.contains('selected')) {
        seat.classList.remove('selected');
        selectedSeats = selectedSeats.filter(s => s !== seatId);
    } else {
        if (selectedSeats.length >= 10) {
            alert('Вы можете выбрать ограниченное количество мест');
            return;
        }
        seat.classList.add('selected');
        selectedSeats.push(seatId);
    }
    
    updateSelectedSeatsInfo();
}

// Обновление информации о выбранных местах в театре
function updateSelectedSeatsInfo() {
    const selectedRow = document.getElementById('selectedRow');
    const selectedSeat = document.getElementById('selectedSeat');
    const totalPrice = document.getElementById('totalPrice');

    if (!selectedRow || !selectedSeat || !totalPrice) return;

    if (selectedSeats.length === 0) {
        selectedRow.textContent = '-';
        selectedSeat.textContent = '-';
        totalPrice.textContent = '0';
    } else {

        const rows = [];
        const seats = [];

        selectedSeats.forEach(seatId => {
            const row = seatId.substring(1, seatId.indexOf('S'));
            const seatNum = seatId.substring(seatId.indexOf('S') + 1);
            rows.push(row);
            seats.push(seatNum);
        });


        selectedRow.textContent = rows.join(', ');
        selectedSeat.textContent = seats.join(', ');
        totalPrice.textContent = currentPrice * selectedSeats.length;
    }
}

// Открытие окна выбора места в театре
function openSeatSelection() {
    closeAllModals();
    currentSelectionType = 'theater';
    modalHistory = ['seatSelectionModal'];
    document.getElementById('seatSelectionModal').style.display = 'flex';
}

// Переход к оплате из театра
function goToPaymentMethod() {
    if (selectedSeats.length === 0) {
        alert('Пожалуйста, выберите место');
        return;
    }

    document.getElementById('seatSelectionModal').style.display = 'none';
    document.getElementById('paymentMethodModal').style.display = 'flex';

    const total = currentPrice * selectedSeats.length;
    const totalText = total.toString();

    // Обновляем paymentPrice по ID
    const paymentPriceEl = document.getElementById('paymentPrice');
    if (paymentPriceEl) {
        paymentPriceEl.textContent = totalText;
    }

    // Обновляем ВСЕ элементы с классом payment-amount
    document.querySelectorAll('.payment-amount').forEach(el => {
        el.textContent = totalText;
    });

    // Также обновляем детали выбора мест (опционально — уже обсуждалось ранее)
    const rows = [];
    const seats = [];
    selectedSeats.forEach(seatId => {
        const row = seatId.substring(1, seatId.indexOf('S'));
        const seatNum = seatId.substring(seatId.indexOf('S') + 1);
        rows.push(row);
        seats.push(seatNum);
    });

    document.getElementById('paymentRow').textContent = rows.join(', ');
    document.getElementById('paymentSeat').textContent = seats.join(', ');

    modalHistory.push('paymentMethodModal');
}

// функция "Назад" для работы с обоими типами выбора
function goBackToPreviousSelection() {
    document.getElementById('paymentMethodModal').style.display = 'none';
    
    if (currentSelectionType === 'theater') {
        document.getElementById('seatSelectionModal').style.display = 'flex';
        modalHistory.pop();
    }
}

// Выбор способа оплаты
function selectPaymentMethodNew(element, method) {
    document.querySelectorAll('.payment-top-block, .payment-side-block').forEach(el => {
        el.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedPaymentMethod = method;
    
    if (method === 'card') {
        setTimeout(() => {
            document.getElementById('paymentMethodModal').style.display = 'none';
            document.getElementById('cardPaymentModal').style.display = 'flex';
            modalHistory.push('cardPaymentModal');
        }, 300);
    }
}

// Обработка платежа
function processPayment() {
    document.getElementById('cardPaymentModal').style.display = 'none';
    document.getElementById('successModal').style.display = 'flex';
    modalHistory.push('successModal');
}

// Показать окно подтверждения отмены
function showCancelConfirmation(modalId) {
    currentModal = modalId;
    document.getElementById(modalId).style.display = 'none';
    document.getElementById('cancelConfirmationModal').style.display = 'flex';
}

// Закрыть окно подтверждения отмены
function closeCancelConfirmation() {
    document.getElementById('cancelConfirmationModal').style.display = 'none';
    if (currentModal) {
        document.getElementById(currentModal).style.display = 'flex';
    }
}

// Назад к выбору способа оплаты
function goBackToPaymentMethod() {
    document.getElementById('cardPaymentModal').style.display = 'none';
    document.getElementById('paymentMethodModal').style.display = 'flex';
    modalHistory.pop();
}

// Закрыть все модальные окна
function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    
    selectedSeats = [];
    selectedPaymentMethod = null;
    currentModal = null;
    modalHistory = [];
    currentSelectionType = null;
    
    document.querySelectorAll('.seat').forEach(seat => {
        seat.classList.remove('selected');
    });
    
    updateSelectedSeatsInfo();
}