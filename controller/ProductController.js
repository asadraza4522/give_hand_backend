const Response = require("../utilities/response");
const Product = require("../models/product");
const fs = require("fs");
const { capitalizeSentence } = require("../utilities/Capitalize");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utilities/cloudinary");

const uniqueName = (name, id) =>
  new Promise((resolve, reject) => {
    name = capitalizeSentence(name);
    let checkID = null;

    if (id) {
      checkID = { _id: { $ne: id } };
    }

    Product.findOne({ name: name, ...checkID })
      .then((res) => {
        if (!res) {
          resolve("");
        } else {
          reject("Name is already taken");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

const createProduct = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let userType = null;
  let userId = null;

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      userType = user?.type;
      userId = user?.id;
    });
  } catch (error) {
    console.log(error, "error");
  }

  const response = new Response();

  try {
    req.body.categories = JSON.parse(req?.body?.categories);

    req.body.name = capitalizeSentence(req.body.name);
    req.body.user = userId;
    const product = new Product(req.body);

    if (req.file.path) product.image = req.file.path;

    uniqueName(req.body.name)
      .then(() => {
        product
          .save()
          .then((result) => {
            response.data = result;
            response.message = result.name + " added successfully";
            res.send(response);
          })
          .catch((err) => {
            response.data = err;
            response.message = "Error";
            response.error = true;
            res.send(response);
          });
      })
      .catch((err) => {
        response.error = true;
        response.message = err;
        res.status(422).send(response);
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const viewProducts = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const TokenData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const response = new Response();

  const { search = "", category = "", page, productType = "" } = req.query;
  console.log(
    "🚀 ~ file: ProductController.js:90 ~ viewProducts ~ productType:",
    productType
  );

  const fields = [];

  if (search !== "") {
    fields.push({
      $or: [
        { name: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    });
  }
  if (productType !== "") {
    fields.push({ productType: productType });
  }

  if (category !== "") {
    fields.push({ categories: category });
  }

  if (TokenData?.type === "seller") {
    fields.push({ user: TokenData?.id });
  }

  try {
    Product.paginate(fields.length > 0 ? { $and: fields } : {}, {
      page: req.query.page,
      limit: 10,
    })
      .then((result) => {
        response.data = result;
        response.message = "Success";
        res.status(200).json(response);
      })
      .catch((error) => {
        response.data = error;
        response.message = "Error";
        response.error = true;
        res.status(500).json(response);
      });
  } catch (error) {
    response.message = error.message;
    response.error = true;
    res.status(500).json(response);
  }
};

const singleProduct = (req, res) => {
  const response = new Response();

  try {
    Product.findById({ _id: req.params.id })
      .populate([{ path: "categories", select: ["name"] }])
      // .populate([{ path: 'categories', select: ['name'] }, { path: 'brand', select: ['name'] }])
      .then((result) => {
        response.data = result;
        response.message = "Success";
        res.send(response);
      })
      .catch((error) => {
        console.log(error);
        response.data = error;
        response.message = "Error";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const liveSearch = (req, res) => {
  const response = new Response();

  try {
    Product.find({
      $or: [
        { name: { $regex: req?.params?.search, $options: "i" } },
        { tags: { $regex: req?.params?.search, $options: "i" } },
      ],
    })
      .limit(20)
      .then((result) => {
        response.data = result;
        response.message = "Success";
        res.send(response);
      })
      .catch((error) => {
        response.data = error;
        response.message = "Error";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const delProduct = (req, res) => {
  const response = new Response();

  let productID = req.body.id;

  try {
    Product.findByIdAndDelete(productID)
      .then((result) => {
        response.data = result;
        response.message = "Success";
        res.send(response);
      })
      .catch((error) => {
        response.data = error;
        response.message = "Error";
        response.error = true;
        res.send(response);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const EditProduct = (req, res) => {
  const response = new Response();
  req.body.name = capitalizeSentence(req.body.name);
  req.body.categories = JSON.parse(req?.body?.categories);

  if (req.file) {
    req.body.image = req.file.path;
  }

  if (req.body.prevImage) {
    const pathImage = "./" + req.body.prevImage;

    fs.unlink(pathImage, function (err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
  }

  try {
    uniqueName(req.body.name, req.body._id)
      .then((result) => {
        Product.findByIdAndUpdate(
          { _id: req.body._id },
          req.body,
          (error, data) => {
            if (error) {
              response.message = "Maybe wrong id";
              response.error = true;
              res.status(422).send(response);
            } else {
              response.message = data.name + " updated to " + req.body.name;
              response.data = data;
              res.send(response);
            }
          }
        );
      })
      .catch((err) => {
        response.error = true;
        response.message = err;
        res.status(422).send(response);
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  createProduct,
  viewProducts,
  delProduct,
  EditProduct,
  singleProduct,
  liveSearch,
};
