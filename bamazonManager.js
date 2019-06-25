var mysql = require("mysql");
var inquirer = require('inquirer');
var Table = require('cli-table');
var colors = require("colors");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    option();
})

function option() {
    inquirer.prompt([
        {
            type: "list",
            name: "userOptions",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New product", "Quit"]
        },

    ]).then(function (answer) {
        switch (answer.userOptions) {
            case "View Products for Sale":
                inventory();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New product":
                addProduct();
                break;
            default:
                connection.end();
                break;
        }
    });
};

var inventory = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quantity"],
            colWidths: [10, 20, 15, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        };
        console.log("\n" + table.toString() + "\n");
        option();
    });
}

var lowInventory = function () {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;

        var table = new Table({
            head: ["ID", "Product", "Department", "Price", "Quantity"],
            colWidths: [10, 20, 15, 10, 10]
        });

        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        };
        console.log(table.toString());
        console.log("\n============================\n");
        option();
    });
};

var addInventory = function () {
    inquirer.prompt([
        {
            name: "id",
            type: "input",
            message: "Enter the ID of the item that you would like to update"
        },
        {
            name: "stock",
            type: "input",
            message: "How many item would you like to add?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?", [{
            item_id: answer.id
        }],
            function (err, res) {
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: parseInt(res[0].stock_quantity) + parseInt(answer.stock)
                },
                {
                    item_id: answer.id
                }],
                    function (err) {
                        if (err) throw err;
                    }
                );
                console.log("\n===============================\n")
                console.log("Your inventory has been updated".yellow)
                console.log("\n===============================\n")
                inventory()
                
            }
        )
    })
}

var addProduct = function () {
    inquirer.prompt([
        {
            type: "input",
            name: "addProduct",
            message: "What is the name of the product you would like to add?",
        },
        {
            type: "list",
            name: "department",
            message: "Which department does this product fall into?",
            choices: ["Video Games", "Apparel", "Necessities", "Film", "Board Games"]
        },
        {
            type: "input",
            name: "cost",
            message: "how much does it cost?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "how many do we have?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
    ]).then(function (answer) {
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.addProduct,
            department_name: answer.department,
            price: answer.cost,
            stock_quantity: answer.quantity
        })
        console.log("\n========================================\n")
        console.log((answer.addProduct + " added to Bamazon").yellow)
        console.log("\n========================================\n")
        option();
    });

}