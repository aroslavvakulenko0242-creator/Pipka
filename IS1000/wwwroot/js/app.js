// ============================================================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    // Заполнение datalist героев и предметов (если они ещё нужны)
    const heroDatalist = document.getElementById('hero-list');
    if (heroDatalist) {
        heroesList.forEach(hero => {
            const option = document.createElement('option');
            option.value = hero;
            heroDatalist.appendChild(option);
        });
    }

    const itemDatalist = document.getElementById('item-list');
    if (itemDatalist) {
        itemsList.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            itemDatalist.appendChild(option);
        });
    }

    // Кастомный выбор героя с иконками
    function initHeroSelect() {
        const heroInput = document.getElementById('hero-input');
        const heroOptionsContainer = document.getElementById('hero-options');
        const heroHidden = document.getElementById('hero');

        // Если элементов нет на странице (например, на других экранах), выходим
        if (!heroInput || !heroOptionsContainer || !heroHidden) return;

        // Вместо testHeroes используем полный список героев
        const allHeroesWithIcons = heroesList.map(heroName => ({
            name: heroName,
            icon: `/images/heroes/${heroName.toLowerCase().replace(/ /g, '_')}.png`
        }));

        // Функция рендеринга опций
        function renderOptions(filter = '') {
            const filtered = allHeroesWithIcons.filter(hero =>
                hero.name.toLowerCase().includes(filter.toLowerCase())
            );
            heroOptionsContainer.innerHTML = '';
            if (filtered.length === 0) {
                heroOptionsContainer.classList.remove('show');
                return;
            }
            filtered.forEach(hero => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'hero-option';
                optionDiv.innerHTML = `
                    <img src="${hero.icon}" alt="${hero.name}" onerror="this.onerror=null; this.src='/images/heroes/placeholder.png';">
                    <span>${hero.name}</span>
                `;
                optionDiv.addEventListener('click', () => {
                    heroInput.value = hero.name;
                    heroHidden.value = hero.name;
                    heroOptionsContainer.classList.remove('show');
                });
                heroOptionsContainer.appendChild(optionDiv);
            });
            heroOptionsContainer.classList.add('show');
        }

        // Скрывать список при клике вне
        document.addEventListener('click', (e) => {
            if (!heroInput.contains(e.target) && !heroOptionsContainer.contains(e.target)) {
                heroOptionsContainer.classList.remove('show');
            }
        });

        // Показывать/фильтровать при вводе
        heroInput.addEventListener('input', (e) => {
            renderOptions(e.target.value);
            if (!heroInput.value) heroHidden.value = '';
        });

        // При получении фокуса показывать все опции
        heroInput.addEventListener('focus', () => {
            renderOptions(heroInput.value);
        });
    }

    // Вызов кастомного селекта
    initHeroSelect();
    initItemSelects();

    // Установка обработчиков навигации
    setupNavigation();

    // Форма добавления
    const matchForm = document.getElementById('match-form');
    if (matchForm) {
        matchForm.addEventListener('submit', handleMatchSubmit);
    }

    // Мета: позиционные табы
    const posTabs = document.querySelectorAll('.pos-tab');
    posTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            posTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const position = tab.getAttribute('data-pos');
            loadTopHeroes(position);
        });
    });

    // При первом показе меты загружаем первую позицию
    const metaScreen = document.getElementById('meta-screen');
    if (metaScreen) {
        metaScreen.addEventListener('screen-show', () => {
            const activeTab = document.querySelector('.pos-tab.active');
            if (activeTab) {
                const position = activeTab.getAttribute('data-pos');
                loadTopHeroes(position);
            }
        });
    }
});

