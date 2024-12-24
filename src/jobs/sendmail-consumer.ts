import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailerService } from '@nestjs-modules/mailer';

@Processor('email-queue')
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<any, any>): Promise<any> {
    const { email, subject } = job.data;

    try {
      console.log(`Starting email job: ${job.id}`);
      console.log(`To: ${email}, Subject: ${subject}`);

      // Enviando o e-mail
      await this.mailerService.sendMail({
        from: 'bondis@meudesafio.com', // Remetente
        to: 'max@teste.com', // Destinatário
        subject: 'teste BullMQ', // Assunto
        text: 'heheheheheh', // Corpo do e-mail em texto simples
      });

      console.log(`Email successfully sent`);
      return { success: true };
    } catch (error) {
      console.error(`Failed to send email:`, error);
      throw error; // Retorna o erro para fins de reprocessamento, se necessário
    }
  }
}
