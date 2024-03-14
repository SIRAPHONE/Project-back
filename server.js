require("dotenv").config();

const express = require("express");
const Sequelize = require("sequelize");
const app = express();
app.use(express.json());

const sequelize = new Sequelize('database' ,'root' ,'' , {
    host: 'http://localhost:3000',
    dialect: 'sqlite',
    storage: './Database/database.sqlite'
});

const Product = sequelize.define('Product',{
    ProductID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ProductName: {
        type: Sequelize.STRING,
        allowNull:false
    },
    Description: {
        type:Sequelize.STRING,
        allowNull:false
    },
    Price: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
    StockQuantity: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
});

const Order = sequelize.define('Order',{
    OrderID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CustomerID: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    ProductID: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    StockQuantity: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    TotalAmount: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    PriceAmount: {
        type: Sequelize.INTEGER,
        allowNull:false
    },     
});

const Customer = sequelize.define('Customer',{
    CustomerID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    CustomerName: {
        type: Sequelize.STRING, 
        allowNull:false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull:false
    },
    Phone: {
        type: Sequelize.STRING,
        allowNull:false
    },
}); 

const OrderDetail = sequelize.define('OrderDetail',{
    OrderDetailID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    OrderID: {
        type: Sequelize.INTEGER, 
        allowNull:false
    },
    ProductID: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
   Quantity: {
        type: Sequelize.INTEGER,
        allowNull:false
    },
    Subtotal: {
        type: Sequelize.STRING,
        allowNull:false
    },
}); 

sequelize.sync();

// app.get("/", (req, res) => {
//     res.send("Hello world! SIRAPHONG Check!!");
// });

//route to get
app.get('/products',(req,res) =>{
    Product.findAll().then(product => {
        res.json(product);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get by id
app.get ('/products/:id' , (req,res) =>{
    Product.findByPk(req.params.id).then(product => {
        if(!product) {
            res.status(404).send('product not found');
        } else {
            res.json(product);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to create a new
app.post('/products',(req,res) => {
    Product.create(req.body).then(product =>{
        res.send(product);
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to update 
app.put ('/products/:id', (req,res) => {
    Product.findByPk(req.params.id).then(product => {
        if (!product) {
            res.status(404).send('product not found');
        } else {
            product.update(req.body).then(() => {
                res.send(product);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to delete
app.delete('/products/:id', (req, res) => {
    Product.findByPk(req.params.id).then(product => {
        if (!product){
            res.status(404).send('Product not found');
        }else{
            product.destroy().then(() =>{
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//----------------------------------------------------------------------
//route to get
app.get('/orders',(req,res) =>{
    Order.findAll().then(order => {
        res.json(order);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get by id
app.get ('/orders/:id' , (req,res) =>{
    Order.findByPk(req.params.id).then(order => {
        if(!order) {
            res.status(404).send('order not found');
        } else {
            res.json(order);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to create a new
app.post('/orders',(req,res) => {
    Order.create(req.body).then(order =>{
        res.send(order);
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to update 
app.put ('/orders/:id', (req,res) => {
    Order.findByPk(req.params.id).then(order => {
        if (!order) {
            res.status(404).send('order not found');
        } else {
            order.update(req.body).then(() => {
                res.send(order);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to delete
app.delete('/orders/:id', (req, res) => {
    Order.findByPk(req.params.id).then(order => {
        if (!order){
            res.status(404).send('order not found');
        }else{
            order.destroy().then(() =>{
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//----------------------------------------------------------------------
//route to get
app.get('/customers',(req,res) =>{
    Customer.findAll().then(customer => {
        res.json(customer);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get by id
app.get ('/Customers/:id' , (req,res) =>{
    Customer.findByPk(req.params.id).then(customer => {
        if(!customer) {
            res.status(404).send('Customer not found');
        } else {
            res.json(customer);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to create a new
app.post('/customers',(req,res) => {
    console.log(req.body);
    Customer.create(req.body).then(customer =>{
        res.send(customer);
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to update 
app.put ('/customers/:id', (req,res) => {
    console.log(req.body);
    Customer.findByPk(req.params.id).then(customer => {
        if (!customer) {
            res.status(404).send('Customer not found');
        } else {
            customer.update(req.body).then(() => {
                res.send(customer);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to delete
app.delete('/customers/:id', (req, res) => {
    console.log(req);
    Customer.findByPk(req.params.id).then(customer => {
        if (!customer){
            res.status(404).send('Customer not found');
        }else{
            customer.destroy().then(() =>{
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});


//----------------------------------------------------------------------
//route to get
app.get('/OrderDetails',(req,res) =>{
    OrderDetail.findAll().then(orderDetail => {
        res.json(orderDetail);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get by id
app.get ('/OrderDetails/:id' , (req,res) =>{
    OrderDetail.findByPk(req.params.id).then(orderDetail => {
        if(!orderDetail) {
            res.status(404).send('OrderDetail not found');
        } else {
            res.json(orderDetail);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to create a new
// app.post('/OrderDetails',(req,res) => {
//     OrderDetail.create(req.body).then(orderDetail =>{
//         res.send(orderDetail);
//     }).catch(err => {
//         res.status(500).send(err);
//     });
// });

app.post('/OrderDetails',(req,res) => {
    OrderDetail.create(req.body).then(orderDetail =>{
        res.send(orderDetail);
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to update 
app.put ('/OrderDetails/:id', (req,res) => {
    OrderDetail.findByPk(req.params.id).then(orderDetail => {
        if (!orderDetail) {
            res.status(404).send('OrderDetail not found');
        } else {
            orderDetail.update(req.body).then(() => {
                res.send(orderDetail);
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

//route to delete
app.delete('/OrderDetails/:id', (req, res) => {
    OrderDetail.findByPk(req.params.id).then(orderDetail => {
        if (!orderDetail){
            res.status(404).send('OrderDetail not found');
        }else{
            orderDetail.destroy().then(() =>{
                res.send({});
            }).catch(err => {
                res.status(500).send(err);
            });
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});