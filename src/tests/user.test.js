const request = require('supertest');
describe('user api', () => {
    let app = null;
    let userId = null;

    beforeAll(async () => {
        app = await (require('../app'));
    });

    it('should return users', async () => {
        const res = await request(app)
            .get('/users');
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('payload');
    });

    it('should create user', async () => {
        const res = await request(app)
            .post('/users').send({name: "Thomas Shelby"});
        expect(res.status).toEqual(200);
        expect(res.body.success).toBe(true);
        expect(res.body).toHaveProperty('payload');
        userId = res.body.payload.id;
    });

    it('should list one user', async () => {
        const res = await request(app)
            .get(`/users/${userId}`);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('payload');
        expect(res.body.success).toBe(true);
    });
});