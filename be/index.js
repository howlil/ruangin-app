const cron = require("node-cron")
const {updateStatusPeminjaman} = require("./src/utils/cronjob")
const {logger} = require("./src/apps/logging")


function initUpdateStatusCron() {
    cron.schedule('* * * * *', async () => {
        logger.info('Running booking status update cron job...');
        await updateStatusPeminjaman();
    });
}


module.exports = {initUpdateStatusCron}