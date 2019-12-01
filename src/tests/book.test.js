const request = require('supertest');

describe('book api', () => {
    let app = null;
    let userId = null;
    let bookId = null;

    beforeAll(async () => {
        app = await (require('../app'));
        const res = await request(app)
            .post('/users').send({name: 'Alex Koshelkov'});
        userId = res.body.payload.id;
    });

    it('should create book', async () => {
        const res = await request(app)
            .post('/books').send({name: 'Martian'});
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('payload');
        bookId = res.body.payload.id;
    });

    it('should list all books', async () => {
        const res = await request(app)
            .get('/books');
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('payload');
    });

    it('should list one book', async () => {
        const res = await request(app)
            .get(`/books/${bookId}`);
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('payload');
    });

    it('should borrow book', async () => {
        const res = await request(app)
            .post(`/users/${userId}/borrow/${bookId}`);
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    it('should return book', async () => {
        const res = await request(app)
            .post(`/users/${userId}/return/${bookId}`).send({score: 3});
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
    });

    it('should return book and give wrong (min) score', async () => {
        const res = await request(app)
            .post(`/users/${userId}/return/${bookId}`).send({score: -1});
        expect(res.status).toEqual(500);
        expect(res.body.success).toBe(false);
    });

    it('should return book and give wrong (max) score', async () => {
        const res = await request(app)
            .post(`/users/${userId}/return/${bookId}`).send({score: 11});
        expect(res.status).toEqual(500);
        expect(res.body.success).toBe(false);
    });

    afterAll(() => setTimeout(() => process.exit(), 1000));
});
