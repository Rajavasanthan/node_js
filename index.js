const calculator = require("./calculator");
// const fs = require("fs"); // File System
// const os = require("os"); // File System

// (() => {
//     //  const createFs = fs.writeFileSync("message.txt","Hello World!")
//      const delFile = fs.unlinkSync("message.txt");
//   //    const core = os.cpus();
//   //    console.log(core.length);

//   // const folderRead = fs.readdirSync("../react_projects/project2");
//   // console.log(folderRead);
// })();

const res = calculator.add(2, 2);
console.log(res);
