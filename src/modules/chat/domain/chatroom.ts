import { AggregateRoot } from '@nestjs/cqrs';
import { ChatroomAddedUsersEvents } from './events/added-user.event';
import { ChatroomUser } from './chatroom-user';

export class Chatroom extends AggregateRoot {
  public id: number;
  public name: string;
  // public userIds: ChatroomUser[];
  public createdAt: Date;
  public updatedAt: Date;
  public deletedAt: Date;
  // * 以下還不確定
  public image: number; // * 為file的外鍵
  public is_group: boolean;

  constructor() {
    super();
  }

  // addUserId(userId: number) {
  //   this.userIds.push(userId);
  // }
}
