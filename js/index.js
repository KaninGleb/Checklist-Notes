const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name.',
        color: 'green',
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Обработка событий',
        content: 'События в JavaScript позволяют реагировать на действия пользователя, такие как клики или нажатия клавиш.',
        color: 'red',
        isFavorite: true,
    },
    {
        id: 3,
        title: 'Асинхронные операции',
        content: 'Используйте промисы для работы с асинхронными операциями. Это позволит избежать callback hell и сделает код более читаемым. Промисы можно легко комбинировать с async/await для упрощения синтаксиса.',
        color: 'blue',
        isFavorite: false,
    },
    {
        id: 4,
        title: 'CSS Flexbox',
        content: 'Flexbox упрощает создание адаптивных макетов. Используйте свойства justify-content и align-items для выравнивания элементов в контейнере. Flexbox позволяет легко управлять пространством между элементами и изменять их порядок.',
        color: 'yellow',
    },
    {
        id: 5,
        title: 'JavaScript ES6',
        content: 'Используйте стрелочные функции и let/const для работы с переменными и функциями.',
        color: 'purple',
        isFavorite: false,
    },
    {
        id: 6,
        title: 'React Hooks',
        content: 'Hooks, такие как useState и useEffect, позволяют управлять состоянием и жизненным циклом компонентов.',
        color: 'green',
        isFavorite: true,
    },
    {
        id: 7,
        title: 'API Fetch',
        content: 'Используйте fetch для получения данных с сервера. Он возвращает промис, который можно обработать.',
        color: 'red',
        isFavorite: false,
    },
    {
        id: 8,
        title: 'Управление состоянием',
        content: 'Redux и Context API помогают управлять состоянием приложения в React.',
        color: 'blue',
        isFavorite: true,
    },
];

const colorMap = {
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    green: 'var(--color-green)',
    blue: 'var(--color-blue)',
    purple: 'var(--color-purple)',
}

const model = {
    notes: [],
    isShowOnlyFavorite: false,

    loadNotesFromLocalStorage () {
        const savedNotes = localStorage.getItem('notes');
        this.notes = savedNotes ? this.notes = JSON.parse(savedNotes) : [];
    },
    
    saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
    },

    addNote(title, content, color) {
        const note = {
            id: new Date().getTime(),
            title,
            content,
            color,
            isFavorite: false
        }
        this.notes.unshift(note);
        this.saveNotesToLocalStorage();
        this.updateNotesView();
    },

    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
        this.updateNotesView();
    },

    toggleFavorite(noteId) {
        this.notes.forEach(note => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite;
                view.renderNotes(this.notes);
            }
        })
    },

    deleteNote(noteId) {
        const noteElement = document.getElementById(noteId);
        noteElement.classList.add('fade-out');
        setTimeout(() => {
            this.notes = this.notes.filter(note => note.id !== noteId);
            this.saveNotesToLocalStorage();
            this.updateNotesView();
        }, 200);
    },

    updateNotesView() {
        const notesToRender = this.isShowOnlyFavorite
            ? this.notes.filter(note => note.isFavorite)
            : this.notes;

        const showNoFavoritesMessage = this.isShowOnlyFavorite && notesToRender.length === 0;
        const hiddenNotesCount = this.notes.length - notesToRender.length;

        view.renderNotes(notesToRender, showNoFavoritesMessage, hiddenNotesCount);
        view.renderNotesCounter(this.notes.length);

        const customContainer = document.querySelector('#custom-container');
        if (notesToRender.length > 0) {
            customContainer.classList.add('custom-container');
        } else {
            customContainer.classList.remove('custom-container');
        }
    },

}

