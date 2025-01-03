const MAX_TITLE_LENGTH = 50;
const MAX_CONTENT_LENGTH = 500;
const DELETE_CONFIRMATION_COUNTDOWN = 5;
const ANIMATION_FADE_OUT_DURATION = 200;
const MESSAGE_DISPLAY_DURATION = 3000;

const IMAGE_PATHS = {
    heartActive: './assets/images/icons/main/note-favourite-heart-active.svg',
    heartInactive: './assets/images/icons/main/favourite-heart-inactive.svg',
    deleteButton: './assets/images/icons/main/note-delete-button.svg',
    successIcon: './assets/images/icons/main/note-message-success.svg',
    warningIcon: './assets/images/icons/main/message-warning.svg',
    cancelButton: './assets/images/icons/main/modal-cancel-button.svg',
}

const COLOR_MAP = {
    yellow: 'var(--note-color-yellow)',
    red: 'var(--note-color-red)',
    green: 'var(--note-color-green)',
    blue: 'var(--note-color-blue)',
    purple: 'var(--note-color-purple)',
    errorRed: 'var(--color-red)',
}

const MESSAGES = {
    emptyFields: 'Both fields must have data',
    titleLengthExceeded: 'Maximum title length is 50 characters',
    contentLengthExceeded: 'Maximum description length is 500 characters',
    noteAdded: 'Note successfully added!',
};

const model = {
    notes: [],
    isShowOnlyFavorite: false,

    loadNotesFromLocalStorage () {
        const savedNotes = localStorage.getItem('notes');
        this.notes = savedNotes ? this.notes = JSON.parse(savedNotes) : [];
    },

    loadCustomContainerState() {
        const isCustomContainerVisible = localStorage.getItem('customContainerVisible') === 'true';
        const customContainer = document.querySelector('#custom-container');
        if (isCustomContainerVisible) {
            customContainer.classList.add('custom-container');
        }
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
                this.saveNotesToLocalStorage();
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
        }, ANIMATION_FADE_OUT_DURATION);
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
        const hasNotes = notesToRender.length > 0;
        const shouldShowCustomContainer = this.isShowOnlyFavorite ? hasNotes : this.notes.length > 0;

        if (shouldShowCustomContainer) {
            customContainer.classList.add('custom-container');
        } else {
            customContainer.classList.remove('custom-container');
        }
    },
}

const view = {
    init() {
        model.loadNotesFromLocalStorage();
        model.loadCustomContainerState();
        this.renderNotes(model.notes);
        this.renderNotesCounter(model.notes.length);

        const form = document.querySelector('.note-form');
        const title = document.querySelector('.note_title');
        const titleLabel = document.querySelector('.name_wrapper label');
        const content = document.querySelector('.note_description');
        const contentLabel = document.querySelector('.description_wrapper label');
        const clearInputFields = () => {
            title.value = ''
            content.value = ''
            titleLabel.textContent = `Title of the note`
            contentLabel.textContent = `Description of the new note`
        }

        const toggleFavoriteButton = document.querySelector('#toggle-favorites');

        title.addEventListener('input', () => {
            const currentTitleLength = title.value.length;
            titleLabel.textContent = `Title of the note (${currentTitleLength} / ${MAX_TITLE_LENGTH})`;
            titleLabel.style.color = currentTitleLength > MAX_TITLE_LENGTH ? COLOR_MAP.errorRed : '';
        })

        content.addEventListener('input', () => {
            const currentContentLength = content.value.length;
            contentLabel.textContent = `Description of the new note (${currentContentLength} / ${MAX_CONTENT_LENGTH})`
            contentLabel.style.color = currentContentLength > MAX_CONTENT_LENGTH ? COLOR_MAP.errorRed : '';
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
        const customContainer = document.querySelector('#custom-container');
        let notesHTML = '';

        if (showNoFavoritesMessage) {
            notesHTML = `<li class="no-favorite-notes-screen-massage">You don't have any favorite notes!</li>`;
        } else if (notes.length === 0) {
            notesHTML = `<li class="no-notes-screen-massage">You don't have any notes yet<br>Fill in the fields above and create your first note!</li>`;
            customContainer.classList.remove('custom-container');
        } else {
            notes.forEach(note => {
                notesHTML +=
                    `<li id="${note.id}" class="${note.isFavorite ? 'favorite-note' : ''}">
                        <div class="note-wrapper">
                            <div class="note-header" style="background-color: ${COLOR_MAP[note.color]}">
                                <p class="note-title">${note.title}</p>
                                <div class="buttons-wrapper">
                                    <img class="favorite-button" src="${note.isFavorite ? IMAGE_PATHS.heartActive : IMAGE_PATHS.heartInactive}" alt="Favorite button" draggable="false">
                                    <img class="delete-button" src="${IMAGE_PATHS.deleteButton}" alt="Delete button" draggable="false">
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
            hiddenNotesMessage.textContent = `(Hidden: ${hiddenNotesCount})`
        } else {
            hiddenNotesMessage.textContent = ''
        }
    },

    renderNotesCounter(count) {
        document.querySelector('.note_counter b').textContent = count;
    },

    showMessage(message, isSuccess) {
        const messagesBox = document.querySelector('.messages-box');
        const messageId = `message-${new Date().getTime()}`;
        
        const messageItem = document.createElement('div');
        messageItem.className = `message-item no_select ${isSuccess ? 'success-message' : 'error-message'}`;
        messageItem.id = messageId;
        
        const img = document.createElement('img');
        img.src = isSuccess ? IMAGE_PATHS.successIcon : IMAGE_PATHS.warningIcon;
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
        }, MESSAGE_DISPLAY_DURATION);
    },

    openDeleteConfirmation(noteId, noteTitle) {
        const modalHtml = `
            <div class="modal" id="delete-confirmation">
                <div class="modal-content">
                    <div class="modal-header-wrapper">
                        <span class="modal-title">Deleting a note</span>
                        <img class="modal-cancel-button" src="${IMAGE_PATHS.cancelButton}" alt="Cancel" draggable="false">
                    </div>
                    <hr class="divider">
                    <div class="delete-confirmation-wrapper">
                        <span class="delete-message-text" id="delete-message"></span>
                        <button class="cancel-delete-button" id="cancel-delete"></button>
                        <button class="confirm-delete-button" id="confirm-delete">Delete</button>
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

        messageElement.innerHTML = `Are you sure you want to delete the note<br>“<b>${noteTitle}</b>”?`;

        let countdown = DELETE_CONFIRMATION_COUNTDOWN;
        cancelButton.textContent = `Cancel (${countdown})`;

        const interval = setInterval(() => {
            countdown--;
            cancelButton.textContent = `Cancel (${countdown})`;

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
    },
}

const controller = {
    addNote(title, content, color) {
        if (!title.trim() || !content.trim()) {
            view.showMessage(MESSAGES.emptyFields, false);
            return false;
        }
        if (title.length > MAX_TITLE_LENGTH) {
            view.showMessage(MESSAGES.titleLengthExceeded, false);
            return false;
        }
        if (content.length > MAX_CONTENT_LENGTH) {
            view.showMessage(MESSAGES.contentLengthExceeded, false);
            return false;
        }
        model.addNote(title, content, color);
        view.showMessage(MESSAGES.noteAdded, true);
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
    },
}

function init() {
    view.init();
}

init();