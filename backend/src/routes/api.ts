import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Person } from '../models/Person';
import { Location } from '../models/Location';
import { Affiliation } from '../models/Affiliation';
import { importCsv } from '../services/csvImporter';
import { Op } from 'sequelize';
import { Order } from 'sequelize';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload CSV route
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    await importCsv(req.file.buffer);
    res.json({ message: 'Import successful' });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Import failed' });
  }
});

// Get people with pagination, search, and sorting
router.get('/people', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const search = req.query.search as string;
    const sortField = req.query.sortField as string || 'first_name';
    const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

    const whereClause = search
      ? {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { count, rows } = await Person.findAndCountAll({
      where: whereClause,
      include: [
        { 
          model: Location,
          through: { attributes: [] },
          attributes: ['name']
        },
        { 
          model: Affiliation,
          through: { attributes: [] },
          attributes: ['name']
        },
      ],
      order: [[sortField, sortOrder]],
      limit,
      offset,
      distinct: true,
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Query failed' });
  }
});

// get all people
router.get('/people/all', async (req, res) => {
  try {
    const sortField = req.query.sortField as string || 'first_name';
    const sortOrder = req.query.sortOrder as 'ASC' | 'DESC' || 'ASC';

    let orderClause;
    if (sortField === 'locations') {
      orderClause = [[{ model: Location, as: 'locations' }, 'name', sortOrder]];
    } else if (sortField === 'affiliations') {
      orderClause = [[{ model: Affiliation, as: 'affiliations' }, 'name', sortOrder]];
    } else {
      orderClause = [[sortField, sortOrder]];
    }

    const rows = await Person.findAll({
      include: [
        { 
          model: Location,
          through: { attributes: [] },
          attributes: ['name']
        },
        { 
          model: Affiliation,
          through: { attributes: [] },
          attributes: ['name']
        },
      ],
      order: orderClause as Order,
    });

    // Sort in memory for array fields to handle multiple values
    if (sortField === 'locations' || sortField === 'affiliations') {
      rows.sort((a, b) => {
        const aNames = a[sortField].map(item => item.name).join(', ');
        const bNames = b[sortField].map(item => item.name).join(', ');
        return sortOrder === 'ASC' 
          ? aNames.localeCompare(bNames)
          : bNames.localeCompare(aNames);
      });
    }

    res.json({
      total: rows.length,
      pages: Math.ceil(rows.length / 10),
      currentPage: 1,
      data: rows,
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Query failed' });
  }
});

export default router;
