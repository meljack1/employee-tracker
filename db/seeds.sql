INSERT INTO department (name)
VALUES ("Engineering"),
        ("Sales"),
        ("Marketing"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 30000, 1),
        ("Lead Engineer", 50000, 1),
        ("Salesperson", 25000, 2),
        ("Sales Lead", 25000, 2),
        ("Social Media Manager", 50000, 3),
        ("Marketing Lead", 50000, 3),
        ("Lawyer", 75000, 4),
        ("Legal Team Lead", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Becky", "Davidson", 2, NULL),
        ("Ismaeel", "Mohammed", 1, 1),
        ("Imogen", "Schwarz", 4, NULL),
        ("Daniel", "Yong", 3, 3),
        ("Alex", "Bancroft", 3, 3);
