DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
    item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(250) NOT NULL,
    department_name VARCHAR(250) NOT NULL,
    price INTEGER(30) NOT NULL,
    stock_quantity INTEGER(250) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price,stock_quantity)
VALUES ("Uncharted 4","Video Games", 49.95, 150),
("DOOM", "Video Games", 59.99, 150),
("Crate of Spam", "Food and Drink", 24.5, 50),
("Cool Shades", "Apparel", 75, 4),
("Worn Denim jeans", "Apparel", 54.25, 35),
("Survival Towel", "Necessities", 42.42, 42),
("Bill and Ted's Axcellent Adventure", "Films", 15, 25),
("Mad Max: Fury Road", "Films", 25.5, 3),
("Monopoly", "Board Games", 30.5, 35),
("Yahtzee", "Board Games", 19.95, 150);


-- CREATE TABLE departments(
--     department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
--     department_name VARCHAR(50) NOT NULL,
--     over_head_costs INTEGER(11) NOT NULL,
--     PRIMARY KEY (item_id)
-- );