const view = {
    init() {
        model.loadNotesFromLocalStorage();
        this.renderNotes(model.notes);
        this.renderNotesCounter(model.notes.length);

        const form = document.querySelector('.note-form');
        const title = document.querySelector('.note_title');
        const titleLabel = document.querySelector('.name_wrapper label');
        const content = document.querySelector('.note_description');
        const contentLabel = document.querySelector('.description_wrapper label');
        const clearInputFields = () => {
            title.value = '',
                content.value = '',
                titleLabel.textContent = `Название заметки`,
                contentLabel.textContent = `Описание новой заметки`
        }

        const toggleFavoriteButton = document.querySelector('#toggle-favorites');

        title.addEventListener('input', () => {
            const currentTitleLength = title.value.length;
            titleLabel.textContent = `Название заметки (${currentTitleLength}/50)`;
            titleLabel.style.color = currentTitleLength > 50 ? 'red' : '';
        })

        content.addEventListener('input', () => {
            const currentContentLength = content.value.length;
            contentLabel.textContent = `Описание новой заметки (${currentContentLength})`
        })

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const color = document.querySelector('input[name="color"]:checked');
            const result = controller.addNote(title.value, content.value, color.value);
            
            if (result) {
                clearInputFields();
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'Enter') {
                event.preventDefault();
                const color = document.querySelector('input[name="color"]:checked');
                const result = controller.addNote(title.value, content.value, color.value);
                
                if (result) {
                    clearInputFields();
                }
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.shiftKey && event.key === 'X') {
                event.preventDefault();

                const list = document.querySelector('.notes-list');
                const notesItems = list.querySelectorAll('li');

                notesItems.forEach((noteItem) => {
                    noteItem.classList.add('fade-out');
                    noteItem.addEventListener('transitionend', () => {
                        noteItem.remove();
                    });
                });
                clearInputFields();

                setTimeout(() => {
                    model.notes = [];
                    model.updateNotesView();
                }, 500);
            }
        });

        toggleFavoriteButton.addEventListener('click', () => {
            controller.toggleShowOnlyFavorite();
        })

        const ul = document.querySelector('.notes-list');
        ul.addEventListener('click', event => {
            if (event.target.classList.contains('delete-button')) {
                const noteId = +event.target.closest('li').id;
                const noteTitle = event.target.closest('li').querySelector('.note-title').textContent;
                this.openDeleteConfirmation(noteId, noteTitle);
            }

            if (event.target.closest('.favorite-button')) {
                const noteId = +event.target.closest('li').id;
                controller.toggleFavorite(noteId);
            }
        })
    },

    renderNotes(notes, showNoFavoritesMessage, hiddenNotesCount) {
        const list = document.querySelector('.notes-list');
        let notesHTML = '';

        if (showNoFavoritesMessage) {
            notesHTML = `<li class="no-favorite-notes-screen-massage">У вас нет избранных заметок!</li>`;
        } else if (notes.length === 0) {
            notesHTML = `<li class="no-notes-screen-massage">У вас нет еще ни одной заметки<br>Заполните поля выше и создайте свою первую заметку!</li>`
        } else {
        notes.forEach(note => {
            notesHTML +=
                `<li id="${note.id}" class="${note.isFavorite ? 'favorite-note' : ''}">
                    <div class="note-wrapper">
                        <div class="note-header" style="background-color: ${colorMap[note.color]}">
                            <p class="note-title">${note.title}</p>
                            <div class="buttons-wrapper">
                                <img class="favorite-button" src="${note.isFavorite ? './images/icons/main/heart-active.svg' : './images/icons/main/heart-inactive.svg'}" alt="Favorite button" draggable="false">
                                <img class="delete-button" src="./images/icons/main/trash.svg" alt="Delete button" draggable="false">
                            </div>
                        </div>
                        <p class="note-content">${note.content}</p>
                    </div>
                </li>`
        })
        }
        list.innerHTML = notesHTML;

        const hiddenNotesMessage = document.querySelector('.hidden-notes-message');
        if (hiddenNotesCount > 0) {
            hiddenNotesMessage.textContent = `(Скрыто: ${hiddenNotesCount})`
        } else {
            hiddenNotesMessage.textContent = ''
        }
    },

    renderNotesCounter(count) {
        const counter = document.querySelector('.note_counter b');
        counter.textContent = count;
    },

    showMessage(message, isSuccess) {
        const messagesBox = document.querySelector('.messages-box');
        const messageId = `message-${new Date().getTime()}`;
        
        const messageItem = document.createElement('div');
        messageItem.className = `message-item no_select ${isSuccess ? 'success-message' : 'error-message'}`;
        messageItem.id = messageId;
        
        const img = document.createElement('img');
        img.src = isSuccess ? './images/icons/main/Done.svg' : './images/icons/main/warning.svg';
        img.alt = isSuccess ? 'Success' : 'Error';
        
        const span = document.createElement('span');
        span.textContent = message;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        messageItem.appendChild(img);
        messageItem.appendChild(span);
        messageItem.appendChild(progressBar);

        messagesBox.appendChild(messageItem);
        
        setTimeout(() => {
            const messageElement = document.getElementById(messageId);
            if (messageElement) {
                messageElement.classList.add('fade-out');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 3000);
    },

    openDeleteConfirmation(noteId, noteTitle) {
        const modalHtml = `
            <div class="modal" id="delete-confirmation">
                <div class="modal-content">
                    <div class="modal-header-wrapper">
                        <span class="modal-title">Удаление заметки</span>
                        <img class="modal-cancel-button" src="../images/icons/main/cancel.svg" alt="Cancel" draggable="false">
                    </div>
                    <hr class="divider">
                    <div class="delete-confirmation-wrapper">
                        <span class="delete-message-text" id="delete-message"></span>
                        <button class="cancel-delete-button" id="cancel-delete"></button>
                        <button class="confirm-delete-button" id="confirm-delete">Удалить</button>
                    </div>
                </div>
            </div>`;

        const container = document.querySelector('#openDeleteConfirmation-container');
        container.innerHTML += modalHtml;

        const modal = document.querySelector('#delete-confirmation');
        const messageElement = document.querySelector('#delete-message');
        const confirmButton = document.querySelector('#confirm-delete');
        const cancelButton = document.querySelector('#cancel-delete');
        const modalCancelButton = document.querySelector('.modal-cancel-button');

        messageElement.innerHTML = `Вы уверены, что хотите удалить заметку <br>“<b>${noteTitle}</b>”?`;

        let countdown = 5;
        cancelButton.textContent = `Отменить (${countdown})`;

        const interval = setInterval(() => {
            countdown--;
            cancelButton.textContent = `Отменить (${countdown})`;

            if (countdown <= 0) {
                clearInterval(interval);
                controller.deleteNote(noteId);
                modal.remove();
            }
        }, 1000);

        confirmButton.onclick = () => {
            clearInterval(interval);
            controller.deleteNote(noteId);
            modal.remove();
        };

        cancelButton.onclick = () => {
            clearInterval(interval);
            modal.remove();
        };

        modalCancelButton.onclick = () => {
            clearInterval(interval);
            modal.remove();
        }
    }
}

const controller = {
    addNote(title, content, color) {
        if (!title.trim() || !content.trim()) {
            view.showMessage('Оба поля должны иметь данные', false);
            return false;
        }
        if (title.length > 50) {
            view.showMessage('Максимальная длина заголовка - 50 символов', false);
            return false;
        }
        model.addNote(title, content, color);
        view.showMessage('Заметка добавлена!', true);
        return true;
    },

    toggleShowOnlyFavorite() {
        model.toggleShowOnlyFavorite();
    },

    deleteNote(noteId) {
        model.deleteNote(noteId);
    },

    toggleFavorite(noteId) {
        model.toggleFavorite(noteId);
    }
}

function init() {
    view.init();
}

init();