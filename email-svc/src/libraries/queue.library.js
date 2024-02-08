const BullQueue = require('bull');

class Queue extends BullQueue {
   
    async add(name, data, opts) {
        return super.add(name, data, opts);
    }

    
    async process(name, callback) {
        return super.process(name, (job, done) => {
                callback(job, done);
            
        });
    }
}

module.exports = Queue;
