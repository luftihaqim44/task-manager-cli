// From requirement - use fs, path, promise
const fs = require('fs').promises;
const path = require('path');

// Set file name
const tasksFile = path.join(__dirname, 'tasks.json');

// Separate commands into readable form
// Sample: add "Buy groceries" --priority high
let action = process.argv[2]; // add, list, done, delete
let detail = process.argv[3]; // title or ID or Flag
let level = process.argv[5]; // priority

// Step 1. Create file
async function start() {
    // Kalau exist, use. Else, create baru
    try {
        await fs.access(tasksFile);
    } catch (error) {
        await fs.writeFile(tasksFile, '[]');
    }

    // Read file
    const fileContent = await fs.readFile(tasksFile, 'utf-8');

    // Tukar file dalam JSON format
    const tasks = JSON.parse(fileContent);

    // Add Task
    if (action === 'add') {
        const newTask = {
            id: tasks.length + 1,
            title: detail,
            completed: false,
            priority: level,
            createdAt: new Date().toLocaleString()
        };
        tasks.push(newTask);
        await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
        console.log('Task added');
    }

    // List task
    else if (action === 'list') {
        let list = tasks;

        // Compare setiap filter, if true, masukkan dalam list. Else, print semua
        if (detail == '--completed') {
            // Sample: list --completed
            list = tasks.filter(item => item.completed === true);
        } else if (detail == '--pending') {
            // Sample: list --pending
            list = tasks.filter(item => item.completed === false);
        } else if (detail == '--priority') {
            // Sample: list --priority high
            let levelChose = process.argv[4];
            list = tasks.filter(item => item.priority === levelChose);
        }

        // Print list yang dah difilter atau semua
        console.log("Task List:");
        list.forEach(function(task) {
            console.log(task.id + ': ' + task.title + ' [' + task.priority + ']' + ' - ' + task.completed);
        });
    }

    // Complete Task
    else if (action === 'done') {
        const id = Number(detail);

        // 1. Loop setiap task
        // 2. Compare task.id in file vs task id entered by user
        // 3. If true, set = true
        tasks.forEach(function(task) {
            if (task.id === id) {
                task.completed = true;
            }
        });
        await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
        console.log('Task finished');
    }

    // Delete Task
    else if (action === 'delete') {
        const id = Number(detail);
        const newList = tasks.filter(function (task) {
            return task.id !== id;
        });
        await fs.writeFile(tasksFile, JSON.stringify(newList, null, 2));
        console.log('Task delete');
    }
}

// Starting point
start();