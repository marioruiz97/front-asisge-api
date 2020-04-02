import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  redirect(to: string) {
    switch (to) {
      case 'fb':
        window.open('https://www.facebook.com/ASISGE', '_blank');
        break;
      case 'twitter':
        window.open('https://twitter.com/asisgesa', '_blank');
        break;
      case 'email':
        const mail = document.createElement('a');
        mail.href = 'mailto:gerencia@asisge.com';
        mail.click();
        break;
      default:
        window.open('http://asisge.com/', '_blank');
        break;
    }
  }
}
