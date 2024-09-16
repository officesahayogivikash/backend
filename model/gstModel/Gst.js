const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    bnm: { type: String, default: "" },
    st: { type: String, default: "" },
    loc: { type: String, default: "" },
    bno: { type: String, default: "" },
    dst: { type: String, default: "" },
    lt: { type: String, default: "" },
    locality: { type: String, default: "" },
    pncd: { type: String, default: "" },
    landMark: { type: String, default: "" },
    stcd: { type: String, default: "" },
    geocodelvl: { type: String, default: "" },
    flno: { type: String, default: "" },
    lg: { type: String, default: "" }
});

const AdAdrSchema = new mongoose.Schema({
    addr: AddressSchema,
    ntr: { type: String, default: "" }
});

const PrAdrSchema = new mongoose.Schema({
    addr: AddressSchema,
    ntr: { type: String, default: "" }
});

const YourSchema = new mongoose.Schema({
    stjCd: { type: String, default: "" },
    lgnm: { type: String, default: "" },
    stj: { type: String, default: "" },
    dty: { type: String, default: "" },
    adadr: [AdAdrSchema],
    cxdt: { type: String, default: "" },
    gstin: { type: String, default: "" },
    nba: { type: [String], default: [] },
    lstupdt: { type: String, default: "" },
    rgdt: { type: String, default: "" },
    ctb: { type: String, default: "" },
    pradr: PrAdrSchema,
    tradeNam: { type: String, default: "" },
    ctjCd: { type: String, default: "" },
    sts: { type: String, default: "" },
    ctj: { type: String, default: "" },
    einvoiceStatus: { type: String, default: "" }
});


const YourModel = mongoose.model('GSTUser', YourSchema);
module.exports = YourModel;
 
