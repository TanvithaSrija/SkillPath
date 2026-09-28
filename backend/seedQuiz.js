const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Quiz = require("./models/Quiz");

dotenv.config();

const javaQuiz = {
  skillId: "Java",

  passingMarks: 6,

  timeLimit: 10,

  questions: [
    {
      question: "Which keyword is used to create a class in Java?",
      options: ["class", "struct", "define", "object"],
      correctAnswer: 0,
    },
    {
      question: "Which method is the entry point of a Java application?",
      options: [
        "start()",
        "main()",
        "run()",
        "execute()",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which data type is used to store whole numbers in Java?",
      options: [
        "double",
        "boolean",
        "int",
        "char",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which concept allows a class to acquire properties and methods from another class?",
      options: [
        "Encapsulation",
        "Inheritance",
        "Abstraction",
        "Polymorphism",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which symbol is used to end a Java statement?",
      options: [":", ".", ";", ","],
      correctAnswer: 2,
    },
    {
      question: "Which collection does not allow duplicate elements?",
      options: [
        "ArrayList",
        "LinkedList",
        "HashSet",
        "Vector",
      ],
      correctAnswer: 2,
    },
    {
      question: "Which keyword is used to inherit a class in Java?",
      options: [
        "implements",
        "extends",
        "inherits",
        "super",
      ],
      correctAnswer: 1,
    },
    {
      question: "Which access modifier allows access from any class?",
      options: [
        "private",
        "protected",
        "default",
        "public",
      ],
      correctAnswer: 3,
    },
    {
      question: "Which keyword is used to create an object in Java?",
      options: [
        "new",
        "create",
        "object",
        "instance",
      ],
      correctAnswer: 0,
    },
    {
      question: "Which keyword prevents a method from being overridden?",
      options: [
        "static",
        "constant",
        "final",
        "private",
      ],
      correctAnswer: 2,
    },
  ],
};

const seedQuiz = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Quiz.findOneAndUpdate(
      { skillId: javaQuiz.skillId },
      javaQuiz,
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Java quiz seeded successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Quiz seed error:", error);

    await mongoose.disconnect();
    process.exit(1);
  }
};

seedQuiz();