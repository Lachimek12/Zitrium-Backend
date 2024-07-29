import { Request, Response } from 'express';
import { sendFirstUser, receiveUserData } from '../controllers/homeController';

const router = require("express").Router();


router.get('/', (req: Request, res: Response) => {
    res.send('Hello, world!');
});
  
router.route('/api')
    .get(sendFirstUser)
    .post(receiveUserData);

module.exports = router;