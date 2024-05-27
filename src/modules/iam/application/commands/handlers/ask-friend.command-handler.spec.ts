import { Test, TestingModule } from '@nestjs/testing';
import { SignUpCommandHandler } from './sign-up.command-handler';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { HashingService } from '../../ports/hashing.service';
import { SignUpCommand } from '../impl/sign-up.command';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserFactory } from 'src/modules/iam/domain/factories/user.factory';
import { User } from 'src/modules/iam/domain/user';
import { ErrorMsg } from 'src/common/enums/err-msg.enum';
import { SignUpResponseDto } from 'src/modules/iam/presenters/http/dto/response/sign-up.response.dto';
import { EventPublisher } from '@nestjs/cqrs';
import { FindUserRepository } from '../../ports/find-user.repository';
import { AskFriendCommandHandler } from './ask-friend.command-handler';
import { AskFriendCommand } from '../impl/ask-friend.command';
import { UserReadModel } from 'src/modules/iam/domain/read-models/user.read-model';
import { Types } from 'mongoose';

type MockCreateUserRepository = Partial<
  Record<keyof CreateUserRepository, jest.Mock>
>;
const createMockCreateUserRepository = (): MockCreateUserRepository => ({
  save: jest.fn(),
  askFriend: jest.fn(),
});

type MockFindUserRepository = Partial<
  Record<keyof FindUserRepository, jest.Mock>
>;
const createMockFindUserRepository = (): MockFindUserRepository => ({
  findOneByEmail: jest.fn(),
  findOneById: jest.fn(),
});

type MockEventPublisher = Partial<Record<keyof EventPublisher, jest.Mock>>;
const createMockEventPublisher = (): MockEventPublisher => ({
  mergeObjectContext: jest.fn(),
});

describe('AskFriendCommandHandler', () => {
  let askFriendCommandHandler: AskFriendCommandHandler;
  let findUserRepository: MockFindUserRepository;
  let createUserRepository: MockCreateUserRepository;
  let eventPublisher: MockEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AskFriendCommandHandler,
        {
          provide: FindUserRepository,
          useValue: createMockFindUserRepository(),
        },
        {
          provide: CreateUserRepository,
          useValue: createMockCreateUserRepository(),
        },
        {
          provide: EventPublisher,
          useValue: createMockEventPublisher(),
        },
      ],
    }).compile();

    askFriendCommandHandler = module.get<AskFriendCommandHandler>(
      AskFriendCommandHandler,
    );
    findUserRepository = module.get<MockFindUserRepository>(FindUserRepository);
    createUserRepository =
      module.get<MockCreateUserRepository>(CreateUserRepository);
    eventPublisher = module.get<MockEventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(askFriendCommandHandler).toBeDefined();
  });

  describe('execute', () => {
    describe('when token valid and friendId exists', () => {
      it('should return null', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        const now = new Date();
        const expectUser: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.userId,
          name: 'username',
          email: 'user@gmail.com',
          password: 'userpassword',
          createdAt: now,
          updatedAt: now,
        };
        const expectFriend: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.friendId,
          name: 'friendname',
          email: 'friend@gmail.com',
          password: 'friendpassword',
          createdAt: now,
          updatedAt: now,
        };
        findUserRepository.findOneById
          .mockReturnValueOnce(expectUser)
          .mockReturnValueOnce(expectFriend);
        createUserRepository.askFriend.mockReturnValue(null);

        const actual = await askFriendCommandHandler.execute(askFriendCommand);
        expect(actual).toEqual(undefined);
      });
    });

    describe('when the friendId or user does not exist', () => {
      it('should throw not found exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        findUserRepository.findOneById.mockRejectedValue(
          new NotFoundException('11007 找不到使用者'),
        );

        try {
          const actual =
            await askFriendCommandHandler.execute(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual('11007 找不到使用者');
        }
      });
    });

    describe('when the they are already friend', () => {
      it('should throw conflict exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };

        const now = new Date();
        const expectUser: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.userId,
          name: 'username',
          email: 'user@gmail.com',
          password: 'userpassword',
          friends: [
            {
              id: askFriendCommand.friendId,
              name: 'friendname',
              email: 'friend@gmail.com',
              password: 'friendpassword',
              createdAt: now,
              updatedAt: now,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };
        const expectFriend: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.friendId,
          name: 'friendname',
          email: 'friend@gmail.com',
          password: 'friendpassword',
          friends: [
            {
              id: askFriendCommand.userId,
              name: 'friendname',
              email: 'friend@gmail.com',
              password: 'friendpassword',
              createdAt: now,
              updatedAt: now,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };

        findUserRepository.findOneById
          .mockReturnValueOnce(expectFriend)
          .mockReturnValueOnce(expectUser);
        jest.spyOn(expectUser.friends, 'find').mockReturnValue(expectFriend);
        jest.spyOn(expectFriend.friends, 'find').mockReturnValue(expectUser);
        try {
          const actual =
            await askFriendCommandHandler.execute(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11009 該使用者已經是好友');
        }
      });
    });

    describe('when already asked friend before', () => {
      it('should throw conflict exception', async () => {
        const askFriendCommand: AskFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        const now = new Date();
        const expectUser: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.userId,
          name: 'username',
          email: 'user@gmail.com',
          password: 'userpassword',
          createdAt: now,
          updatedAt: now,
        };
        const expectFriend: UserReadModel = {
          _id: new Types.ObjectId(),
          id: askFriendCommand.friendId,
          name: 'friendname',
          email: 'friend@gmail.com',
          password: 'friendpassword',
          createdAt: now,
          updatedAt: now,
        };
        findUserRepository.findOneById
          .mockReturnValueOnce(expectFriend)
          .mockReturnValueOnce(expectUser);

        createUserRepository.askFriend.mockRejectedValue(
          new ConflictException('11008 已送出好友邀請'),
        );

        try {
          const actual =
            await askFriendCommandHandler.execute(askFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(ConflictException);
          expect(err.message).toEqual('11008 已送出好友邀請');
        }
      });
    });
  });
});
