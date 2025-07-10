import { getUserProfile, updateUser } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // /api/user/profile?username=USERNAME
    const { username } = req.query;
    req.params = { username };
    await protectRoute(req, res, () => getUserProfile(req, res));
  } else if (req.method === 'PUT') {
    await protectRoute(req, res, () => updateUser(req, res));
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
