import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    constructor(private cookieService: CookieService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const cookie = this.cookieService.get('jwt')
        const clonedReq = req.clone({setHeaders:{Authorization: cookie}})
        return next.handle(clonedReq)
    }
}