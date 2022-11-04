/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import '@/styles/globals.css';
import { NinetailedProvider } from '@ninetailed/experience.js-next';
import { NinetailedPreviewPlugin } from '@ninetailed/experience.js-plugin-preview';
import { NinetailedPrivacyPlugin } from '@ninetailed/experience.js-plugin-privacy';
import { getExperiments } from '@/lib/api';

export default async function App({ children }: { children: React.ReactNode }) {
  // @ts-ignore: 'await' expressions are only allowed within async functions
  const experiments = await getExperiments();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <NinetailedProvider
          preview
          plugins={[
            NinetailedPreviewPlugin({
              clientId:
                process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_CLIENT_ID ?? '',
              secret:
                process.env.NEXT_PUBLIC_NINETAILED_MANAGEMENT_SECRET ?? '',
              environment:
                process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main',
              ui: { opener: { hide: false } },
            }),
            NinetailedPrivacyPlugin({
              allowedEvents: ['page', 'track', 'identify'], // ['page', 'track]
              allowedPageEventProperties: ['*'], // ['*']
              allowedTrackEvents: ['*'], // []
              allowedTrackEventProperties: ['*'], // []
              allowedTraits: ['*'], // []
              blockProfileMerging: true, // flase
            }),
          ]}
          clientId={process.env.NEXT_PUBLIC_NINETAILED_CLIENT_ID ?? ''}
          environment={process.env.NEXT_PUBLIC_NINETAILED_ENVIRONMENT ?? 'main'}
          experiments={experiments || []}
        >
          {children}
        </NinetailedProvider>
      </body>
    </html>
  );
}
