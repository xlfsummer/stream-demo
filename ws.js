let { Writable, Readable, Transform } = require("stream");
let delay = time => new Promise(r => setTimeout(r, time));


let inWrite = false;
let ws = new Writable({
    async write(chunk, enc, done) {
        await delay(500);
        console.log("内部: chunk: " + chunk + " 缓存 ----> 内部目标");
        // 外部输入 ------> 缓存 >>>>>>> 内部目标
        done();
    },
    objectMode: true,
    highWaterMark: 5
});


let count = 0;
const TOTAL = 9;

let write = function () {
    while (count < TOTAL) {
        count++;
        // 外部输入 >>>>>> 缓存 ------> 内部目标
        let ret = ws.write(count + "", (count => _ => {
            console.log("外部: 写入 " + count + " 完成");
        })(count))
        console.log("外部: " + count + " 外部输入 ----> 缓存");

        // 缓存满， 暂停外部写入
        // 外部输入 ---X---> 缓存 ------> 内部目标
        if (ret == false) {
            break;
        }
    }
    if (count >= TOTAL) {
        //可以在 end 时写入最后一块数据
        ws.end("最后一块", () => {
            console.log("外部: 最后一块 写入完成")
        });
    }
};

//初始写入
write();
// 表示 ws 从已满到未满，又可以继续写入了
ws.on("drain", write);

ws.on("finish", _ => {
    console.log("外部: 可写流写入完成, 触发 finish 事件");
});