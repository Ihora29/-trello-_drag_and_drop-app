
const columns = document.querySelectorAll('.tasks');
const addButtons = document.querySelectorAll('.add-btn');
let draggedTask = null;

loadBoard();

document.querySelectorAll('.task').forEach(task => {
    addDeleteButton(task);
    attachDragToTask(task);
});

// --- Drag & drop ---
document.addEventListener('dragstart', e => {
    if (e.target.classList.contains('task')) {
        draggedTask = e.target;
        e.target.classList.add('dragging');
    }
});

document.addEventListener('dragend', e => {
    if (e.target.classList.contains('task')) {
        e.target.classList.remove('dragging');
        draggedTask = null;
        saveBoard();
    }
});

columns.forEach(column => {
    column.addEventListener('dragover', e => {
        e.preventDefault();
        column.parentElement.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
        column.parentElement.classList.remove('drag-over');
    });

    column.addEventListener('drop', e => {
        column.parentElement.classList.remove('drag-over');
        if (draggedTask) {
            column.appendChild(draggedTask);
            saveBoard();
        }
    });
});

addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        while (true) {
            const taskText = prompt('Enter new task (max 30 characters)');
            if (taskText === null) {
                return;
            }

            const trimmed = taskText.trim();

            if (trimmed.length === 0) {
                alert('Завдання не може бути лише з пробілів. Спробуйте ще раз або натисніть Cancel.');
                continue;
            }

            if (trimmed.length > 30) {
                alert(`Забагато довго — максимум 30 символів. Наразі: ${trimmed.length}`);
                continue;
            }

            const newTask = createTask(trimmed);
            if (newTask) {
                const tasksContainer = btn.previousElementSibling;
                tasksContainer.appendChild(newTask);
                saveBoard();
            }
            break;
        }
    });
});


function createTask(text) {
    if (!text || text.trim() === '') return null;

    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');

    const span = document.createElement('span');
    span.classList.add('task-text');
    span.textContent = text;
    task.appendChild(span);

    addDeleteButton(task);
    attachDragToTask(task);

    return task;
}

function addDeleteButton(task) {

    if (task.querySelector('.delete-btn')) return;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn');
    task.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();

        const parent = task.parentElement;
        if (parent) {
            task.remove();
            saveBoard();
        }
    });
}

function attachDragToTask(task) {

    task.setAttribute('draggable', 'true');

    task.addEventListener('mousedown', () => {
        task.style.userSelect = 'none';
    });
    task.addEventListener('mouseup', () => {
        task.style.userSelect = '';
    });
}

function saveBoard() {
    const boardData = {};

    columns.forEach(column => {
        const columnId = column.parentElement.id;
        const tasks = Array.from(column.querySelectorAll('.task')).map(task => {
            const t = task.querySelector('.task-text');
            return t ? t.textContent.trim() : '';
        }).filter(Boolean);
        boardData[columnId] = tasks;
    });

    localStorage.setItem('trelloBoard', JSON.stringify(boardData));
}

function loadBoard() {
    const saved = localStorage.getItem('trelloBoard');
    if (!saved) return;

    const boardData = JSON.parse(saved);

    Object.keys(boardData).forEach(columnId => {
        const column = document.querySelector(`#${columnId} .tasks`);
        if (!column) return;
        column.innerHTML = '';
        boardData[columnId].forEach(taskText => {
            const task = createTask(taskText);
            if (task) column.appendChild(task);
        });
    });
}
