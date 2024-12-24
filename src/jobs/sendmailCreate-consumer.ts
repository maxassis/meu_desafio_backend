import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateUserTemplate } from 'src/templates-email/create.user.code.template';

@Processor('email-queue')
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(
    job: Job<{ name: string; email: string; code: string }>,
  ): Promise<any> {
    const { name, email, code } = job.data;

    try {
      // console.log(`Starting email job: ${job.id}`);
      // console.log(`To: ${email}, Code: ${code}`);

      // Enviando o e-mail
      await this.mailerService.sendMail({
        from: 'bondis@meudesafio.com',
        to: email,
        subject: 'Confirme seu email',
        html: CreateUserTemplate(name, code),
      });

      console.log(`Email successfully sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send email for job ${job.id}:`, error);
      throw error;
    }
  }
}
