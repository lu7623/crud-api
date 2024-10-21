import { UserInfo } from '../server/types';

export function isUserInfo(body: object): body is UserInfo {
  return (
    (body as UserInfo).age !== undefined &&
    (body as UserInfo).username !== undefined &&
    (body as UserInfo).hobbies !== undefined
  );
}
