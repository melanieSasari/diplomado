import { Task } from '../models/task.js';

async function getTasks(req, res, next) {
  //const { userId } = req.user;
  const  userId = req.user.id;
  try {
    const tasks = await Task.findAll({
      attributes: ['id', 'name','done'],
      order: [['name', 'ASC']],
      where: {
        userId,
      },
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

async function createTask(req, res, next) {
  //const { userId } = req.user;
  const  userId = req.user.id;
  const { name } = req.body;
    try {
        const task = await Task.create({
        name,
        userId,
        });
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function getTask(req, res, next) {
  const { id } = req.params;
  //const { userId } = req.user;
  const  userId = req.user.id;
  try {
    const task = await Task.findOne({
        attributes: ['name', 'done'],
        where: {
            id,
            userId,
        },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  const { id } = req.params;
  //const { userId } = req.user;
  const  userId = req.user.id;
  const { name } = req.body;
    try {
        const task = await Task.update(
        { name },
        {
        where: {
            id,
            userId: userId,
        },
        });
        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        next(error);
    }

}

async function taskDone(req, res, next) {
  const { id } = req.params;  
  //const { userId } = req.user;
  const  userId = req.user.id;
  const { done } = req.body;
    try {
        const task = await Task.update(
        { done },
        {
        where: {
            id,
            userId: userId,
        },
        });
        if (!task) {
        return res.status(404).json({ message: 'Task not found' });
        }
        
        res.json(task);
    } catch (error) {
        next(error);
    }
}

async function deleteTask(req, res, next) {
  const { id } = req.params;
  //const { userId } = req.user;
  const  userId = req.user.id;
  try {
    const task = await Task.destroy({
      where: {
        id,
        userId: userId,
      },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }


}

export default{
    getTasks,
    createTask,
    getTask,
    updateTask,
    taskDone,
    deleteTask
};