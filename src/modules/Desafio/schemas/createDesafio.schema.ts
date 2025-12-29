import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Schema para validar purchaseData após o parse
export const PurchaseDataSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.string().min(1, 'Preço é obrigatório'),
  priceId: z.string().min(1, 'PriceId é obrigatório'),
  rules: z.array(z.string()).min(1, 'Pelo menos uma regra é obrigatória'),
  benefits: z.array(z.string()).min(1, 'Pelo menos um benefício é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  shortDescription: z.string().min(1, 'Descrição curta é obrigatória'),
  howParticipate: z.string().min(1, 'Como participar é obrigatório'),
});

// Schema principal que aceita purchaseData como string (será parseado depois)
const CreateDesafioSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  location: z.string().min(1, 'Localização é obrigatória'),
  distance: z.string().min(1, 'Distância é obrigatória'),
  priceId: z.string().min(1, 'PriceId é obrigatório'),
  active: z.coerce.boolean(),
  purchaseData: z.string().min(1, 'Pelo menos uma regra é obrigatória'),
});

export class CreateDesafioDTO extends createZodDto(CreateDesafioSchema) {}
