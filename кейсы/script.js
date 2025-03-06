const caseDisplay = document.getElementById('caseDisplay');
const spinButton = document.getElementById('spinButton');
const resultDiv = document.getElementById('result');
const caseImage = document.getElementById('caseImage');
const depositButton = document.getElementById('depositButton');
const cardModal = document.getElementById('cardModal');
const depositModal = document.getElementById('depositModal');
const closeModal = document.querySelectorAll('.close');
const confirmDeposit = document.getElementById('confirmDeposit');
const depositAmount = document.getElementById('depositAmount');
const balanceSpan = document.getElementById('balance');
const actionsDiv = document.getElementById('actions');
const sellButton = document.getElementById('sellButton');
const sellPriceSpan = document.getElementById('sellPrice');
const toInventoryButton = document.getElementById('toInventoryButton');
const openInventoryButton = document.getElementById('openInventoryButton');
const inventoryModal = document.getElementById('inventoryModal');
const inventoryItemsDiv = document.getElementById('inventoryItems');
const cardSubmit = document.getElementById('cardSubmit');
const cardNumber = document.getElementById('cardNumber');
const cardExpiry = document.getElementById('cardExpiry');
const cardCVC = document.getElementById('cardCVC');
const cardName = document.getElementById('cardName');
const adminButton = document.getElementById('adminButton');
const adminPanel = document.getElementById('adminPanel');
const appleCaseButton = document.getElementById('appleCaseButton');
const burgerCaseButton = document.getElementById('burgerCaseButton');

let balance = 0; // Начальный баланс
let currentItem = null; // Текущий выпавший предмет
let inventory = []; // Инвентарь игрока
let currentCase = 'apple'; // Текущий выбранный кейс

const appleCaseItems = [
    { name: 'Обычное яблоко', chance: 80, image: 'common_apple.png', price: 4 },
    { name: 'Редкое яблоко', chance: 15, image: 'rare_apple.png', price: 10 },
    { name: 'Мифическое яблоко', chance: 5, image: 'mythic_apple.png', price: 20 },
    { name: 'Легендарное яблоко', chance: 1, image: 'legendary_apple.png', price: 55 }
];

const burgerCaseItems = [
    { name: 'Бургер', chance: 80, image: 'burger.png', price: 4 },
    { name: 'Чизбургер', chance: 10, image: 'cheeseburger.png', price: 10 },
    { name: 'Биг-Хит', chance: 7, image: 'big_hit.png', price: 20 },
    { name: 'Воппер', chance: 3, image: 'whopper.png', price: 100 }
];

// Функция для открытия кейса
spinButton.addEventListener('click', () => {
    if (balance < 10) {
        resultDiv.textContent = 'Ошибка: недостаточно грiвень. Пополните баланс.';
        return;
    }

    balance -= 10; // Снимаем 10 грiвень за открытие кейса
    updateBalance();

    spinButton.disabled = true;
    resultDiv.textContent = '';
    caseImage.src = 'spinning.gif'; // Анимация прокрутки

    setTimeout(() => {
        const items = currentCase === 'apple' ? appleCaseItems : burgerCaseItems;
        const random = Math.random() * 100;
        let cumulativeChance = 0;
        let selectedItem = null;

        for (const item of items) {
            cumulativeChance += item.chance;
            if (random <= cumulativeChance) {
                selectedItem = item;
                break;
            }
        }

        currentItem = selectedItem;
        caseImage.src = selectedItem.image;
        resultDiv.textContent = `Вы получили: ${selectedItem.name}`;
        sellPriceSpan.textContent = selectedItem.price;
        actionsDiv.style.display = 'flex';
        spinButton.disabled = false;
    }, 2000); // Задержка для имитации прокрутки
});

// Функция для обновления баланса на экране
function updateBalance() {
    balanceSpan.textContent = balance;
}

// Продажа предмета
sellButton.addEventListener('click', () => {
    if (currentItem) {
        balance += currentItem.price;
        updateBalance();
        resultDiv.textContent = `Вы продали ${currentItem.name} за ${currentItem.price} грiвень`;
        actionsDiv.style.display = 'none';
        currentItem = null;
    }
});

// Добавление предмета в инвентарь
toInventoryButton.addEventListener('click', () => {
    if (currentItem) {
        inventory.push(currentItem);
        resultDiv.textContent = `${currentItem.name} добавлен в инвентарь`;
        actionsDiv.style.display = 'none';
        currentItem = null;
    }
});

// Открытие окна ввода данных карты
depositButton.addEventListener('click', () => {
    cardModal.style.display = 'flex';
});

// Закрытие модальных окон
closeModal.forEach(button => {
    button.addEventListener('click', () => {
        cardModal.style.display = 'none';
        depositModal.style.display = 'none';
        inventoryModal.style.display = 'none';
        adminPanel.style.display = 'none';
    });
});

// Подтверждение ввода данных карты
cardSubmit.addEventListener('click', () => {
    if (cardNumber.value && cardExpiry.value && cardCVC.value && cardName.value) {
        cardModal.style.display = 'none';
        depositModal.style.display = 'flex';
    } else {
        alert('Заполните все поля!');
    }
});

// Подтверждение пополнения баланса
confirmDeposit.addEventListener('click', () => {
    const amount = parseInt(depositAmount.value);
    if (amount > 0) {
        balance += amount;
        updateBalance();
        depositModal.style.display = 'none';
        depositAmount.value = ''; // Очищаем поле ввода
    } else {
        alert('Введите корректную сумму!');
    }
});

// Открытие инвентаря
openInventoryButton.addEventListener('click', () => {
    inventoryModal.style.display = 'flex';
    renderInventory();
});

// Рендер инвентаря
function renderInventory() {
    inventoryItemsDiv.innerHTML = '';
    inventory.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'inventory-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>${item.name}</p>
            <button onclick="sellFromInventory(${index})">Продать (${item.price} грiвень)</button>
        `;
        inventoryItemsDiv.appendChild(itemDiv);
    });
}

// Продажа предмета из инвентаря
window.sellFromInventory = (index) => {
    const item = inventory[index];
    balance += item.price;
    updateBalance();
    inventory.splice(index, 1); // Удаляем предмет из инвентаря
    renderInventory(); // Обновляем отображение инвентаря
};

// Выбор кейса
appleCaseButton.addEventListener('click', () => {
    currentCase = 'apple';
    caseImage.src = 'apple_case.png'; // Изображение яблочного кейса
});

burgerCaseButton.addEventListener('click', () => {
    currentCase = 'burger';
    caseImage.src = 'burger_case.png'; // Изображение бургерного кейса
});

// Админ-панель
adminButton.addEventListener('click', () => {
    const pin = prompt('Введите пин-код:');
    if (pin === '1239') {
        adminPanel.style.display = 'flex';
    } else {
        alert('Неверный пин-код!');
    }
});

// Добавление предмета в инвентарь через админ-панель
window.addItemToInventory = (itemName) => {
    const allItems = [...appleCaseItems, ...burgerCaseItems];
    const item = allItems.find(i => i.name === itemName);
    if (item) {
        inventory.push(item);
        renderInventory();
        alert(`${itemName} добавлен в инвентарь!`);
    }
};