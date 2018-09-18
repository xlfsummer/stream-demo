const stream = require("stream");

let i = 0

let rs = new stream.Readable({
    // read() {
    //     i++
    // i < 10
    //     ? rs.push(i + "Hello \n")
    //     : rs.push(null)
    // }
});

rs.read = function () {
    i++
    i < 10
        ? rs.push(i + "Hello \n")
        : rs.push(null)
}

rs.pipe(process.stdout);


// let ws = new stream.Writable();

// ws._write = (data, code, next) => {
//     /** @type {string} */
//     let c = data.toString();
//     debugger
//     console.log(c.toUpperCase());
//     setTimeout(()=>next(), 1000)
// };


// process.stdin.pipe(ws);


// const inStream = new stream.Readable({
//     read(size) {
//         this.push(String.fromCharCode(this.currentCharCode++));
//         if (this.currentCharCode > 90) {
//         this.push(null);
//         }
//     }
// });
// inStream.currentCharCode = 65;
// inStream.pipe(process.stdout);