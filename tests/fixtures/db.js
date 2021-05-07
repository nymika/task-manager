const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const UserOneId = new mongoose.Types.ObjectId()
const UserOne = {
    _id: UserOneId,
    name: 'userOne',
    email: 'userOne@example.com',
    password: 'userOne12',
    tokens: [{
        token: jwt.sign({_id: UserOneId}, process.env.JWT_SECRET)
    }]
}

const UserTwoId = new mongoose.Types.ObjectId()
const UserTwo = {
    _id: UserTwoId,
    name: 'userTwo',
    email: 'userTwo@example.com',
    password: 'userTwo12',
    tokens: [{
        token: jwt.sign({_id: UserTwoId}, process.env.JWT_SECRET)
    }]
}

const TaskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'first task',
    completed: false,
    owner: UserOneId
}

const TaskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'second task',
    completed: true,
    owner: UserOneId
}

const TaskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'third task',
    completed: false,
    owner: UserTwoId
}

const setUpDatabase = async () => {
    await User.deleteMany()
    await new User(UserOne).save()
    await new User(UserTwo).save()

    await Task.deleteMany()
    await new Task(TaskOne).save()
    await new Task(TaskTwo).save()
    await new Task(TaskThree).save()
}

module.exports = {
    UserOne,
    UserOneId,
    UserTwo,
    UserTwoId,
    TaskOne,
    TaskTwo,
    TaskThree,
    setUpDatabase
}