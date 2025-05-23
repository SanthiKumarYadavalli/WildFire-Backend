import UserHabitRepository from "../repositories/UserHabitRepository.js";
import HabitRepository from "../repositories/HabitRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import { DateTime } from "luxon";
export default class UserHabitService{
    constructor(){
        this.repository = new UserHabitRepository();
        this.habitRepository = new HabitRepository();
        this.userRepository = new UserRepository();
    }

    addUserToHabit = async(userId , habitId)=>{
        try{
            const habit = await this.habitRepository.findById(habitId);
            if(!habit) throw new Error("Habit Not Found");

            const user = await this.userRepository.findById(userId);
            if(!user) throw new Error("User not found");

            return await this.repository.addUserTohabit(userId,habitId);

        }catch(error){
            throw Error(`Error while adding user to habit : ${error.message} `);
        }
    }

    toggleCompletion = async (userId, habitId, date) => {
        try {
          const dateObj = new Date(date);
          if (isNaN(dateObj.getTime())) {
            throw Error("Invalid date format");
          }
          
          const istNow = new Date(DateTime.now().setZone("Asia/Kolkata").toFormat("yyyy-MM-dd"));

          if (dateObj > istNow) {
            throw Error("Date cannot be in the future");
          }

          const formattedDate = dateObj.toISOString().split("T")[0];
          if (!formattedDate) {
            throw Error("Invalid date format");
          }
          const res = await this.repository.toggleCompletion(userId, habitId, formattedDate);
          return res;
        } catch (error) {
          throw Error(`Error while toggling completion: ${error.message}`);
        }
      };

      getAllMembers = async (habitId) => {
        try {
          const members = await this.repository.getAllMembers(habitId);
          return members;
        } catch (error) {
          throw Error(error.message);
        }
      }

      getAllHabits = async (userId) => {
        try {
          const habits = await this.repository.getAllHabits(userId);
          return habits;
        } catch (error) {
          throw Error(error.message);
        }
      }

      removeUserFromHabit = async (userId, habitId) => {
        try {
          const res = await this.repository.deleteOne({ user: userId, habit: habitId });
          return res;
        } catch (error) {
          throw Error(`Error while removing user from habit: ${error.message}`);
        }
      }
}