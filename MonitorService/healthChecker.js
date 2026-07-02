import axios from "axios";
import Monitor from "./Monitor.js";
import Log from "./Log.js";
export const checkMonitors = async () => {
  console.log(
  "CHECK START",
  new Date().toISOString(),
  "PID:",
  process.pid
);
  const monitors = await Monitor.find();

  for (const monitor of monitors) {
    console.log(
  "Checking monitor:",
  monitor.name,
  "Time:",
  new Date().toISOString()
);
  // console.log("Checking:", monitor.url);
    const previousStatus = monitor.status;
// console.log("monitor name:",monitor.name);

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
 console.log("Response status:", response.status);
  console.log("Response time:", end - start);
  if (response.status >= 200 && response.status < 400) {
    monitor.status = "UP";
  } else {
    monitor.status = "UNHEALTHY";
  }

  await monitor.save();
  const check = await Monitor.findById(monitor._id);
console.log("Saved in DB:", check.status);
const logData = {
  monitorId: monitor._id,
  monitorname: monitor.name,
  status: monitor.status,
  statusCode: response.status,
  responseTime: monitor.responseTime,
};

console.log(logData);

  await Log.create(logData);
  // DOWN/UNHEALTHY -> UP notification
  if (
    previousStatus !== "UP" &&
    monitor.status === "UP"
  ) {
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE}/api/notifications/sendNotification`,
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
      `${process.env.NOTIFICATION_SERVICE}/api/notifications/sendNotification`,
      {
        email: "akshit@gmail.com",
        monitorName: monitor.name,
        status: "UNHEALTHY",
      }
    );
  }
}  catch (error) {
 console.log("Error:", error.message);

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);
  }

  if (error.code) {
    console.log("Code:", error.code);

  }

 monitor.status = "DOWN";
monitor.responseTime = 0;
monitor.statusCode = null;

  await monitor.save();

  await Log.create({
  monitorId: monitor._id,
  monitorname: monitor.name,
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