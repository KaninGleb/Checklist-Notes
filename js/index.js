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
    updateNotesView() {
        // 1. рендерит список заметок (вызывает метод view.renderNotes)
        view.renderNotes(this.notes);
        // 2. рендерит количество заметок (вызывает метод view.renderNotesCount)
        // view.renderNotesCount(this.notes.length);
    },
    //
    //
    // updateNotesView() {
    //     const notesToRender = this.notes.filter(el => el.isFavorite);
    //     this.notes = notesToRender;
    //
    //     view.renderNotes(this.notes);
    // }
}

const colorMap = {
    yellow: 'var(--color-yellow)',
    red: 'var(--color-red)',
    green: 'var(--color-green)',
    blue: 'var(--color-blue)',
    purple: 'var(--color-purple)',
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.note-form');
        const title = document.querySelector('.note_input');
        const content = document.querySelector('.note_description');

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            // получаем данные из полей формы
            const color = document.querySelector('input[name="color"]:checked');
            // передаем данные в контроллер
            controller.addNote(title.value, content.value, color.value);

            title.value = '';
            content.value = '';
        })
    },

    renderNotes(notes) {
        const list = document.querySelector('.notes-list');
        let notesHTML = '';

        notes.forEach(note => {
            notesHTML +=
                `<li id="${note.id}" class="${note.isFavorite ? 'favorite' : ''}">
            <div class="note-wrapper">
                <div class="note-title-actions-wrapper" style="background-color: ${colorMap[note.color]}">
                    <p class="note-title">${note.title}</p>
                    <div class="button-wrapper">
                        <input class="favorite-button" type="checkbox"></input>
                        <button class="delete-button">-X-</input>
                    </div>
                </div>
                <p class="note-content">${note.content}</p>
            </div>
        </li>`
        })
        list.innerHTML = notesHTML;
    }
}

const controller = {
    addNote(title, content, color) {
        // здесь можно добавить валидацию полей
            model.addNote(title, content, color);
        // view.showMessage('Заметка добавлена')
    }
}

function init() {
    view.init()
}

init()