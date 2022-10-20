import { JWTPayload } from './jwtPayload.type';

export type JWTPayloadWithRT = JWTPayload & { refreshToken: string };
