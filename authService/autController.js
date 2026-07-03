import User from "./user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import axios from "axios";
dotenv.config();
const otpStore = {}
export const googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    let user = await User.findOne({ email });

    // Create user if not present
    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH_USER",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: "user",
        userEmail:email
        
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};



export const register = async (req, res) => {
  try {
    console.log("Runnning signup");
    
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      email
    });
    ;
    
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const otp = Math.floor(
      1000 + Math.random() * 9000
    );

    otpStore[email] = {
      name,
      email,
      password,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    };

    // Send OTP Email
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE}/api/notifications/sendOtp`,
      {
        email,
        otp
      }
    );

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.log("error:",error);
    
    res.status(500).json({
      message: error.message
    });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const stored = otpStore[email];

  if (!stored) {
    return res.status(400).json({
      message: "OTP expired"
    });
  }

  if (stored.otp != otp) {
    return res.status(400).json({
      message: "Invalid OTP"
    });
  }

  const hashedPassword =
    await bcrypt.hash(stored.password, 10);

  await User.create({
    name: stored.name,
    email: stored.email,
    password: hashedPassword
  });

  delete otpStore[email];

  res.status(200).json({
    message:
      "Account created successfully"
  });
};
export const getEmail=async(req,res)=>{
  try {
   const email=req.user.userEmail; 
   res.status(200).json(email);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
    
  }
}
// export const getMonitors = async (req, res) => {
//   try {
//      console.log("Route reached");
//   console.log("User:", req.user);
//     const monitors = await Monitor.find({
//       userId: req.user.id
//     });

//     res.status(200).json(monitors);

//   } catch (error) {

//     res.status(500).json({
//       message: error.message
//     });
//   }
// };

export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.status(200).json({
      token
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const profile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};