const axios = require('axios');
const { Companies,Scores }  = require('../../database/models');


function csvJSON(csvStr){
    var lines=csvStr.split("\n");
    var result = [];
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    return result; 
  }


const parseCSV = async (url) => {
    const res = await axios.get(url);
    const data = res.data;
    const result = csvJSON(data);
    return result;
}

const saveData = async (data) => {
    const companiesWithPerformanceDetails = [];
    for(const company of data){
        const res = await axios.get('http://54.167.46.10/company/'+company.company_id)
        const companyDetails = res.data;
        await Companies.create({
            company_id: companyDetails.id,
            name: companyDetails.name,
            ceo: companyDetails.ceo,
        })
    }
    const sector = [];
    for(const company of data){
        sector.push(company.company_sector);
    }
    const uniqueSector = sector.filter((item, 
        index) => sector.indexOf(item) === index);
    
        for(const sector of uniqueSector){
            const res = await axios.get('http://54.167.46.10/sector', {
                params: {
                    name: sector
                }
            })
            console.log(res.data);
            companiesWithPerformanceDetails.push(...res.data);
        }
            for(const company of companiesWithPerformanceDetails) {
            const sumScore = company.performanceIndex[0].value*10 + company.performanceIndex[1].value/10000 + company.performanceIndex[2].value*10 + company.performanceIndex[3].value
            const score = parseInt(sumScore/4);
            await Scores.create({
                company_id: company.companyId,
                score: score,
            })    
        }
}



const createResponse = async () => {
    const companies = await Companies.findAll();
    const scores = await Scores.findAll();
    const response = [];
    for(const company of companies){
        const score = scores.find((item) => item.company_id === company.company_id);
        response.push({
            company_id: company.company_id,
            name: company.name,
            ceo: company.ceo,
            score: score.score
        })
    }
    return response;
}

const getCompaniesByRanking = async (sector) => {
    const res = await axios.get('http://54.167.46.10/sector', {
                params: {
                    name: sector
                }
            })
    const companies = res.data;
    const companiesDb = await Companies.findAll();
    const scores = await Scores.findAll();
    const responseTemp = [];
    for(const company of companies){
        const companyRes = companiesDb.find((item) => item.company_id === company.companyId);
        const scoresRes = scores.find((item) => item.company_id === company.companyId);
        responseTemp.push({
            id: companyRes.company_id,
            name: companyRes.name,
            ceo: companyRes.ceo,
            score: scoresRes.score,
        }) 
    }
    const response = responseTemp.sort((a,b) => b.score - a.score);
    for(const res of response){
        Object.assign(res, {ranking: response.indexOf(res)+1})
    }
    return response;
}


const updateCompanyDetails = async (name, body) => {
    const company = await Companies.findOne({
        where: {
            name: name
        }
    })
    const updatedCompany = await company.update(body);
    return updatedCompany;
}

module.exports = {
    parseCSV,saveData,createResponse,getCompaniesByRanking,updateCompanyDetails
}

