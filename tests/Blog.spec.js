const request = require('supertest')
const { connect } = require('./database')
const app = require('../index');
const moment = require('moment');
const { BlogModel, UserModel } = require('../models');


describe('Blog Route', () => {
    let conn;
    let token;
    let user;

    beforeAll(async () => {
        conn = await connect()

        user = await UserModel.create({ username: 'boma', password: '123456', email: 'boma@talent.com'});

        const loginResponse = await request(app)
        .post('/login')
        .set('content-type', 'application/json')
        .send({ 
            username: 'tobi', 
            password: '123456'
        });

        token = loginResponse.body.token;
    })

    afterEach(async () => {
        await conn.cleanup()
    })

    afterAll(async () => {
        await conn.disconnect()
    })

    it('should return blogs', async () => {
        // create blog in our db
        await BlogModel.create({ 
            title: 'Building a nodejs app',
            created_at: moment().toDate(),
            description: 'An express app',
            body: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
            tags: ['dev', 'javascript', 'node'],
            author: user,
        })

        await BlogModel.create({ 
            title: 'Building a frontend app',
            created_at: moment().toDate(),
            description: 'A react app',
            body: 'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
            tags: ['dev', 'javascript', 'react'],
            author: user,
        })

        const response = await request(app)
        .get('/blogs')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blogs')
        expect(response.body).toHaveProperty('status', true)
    })

    it('should return blogs with dev tag', async () => {
        // create order in our db
        await BlogModel.create({ 
            title: 'Building a nodejs app',
            created_at: moment().toDate(),
            description: 'An express app',
            body: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
            tags: ['dev', 'javascript', 'node'],
            author: user,
        })

        await BlogModel.create({ 
            title: 'Building a frontend app',
            created_at: moment().toDate(),
            description: 'A react app',
            body: 'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
            tags: ['dev', 'javascript', 'react'],
            author: user,
        })

        const response = await request(app)
        .get('/blogs?tags=dev')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('blogs')
        expect(response.body).toHaveProperty('status', true)
        expect(response.body.blogs.every(blog => blog.tags.includes('dev'))).toBe(true)
    })
});