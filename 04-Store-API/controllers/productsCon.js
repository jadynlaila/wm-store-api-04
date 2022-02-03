const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  const { featured, company, name, filters, sort, fields} = req.query;
  let queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true";
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }
  if (filters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<=": "$lte",
      "<": "$lt",
    };

    const re = /\b(<|>|>=|<=)\b/g;

    //filters = price>=30,rating>3
    let newFilters = filters.replace(re, (match) => `-${operatorMap[match]}-`);

    //filters = price-$gte-30,rating-$gt-3
    const options = ["price", "rating"];
    newFilters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      //field = price
      //operator = $gte
      //value = 30
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
      // {price: { $gte: 30}}
    });
  }
  let results = Product.find(queryObject);

  if (sort) {
    const sortList = sort.split(",").join(" ");
    results = results.sort(sortList);
  } else {
    results = results.sort("createdAt");
  }

  if(fields){
      const fieldsList = fields.split(',').join(' ');
      results = results.select(fieldsList)
  }

  

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  results = results.skip(skip).limit(limit);

  const products = await results;
  res.json({ status: 200, msg: "success", results: products, nbHits: products.length});
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({}).select("name price");
  // .select('name price')
  //this will only show those w matching name and price properties
  // .select('-name -price')
  // will only show those that don't match
  res.json({ status: 200, msg: "static", results: products });
};

module.exports = { getAllProducts, getAllProductsStatic };
