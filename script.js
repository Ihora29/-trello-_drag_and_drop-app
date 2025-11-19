const columns = document.querySelectorAll('.tasks');
const addButtons = document.querySelectorAll('.add-btn');
let draggedTask = null;


loadBoard();


document.querySelectorAll('.task').forEach(addDeleteButton);


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

    column.addEventListener('drop', () => {
        column.parentElement.classList.remove('drag-over');
        if (draggedTask) {
            column.appendChild(draggedTask);
            saveBoard();
        }
    });
});


addButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const taskText = prompt('Enter new task:');
        if (taskText) {
            const newTask = createTask(taskText);
            btn.previousElementSibling.appendChild(newTask);
            saveBoard();
        }
    });
});


function createTask(text) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.textContent = text;
    task.setAttribute('draggable', 'true');
    addDeleteButton(task);
    return task;
}


function addDeleteButton(task) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add('delete-btn');
    task.appendChild(deleteBtn);

    deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        task.remove();
        saveBoard();
    });
}

function saveBoard() {
    const boardData = {};

    columns.forEach(column => {
        const columnId = column.parentElement.id;
        const tasks = Array.from(column.querySelectorAll('.task')).map(task => task.firstChild.textContent.trim());
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
        column.innerHTML = '';
        boardData[columnId].forEach(taskText => {
            const task = createTask(taskText);
            column.appendChild(task);
        });
    });
}
