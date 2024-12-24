import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';
import { AccountRecoveryDoneTemplate } from 'src/templates-email/account.recovery.done.template';

@Processor('emailRecoveryDone-queue')
export class MailRecoveryDoneConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<{ name: string; email: string }>): Promise<any> {
    const { name, email } = job.data;

    try {
      // console.log(`Starting email job: ${job.id}`);
      // console.log(`To: ${email}`);

      // Enviando o e-mail
      await this.mailerService.sendMail({
        from: 'bondis@meudesafio.com',
        to: email,
        subject: 'Sua senha foi cadastrada com sucesso',
        html: AccountRecoveryDoneTemplate(name),
      });

      console.log(`Email successfully sent to ${email}`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send email for job ${job.id}:`, error);
      throw error;
    }
  }
}
