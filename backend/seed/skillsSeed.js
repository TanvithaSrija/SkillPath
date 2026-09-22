const mongoose = require("mongoose");
require("dotenv").config();

const CareerGoal = require("../models/CareerGoal");
const Skill = require("../models/Skill");
const connectDB = require("../config/db");

const seedSkills = async () => {
    try {
        await connectDB();

        // Clear existing skills
        await Skill.deleteMany();

        const careerGoals = await CareerGoal.find();

        const goalMap = {};

        careerGoals.forEach((goal) => {
            goalMap[goal.title] = goal._id;
        });

        const requiredGoals = [
            "MERN Stack Developer",
            "Java Backend Developer",
            "Data Analyst",
            "AI Engineer",
            "DevOps Engineer",
            "Cyber Security Engineer"
        ];

        for (const goal of requiredGoals) {
            if (!goalMap[goal]) {
                throw new Error(`Career goal not found: ${goal}`);
            }
        }

        // ------------------------------------
        // MERN STACK DEVELOPER
        // ------------------------------------

        const mernSkills = [
            {
                title: "HTML & CSS",
                description:
                    "Learn HTML structure, semantic elements, CSS styling, layouts, Flexbox, Grid and responsive design.",
                order: 1,
                estimatedHours: 30,
                difficulty: "Beginner"
            },
            {
                title: "JavaScript",
                description:
                    "Learn JavaScript fundamentals, ES6+, functions, arrays, objects, DOM manipulation and asynchronous programming.",
                order: 2,
                estimatedHours: 50,
                difficulty: "Intermediate"
            },
            {
                title: "React.js",
                description:
                    "Learn React components, props, state, hooks, routing and building interactive user interfaces.",
                order: 3,
                estimatedHours: 50,
                difficulty: "Intermediate"
            },
            {
                title: "Node.js",
                description:
                    "Learn Node.js fundamentals, modules, npm, asynchronous programming and server-side JavaScript.",
                order: 4,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "Express.js",
                description:
                    "Learn Express.js, routing, middleware, REST APIs and backend application development.",
                order: 5,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "MongoDB",
                description:
                    "Learn MongoDB databases, collections, documents, CRUD operations and Mongoose.",
                order: 6,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "MERN Full Stack Project",
                description:
                    "Build a complete full-stack application using MongoDB, Express.js, React.js and Node.js.",
                order: 7,
                estimatedHours: 60,
                difficulty: "Advanced"
            }
        ];

        // ------------------------------------
        // JAVA BACKEND DEVELOPER
        // ------------------------------------

        const javaSkills = [
            {
                title: "Java Programming Fundamentals",
                description:
                    "Learn Java syntax, variables, data types, operators, conditions, loops and functions.",
                order: 1,
                estimatedHours: 40,
                difficulty: "Beginner"
            },
            {
                title: "Object Oriented Programming in Java",
                description:
                    "Learn classes, objects, inheritance, polymorphism, abstraction and encapsulation.",
                order: 2,
                estimatedHours: 40,
                difficulty: "Intermediate"
            },
            {
                title: "Java Collections & Exception Handling",
                description:
                    "Learn Collections Framework, generics, exception handling and file handling.",
                order: 3,
                estimatedHours: 40,
                difficulty: "Intermediate"
            },
            {
                title: "SQL & Database Fundamentals",
                description:
                    "Learn relational databases, SQL queries, joins, constraints and database design.",
                order: 4,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "Spring Boot",
                description:
                    "Learn Spring Boot, dependency injection, REST APIs and backend application development.",
                order: 5,
                estimatedHours: 55,
                difficulty: "Advanced"
            },
            {
                title: "REST API Development",
                description:
                    "Build secure and scalable REST APIs using Java and Spring Boot.",
                order: 6,
                estimatedHours: 40,
                difficulty: "Advanced"
            },
            {
                title: "Java Backend Project",
                description:
                    "Build a complete backend application using Java, Spring Boot and a relational database.",
                order: 7,
                estimatedHours: 60,
                difficulty: "Advanced"
            }
        ];

        // ------------------------------------
        // DATA ANALYST
        // ------------------------------------

        const dataSkills = [
            {
                title: "Excel",
                description:
                    "Learn spreadsheets, formulas, functions, pivot tables and basic data analysis.",
                order: 1,
                estimatedHours: 25,
                difficulty: "Beginner"
            },
            {
                title: "SQL",
                description:
                    "Learn SQL queries, filtering, grouping, joins, subqueries and database analysis.",
                order: 2,
                estimatedHours: 40,
                difficulty: "Beginner"
            },
            {
                title: "Python for Data Analysis",
                description:
                    "Learn Python fundamentals and libraries such as NumPy and Pandas for data analysis.",
                order: 3,
                estimatedHours: 45,
                difficulty: "Intermediate"
            },
            {
                title: "Data Visualization",
                description:
                    "Learn Matplotlib, Seaborn and visualization techniques for presenting data effectively.",
                order: 4,
                estimatedHours: 30,
                difficulty: "Intermediate"
            },
            {
                title: "Statistics",
                description:
                    "Learn descriptive statistics, probability, distributions, correlation and hypothesis testing.",
                order: 5,
                estimatedHours: 40,
                difficulty: "Intermediate"
            },
            {
                title: "Power BI",
                description:
                    "Learn dashboards, reports, data modeling and visualization using Power BI.",
                order: 6,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "Data Analysis Project",
                description:
                    "Perform an end-to-end data analysis project and present meaningful insights.",
                order: 7,
                estimatedHours: 50,
                difficulty: "Advanced"
            }
        ];

        // ------------------------------------
        // AI ENGINEER
        // ------------------------------------

        const aiSkills = [
            {
                title: "Python Programming",
                description:
                    "Learn Python programming fundamentals, functions, data structures and object-oriented programming.",
                order: 1,
                estimatedHours: 40,
                difficulty: "Beginner"
            },
            {
                title: "Mathematics for AI",
                description:
                    "Learn linear algebra, probability, statistics and calculus concepts used in AI.",
                order: 2,
                estimatedHours: 50,
                difficulty: "Intermediate"
            },
            {
                title: "Machine Learning",
                description:
                    "Learn supervised and unsupervised learning algorithms and model evaluation techniques.",
                order: 3,
                estimatedHours: 60,
                difficulty: "Intermediate"
            },
            {
                title: "Deep Learning",
                description:
                    "Learn neural networks, CNNs, RNNs and deep learning frameworks.",
                order: 4,
                estimatedHours: 65,
                difficulty: "Advanced"
            },
            {
                title: "Natural Language Processing",
                description:
                    "Learn text preprocessing, embeddings, transformers and NLP applications.",
                order: 5,
                estimatedHours: 55,
                difficulty: "Advanced"
            },
            {
                title: "Computer Vision",
                description:
                    "Learn image processing, object detection and image classification.",
                order: 6,
                estimatedHours: 55,
                difficulty: "Advanced"
            },
            {
                title: "AI Project",
                description:
                    "Build and deploy an AI application using machine learning or deep learning.",
                order: 7,
                estimatedHours: 70,
                difficulty: "Advanced"
            }
        ];

        // ------------------------------------
        // DEVOPS ENGINEER
        // ------------------------------------

        const devopsSkills = [
            {
                title: "Linux Fundamentals",
                description:
                    "Learn Linux commands, file systems, permissions, processes and shell basics.",
                order: 1,
                estimatedHours: 30,
                difficulty: "Beginner"
            },
            {
                title: "Git & GitHub",
                description:
                    "Learn version control, branches, merging, pull requests and collaborative development.",
                order: 2,
                estimatedHours: 25,
                difficulty: "Beginner"
            },
            {
                title: "Docker",
                description:
                    "Learn containers, Docker images, Dockerfiles and containerized applications.",
                order: 3,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "CI/CD",
                description:
                    "Learn continuous integration and continuous deployment using automation pipelines.",
                order: 4,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "Kubernetes",
                description:
                    "Learn container orchestration, pods, deployments, services and scaling.",
                order: 5,
                estimatedHours: 50,
                difficulty: "Advanced"
            },
            {
                title: "Cloud Computing",
                description:
                    "Learn cloud fundamentals and services using platforms such as AWS or Azure.",
                order: 6,
                estimatedHours: 50,
                difficulty: "Advanced"
            },
            {
                title: "DevOps Project",
                description:
                    "Build a complete CI/CD deployment pipeline for a containerized application.",
                order: 7,
                estimatedHours: 60,
                difficulty: "Advanced"
            }
        ];

        // ------------------------------------
        // CYBER SECURITY ENGINEER
        // ------------------------------------

        const cyberSkills = [
            {
                title: "Computer Networks",
                description:
                    "Learn networking fundamentals, TCP/IP, HTTP, DNS, routing and network protocols.",
                order: 1,
                estimatedHours: 40,
                difficulty: "Beginner"
            },
            {
                title: "Linux Security",
                description:
                    "Learn Linux security, permissions, users, processes and system hardening.",
                order: 2,
                estimatedHours: 35,
                difficulty: "Intermediate"
            },
            {
                title: "Ethical Hacking",
                description:
                    "Learn penetration testing concepts, reconnaissance and common attack techniques.",
                order: 3,
                estimatedHours: 50,
                difficulty: "Intermediate"
            },
            {
                title: "Web Application Security",
                description:
                    "Learn common web vulnerabilities such as SQL injection, XSS and authentication issues.",
                order: 4,
                estimatedHours: 45,
                difficulty: "Advanced"
            },
            {
                title: "Cryptography",
                description:
                    "Learn encryption, hashing, digital signatures and cryptographic fundamentals.",
                order: 5,
                estimatedHours: 40,
                difficulty: "Advanced"
            },
            {
                title: "Security Tools",
                description:
                    "Learn practical security tools used for network analysis, vulnerability assessment and penetration testing.",
                order: 6,
                estimatedHours: 45,
                difficulty: "Advanced"
            },
            {
                title: "Cyber Security Project",
                description:
                    "Build a practical security project involving vulnerability assessment or security monitoring.",
                order: 7,
                estimatedHours: 60,
                difficulty: "Advanced"
            }
        ];

        const roadmapData = [
            {
                careerGoalId: goalMap["MERN Stack Developer"],
                skills: mernSkills
            },
            {
                careerGoalId: goalMap["Java Backend Developer"],
                skills: javaSkills
            },
            {
                careerGoalId: goalMap["Data Analyst"],
                skills: dataSkills
            },
            {
                careerGoalId: goalMap["AI Engineer"],
                skills: aiSkills
            },
            {
                careerGoalId: goalMap["DevOps Engineer"],
                skills: devopsSkills
            },
            {
                careerGoalId: goalMap["Cyber Security Engineer"],
                skills: cyberSkills
            }
        ];

        for (const roadmap of roadmapData) {
            let previousSkill = null;

            for (const skillData of roadmap.skills) {
                const skill = await Skill.create({
                    ...skillData,
                    careerGoalId: roadmap.careerGoalId,
                    prerequisiteSkill: previousSkill
                });

                previousSkill = skill._id;
            }
        }

        console.log("Skills seeded successfully!");

        const skillCount = await Skill.countDocuments();

        console.log(`Total skills inserted: ${skillCount}`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Error seeding skills:", error.message);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedSkills();