import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from '@enum/user-role.enum';
import { Answer } from 'src/graphql/answer/entities/answer.entity';
import { User } from 'src/graphql/user/entities/user.entity';
import { Request } from 'src/graphql/request/entities/request.entity'
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async seed() {
    try {
      await this.clearDatabase();
      await this.seedUsers();
      await this.seedRequests();
      await this.seedAnswers();
      return { success: true, message: 'Database seeded successfully' };
    } catch (error) {
      return { 
        success: false, 
        message: 'Seeding failed',
        error: error.message 
      };
    }
  }

  private async clearDatabase() {
    await this.answerRepository.delete({});
    await this.requestRepository.delete({});
    await this.userRepository.delete({});
  }

  private async seedUsers() {
    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: '123456',
        description: 'System administrator',
        role: UserRole.ADMIN,
        wallet: '0xAdminWallet123',
      },
      {
        username: 'joki_pro',
        email: 'joki@example.com',
        password: '123456',
        description: 'Professional assignment helper',
        role: UserRole.JOKI,
        wallet: '0xJokiWallet456',
      },
      {
        username: 'student1',
        email: 'student1@example.com',
        password: '123456',
        description: 'Computer Science student',
        role: UserRole.USER,
        wallet: '0xStudentWallet789',
      },
      {
        username: 'student2',
        email: 'student2@example.com',
        password: '123456',
        description: 'Engineering student',
        role: UserRole.USER,
      },
    ];

    for (const userData of users) {
      const { password, ...rest } = userData;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        password: hashedPassword,
        ...rest
      });
      await this.userRepository.save(user);
    }
  }

  private async seedRequests() {
    const users = await this.userRepository.find();
    const student = users.find((u) => u.username === 'student1');
    const joki = users.find((u) => u.role === UserRole.JOKI);

    const requests = [
      {
        assignment: 'Math Homework',
        faculty: 'Science',
        studyProgram: 'Mathematics',
        lecturer: 'Dr. Smith',
        status: 'Pending',
        requestor: student,
        requested: joki,
      },
      {
        assignment: 'Programming Project',
        faculty: 'Computer Science',
        studyProgram: 'Software Engineering',
        lecturer: 'Prof. Johnson',
        status: 'In Progress',
        attachment: 'project_requirements.pdf',
        requestor: student,
      },
      {
        assignment: 'Physics Assignment',
        faculty: 'Science',
        studyProgram: 'Physics',
        status: 'Completed',
        requestor: users.find((u) => u.username === 'student2'),
        requested: joki,
      },
    ];

    for (const requestData of requests) {
      const request = this.requestRepository.create(requestData);
      await this.requestRepository.save(request);
    }
  }

  private async seedAnswers() {
    const requests = await this.requestRepository.find({
      relations: ['requestor', 'requested'],
    });
    const joki = await this.userRepository.findOneOrFail({
      where: { role: UserRole.JOKI },
    });

    const answers = [
      {
        description: 'I can help with this math problem. Here are the solutions.',
        attachment: 'math_solutions.pdf',
        user: joki,
        request: requests.find((r) => r.assignment === 'Math Homework'),
      },  
      {
        description: 'I need more information about the project requirements.',
        user: requests[1].requestor,
        request: requests[1],
      },
      {
        description: 'The physics assignment has been completed. Please review.',
        attachment: 'physics_assignment_solutions.docx',
        user: joki,
        request: requests.find((r) => r.assignment === 'Physics Assignment'),
      },
    ];

    for (const answerData of answers) {
      const answer = this.answerRepository.create(answerData);
      await this.answerRepository.save(answer);
    }
  }
}
