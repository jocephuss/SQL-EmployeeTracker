const inquirer = require("inquirer");
const db = require("./models/queries");

const mainMenu = async () => {
  // Main menu logic 'choices'
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all departments",
      "View all roles",
      "View all employees",
      "Add a department",
      "Add a role",
      "Add an employee",
      "Update an employee role",
      "Update an employee manager",
      "View employees by manager",
      "View employees by department",
      "Delete department",
      "Delete role",
      "Delete employee",
      "View department budget",
      "Exit",
    ],
  });

  switch (
    action // Switch case for menu choices
  ) {
    case "View all departments":
      await viewAllDepartments();
      break;
    case "View all roles":
      await viewAllRoles();
      break;
    case "View all employees":
      await viewAllEmployees();
      break;
    case "Add a department":
      await addDepartmentPrompt();
      break;
    case "Add a role":
      await addRolePrompt();
      break;
    case "Add an employee":
      await addEmployeePrompt();
      break;
    case "Update an employee role":
      await updateEmployeeRolePrompt();
      break;
    case "Update an employee manager":
      await updateEmployeeManagerPrompt();
      break;
    case "View employees by manager":
      await viewEmployeesByManagerPrompt();
      break;
    case "View employees by department":
      await viewEmployeesByDepartmentPrompt();
      break;
    case "Delete department":
      await deleteDepartmentPrompt();
      break;
    case "Delete role":
      await deleteRolePrompt();
      break;
    case "Delete employee":
      await deleteEmployeePrompt();
      break;
    case "View department budget":
      await viewDepartmentBudgetPrompt();
      break;
    case "Exit":
      console.log("Goodbye!");
      process.exit();
  }
};

const viewAllDepartments = async () => {
  const departments = await db.getDepartments(); // Call the getDepartments method from the database model
  console.table(departments);
  mainMenu();
};

const viewAllRoles = async () => {
  const roles = await db.getRoles(); // Call the getRoles method from the database model
  console.table(roles);
  mainMenu();
};

const viewAllEmployees = async () => {
  const employees = await db.getEmployees(); // Call the getEmployees method from the database model
  console.table(employees);
  mainMenu();
};

const addDepartmentPrompt = async () => {
  const { name } = await inquirer.prompt({
    // Prompt for department name
    name: "name",
    type: "input",
    message: "Enter the name of the department:",
  });
  await db.addDepartment(name);
  console.log(`Added department ${name}`); // Log the success message and return to the main menu
  mainMenu();
};

const addRolePrompt = async () => {
  const departments = await db.getDepartments(); // Get all departments from the database
  const { title, salary, department_id } = await inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "Enter the name of the role:",
    },
    {
      name: "salary",
      type: "input",
      message: "Enter the salary for the role:",
    },
    {
      name: "department_id",
      type: "list",
      message: "Select the department for the role:",
      choices: departments.map((dept) => ({ name: dept.name, value: dept.id })), // Create choices array with department names and IDs
    },
  ]);
  await db.addRole(title, salary, department_id); // Call the addRole method from the database model with provided details
  console.log(`Added role ${title}`);
  mainMenu();
};

const addEmployeePrompt = async () => {
  const roles = await db.getRoles();
  const employees = await db.getEmployees(); // Get all roles and employees from the database
  const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "Enter the employee’s first name:",
    },
    {
      name: "last_name",
      type: "input",
      message: "Enter the employee’s last name:",
    },
    {
      name: "role_id",
      type: "list",
      message: "Select the role for the employee:",
      choices: roles.map((role) => ({ name: role.title, value: role.id })), // Create choices array with role titles and IDs
    },
    {
      name: "manager_id",
      type: "list",
      message: "Select the manager for the employee:",
      choices: [
        { name: "None", value: null },
        ...employees.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        })),
      ],
    },
  ]);
  await db.addEmployee(first_name, last_name, role_id, manager_id); // Call the addEmployee method from the database model with provided details
  console.log(`Added employee ${first_name} ${last_name}`);
  mainMenu();
};

