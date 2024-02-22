import jwt from 'jsonwebtoken';

import User from '../models/user';
import { comparePassword, hashPassword } from '../lib';
import { CreateUser } from '../interfaces';

export const getUserById = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error: any) {
    throw new Error(`Error in getUserById service: ${error.message}`);
  }
}

export const createUser = async (userData: CreateUser) =>{
  try {
    const { firstName, lastName, email, password } = userData;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return {
        status: 400
      }
    } else {
      const hashedPassword = await hashPassword(password);

      const user = await new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }).save();

      return {
        status: 201
      };
    }
  } catch (error: any) {
    throw new Error(`Error in createUser service: ${error.message}`);
  }
}

export const signInUser = async (credentials: {email: string, password: string}) => {
  try {
    const { email, password } = credentials;
    const user = await User.findOne({ email: email });

    if (user) {
      const isMatched = await comparePassword(password, user.password);

      if (!isMatched) {
        return {
          status: 400
        }
      }
      else {
        const token = jwt.sign(
          { userId: user._id },
          process.env.SECRET_KEY || '', {
          expiresIn: 60 * 60 * 24 * 365,
        });

        return {
          status: 200, token
        }
      }
    }
    else {
      return { status: 404 }
    }
  } catch (error: any) {
    console.log(error.message);
    return { status: 500 }
  }
}