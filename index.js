const express = require("express");
const app = express();
const mongoose = require("mongoose");
const AuthRoutes = require("./routes/Auth");
const ProductRoutes = require("./routes/Product");
const CaterogoriesRoutes = require("./routes/Categories");
const BrandsRoutes = require("./routes/Brands");
const CartRoutes = require("./routes/Cart");
const OrderRoutes = require("./routes/Order");
const AdminRoutes = require("./routes/Admin");
const PaymentRoutes = require("./routes/Payment");
const LikeProductRoutes = require("./routes/LikeProduct");
const ProductCommentsRoutes = require("./routes/productComments");
const ChatRoomRoutes = require("./routes/ChatRoom");
const MessageRoutes = require("./routes/Message");
// var multer = require('multer');
// var upload = multer();

// const dbURI =
//   "mongodb+srv://ahmad71666:Creative5.1@cluster0.r88m8.mongodb.net/ecommerceApp?retryWrites=true&w=majority";
// const dbURI = 'mongodb+srv://ahmad71666:Creative5.1@cluster0.r88m8.mongodb.net/node-tuts?retryWrites=true&w=majority'
const dbURI =
  "mongodb+srv://raza0120:G68JOKJzWSnkcT5B@cluster0.i57jenj.mongodb.net/?retryWrites=true&w=majority";

const port = process.env.PORT || 4000;

mongoose
  .connect(dbURI)
  .then((res) => {
    app.listen(port, () => {
      console.log("server is listening" + port);
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
// app.use(upload.array());

app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/extraData", express.static("extraData"));

app.use(AuthRoutes);

app.use(ProductRoutes);

app.use(CaterogoriesRoutes);

app.use(BrandsRoutes);

app.use(CartRoutes);

app.use(OrderRoutes);

app.use(AdminRoutes);

app.use(PaymentRoutes);

app.use(LikeProductRoutes);

app.use(ProductCommentsRoutes);

app.use(ChatRoomRoutes);

app.use(MessageRoutes);
