import * as express from 'express';
import {db} from '../server';

export const customersRouter = express.Router();

//* CREATE *//

customersRouter.post("/customers", (req, res) => {
    const customer = req.body;
    const updCustomerAddress = JSON.stringify(req.body.customerAddress);
    customer.customerAddress = updCustomerAddress;
    const q = 'INSERT into customers SET ?';

    db.query(q, [customer], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({ data });
        }
    });
});

//* GET ALL *//

customersRouter.get("/customers", (_req, res) => {
    const q = 'SELECT * FROM customers';

    db.query(q, (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({ data });
        }
    });
});

//* GET BY ID *//

customersRouter.get("/customers/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    const q = 'SELECT * FROM customers WHERE customerID = ?';

    db.query(q, [customerID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({ data });
        }
    });
});

//* UPDATE *//

customersRouter.put("/customers/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    const customer = req.body;
    const stringCustomerAddress = JSON.stringify(customer.customerAddress);
    customer.customerAddress = stringCustomerAddress;
    const q = 'UPDATE customers SET ? WHERE customerID = ?';

    db.query(q, [customer, customerID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({ data });
        }
    });
});

//* DELETE *//

customersRouter.delete("/customers/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    const q = 'DELETE FROM customers WHERE customerID = ?';

    db.query(q, [customerID], (err, data) => {
        if (err) {
            console.error(err);
        } else {
            return res.json({ data });
        }
    });
});
