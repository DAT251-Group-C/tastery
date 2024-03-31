import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Resend } from 'resend';
import { Observable, catchError, from, map, switchMap, tap, throwError } from 'rxjs';
import { InviteEntity } from '../../entities';
import appConfig from '../config/app-conf';
import { MembershipRole } from '../models/membership.model';

export const html = String.raw;

@Injectable()
export class EmailService {
  private readonly resend: Resend;
  private readonly frontendUrl: string;

  constructor(@Inject(appConfig.KEY) config: ConfigType<typeof appConfig>) {
    const { key } = config.resend;
    const { url } = config.frontend;

    if (!key) {
      throw new Error('Resend key is not provided');
    }

    if (!url) {
      throw new Error('Frontend URL is not provided');
    }

    this.resend = new Resend(key);
    this.frontendUrl = url;
  }

  public sendInvite(invite: InviteEntity, hash: string): Observable<InviteEntity> {
    return from(Promise.resolve(invite.organization))
      .pipe(
        tap(org => console.log(org)),
        switchMap(() =>
          from(
            this.resend.emails.send({
              from: 'Agient <no-reply@agient.dev>',
              to: [invite.email],
              subject: `You have been invited to join the ${invite.organizationName} organization`,
              html: html`
                <div>
                  <h3>You have been invited</h3>
                  <p>
                    You have been invited to join the ${invite.organizationName} organization as
                    a${invite.role === MembershipRole.USER ? '' : 'n'} ${invite.role.toLowerCase()}
                  </p>
                  <p>Click the link below to continue:</p>
                  <a href="${this.frontendUrl}/invite?hash=${hash}">Accept invite</a>
                </div>
              `,
            }),
          ),
        ),
      )
      .pipe(
        map(() => invite),
        catchError(() => throwError(() => new Error('Failed to send email'))),
      );
  }
}
