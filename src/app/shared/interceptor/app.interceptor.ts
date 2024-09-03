import { HttpInterceptorFn } from '@angular/common/http';
import { firebaseConfig } from '../../app.config';

export const appInterceptor: HttpInterceptorFn = (req, next) => {
  const accessToken = JSON.parse(
    sessionStorage.getItem(
      `firebase:authUser:${firebaseConfig.apiKey}:[DEFAULT]`
    ) as string
  ).stsTokenManager.accessToken;
  const clonedReq = req.clone({ params: req.params.set('auth', accessToken) });
  return next(clonedReq);
};
