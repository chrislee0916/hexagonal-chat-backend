import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserRepository } from '../../ports/create-user.repository';
import { EventPublisher } from '@nestjs/cqrs';
import { AcceptFriendCommandHandler } from './accept-friend.command-handler';
import { AcceptFriendCommand } from '../impl/accept-friend.command';
import { NotFoundException } from '@nestjs/common';

type MockCreateUserRepository = Partial<
  Record<keyof CreateUserRepository, jest.Mock>
>;
const createMockCreateUserRepository = (): MockCreateUserRepository => ({
  acceptFriend: jest.fn(),
});

type MockEventPublisher = Partial<Record<keyof EventPublisher, jest.Mock>>;
const createMockEventPublisher = (): MockEventPublisher => ({
  mergeObjectContext: jest.fn(),
});

describe('AcceptFriendCommandHandler', () => {
  let acceptFriendCommandHandler: AcceptFriendCommandHandler;
  let createUserRepository: MockCreateUserRepository;
  let eventPublisher: MockEventPublisher;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AcceptFriendCommandHandler,
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

    acceptFriendCommandHandler = module.get<AcceptFriendCommandHandler>(
      AcceptFriendCommandHandler,
    );
    createUserRepository =
      module.get<MockCreateUserRepository>(CreateUserRepository);
    eventPublisher = module.get<MockEventPublisher>(EventPublisher);
  });

  it('should be defined', () => {
    expect(acceptFriendCommandHandler).toBeDefined();
  });

  describe('execute', () => {
    describe('when token valid and ask exists', () => {
      it('should return null', async () => {
        const acceptFriendCommand: AcceptFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        createUserRepository.acceptFriend.mockReturnValue(undefined);

        const actual =
          await acceptFriendCommandHandler.execute(acceptFriendCommand);
        expect(actual).toEqual(undefined);
      });
    });

    describe('when the ask does not exist', () => {
      it('should throw the not found exception', async () => {
        const acceptFriendCommand: AcceptFriendCommand = {
          userId: 1,
          friendId: 2,
        };
        createUserRepository.acceptFriend.mockRejectedValue(
          new NotFoundException('11010 找不到此好友邀請'),
        );

        try {
          const actual =
            await acceptFriendCommandHandler.execute(acceptFriendCommand);
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException);
          expect(err.message).toEqual('11010 找不到此好友邀請');
        }
      });
    });
  });
});
