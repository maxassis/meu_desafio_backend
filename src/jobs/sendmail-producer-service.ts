import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MailService {
  constructor(@InjectQueue('email-queue') private queue: Queue) {}

  async sendEmail(email: string, subject: string, message: string) {
    await this.queue.add('email-job', { email, subject, message });
  }
}
