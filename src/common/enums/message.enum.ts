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
  LoginIsRequired = 'وارد حساب کاربری خود شوید',
}
export enum PublicMessage {
  SendOtp = 'کد یکبار مصرف با موفقیت ارسال شد',
  LoggedIn = 'با موفقیت وارد حساب کاربری خود شدید',
  Created = 'با موفقیت ایجاد شد',
  Deleted = 'با موفقیت حذف شد',
  Updated = 'با موفقیت به روزرسانی شد',
  Inserted = 'با موفقیت درج شد',
}
export enum ConflictMessage {
  CategoryTitle = 'عنوان دسته بندی قبلا ثبت شده است',
}

export enum NotFoundMessage {
  NotFound = 'موردی یافت نشد',
  NotFoundCategory = 'دسته بندی یافت نشد',
  NotFoundPost = 'دسته بندی یافت نشد',
  NotFoundUser = 'کاربری یافت نشد',
}
export enum ValidationMessage {
  InvalidImageFormat = 'فرمت تصویر انتخاب شده باید از jpg و png باشد',
}
