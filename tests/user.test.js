const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { UserOne, UserOneId, setUpDatabase } = require('./fixtures/db')

beforeEach(setUpDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'hello1',
        email: 'hello1@gmail.com',
        password: 'hello1234567!'
    }).expect(201)

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.myUser._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    expect(response.body).toMatchObject({
        myUser: {
            name: 'hello1',
            email: 'hello1@gmail.com',
        },
        token: user.tokens[0].token
    })

    //password should not be plain text
    expect(user.password).not.toBe('hello1234567!')
    
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: 'userOne@example.com',
        password: 'userOne12'
    }).expect(200)

    //console.log(response.body)

    const user = await User.findById(UserOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login non-existent user', async () => {
    await request(app).post('/users/login').send({
        email: 'userZero@example.com',
        password: 'userZero12'
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
            .get('/users/me')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .send()
            .expect(200)
})

test('should not get profile for unauthenticated user', async() => {
    await request(app)
            .get('/users/me')
            .send()
            .expect(401)
})

test('should delete account for user', async() => {
    const response = await request(app)
            .delete('/users/me')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .send()
            .expect(200)

    const user = await User.findById(UserOneId)
    expect(user).toBeNull()        
})

test('should not delete account for unauthenticated user', async() => {
    await request(app)
            .delete('/users/me')
            .send()
            .expect(401)
})

test('should upload avatar image', async () => {
    await request(app).post('/users/me/avatar')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .attach('avatar', 'tests/fixtures/profile-pic.jpg')
            .expect(200)
    const user = await User.findById(UserOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .send({
                name: 'UserOneUpdatedName'
            })
            .expect(200)

    const user = await User.findById(UserOneId)
    expect(user.name).toBe('UserOneUpdatedName') 
})

test('should not update invalid user fields', async () => {
    await request(app)
            .patch('/users/me')
            .set('Authorization', `Bearer ${UserOne.tokens[0].token}`)
            .send({
                location: 'hyd'
            })
            .expect(400)
})