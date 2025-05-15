import { User } from '../../users/entities/user.entity';

export const userMasterData: User[] = [
  {
    id: '1',
    username: 'hasta',
    email: 'hasta@example.com',
    password: '$2b$10$hashpasswordcontoh123456', // hashed password bcrypt
    // properti lain sesuai entity
  },
];
