import { formatDistance } from 'date-fns';

const toDateAgo = (timestamp: string) => formatDistance(new Date(timestamp), new Date(), { addSuffix: true });

export { toDateAgo };
