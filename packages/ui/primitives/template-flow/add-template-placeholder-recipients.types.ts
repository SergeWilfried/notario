import { z } from '@documenso/lib/i18n/settings';

import { createTranslation } from '@documenso/lib/i18n/server';

const {t} = await createTranslation('common');

import { RecipientRole } from '.prisma/client';

export const ZAddTemplatePlacholderRecipientsFormSchema = z
  .object({
    signers: z.array(
      z.object({
        formId: z.string().min(1),
        nativeId: z.number().optional(),
        email: z.string().min(1).email(),
        name: z.string(),
        role: z.nativeEnum(RecipientRole),
      }),
    ),
  })
  .refine(
    (schema) => {
      const emails = schema.signers.map((signer) => signer.email.toLowerCase());

      return new Set(emails).size === emails.length;
    },
    // Dirty hack to handle errors when .root is populated for an array type
    { message: t('signers-must-have-unique-emails'), path: ['signers__root'] },
  );

export type TAddTemplatePlacholderRecipientsFormSchema = z.infer<
  typeof ZAddTemplatePlacholderRecipientsFormSchema
>;
