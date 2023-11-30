import { notFound } from 'next/navigation';

import { getDocumentAndRecipientByToken } from '@documenso/lib/server-only/document/get-document-by-token';
import { getRecipientSignatures } from '@documenso/lib/server-only/recipient/get-recipient-signatures';
import { DocumentStatus } from '@documenso/prisma/client';
import { LocaleTypes } from '@documenso/ui/i18n/settings';

import { SinglePlayerModeSuccess } from '~/components/(marketing)/single-player-mode/single-player-mode-success';

export type SinglePlayerModeSuccessPageProps = {
  params: {
    token?: string;
    locale: LocaleTypes;
  };
};

export default async function SinglePlayerModeSuccessPage({
  params: { token, locale },
}: SinglePlayerModeSuccessPageProps) {
  if (!token) {
    return notFound();
  }

  const document = await getDocumentAndRecipientByToken({
    token,
  }).catch(() => null);

  if (!document || document.status !== DocumentStatus.COMPLETED) {
    return notFound();
  }

  const signatures = await getRecipientSignatures({ recipientId: document.Recipient.id });

  return <SinglePlayerModeSuccess locale={locale} document={document} signatures={signatures} />;
}
