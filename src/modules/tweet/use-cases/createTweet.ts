import { ICommandHandler } from "~/share/interface";
import { CreateTweetCommand } from "../interfaces/tweetCommands";
import { Tweet } from "../domain/entities";
import { ITweetRepository } from "../interfaces/tweetRepository";


export class CreateNewTweetCmdHandler
  implements ICommandHandler<CreateTweetCommand, Tweet>
{
  constructor(
    private readonly repository: ITweetRepository,
  ) {}

  async execute(command: CreateTweetCommand): Promise<Tweet> {
    const tweet = command.dto;
    if(tweet.video) {
      //upload video to cloud
    } else {
      //upload images to cloud
    }

    //sẽ tạo queue để upload images và video sau đó từ mảng url của images hoặc video có thể tạo thành 1 text url trong db sau đó insert vào trong db
    console.log("Creating new tweet", tweet);

    //create object tweet
    //upload media
    // await this.repository.insert(tweet);

    //future call timeline service to update timeline

    return {} as Tweet;
  }
}
