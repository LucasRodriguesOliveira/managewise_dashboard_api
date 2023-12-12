import { ThrottlerModuleOptions, seconds } from '@nestjs/throttler';

/**
 * ```
 * name: 'short'
 * ttl: 1000 // 1 second
 * limit: 3 // 3 request in 1 second
 * ```
 */
export const throttlerConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: seconds(1),
    limit: 5,
  },
];
