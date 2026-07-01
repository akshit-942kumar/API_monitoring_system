import Monitor from "./Monitor.js";
import Log from "./Log.js";
export const addMonitor = async (req, res) => {
  try {
    const { name, url } = req.body;

    const monitor = await Monitor.create({
      name,
      url,
      userId: req.user.id
    });

    res.status(201).json(monitor);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({
      monitorId: req.params.monitorId,
    }).sort({ createdAt: -1 });

    res.status(200).json(logs);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getMonitors = async (req, res) => {
  try {
     console.log("Route reached");
  
    const monitors = await Monitor.find({
      userId: req.user.id
    });

    res.status(200).json(monitors);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

export const updateLastEmailSent=async(req,res)=>{
  try {
    //  console.log("Params:", req.params);
    // console.log("Body:", req.body);
    const monitor=await Monitor.findByIdAndUpdate(
      req.params.id,{
 lastEmailSent:req.body.lastEmailSent
      },{
    new: true
  }
     

    )
    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found"
      });
    }

    res.status(200).json({
      message: "Last email time updated",
      monitor
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteMonitor = async (req, res) => {
  try {

    const monitor = await Monitor.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!monitor) {
      return res.status(404).json({
        message: "Monitor not found"
      });
    }

    res.status(200).json({
      message: "Monitor deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};