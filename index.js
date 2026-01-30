const taskService = require('./src/taskService');

const action = process.argv[2];
const detail = process.argv[3];
const level = process.argv[4];      // Used for: list --priority high
const addPriority = process.argv[5]; // Used for: add "Title" --priority high

async function start() {
    if (action === 'add') {
        await taskService.add(detail, addPriority);
    }
    else if (action === 'list') {
        await taskService.list(detail, level);
    }
    else if (action === 'done') {
        await taskService.done(detail);
    }
    else if (action === 'delete') {
        await taskService.delete(detail);
    }
}

start();