import { logout } from '../controllers/auth.controller';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await logout(req, res);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