const updateEmployeeRolePrompt = async () => {
  // Prompt for employee and role selection
  const employees = await db.getEmployees();
  const roles = await db.getRoles();
  const { employee_id, role_id } = await inquirer.prompt([
    {
      name: "employee_id",
      type: "list",
      message: "Select the employee to update:",
      choices: employees.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      name: "role_id",
      type: "list",
      message: "Select the new role for the employee:",
      choices: roles.map((role) => ({ name: role.title, value: role.id })),
    },
  ]);
  await db.updateEmployeeRole(employee_id, role_id); // Call the updateEmployeeRole method from the database model with provided details
  console.log("Updated employee’s role.");
  mainMenu();
};

const updateEmployeeManagerPrompt = async () => {
  // Prompt for employee and manager selection
  const employees = await db.getEmployees();
  const { employee_id, manager_id } = await inquirer.prompt([
    {
      name: "employee_id",
      type: "list",
      message: "Select the employee to update:",
      choices: employees.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    },
    {
      name: "manager_id",
      type: "list",
      message: "Select the new manager for the employee:",
      choices: [
        { name: "None", value: null },
        ...employees.map((emp) => ({
          name: `${emp.first_name} ${emp.last_name}`,
          value: emp.id,
        })),
      ],
    },
  ]);
  await db.updateEmployeeManager(employee_id, manager_id); // Call the updateEmployeeManager method from the database model with provided details
  console.log("Updated employee’s manager.");
  mainMenu();
};

const viewEmployeesByManagerPrompt = async () => {
  const managers = await db.getEmployees(); // Get all employees to use as potential managers
  const { manager_id } = await inquirer.prompt({
    name: "manager_id",
    type: "list",
    message: "Select the manager:",
    choices: [
      { name: "View all employees", value: null },
      ...managers.map((emp) => ({
        name: `${emp.first_name} ${emp.last_name}`,
        value: emp.id,
      })),
    ],
  });
  const employees = await db.getEmployeesByManager(manager_id); // Call the getEmployeesByManager method from the database model with provided manager ID
  console.table(employees);
  mainMenu();
};

const viewEmployeesByDepartmentPrompt = async () => {
  const departments = await db.getDepartments();
  const { department_id } = await inquirer.prompt({
    name: "department_id",
    type: "list",
    message: "Select the department:",
    choices: departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    })),
  });
  const employees = await db.getEmployeesByDepartment(department_id); // Call the getEmployeesByDepartment method from the database model with provided department ID
  console.table(employees);
  mainMenu();
};

const deleteDepartmentPrompt = async () => {
  const departments = await db.getDepartments(); // Get all departments from the database
  const { department_id } = await inquirer.prompt({
    name: "department_id",
    type: "list",
    message: "Select the department to delete:",
    choices: departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    })),
  });
  await db.deleteDepartment(department_id); // Call the deleteDepartment method from the database model with provided department ID
  console.log("Deleted department.");
  mainMenu();
};

const deleteRolePrompt = async () => {
  // Prompt for role selection
  const roles = await db.getRoles(); // Get all roles from the database
  const { role_id } = await inquirer.prompt({
    name: "role_id",
    type: "list",
    message: "Select the role to delete:",
    choices: roles.map((role) => ({
      name: role.title,
      value: role.id,
    })),
  });
  await db.deleteRole(role_id); // Call the deleteRole method from the database model with provided role ID
  console.log("Deleted role.");
  mainMenu();
};

const deleteEmployeePrompt = async () => {
  // Prompt for employee selection
  const employees = await db.getEmployees(); // Get all employees from the database
  const { employee_id } = await inquirer.prompt({
    name: "employee_id",
    type: "list",
    message: "Select the employee to delete:",
    choices: employees.map((emp) => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id,
    })),
  });
  await db.deleteEmployee(employee_id); // Call the deleteEmployee method from the database model with provided employee ID
  console.log("Deleted employee."); // Log the success message and return to the main menu
  mainMenu();
};

const viewDepartmentBudgetPrompt = async () => {
  // Prompt for department selection
  const departments = await db.getDepartments(); // Get all departments from the database
  const { department_id } = await inquirer.prompt({
    name: "department_id",
    type: "list",
    message: "Select the department:",
    choices: departments.map((dept) => ({
      name: dept.name,
      value: dept.id,
    })),
  });
  const budget = await db.getDepartmentBudget(department_id); // Call the getDepartmentBudget method from the database model with provided department ID
  console.log(`Department budget: ${budget}`); // Log the department budget and return to the main menu
  mainMenu();
};

mainMenu();
