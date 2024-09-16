require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());
const cors = require("cors");
require("../server/db/conn");
const PORT = process.env.PORT || 5004;
const userRoutes = require('../server/routes/userRoutes/userRoutes');

const contactUs = require('./routes/userRoutes/contactRoutes');
const ecom = require('./routes/eCommerceRoutes/ecomUserRoutes');
const gst  = require('./routes/gstRoutes/gstRoutes');
const org = require('./routes/masterRoutes/orgRoutes')
const crm = require('./routes/crmRoutes/crmUserRoutes');
const payroll =require('./routes/payrollRoutes/payrollRoutes');
const osInternalRoutes = require("./routes/internalRoutes/osInternalRoutes");

app.use(cors());
app.use(express.json());



app.use('/api/users', userRoutes);
app.use('/api/contact',contactUs);
app.use('/api/ecom',ecom);
app.use('/api/gst',gst);
app.use('/api/org',org)
app.use("/api/OS", osInternalRoutes);

app.listen(PORT, () => {
    console.log(`Server started at port no ${PORT}`);
});
