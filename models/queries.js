const pool = require("../db");

class Database {
  async getDepartments() {
    // Get all departments with their employees
    const res = await pool.query("SELECT * FROM departments");
    return res.rows;
  }

  async getRoles() {
    // Get all roles with their salaries, departments, and employees
    const res = await pool.query(
      `SELECT roles.id, roles.title, roles.salary, departments.name AS department 
       FROM roles 
       JOIN departments ON roles.department_id = departments.id`
    );
    return res.rows;
  }

  async getEmployees() {
    // Get all employees with their roles, departments, and managers
    const res = await pool.query(`
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
             CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON manager.id = employees.manager_id
    `);
    return res.rows;
  }

  async addDepartment(name) {
    // Add a new department with the given name
    await pool.query("INSERT INTO departments (name) VALUES ($1)", [name]);
  }

  async addRole(title, salary, department_id) {
    // Add a new role with the given details
    await pool.query(
      "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
      [title, salary, department_id]
    );
  }

  async addEmployee(first_name, last_name, role_id, manager_id) {
    // Add a new employee with the given details
    await pool.query(
      "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
      [first_name, last_name, role_id, manager_id]
    );
  }

  async updateEmployeeRole(employee_id, role_id) {
    // Update the role of the given employee
    await pool.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
      role_id,
      employee_id,
    ]);
  }

  async updateEmployeeManager(employee_id, manager_id) {
    // Update the manager of the given employee
    await pool.query("UPDATE employees SET manager_id = $1 WHERE id = $2", [
      manager_id,
      employee_id,
    ]);
  }

  async getEmployeesByManager(manager_id) {
    // Get all employees managed by the given manager
    const res = await pool.query(
      `
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      WHERE employees.manager_id = $1
    `,
      [manager_id] // Adjust the query to match the database schema
    );
    return res.rows;
  }

  async getEmployeesByDepartment(department_id) {
    // Get all employees assigned to the given department
    const res = await pool.query(
      `
      SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees manager ON manager.id = employees.manager_id
      WHERE departments.id = $1
    `,
      [department_id] // Adjust the query to match the database schema
    );
    return res.rows;
  }

  async deleteDepartment(department_id) {
    // Delete all employees assigned to the given department and their roles
    await pool.query("DELETE FROM departments WHERE id = $1", [department_id]);
  }

  async deleteRole(role_id) {
    // Delete all roles assigned to the given department and their employees
    await pool.query("DELETE FROM roles WHERE id = $1", [role_id]);
  }

  async deleteEmployee(employee_id) {
    // Delete all employees assigned to the given role
    await pool.query("DELETE FROM employees WHERE id = $1", [employee_id]);
  }

  async getDepartmentBudget(department_id) {
    // Calculate the total salary for the given department
    const res = await pool.query(
      `
      SELECT SUM(roles.salary) AS budget
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      WHERE roles.department_id = $1
    `,
      [department_id] // Adjust the query to match the database schema
    );
    return res.rows[0].budget;
  }
}

module.exports = new Database();
