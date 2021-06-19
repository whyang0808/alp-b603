import { Router } from 'express'

const router = Router()

router.route('/').get((req, res) => {
  const file = `${__dirname}/../apidocs.yaml`;
  res.download(file);
})

export default router
