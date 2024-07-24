"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../controllers/userController");
const router = require("express").Router();
router.get('/', (req, res) => {
    res.send('Hello, world!');
});
router.route('/api')
    .get(userController_1.sendFirstUser)
    .post(userController_1.receiveUserData);
module.exports = router;
//# sourceMappingURL=homePage.routes.js.map