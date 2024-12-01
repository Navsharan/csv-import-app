import request from 'supertest';
import express from 'express';
import apiRoutes from '../api';
import { Person } from '../../models/Person';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

describe('API Routes', () => {
  beforeEach(async () => {
    await Person.destroy({ where: {} });
  });

  describe('POST /api/upload', () => {
    it('should upload a CSV file and return success message', async () => {
      const csvData = 
        'Name,Location,Affiliations,Weapon,Vehicle\n' +
        'John Doe,New York,Rebels,Sword,Car';
      
      const response = await request(app)
        .post('/api/upload')
        .attach('file', Buffer.from(csvData), 'test.csv')
        .expect(200);

      expect(response.body.message).toBe('Import successful');
    });
  });

  describe('GET /api/people', () => {
    it('should return paginated results', async () => {
      await Person.create({
        first_name: 'Test',
        last_name: 'User'
      });

      const response = await request(app)
        .get('/api/people')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.total).toBe(1);
    });
  });
});
