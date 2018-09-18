let { Writable, Readable, Transform } = require("stream");
let delay = time => new Promise(r => setTimeout(r, time));

let readCount = 0;
let rs = new Readable({
    read() {
        if (readCount < 25) {
            let ret = this.push(readCount + "");
            console.log("push <- " + readCount);
            readCount++;
            if (ret == false) {
                // 自动暂停
                // 内部源---X--->缓存------>外部输出
                console.log("背压");
            }
        } else {
            this.push(null);
        }
    },
    objectMode: true,
    highWaterMark: 20
});

rs.on("data", async data => {
    console.log(data)

    // 可以控制可读流暂停输出，可读流暂停输出时会先将数据存入缓存，可能导致背压
    // 内部源------>缓存---X--->外部输出
    rs.pause(); //暂停输出
    await delay(100);
    rs.resume(); //恢复输出
})

rs.on("end", _ => {
    console.log("写入流结束");
});