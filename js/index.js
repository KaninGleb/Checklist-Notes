const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: 'green',
        isFavorite: false,
    },
    {
        id: 2,
        title: 'Note 2',
        content: 'Content 2',
        color: 'red',
        isFavorite: true,
    }
]

const colorMap = {
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    green: 'var(--color-green)',
    blue: 'var(--color-blue)',
    purple: 'var(--color-purple)',
}

const model = {
    notes: MOCK_NOTES,
    isShowOnlyFavorite: false,

    addNote(title, content, color) {
        const note = {
            id: new Date().getTime(),
            title,
            content,
            color,
            isFavorite: false
        }
        this.notes.unshift(note);
        this.updateNotesView();
    },

    toggleShowOnlyFavorite() {
        this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
        this.updateNotesView();
    },

    deleteNote(noteId) {
        const noteElement = document.getElementById(noteId);
        noteElement.classList.add('fade-out');
        setTimeout(() => {
            this.notes = this.notes.filter(note => note.id !== noteId);
            this.updateNotesView();
        }, 300);
    },

    toggleFavorite(noteId) {
        this.notes.forEach(note => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite;
                view.renderNotes(this.notes);
            }
        })
    },

    updateNotesView() {
        const notesToRender = this.isShowOnlyFavorite
            ? this.notes.filter(note => note.isFavorite)
            : this.notes;
        const showNoFavoritesMessage = this.isShowOnlyFavorite && notesToRender.length === 0;
        const hiddenNotesCount = this.notes.length - notesToRender.length;

        view.renderNotes(notesToRender, showNoFavoritesMessage, hiddenNotesCount);
        view.renderNotesCounter(this.notes.length);
    },
}

const view = {
    init() {
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

        toggleFavoriteButton.addEventListener('click', () => {
            controller.toggleShowOnlyFavorite();
        })

        const ul = document.querySelector('.notes-list');
        ul.addEventListener('click', event => {
            if (event.target.classList.contains('delete-button')) {
                const noteId = +event.target.closest('li').id;
                controller.deleteNote(noteId);
            }

            if (event.target.closest('.favorite-checkbox')) {
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
                                <img class="favorite-checkbox" src="${note.isFavorite ? './images/icons/main/heart-active.svg' : './images/icons/main/heart-inactive.svg'}" alt="Favorite button">
                                <img class="delete-button" src="./images/icons/main/trash.svg" alt="Delete button">
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
    const messageHtml = `
    <div class="message-item no_select ${isSuccess ? 'success-message' : 'error-message'}" id="${messageId}">
        <img src="${isSuccess ? './images/icons/main/Done.svg' : './images/icons/main/warning.svg'}" alt="${isSuccess ? 'Success' : 'Error'}">
        <span>${message}</span>
        <div class="progress-bar"></div>
    </div>`;

    messagesBox.innerHTML += messageHtml;

    setTimeout(() => {
        const messageElement = document.getElementById(messageId);
        if (messageElement) {
            messageElement.remove();
        }
    }, 3000);
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