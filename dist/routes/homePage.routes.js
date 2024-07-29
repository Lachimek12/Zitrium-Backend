"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const homeController_1 = require("../controllers/homeController");
const router = require("express").Router();
router.get('/', (req, res) => {
    res.send('Hello, world!');
});
router.route('/api')
    .get(homeController_1.sendFirstUser)
    .post(homeController_1.receiveUserData);
module.exports = router;
//# sourceMappingURL=homePage.routes.js.map