import { removeSubjects } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

export default async function removeSubjectsHandler(req, res) {
  return protectRoute(req, res, () => removeSubjects(req, res));
}
