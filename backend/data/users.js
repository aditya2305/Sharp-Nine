import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Test User1",
    email: "testu1@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Test User2",
    email: "testu2@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
