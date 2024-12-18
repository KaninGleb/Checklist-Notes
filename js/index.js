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
        // 2. добавим заметку в начало списка
        this.notes.unshift(note)
        // 3. обновим view
        this.updateNotesView();
    },

    // toggleShowOnlyFavorite(isShowOnlyFavorite) {
    //     this.isShowOnlyFavorite = !this.isShowOnlyFavorite;
    //     this.updateNotesView();
    // },
    //
    // updateNotesView() {
    //     const notesToRender = this.notes.filter(el => el.isFavorite);
    //     this.notes = notesToRender;
    //
    //     view.renderNotes(this.notes);
    // },

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
    }
    ,

    updateNotesView() {
        view.renderNotes(this.notes);
        // 2. рендерит количество заметок (вызывает метод view.renderNotesCount)
        view.renderNotesCounter(this.notes.length);
    },
}

const view = {
    init() {
        this.renderNotes(model.notes);
        this.renderNotesCounter(model.notes.length);

        const form = document.querySelector('.note-form');
        const title = document.querySelector('.note_input');
        const content = document.querySelector('.note_description');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const color = document.querySelector('input[name="color"]:checked');
            controller.addNote(title.value, content.value, color.value);

            const result = controller.addNote(title, content, color);

            if (result) {
                title.value = '';
                content.value = '';
            }
        });

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
                                <img src="${note.isFavorite ? '/images/icons/main/heart-active.svg' : '/images/icons/main/heart-inactive.svg'}" alt="Favorite button">
                            </span>
                            <img class="delete-button" src="/images/icons/main/trash.svg" alt="Delete button">
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
        if (!title.trim()) {
            console.log('Название не может быть пустым');
            return false;
        }
        if (!content.trim()) {
            console.log('Содержимое не может быть пустым');
            return false;
        }
        if (title.length > 45) {
            console.log('Заголовок не должен превышать 45 символов');
            return false;
        }
        if (content.length > 300) {
            console.log('Содержимое заметки не должно превышать 300 символов');
            return false;
        }
        model.addNote(title, content, color);
        return true;
    },

    deleteNote(noteId) {
        model.deleteNote(noteId);
    },

    toggleFavorite(noteId) {
        model.toggleFavorite(noteId);
    }
}

function init() {
    view.init()
}

init()