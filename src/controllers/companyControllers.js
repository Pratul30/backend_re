const services = require('../services/companyServices');

const saveDataAndScore = async (req, res) =>{
    const url = req.body.urlLink;
    const parseCSV = await services.parseCSV(url);
    await services.saveData(parseCSV);
    const createdResponse = await services.createResponse();
    res.status(200).json(createdResponse);
}

const getCompanies = async (req, res) => {
    const {sector} = req.query;
    const companies = await services.getCompaniesByRanking(sector);
    res.status(200).json(companies);
}

const updateCompanyDetails = async (req, res) => {
    const {name} = req.query;
    const {body} = req;
    const updatedCompany = await services.updateCompanyDetails(name, body);
    res.status(200).json(updatedCompany);
}

module.exports = {
    saveDataAndScore, getCompanies, updateCompanyDetails
}