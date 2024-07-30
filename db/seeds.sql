-- Departments
INSERT INTO departments (name) VALUES ('Sales');
INSERT INTO departments (name) VALUES ('Engineering');
INSERT INTO departments (name) VALUES ('Finance');

-- Roles
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Manager', 60000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Sales Associate', 40000, 1);
INSERT INTO roles (title, salary, department_id) VALUES ('Software Engineer', 80000, 2);
INSERT INTO roles (title, salary, department_id) VALUES ('Financial Analyst', 70000, 3);

-- Employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, 1);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 3, NULL);
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Bob', 'Brown', 4, NULL);
