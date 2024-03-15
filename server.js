require("dotenv").config();

const express = require("express");
const Sequelize = require("sequelize");
const app = express();
app.use(express.json());

const sequelize = new Sequelize('database' ,'root' ,'' , {
    host: 'http://10.104.17.251:3000',
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
    TotalAmount: {
        type: Sequelize.INTEGER,
        allowNull:false
    },    
    PromotionID: {
        type: Sequelize.INTEGER,
        allowNull:true
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

const Promotion = sequelize.define('Promotion',{
    PromotionID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PromotionCode: {
        type: Sequelize.STRING,
        allowNull:false
    },
    Discount: {
        type:Sequelize.INTEGER,
        allowNull:false
    },
});


Customer.hasMany(Order, {foreignKey: 'CustomerID'})
Order.belongsTo(Customer, {foreignKey: 'CustomerID'})
Product.hasMany(Order, {foreignKey: 'ProductID'})
Order.belongsTo(Product, {foreignKey: 'ProductID'})

Promotion.hasMany(Order, {foreignKey: 'PromotionID'})
Order.belongsTo(Promotion, {foreignKey: 'PromotionID'})


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
    Order.findAll({include:[Customer,Product,Promotion]}).then(order => {
        res.json(order);
    }).catch(err => {
        res.status(500).send(err);
    });
});

// route to get by id
app.get ('/orders/:id' , (req,res) =>{
    Order.findByPk(req.params.id, {include:[Customer,Product,Promotion]}).then(order => {
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
app.post('/orders', async(req,res) => {
    try {
        const product = await Product.findByPk(req.body.ProductID);
        if(product){
            product.update({ StockQuantity: product.StockQuantity  -  req.body.TotalAmount })
        }
        await Order.create(req.body);
        
        res.send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
});

//route to update 
app.put('/orders/:id', async(req,res) => {
    try {
        const product = await Product.findByPk(req.body.ProductID);
        const order = await Order.findByPk(req.params.id);
        if(order.ProductID != req.body.ProductID){
            const product_old = await Product.findByPk(order.ProductID);
            product_old.update({ StockQuantity: product_old.StockQuantity  +  order.TotalAmount }) 
            product.update({ StockQuantity: product.StockQuantity  -  req.body.TotalAmount })
        }

        if(product){
            if(order.TotalAmount > req.body.TotalAmount){
                let change =  order.TotalAmount - req.body.TotalAmount;
                product.update({ StockQuantity: product.StockQuantity  +  change })
            }else{
                let change =   req.body.TotalAmount - order.TotalAmount
                product.update({ StockQuantity: product.StockQuantity  -  change })
            }
        }
        order.update(req.body);
        res.send(req.body);
    } catch (error) {
        res.status(500).send(error);
    }
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


app.get('/Promotion', async (req,res)=>{
    const data = await Promotion.findAll();
    res.send(data)
})


app.get('/Promotion/:id', async (req,res)=>{
    console.log(req.params.id);
    const data = await Promotion.findByPk(Number(req.params.id));
    if(!data){
        res.status(404).send("Promotion not fond")
    }else{
        res.send(data)
    }
})

app.post('/Promotion', async (req,res)=>{
    try {
        const resp =  await  Promotion.create(req.body);
        res.status(200).send(resp)

    }catch(err){
        res.status(404).send("Erro form insert")
    }

})


app.put('/Promotion/:promotionID', async (req,res)=>{
    try {
        const  promotion = await Promotion.findByPk(Number(req.params.promotionID));
        const resp = await promotion.update(req.body);

        res.status(200).send(resp)

    }catch(err){
        res.status(404).send("Erro form insert")
    }

})

app.delete('/Promotion/:promotionID', async (req,res)=>{
    try {
        const  promotion = await Promotion.findByPk(Number(req.params.promotionID));
        if(promotion){
            promotion.destroy();
            res.send({})
        }else{
            res.status(404).send("not foind")
        }

        // res.status(200).send(resp)

    }catch(err){
        res.status(404).send("Erro form insert")
    }

})




app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});