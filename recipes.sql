CREATE database cooking_papa;

CREATE TABLE recipes (
    id INTEGER PRIMARY KEY,
    name TEXT,
    ingredients TEXT,
    instructions TEXT
);

INSERT INTO recipes (id, name, ingredients, instructions) VALUES
(1,'Pasta Carbonara', 'Pasta, Eggs, Parmesan, Pancetta, Pepper', '1. Cook pasta. 2. Fry pancetta. 3. Mix eggs and parmesan. 4. Combine all with pasta.'),
(2,'Tomato Soup', 'Tomatoes, Onions, Garlic, Basil, Salt, Pepper', '1. Sauté onions and garlic. 2. Add tomatoes and basil. 3. Simmer. 4. Blend. 5. Season to taste.');