// ============================================================
// НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ (SPA)
// ============================================================
function setupNavigation() {
    const screens = document.querySelectorAll('.screen');
    const backBtns = document.querySelectorAll('.back-btn');

    function showScreen(screenId) {
        screens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.add('active');
                // Триггер события для экрана
                const event = new Event('screen-show');
                screen.dispatchEvent(event);
            } else {
                screen.classList.remove('active');
            }
        });
    }

    const addScreen = document.getElementById('add-screen');
    if (addScreen) {
        addScreen.addEventListener('screen-show', () => {
            const form = document.getElementById('match-form');
            if (form) form.reset();
            document.querySelectorAll('.item-input').forEach(input => input.value = '');
        });
    }

    // Кнопки главного меню
    const addBtn = document.getElementById('add-data-btn');
    const viewBtn = document.getElementById('view-meta-btn');
    if (addBtn) addBtn.addEventListener('click', () => showScreen('add-screen'));
    if (viewBtn) viewBtn.addEventListener('click', () => showScreen('meta-screen'));

    // Обработка кнопок "назад"
    backBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetScreen = btn.getAttribute('data-target');
            if (targetScreen === 'home') showScreen('home-screen');
            else if (targetScreen === 'meta') showScreen('meta-screen');
        });
    });
}

// ============================================================
// ВСПЛЫВАЮЩЕЕ СООБЩЕНИЕ (TOAST)
// ============================================================
function showToast(message, isError = false) {
    const toast = document.getElementById('toast-message');
    if (!toast) return;
    toast.textContent = message;
    toast.style.backgroundColor = isError ? '#9c2e2e' : '#1F303B';
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================================
// ОБРАБОТЧИК ФОРМЫ ДОБАВЛЕНИЯ МАТЧА
// ============================================================
async function handleMatchSubmit(event) {
    event.preventDefault();

    const hero = document.getElementById('hero').value.trim();
    const position = document.getElementById('position').value;
    const lose_win = document.querySelector('input[name="lose_win"]:checked')?.value;
    const itemInputs = document.querySelectorAll('.item-input');
    const items = Array.from(itemInputs).map(input => input.value.trim()).filter(val => val !== '');

    if (!hero || !position || lose_win === undefined) {
        showToast("Please fill all required fields: Hero, Position, Result", true);
        return;
    }

    const matchData = {
        HeroName: hero,
        Position: position,
        Lose_win: parseInt(lose_win, 10),
        Items: items
    };

    try {
        const response = await addMatch(matchData);
        if (response.success) {
            showToast(response.message);
            document.getElementById('match-form').reset();
            document.querySelectorAll('.item-input').forEach(input => input.value = '');
        } else {
            showToast("Error saving match. Please try again.", true);
        }
    } catch (error) {
        console.error(error);
        showToast("Server error. Check console.", true);
    }
}

// ============================================================
// ЗАГРУЗКА ТОП-5 ГЕРОЕВ ДЛЯ ВЫБРАННОЙ ПОЗИЦИИ
// ============================================================
async function loadTopHeroes(position) {
    const container = document.getElementById('top-heroes-list');
    if (!container) return;
    container.innerHTML = '<div style="text-align:center;">Loading...</div>';

    const heroes = await getTopHeroes(position);
    if (!heroes.length) {
        container.innerHTML = '<div style="text-align:center;">No data for this position</div>';
        return;
    }

    container.innerHTML = '';
    heroes.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'hero-card';

        // Формируем путь к иконке
        const heroFileName = hero.name.toLowerCase().replace(/ /g, '_');
        const iconPath = `/images/heroes/${heroFileName}.png`;

        card.innerHTML = `
            <div class="hero-info">
                <img src="${iconPath}" alt="${hero.name}" class="hero-icon" onerror="this.onerror=null; this.src='/images/heroes/placeholder.png';">
                <span class="hero-name">${hero.name}</span>
            </div>
            <div class="hero-winrate">${hero.winrate}%</div>
        `;
        card.addEventListener('click', () => showHeroDetails(hero.name));
        container.appendChild(card);
    });
}

