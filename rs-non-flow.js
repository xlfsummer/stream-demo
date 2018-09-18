let { Writable, Readable, Transform } = require("stream");
let delay = time => new Promise(r => setTimeout(r, time));

let readCount = 0;
let rs = new Readable({
    read() {
        if (readCount < 20) {
            // 内部源>>>>>>写入缓存------>外部输出
            let ret = this.push(readCount + "");
            console.log("内部源----->写入缓存: " + readCount);
            readCount++;
            if (ret == false) {
                // 背压即"缓存"满
                // 背压时自动暂停从数据源读取数据并写入到"缓存"的操作(最后一次的写入成功)
                // 内部源---X--->缓存------>输出
                // 外部调用 rs.read() 从缓存中读取数据时，自动恢复
                console.log("内部: 背压");
            }
        } else {
            this.push(null);
        }
    },
    objectMode: true,
    highWaterMark: 10
});


let inReadableHandler = false
let handleCount = 0;
rs.on("readable", async () => {

    // 可以通过加锁来确保每次仅有一个事件处理器实例在运行
    // if (inReadableHandler) return;

    inReadableHandler = true;

    console.log("触发 readable 事件")
    console.log("事件处理器函数实例数 + 1, 现在实例数: " +  ++handleCount)

    let data = rs.read();
    if (data == null) {
        console.log("没有数据了");
        return;
    }

    // 在 readable 事件处理器中未调用 rs.read() 处理数据时，不会重复触发 readable
    // 所以一次 readable 事件触发后，要把所有能读取的数据都读取出来（直到 rs.read()返回 null）
    do {
        // 使用延迟模拟输出慢的情况
        // 内部源------>写入缓存---慢--->外部输出
        await delay(500);
        console.log("写入缓存----->外部输出: " + data);


        // 内部源------>写入缓存>>>>>>外部输出
        data = rs.read();
    } while (data != null);

    console.log("readable 事件处理结束, 没有数据了");
    console.log("事件处理器函数实例数 - 1: 现在实例数: " + --handleCount)
    inReadableHandler = false;
});

rs.on("end", _ => {
    console.log("外部: 可读流结束");
});