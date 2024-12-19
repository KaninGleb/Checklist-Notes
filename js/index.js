const MOCK_NOTES = [
    {
        id: 1,
        title: 'Работа с формами',
        content: 'К определённым полям формы можно обратиться через form.elements по значению, указанному в атрибуте name',
        color: 'green',
        isFavorite: false,
    },
    // ...
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
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.updateNotesView()
    },

    toggleFavorite(noteId) {
        this.notes.forEach(note => {
            if (note.id === noteId) {
                note.isFavorite = !note.isFavorite;
                // Обновляем вид после изменения состояния
                view.renderNotes(this.notes);
            }
        })
    },

    updateNotesView() {
        const notesToRender = this.isShowOnlyFavorite
            ? this.notes.filter(note => note.isFavorite)
            : this.notes;
        view.renderNotes(notesToRender);
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
                title.value = '';
                content.value = '';
                titleLabel.textContent = `Название заметки`;
                contentLabel.textContent = `Описание новой заметки`;
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

    renderNotes(notes) {
        const list = document.querySelector('.notes-list');
        let notesHTML = '';

        notes.forEach(note => {
            notesHTML +=
                `<li id="${note.id}" class="${note.isFavorite ? 'favorite-note' : ''}">
                <div class="note-wrapper">
                    <div class="note-header" style="background-color: ${colorMap[note.color]}">
                        <p class="note-title">${note.title}</p>
                        <div class="buttons-wrapper">
                            <span class="favorite-checkbox custom-checkbox">
                            <!--<input type="checkbox" class="checkbox favorite-button" ${note.isFavorite ? 'checked' : ''} name="Favorite" />-->
                                <img src="${note.isFavorite ? './images/icons/main/heart-active.svg' : './images/icons/main/heart-inactive.svg'}" alt="Favorite button">
                            </span>
                            <img class="delete-button" src="./images/icons/main/trash.svg" alt="Delete button">
                        </div>
                    </div>
                    <p class="note-content">${note.content}</p>
                </div>
            </li>`
        })
        list.innerHTML = notesHTML;
    },

    renderNotesCounter(count) {
        const counter = document.querySelector('.note_counter b');
        counter.textContent = count;
    }
}

const controller = {
    addNote(title, content, color) {
        if (!title.trim() || !content.trim()) {
            console.log('Оба поля должны иметь данные');
            return false;
        }
        if (title.length > 50) {
            console.log('Заголовок не должен превышать 50 символов');
            return false;
        }
        model.addNote(title, content, color);
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