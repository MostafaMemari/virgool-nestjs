export enum BadRequestMessage {
  InValidLoginData = 'اطلاعات ارسال شده برای ورود صحیح نمی باشد',
  InValidRegisterData = 'اطلاعات ارسال شده برای ثبت نام صحیح نمی باشد',
}
export enum AuthMessage {
  NotFoundAccount = 'حساب کاربری یافت نشد',
  TryAgain = 'دوره تلاش کنید',
  AlreadyExistAccount = 'حساب کاربری تکراری می باشد',
  ExpiredCode = 'کد تایید منقضی شده مجدد تلاش کنید',
}
export enum PublicMessage {
  SendOtp = 'کد یکبار مصرف با موفقیت ارسال شد',
}

export enum NotFoundMessage {}
export enum ValidationMessage {}
