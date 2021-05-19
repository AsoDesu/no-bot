import cron from "node-cron";
import main from "../index";

import updateCache from "./LeaderboardCache";

var task: cron.ScheduledTask;

function startCron() {
	task = cron.schedule("30 * * * *", () => {
		if (updateCache.getCacheStatus().job == true) return;
		updateCache.updateCache(main.getClient());
	});
}

function stopCron() {
	task.stop();
}

export default {
	startCron,
	stopCron,
	task,
};
