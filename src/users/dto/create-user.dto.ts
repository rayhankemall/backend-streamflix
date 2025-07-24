export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  isSubscribed?: boolean;
  subscriptionEnd?: Date;
}
