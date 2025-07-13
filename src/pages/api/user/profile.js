import { getUserProfile } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

    const { email } = req.query;
    req.params = { email };
    await protectRoute(req, res, () => getUserProfile(req, res));
export default async function handler(req, res) {
  if (req.method === 'GET') {
    // /api/user/profile?email=EMAIL
    const { email } = req.query;
    req.params = { email };
    await protectRoute(req, res, () => getUserProfile(req, res));
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
