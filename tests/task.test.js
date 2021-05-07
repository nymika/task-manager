const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const { UserOne, UserOneId, 
        UserTwo, 
        TaskOne, 
        setUpDatabase 
    } = require('./fixtures/db')

beforeEach(setUpDatabase)

test('should create task for user', async () => {
    const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .send({
                description: 'from my test'
            })
            .expect(201)
    
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('get user 1 tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    expect(response.body.length).toEqual(2)
})

test('should not delete other users task', async () => {
    const response = await request(app)
        .delete(`/tasks/${TaskOne._id}`)
        .set('Authorization', `Bearer ${UserTwo.tokens[0].token}`)
        .send()
        .expect(400)
    
    const task = await Task.findById(TaskOne._id)
    expect(task).not.toBeNull() //task is not deleted. so should exist in DB

})