const request = require('supertest');
const app = require('../index');

describe('Football Scores API', () => {
  it('should return all scores', async () => {
    const res = await request(app).get('/scores');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ homeTeam: 'Team A' })
    ]));
  });

  it('should create a new score', async () => {
    const res = await request(app).post('/scores').send({
      homeTeam: 'Team X', awayTeam: 'Team Y', score: '3-0'
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
  });

  it('should update a score', async () => {
    const res = await request(app)
      .put('/scores/1')
      .send({ homeTeam: 'Team A', awayTeam: 'Team B', score: '3-3' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.score).toBe('3-3');
  });

  it('should delete a score', async () => {
    const res = await request(app).delete('/scores/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ status: 'UP' });
  });
});
