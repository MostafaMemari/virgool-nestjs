export enum BadRequestMessage {
  InValidLoginData = 'اطلاعات ارسال شده برای ورود صحیح نمی باشد',
  InValidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}
export enum AuthMessage {
  NotFoundAccount = 'حساب کاربری یافت نشد',
  TryAgain = 'دوباره تلاش کنید',
  AlreadyExistAccount = 'حساب کاربری تکراری می باشد',
  ExpiredCode = 'کد تایید منقضی شده مجدد تلاش کنید',
  LoginAgain = 'مجدد وارد حساب کاربری خود شوید',
}
export enum PublicMessage {
  SendOtp = 'کد یکبار مصرف با موفقیت ارسال شد',
  LoggedIn = 'با موفقیت وارد حساب کاربری خود شدید',
}

export enum NotFoundMessage {}
export enum ValidationMessage {}
