import { IRepository } from "~/share/interface";
import { Tweet } from "../domain/entities";
import { TweetCondDTO, UpdateTweetDTO } from "./dtos";

export interface ITweetRepository
  extends IRepository<Tweet, TweetCondDTO, UpdateTweetDTO> {}
