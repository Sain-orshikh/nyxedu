import { fetchUserSubjects } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    await protectRoute(req, res, () => fetchUserSubjects(req, res));
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
