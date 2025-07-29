import { paraglideMiddleware } from '$lib/paraglide/server';

const paraglideHandle = ({ event, resolve }) =>
    paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
        event.request = localizedRequest;
        return resolve(event, {
            transformPageChunk: ({ html }) => {
                return html.replace('%lang%', locale);
            }
        });
    });

export const handle = paraglideHandle;