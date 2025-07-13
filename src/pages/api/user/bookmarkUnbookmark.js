import { bookmarkUnbookmark } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

export default async function bookmarkUnbookmarkHandler(req, res) {
  return protectRoute(req, res, () => bookmarkUnbookmark(req, res));
}