// ============================================================
// ПОКАЗ ДЕТАЛЕЙ ГЕРОЯ (ПОСЛЕДНИЕ ИГРЫ)
// ============================================================
async function showHeroDetails(heroName) {
    const heroDetailScreen = document.getElementById('hero-detail-screen');
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    heroDetailScreen.classList.add('active');

    document.getElementById('hero-detail-title').textContent = heroName;

    const contentDiv = document.getElementById('hero-detail-content');
    contentDiv.innerHTML = '<div style="text-align:center;">Loading games...</div>';

    const games = await getHeroGames(heroName);
    if (!games.length) {
        contentDiv.innerHTML = '<div style="text-align:center;">No recent games found.</div>';
        return;
    }

    // Шапка героя
    const heroHeader = document.createElement('div');
    heroHeader.className = 'hero-header-detail';
    const heroFileName = heroName.toLowerCase().replace(/ /g, '_');
    const heroIconPath = `/images/heroes/${heroFileName}.png`;
    heroHeader.innerHTML = `
        <img src="${heroIconPath}" alt="${heroName}" class="hero-icon-large" onerror="this.onerror=null; this.src='/images/heroes/placeholder.png';">
        <div class="hero-name-large">${heroName}</div>
    `;

    const gamesList = document.createElement('div');
    gamesList.className = 'games-list';

    games.forEach((game, idx) => {
        const gameDiv = document.createElement('div');
        gameDiv.className = 'game-item';
        const resultClass = game.result.toLowerCase() === 'win' ? 'win' : 'loss';

        const itemsHtml = [];
        for (let i = 0; i < 6; i++) {
            const itemName = game.items[i] || null;
            if (itemName) {
                const itemFileName = itemName.toLowerCase().replace(/ /g, '_').replace(/'/g, '');
                const itemIconPath = `/images/items/${itemFileName}.png`;
                itemsHtml.push(`
                    <div class="item-slot-icon" data-item-name="${itemName}">
                        <img src="${itemIconPath}" alt="${itemName}" onerror="this.onerror=null; this.src='/images/items/placeholder.png';">
                    </div>
                `);
            } else {
                itemsHtml.push(`<div class="item-slot-empty">—</div>`);
            }
        }

        gameDiv.innerHTML = `
            <div class="game-header">
                <span>Game ${idx + 1}</span>
                <span class="${resultClass}">${game.result}</span>
            </div>
            <div class="items-grid">
                ${itemsHtml.join('')}
            </div>
        `;

        // Добавляем обработчики кликов на иконки предметов
        const itemSlots = gameDiv.querySelectorAll('.item-slot-icon');
        itemSlots.forEach(slot => {
            slot.addEventListener('click', (e) => {
                const itemName = slot.getAttribute('data-item-name');
                console.log('Clicked on item:', itemName);
                if (itemName) showToast(itemName);
            });
        });
        

        gamesList.appendChild(gameDiv);
    });

    contentDiv.innerHTML = '';
    contentDiv.appendChild(heroHeader);
    contentDiv.appendChild(gamesList);
}

// Функция инициализации кастомных селектов предметов
function initItemSelects() {
    const itemContainers = document.querySelectorAll('.custom-select-item');

    // Создаём массив предметов с иконками (на основе глобального itemsList)
    const allItemsWithIcons = itemsList.map(itemName => ({
        name: itemName,
        icon: `/images/items/${itemName.toLowerCase().replace(/ /g, '_').replace(/'/g, '')}.png`
    }));

    // Для каждого контейнера предмета
    itemContainers.forEach(container => {
        const input = container.querySelector('.item-input');
        const optionsDiv = container.querySelector('.items-options');

        // Функция рендеринга опций
        function renderOptions(filter = '') {
            const filtered = allItemsWithIcons.filter(item =>
                item.name.toLowerCase().includes(filter.toLowerCase())
            );
            optionsDiv.innerHTML = '';
            if (filtered.length === 0) {
                optionsDiv.classList.remove('show');
                return;
            }
            filtered.forEach(item => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'item-option';
                optionDiv.innerHTML = `
                    <img src="${item.icon}" alt="${item.name}" onerror="this.onerror=null; this.src='/images/items/placeholder.png';">
                    <span>${item.name}</span>
                `;
                optionDiv.addEventListener('click', () => {
                    input.value = item.name;
                    optionsDiv.classList.remove('show');
                });
                optionsDiv.appendChild(optionDiv);
            });
            optionsDiv.classList.add('show');
        }

        // Скрывать список при клике вне
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                optionsDiv.classList.remove('show');
            }
        });

        // Показывать/фильтровать при вводе
        input.addEventListener('input', (e) => {
            renderOptions(e.target.value);
        });

        // При получении фокуса показывать все опции
        input.addEventListener('focus', () => {
            renderOptions(input.value);
        });
    });
}