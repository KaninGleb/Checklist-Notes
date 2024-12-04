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
}

const colors = {
    GREEN: 'green',
    BLUE: 'blue',
    RED: 'red',
    YELLOW: 'yellow',
    PURPLE: 'purple',
}

const view = {
    renderNotes(notes) {
        // your code here
        // находим контейнер для заметок и рендерим заметки в него (если заметок нет, отображаем соответствующий текст)
        // также здесь можно будет повесить обработчики кликов на кнопки удаления и избранного
    }
}

const view = {
    init() {
        this.renderNotes(model.notes)
    },
    renderNotes(notes) { ...
    }
}

function init() {
    view.init()
}

init()