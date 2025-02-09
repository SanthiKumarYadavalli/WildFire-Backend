import HabitRepository from "../repositories/HabitRepository.js";
import UserHabitRepository from "../repositories/UserHabitRepository.js";
import mongoose from "mongoose";

export default class HabitService {
  constructor() {
    this.repository = new HabitRepository();
    this.junctionRepository = new UserHabitRepository();
  }

  create = async (data) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const Habit = await this.repository.create(data);  // create habit
      await this.junctionRepository.addUserTohabit(data.createdBy, Habit._id);  // add user to habit
      await session.commitTransaction();
      session.endSession();
      return Habit;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw Error(`Error while creating Habit :${error.message} `);
    }
  };
  findOne = async (data) => {
    try {
      const Habit = await this.repository.findOne(data);
      return Habit;
    } catch (error) {
      throw Error(`Error while finding habit: ${error.message}`);
    }
  };

  find = async (data) => {
    try {
      const Habit = await this.repository.find(data);
      return Habit;
    } catch (error) {
      throw Error(`Error while finding habit: ${error.message}`);
    }
  };
  findById = async (data) => {
    try {
      const Habit = await this.repository.findById(data);
      return Habit;
    } catch (error) {
      throw Error(`Error while finding habit: ${error.message}`);
    }
  };

  //   Update routes
  findByIdAndUpdate = async (data) => {
    try {
      const Habit = await this.repository.findByIdAndUpdate(data.id, data);
      return Habit;
    } catch (error) {
      throw Error(`Error while finding and updating habit: ${error.message}`);
    }
  };

  findByIdAndDelete = async (data) => {
    try {
      const Habit = await this.repository.findByIdAndDelete(data.id);
      return Habit;
    } catch (error) {
      throw Error(`Error while deliting habit: ${error.message}`);
    }
  };

  toggleCompletion = async (data) => {
    try {
      const date = data.date;
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        throw Error("Invalid date format");
      }
      if (new Date(date) > new Date()) {
        throw Error("Cannot toggle completion for future dates");
      }
      const formattedDate = new Date(date).toISOString().split("T")[0];
      if (!formattedDate) {
        throw Error("Invalid date format");
      }
      data.date = formattedDate;
      const res = await this.junctionRepository.toggleCompletion(data);
      return res;
    } catch (error) {
      throw Error(`Error while toggling completion: ${error.message}`);
    }
  };
}
