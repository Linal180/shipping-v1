import { Request, Response } from "express";
import { createUser, signInUser } from "./users.service";
import {
  USER_ALREADY_EXIST, REGISTER_SUCCESSFUL, USER_REGISTRATION_FAILED, USER_NOT_FOUND,
   WRONG_CREDENTIALS, USER_LOGGED_IN_SUCCESSFUL, USER_LOG_IN_FAILED
} from "../constants";

export const signUp = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    console.log("***", userData)
    const response = await createUser(userData)
    console.log(response, ":::::::::::::")
    if (response.status === 400) {
      return res.status(400).json({ message: USER_ALREADY_EXIST });
    }

    res.status(201).json({ message: REGISTER_SUCCESSFUL });
  } catch (error) {
    console.log("::::::::>", error)
    res.status(500).json({ message: USER_REGISTRATION_FAILED });
  }
}

export const signIn = async (req: Request, res: Response) => {
  try {
    const credentials = req.body;
    const response = await signInUser(credentials)

    if (response.status === 404) {
      res.status(404).json({ message: USER_NOT_FOUND });
    } else if (response.status === 400) {
      res.status(400).json({ message: WRONG_CREDENTIALS });
    } else {
      res.status(201).json({ token: response.token, message: USER_LOGGED_IN_SUCCESSFUL });
    }
  } catch (error) {
    res.status(500).json({ message: USER_LOG_IN_FAILED });
  }
}
