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
    addNote(title, content, color) {
        const note = {
            // 1. создадим новую заметку
        }

        // 2. добавим заметку в начало списка
        // 3. обновим view
    },

    updateNotesView() {
        // 1. рендерит список заметок (вызывает метод view.renderNotes)
        // 2. рендерит количество заметок (вызывает метод view.renderNotesCount)
    }
}

const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

const view = {
    init() {
        this.renderNotes(model.notes)

        const form = document.querySelector('.note-form');
        form.addEventListener('submit', (event) => {
            // получаем данные из полей формы
            // передаем данные в контроллер
            controller.addNote(title, content, color);
        })

    },
    renderNotes(notes) {}
}

const controller = {
    addNote(title, content, color) {
        // здесь можно добавить валидацию полей
        // your code

        // вызываем метод модели
        model.addNote(title, content, color);

        // view.showMessage('Заметка добавлена')
    }
}

function init() {
    view.init()
}

init()