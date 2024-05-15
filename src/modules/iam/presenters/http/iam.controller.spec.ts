import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';
import { IamService } from '../../application/iam.service';
import { PasswordConfirmedPipe } from '../../domain/pipes/password-confirmed.pipe';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpResponseDto } from './dto/sign-up.response.dto';

type MockIamService = Partial<Record<keyof IamService, jest.Mock>>;
const createMockIamService = (): MockIamService => ({
  signUp: jest.fn(),
});

type MockPasswordConfirmedPipe = Partial<
  Record<keyof PasswordConfirmedPipe, jest.Mock>
>;
const createMockPasswordConfirmedPipe = (): MockPasswordConfirmedPipe => ({
  transform: jest.fn(),
});

describe('IamController', () => {
  let controller: IamController;
  let iamService: MockIamService;
  let passwordConfirmedPipe: MockPasswordConfirmedPipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [
        {
          provide: IamService,
          useValue: createMockIamService(),
        },
        {
          provide: PasswordConfirmedPipe,
          useValue: createMockPasswordConfirmedPipe(),
        },
      ],
    }).compile();

    controller = module.get<IamController>(IamController);
    iamService = module.get<MockIamService>(IamService);
    passwordConfirmedPipe = module.get<MockPasswordConfirmedPipe>(
      PasswordConfirmedPipe,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    describe('when user does not exist', () => {
      it('should return the user object', async () => {
        const signUpDto: SignUpDto = {
          email: 'example@gmail.com',
          password: 'password',
          password_confirmed: 'password',
        };
        const expectRes: SignUpResponseDto = {
          id: 1,
          email: signUpDto.email,
        };
        passwordConfirmedPipe.transform.mockReturnValue(signUpDto);
        iamService.signUp.mockReturnValue(expectRes);
        const actual = await controller.signUp(signUpDto);
        expect(actual).toEqual(expectRes);
      });
    });
  });
});
