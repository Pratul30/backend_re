const express = require('express');
const router = express.Router();

const {
    saveDataAndScore,
    getCompanies,
    updateCompanyDetails
} = require('../controllers/companyControllers');

router.route('/save').get(saveDataAndScore);
router.route('/companies').get(getCompanies).patch(updateCompanyDetails)

module.exports = router;