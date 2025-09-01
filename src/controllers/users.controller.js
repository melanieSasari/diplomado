import { User } from '../models/user.js';
import {Task} from '../models/task.js';
import logger from '../logs/logger.js';
import { Status } from '../constants/index.js';
import { encriptar } from '../common/bcrypt.js';
import { Op } from 'sequelize';

async function getUsers(req, res, next) {
  try {
    const users= await User.findAll({
      attributes: ['id', 'username', 'password', 'status'],
      order: [['id', 'DESC']],
      where: {
        status: Status.ACTIVE,
      },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
}   

async function createUser(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await User.create({
      username,
      password,
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username', 'password', 'status'],
      where: {
        id,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  const { id } = req.params;
  const { username, password } = req.body;
  try {
    if (!username && !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const passwordEncrypted = await encriptar(password);

    const user = await User.update({
      username,
      password: passwordEncrypted,
    }, {
      where: {
        id,
      },
    })

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  const { id } = req.params;
  try {
    await User.destroy({
      where: {
        id,
      },
    });
    res.status(204).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
}

async function activateInactivate(req, res, next) {
  const { id } = req.params;
  const { status } = req.body;
  try{
    if(!status){
      return res.status(400).json({ message: 'Status is required' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.status === status) {
      return res.status(409).json({ message: 'same status' });
    }

    user.status = status;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function getTasks(req, res, next) {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ['username'],
      include : [
        {
          model: Task,
          attributes: ['name', 'done'],
          where: {
            done: true,
          }
        }
      ],
      where: {
        id,
      },
    });
    
    res.json(user);
  } catch (error) {
    next(error);
  }
}


async function getUsersList(req, res, next) {
  try {
    const pageNum = parseInt(req.query.page) || 1;
    const limitNum = parseInt(req.query.limit) || 10;
    const search = req.query.search?.trim() || '';
    const orderBy = req.query.orderBy || 'id';
    const orderDir = req.query.orderDir?.toUpperCase() || 'DESC';
    const status = req.query.status || '';

    const page = pageNum > 0 ? pageNum : 1;
    const limit = [5, 10, 15, 20].includes(limitNum) ? limitNum : 10;

    const validFields = ['id', 'username', 'status'];
    const validDirections = ['ASC', 'DESC'];

    const sortField = validFields.includes(orderBy) ? orderBy : 'id';
    const sortDirection = validDirections.includes(orderDir) ? orderDir : 'DESC';

    const offset = (page - 1) * limit;

    const where = search
      ? {
          username: {
            [Op.iLike]: `%${search}%`
          }
        }
      : {};

    if (status) {
    console.log('stat', status)
    if (status !== Status.ACTIVE && status !== Status.INACTIVE)
      return res.status(400).json({
        message: `Invalid status, must be ${Status.ACTIVE} or ${Status.INACTIVE}`,
      });
    where.status = {
      [Op.iLike]: `${status}`,
    };
    where.status = status;
  }

    const { count: total, rows: data } = await User.findAndCountAll({
      attributes: ['id', 'username', 'status'],
      where,
      order: [[sortField, sortDirection]],
      limit,
      offset
    });

    const pages = Math.ceil(total / limit);

    res.json({
      total,
      page,
      pages,
      data
    });

  } catch (error) {
    next(error);
  }
}

export default {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  activateInactivate,
  getTasks,
  getUsersList
};