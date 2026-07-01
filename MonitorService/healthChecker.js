import axios from "axios";
import Monitor from "./Monitor.js";
import Log from "./Log.js";
export const checkMonitors = async () => {
  const monitors = await Monitor.find();

  for (const monitor of monitors) {
  console.log("Checking:", monitor.url);
    const previousStatus = monitor.status;

    try {
  const start = Date.now();

  const response = await axios.get(monitor.url, {
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: () => true,
  });

  const end = Date.now();

  monitor.responseTime = end - start;
  monitor.statusCode = response.status;

  if (response.status >= 200 && response.status < 400) {
    monitor.status = "UP";
  } else {
    monitor.status = "UNHEALTHY";
  }

  await monitor.save();

  await Log.create({
  monitorId: monitor._id,
  status: monitor.status,
  statusCode: response.status,
  responseTime: monitor.responseTime,
});
  // DOWN/UNHEALTHY -> UP notification
  if (
    previousStatus !== "UP" &&
    monitor.status === "UP"
  ) {
    await axios.post(
      "http://localhost:5003/api/notifications/sendNotification",
      {
        email: "akshit@gmail.com",
        monitorName: monitor.name,
        status: "UP",
      }
    );
  }

  // UP -> UNHEALTHY notification
  if (
    previousStatus === "UP" &&
    monitor.status === "UNHEALTHY"
  ) {
    await axios.post(
      "http://localhost:5003/api/notifications/sendNotification",
      {
        email: "akshit@gmail.com",
        monitorName: monitor.name,
        status: "UNHEALTHY",
      }
    );
  }
}  catch (error) {
  console.log(error.message);

 monitor.status = "DOWN";
monitor.responseTime = 0;
monitor.statusCode = null;

  await monitor.save();

  await Log.create({
    monitorId: monitor._id,
    status: "DOWN",
    responseTime: 0,
      statusCode: null,

    error: error.message,
  });

  if (
    previousStatus !== "DOWN"
  ) {
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE}/api/notifications/sendNotification`,
      {
        email: "abc@gmail.com",
        monitorName: monitor.name,
        status: "DOWN",
      }
    );
  }
}
  }
};