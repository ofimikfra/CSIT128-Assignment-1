/* run these queries before using the website */

CREATE TABLE cookingPapa;

CREATE TABLE users (
id INT AUTO INCREMENT PRIMARY KEY,
username VARCHAR(100) UNIQUE NOT NULL,
fname VARCHAR(100),
lname VARCHAR(100),
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
id INT AUTO INCREMENT PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL,
creator VARCHAR(100),
FOREIGN KEY (creator) REFERENCES users(username)
);

CREATE TABLE recipes (
id INT AUTO INCREMENT PRIMARY KEY,
name VARCHAR(100),
ingredients TEXT,
instructions TEXT,
category VARCHAR(100),
creator VARCHAR(100),
FOREIGN KEY (creator) REFERENCES users(username)
FOREIGN KEY (category) REFERENCES categories(name)
);