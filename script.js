document.addEventListener('DOMContentLoaded', function() {
      const taskInput = document.getElementById('taskInput');
      const categorySelect = document.getElementById('categorySelect');
      const addTaskButton = document.getElementById('addTaskButton');
      const taskList = document.getElementById('taskList');
      const searchTasks = document.getElementById('searchTasks');
      const filterCategory = document.getElementById('filterCategory');
      const sortBy = document.getElementById('sortBy');
      const dueDateInput = document.getElementById('dueDate');

      let tasks = [];

      function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = [...tasks];

        // Filtering
        if (searchTasks.value) {
          filteredTasks = filteredTasks.filter(task =>
            task.name.toLowerCase().includes(searchTasks.value.toLowerCase())
          );
        }

        if (filterCategory.value !== 'All') {
          filteredTasks = filteredTasks.filter(task =>
            task.category === filterCategory.value
          );
        }

        // Sorting
        if (sortBy.value === 'Date') {
          filteredTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        } else if (sortBy.value === 'Category') {
          filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
        }

        filteredTasks.forEach((task, index) => {
          const li = document.createElement('li');
          let tagClass = task.category.toLowerCase(); // Category for tag class

          li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}">
              ${task.name}
              <span class="tag ${tagClass}">${task.category}</span> - Due: ${task.dueDate}
            </span>
            <div>
              <button class="complete-button" data-index="${index}">${task.completed ? 'Undo' : 'Complete'}</button>
              <button class="edit-button" data-index="${index}">Edit</button>
              <button class="delete-button" data-index="${index}">Delete</button>
            </div>
          `;
          taskList.appendChild(li);
        });

        // Add event listeners to the buttons
        document.querySelectorAll('.complete-button').forEach(button => {
          button.addEventListener('click', completeTask);
        });
        document.querySelectorAll('.edit-button').forEach(button => {
          button.addEventListener('click', editTask);
        });
        document.querySelectorAll('.delete-button').forEach(button => {
          button.addEventListener('click', deleteTask);
        });
      }

      function addTask() {
        const taskName = taskInput.value.trim();
        if (taskName === '') return;

        const taskCategory = categorySelect.value;
        const dueDate = dueDateInput.value || 'No Due Date';

        tasks.push({
          name: taskName,
          category: taskCategory,
          completed: false,
          dueDate: dueDate
        });

        taskInput.value = '';
        dueDateInput.value = '';
        renderTasks();
      }

      function completeTask(event) {
        const index = event.target.dataset.index;
        tasks[index].completed = !tasks[index].completed;
        renderTasks();
      }

      function editTask(event) {
        const index = event.target.dataset.index;
        const task = tasks[index];
        const newName = prompt('Enter new name for the task', task.name);
        if (newName) {
          task.name = newName;
          renderTasks();
        }
      }

      function deleteTask(event) {
        const index = event.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
      }

      addTaskButton.addEventListener('click', addTask);
      searchTasks.addEventListener('input', renderTasks);
      filterCategory.addEventListener('change', renderTasks);
      sortBy.addEventListener('change', renderTasks);

      renderTasks();
    });
