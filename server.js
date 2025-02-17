const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const connectDB = require('./config/db');
const userResolvers = require('./resolvers/userResolvers');
const employeeResolvers = require('./resolvers/employeeResolvers');

require('dotenv').config();
connectDB();

const schema = buildSchema(`
    type User {
        id: ID!
        username: String!
        email: String!
    }

    type Employee {
        id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String!
        designation: String!
        salary: Float!
        date_of_joining: String!
        department: String!
        employee_photo: String
    }

    type Query {
        login(email: String!, password: String!): String
        getEmployees: [Employee]
        searchEmployeeById(id: ID!): Employee
        searchEmployeeByDepartment(department: String!): [Employee]
    }

    type Mutation {
        signup(username: String!, email: String!, password: String!): User
        addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, salary: Float!, date_of_joining: String!, department: String!): Employee
        updateEmployee(id: ID!, first_name: String, last_name: String, email: String, designation: String, salary: Float, department: String): Employee
        deleteEmployee(id: ID!): String
    }
`);

const root = {
    ...userResolvers,
    ...employeeResolvers,
};

const app = express();
app.use('/graphql', graphqlHTTP({ schema, rootValue: root, graphiql: true }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
