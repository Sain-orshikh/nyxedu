import { addSubjects } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectRoute';

export default async function addSubjectsHandler(req, res) {
  return protectRoute(req, res, () => addSubjects(req, res));
}
